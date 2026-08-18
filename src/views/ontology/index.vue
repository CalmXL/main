<script setup lang="ts">
import { marked } from 'marked'
import WuJie from 'wujie-vue3'
import type { Chat } from '@/services/types'
import { chatService } from '@/services/chat'
import type { HistoryItemType } from '@/components/MicroNavList/types'

// 建议卡片与快捷标签数据
const suggestions = [
  { icon: 'i-ep-data-line', title: '业务数据查询', desc: '帮我查一下公司26年新增项目', message: '帮我查一下公司26年新增项目' },
  { icon: 'i-ep-pie-chart', title: '经营情况分析', desc: '公司25年Q3季度经营情况', message: '公司25年Q3季度经营情况' },
  { icon: 'i-ep-edit-pen', title: '数据写入与落表', desc: '更新CRM二期项目负责人为李四', message: '更新CRM二期项目负责人为李四', disabled: true },
  { icon: 'i-ep-search', title: '深度业务洞察', desc: '分析近半年各事业部回款趋势', message: '分析近半年各事业部回款趋势' }
]

const quickTags = ['查询公司现有的合同额', '查询26年3月份外包付款', '电信项目的外包成本', '查询公司本年度回款总额']

interface HistoryItem {
  conversation_id: string
  title: string
  updated_at: string | null
  created_at: string | null
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  step?: Chat.StepName
  clarify_card?: Chat.ClarifyCard
  error?: string
  messageId?: string
  isWaiting?: boolean
  thinking?: string
  task_state?: Chat.TaskState
  actionDisabled?: boolean
  html_url?: string
  feedback?: 'good' | 'bad' | null
}

const emit = defineEmits<{
  close: []
}>()

const { bus } = WuJie

const TERMINAL_STATUSES: Chat.ResultStatus[] = ['success', 'partial_success', 'no_data', 'sql_failed', 'error', 'aborted']

const inputMessage = ref('')
const conversationId = ref<string | null>(null)
const isClarifyingMode = ref(false)
const expandedThinking = ref<Set<string>>(new Set())
const inputRef = ref<InstanceType<typeof import('element-plus')['ElInput']>>()
const messagesContainer = ref<HTMLElement>()
const isPolling = ref(false)
const abortController = ref<AbortController | null>(null)
const historyList = ref<HistoryItem[]>([])
const selectedConversationId = ref<string | null>(null)
const historyDetailLoading = ref(false)
const messages = ref<ChatMessage[]>([])
const deepThinkEnabled = ref(false)
const copiedMessageId = ref<string | null>(null)

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 5) return '凌晨好'
  if (hour < 11) return '早上好'
  if (hour < 13) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

function handleEmptyStateSelect(message: string) {
  inputMessage.value = message
  nextTick(() => {
    inputRef.value?.focus()
  })
}

function toggleThinking(messageId: string) {
  if (expandedThinking.value.has(messageId)) {
    expandedThinking.value.delete(messageId)
  } else {
    expandedThinking.value.add(messageId)
  }
}

function closePanel() {
  emit('close')
}

function scrollToBottom(smooth = false) {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTo({
        top: messagesContainer.value.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      })
    }
  })
}

function cancelPolling() {
  if (abortController.value) {
    abortController.value.abort()
    abortController.value = null
  }
  isPolling.value = false
}

function isClarifyResponse(res: Chat.RGetChatResult): res is Chat.ClarifyResultResponse {
  return 'status' in res && res.status === 'clarifying'
}

function replaceWaitingMessage(waitingId: string, updates: Partial<ChatMessage>) {
  const idx = messages.value.findIndex(m => m.id === waitingId)
  if (idx !== -1) {
    Object.assign(messages.value[idx], updates)
  }
  scrollToBottom(true)
}

function buildClarifyCard(res: Chat.ClarifyResultResponse): Chat.ClarifyCard {
  return {
    question: res.clarify_question || res.ai_response,
    interaction: res.interaction
  }
}

function buildClarifyCardFromTurn(turn: Chat.HistoryTurn): Chat.ClarifyCard | null {
  if (!turn.interaction) return null
  return {
    question: turn.clarify_question || turn.ai_response || '',
    interaction: turn.interaction
  }
}

function applyClarifyState(targetId: string, res: Chat.ClarifyResultResponse) {
  isClarifyingMode.value = true
  conversationId.value = res.conversation_id
  replaceWaitingMessage(targetId, {
    step: 'clarify',
    clarify_card: buildClarifyCard(res),
    content: res.ai_response || res.clarify_question,
    isWaiting: false,
    messageId: res.message_id
  })
}

function getTurnMessageId(turn: Chat.HistoryTurn): string {
  return turn.message_id || turn.id
}

async function restoreClarifyState(turn: Chat.HistoryTurn, assistantMessageId: string) {
  const clarifyCard = buildClarifyCardFromTurn(turn)
  if (clarifyCard) {
    isClarifyingMode.value = true
    replaceWaitingMessage(assistantMessageId, {
      step: 'clarify',
      clarify_card: clarifyCard,
      content: turn.ai_response || turn.clarify_question || clarifyCard.question,
      messageId: getTurnMessageId(turn)
    })
    return
  }

  try {
    const res = await chatService.getChatResult(getTurnMessageId(turn))
    if (isClarifyResponse(res)) {
      applyClarifyState(assistantMessageId, res)
      return
    }
  } catch (err) {
    console.error('恢复澄清状态失败', err)
  }

  isClarifyingMode.value = true
  replaceWaitingMessage(assistantMessageId, {
    step: 'clarify',
    clarify_card: {
      question: turn.clarify_question || turn.ai_response || '请补充更多信息',
      interaction: {
        type: 'text',
        slot_name: '',
        problem_type: '',
        options: [],
        allow_other: true,
        other_placeholder: '请补充更具体的信息'
      }
    },
    content: turn.ai_response || turn.clarify_question || '请补充更多信息',
    messageId: getTurnMessageId(turn)
  })
}

async function restorePendingState(lastTurn: Chat.HistoryTurn) {
  const messageId = getTurnMessageId(lastTurn)

  if (lastTurn.status === 'running') {
    const waitingId = appendWaitingMessage('正在思考中...')
    await startPolling(messageId, waitingId)
    return
  }

  if (lastTurn.status === 'clarifying') {
    await restoreClarifyState(lastTurn, `${lastTurn.id}-assistant`)
  }
}

function getResultStatusMessage(status: Chat.ResultStatus): string {
  // eslint-disable-next-line no-shadow
  const messages: Record<string, string> = {
    partial_success: '部分查询成功，部分失败',
    no_data: '查询完成，暂无数据',
    sql_failed: 'SQL 执行失败',
    error: '执行出错',
    aborted: '任务已中止'
  }
  return messages[status] || '执行完成'
}

async function pollThinking(messageId: string, waitingId: string) {
  if (!isPolling.value) return
  try {
    const data = await chatService.getChatThinking(messageId)
    const idx = messages.value.findIndex(m => m.id === waitingId)
    if (idx !== -1) {
      const msg = messages.value[idx]
      msg.thinking = data.thinking || msg.thinking
      msg.task_state = data.task_state
      if (data.thinking) {
        expandedThinking.value.add(waitingId)
      }
    }
  } catch {
    // 网络错误忽略，由 result 轮询兜底
  }
}

async function pollResult(messageId: string, waitingId: string): Promise<boolean> {
  const res = await chatService.getChatResult(messageId)

  if (isClarifyResponse(res)) {
    applyClarifyState(waitingId, res)
    return true
  }

  const { data } = res
  if (!data) {
    replaceWaitingMessage(waitingId, {
      step: 'error',
      error: '响应格式异常',
      content: '响应格式异常',
      isWaiting: false
    })
    return true
  }

  if (data.status === 'running') {
    return false
  }

  if (data.status === 'error' || data.status === 'sql_failed' || data.status === 'aborted') {
    replaceWaitingMessage(waitingId, {
      step: 'error',
      error: data.errorMessage || getResultStatusMessage(data.status),
      content: data.errorMessage || getResultStatusMessage(data.status),
      isWaiting: false
    })
    isClarifyingMode.value = false
    return true
  }

  if (TERMINAL_STATUSES.includes(data.status)) {
    isClarifyingMode.value = false
    const aiResponse = data.result?.ai_response
    const prefix = data.status !== 'success' ? `${getResultStatusMessage(data.status)}\n\n` : ''
    replaceWaitingMessage(waitingId, {
      step: 'result',
      content: aiResponse ? `${prefix}${aiResponse}` : getResultStatusMessage(data.status),
      html_url: data.result?.html_url || undefined,
      isWaiting: false
    })
    return true
  }

  return false
}

async function startPolling(messageId: string, waitingId: string) {
  isPolling.value = true
  abortController.value = new AbortController()

  while (isPolling.value) {
    // eslint-disable-next-line no-await-in-loop
    await pollThinking(messageId, waitingId)
    try {
      // eslint-disable-next-line no-await-in-loop
      const finished = await pollResult(messageId, waitingId)
      if (finished) return
    } catch {
      // 网络错误继续重试
    }
    // eslint-disable-next-line no-await-in-loop, no-promise-executor-return
    await new Promise(resolve => setTimeout(resolve, 1500))
  }
}

async function submitAndPoll(userInput: string, waitingId: string) {
  try {
    const submitData = await chatService.postChatSubmit({
      conversation_id: conversationId.value,
      user_input: userInput
    })
    conversationId.value = submitData.conversation_id

    const idx = messages.value.findIndex(m => m.id === waitingId)
    if (idx !== -1) {
      messages.value[idx].messageId = submitData.message_id
    }

    await startPolling(submitData.message_id, waitingId)
  } catch (err: any) {
    replaceWaitingMessage(waitingId, {
      step: 'error',
      error: err.message || '未知错误',
      content: `系统错误：${err.message || '未知错误'}`,
      isWaiting: false
    })
  } finally {
    isPolling.value = false
    abortController.value = null
  }
}

async function clarifyAndPoll(supplementText: string, waitingId: string) {
  if (!conversationId.value) return

  try {
    const clarifyData = await chatService.postChatClarify({
      conversation_id: conversationId.value,
      supplement_text: supplementText,
      user_input: supplementText
    })
    conversationId.value = clarifyData.conversation_id

    const idx = messages.value.findIndex(m => m.id === waitingId)
    if (idx !== -1) {
      messages.value[idx].messageId = clarifyData.message_id
    }

    isClarifyingMode.value = false
    await startPolling(clarifyData.message_id, waitingId)
  } catch (err: any) {
    replaceWaitingMessage(waitingId, {
      step: 'error',
      error: err.message || '未知错误',
      content: `系统错误：${err.message || '未知错误'}`,
      isWaiting: false
    })
  } finally {
    isPolling.value = false
    abortController.value = null
  }
}

function disableClarifyCard() {
  const clarifyMsg = messages.value.find(m => m.step === 'clarify' && !m.actionDisabled)
  if (clarifyMsg) {
    clarifyMsg.actionDisabled = true
  }
}

function appendUserMessage(content: string) {
  messages.value.push({
    id: Date.now().toString(),
    role: 'user',
    content,
    timestamp: new Date()
  })
  scrollToBottom(true)
}

function appendWaitingMessage(content = '正在思考中...'): string {
  const waitingMessage: ChatMessage = {
    id: (Date.now() + 1).toString(),
    role: 'assistant',
    content,
    timestamp: new Date(),
    step: 'thinking',
    isWaiting: true
  }
  messages.value.push(waitingMessage)
  scrollToBottom(true)
  return waitingMessage.id
}

async function sendMessage() {
  const content = inputMessage.value.trim()
  if (!content || isPolling.value) return

  cancelPolling()
  appendUserMessage(content)
  inputMessage.value = ''

  const waitingId = appendWaitingMessage(isClarifyingMode.value ? '处理中...' : '正在思考中...')

  if (isClarifyingMode.value) {
    disableClarifyCard()
    await clarifyAndPoll(content, waitingId)
  } else {
    await submitAndPoll(content, waitingId)
  }
}

async function handleClarifyOption(option: Chat.ClarifyOption) {
  if (isPolling.value) return

  cancelPolling()
  disableClarifyCard()
  appendUserMessage(option.label)

  const waitingId = appendWaitingMessage('处理中...')
  await clarifyAndPoll(option.label, waitingId)
}

function handleClarifyOther() {
  isClarifyingMode.value = true
  inputRef.value?.focus()
}

function handleKeydown(e: Event | KeyboardEvent) {
  const event = e as KeyboardEvent
  if (event.key === 'Enter' && !event.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

function renderMarkdown(text: string): string {
  if (!text) return ''
  return marked.parse(text) as string
}

function formatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0')
  const m = date.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

async function copyMessage(message: ChatMessage) {
  const text = message.error || message.content
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    copiedMessageId.value = message.id
    setTimeout(() => {
      if (copiedMessageId.value === message.id) {
        copiedMessageId.value = null
      }
    }, 1600)
  } catch {
    /* 忽略 */
  }
}

function setFeedback(message: ChatMessage, type: 'good' | 'bad') {
  message.feedback = message.feedback === type ? null : type
}

function regenerateMessage(message: ChatMessage) {
  if (isPolling.value) return
  // 找到该消息之前最近的一条用户消息
  const idx = messages.value.findIndex(m => m.id === message.id)
  if (idx <= 0) return
  for (let i = idx - 1; i >= 0; i--) {
    if (messages.value[i].role === 'user') {
      const lastUser = messages.value[i]
      // 删除该 user 之后所有消息并重发
      messages.value = messages.value.slice(0, i)
      inputMessage.value = lastUser.content
      sendMessage()
      return
    }
  }
}

async function loadHistory() {
  if (historyList.value.length > 0) return
  try {
    const data = await chatService.getHistory(20)
    historyList.value = data.items || []
    emitAgentHistory()
  } catch (err) {
    console.error('加载历史记录失败', err)
  }
}

function emitAgentHistory() {
  const mapped: HistoryItemType[] = historyList.value.map(item => ({
    id: item.conversation_id,
    name: item.title,
    updatedDate: item.updated_at || item.created_at || undefined
  }))

  console.log('emitAgentHistory', mapped)
  bus.$emit('set-agent-history', mapped)
}

function createNewConversation() {
  cancelPolling()
  messages.value = []
  conversationId.value = null
  selectedConversationId.value = null
  isClarifyingMode.value = false
  bus.$emit('set-agent-active-id', null)
}

function onSelectHistoryFromBus(item: HistoryItemType) {
  if (selectedConversationId.value === item.id) return
  const source = historyList.value.find(h => h.conversation_id === item.id)
  if (source) {
    selectHistory(source)
  }
}

async function selectHistory(item: HistoryItem) {
  if (historyDetailLoading.value) return
  cancelPolling()
  selectedConversationId.value = item.conversation_id
  bus.$emit('set-agent-active-id', item.conversation_id)
  historyDetailLoading.value = true
  isClarifyingMode.value = false
  messages.value = []

  try {
    const detail = await chatService.getHistoryDetail(item.conversation_id)
    conversationId.value = detail.conversation_id
    const turns = detail.turns || []

    for (let i = 0; i < turns.length; i++) {
      const turn = turns[i]
      const isLastTurn = i === turns.length - 1

      messages.value.push({
        id: `${turn.id}-user`,
        role: 'user',
        content: turn.user_input,
        timestamp: new Date(turn.created_at || '')
      })

      // 最后一轮若仍在执行中，由轮询逻辑接管展示
      if (isLastTurn && turn.status === 'running') continue

      const isClarifyingTurn = isLastTurn && turn.status === 'clarifying'
      messages.value.push({
        id: `${turn.id}-assistant`,
        role: 'assistant',
        content: turn.ai_response || turn.clarify_question || '',
        timestamp: new Date(turn.created_at || ''),
        thinking: turn.ai_thinking || undefined,
        html_url: isClarifyingTurn ? undefined : turn.html_url || undefined,
        step: 'result',
        messageId: getTurnMessageId(turn)
      })
    }

    const lastTurn = turns[turns.length - 1]
    if (lastTurn && (lastTurn.status === 'clarifying' || lastTurn.status === 'running')) {
      await restorePendingState(lastTurn)
    }
  } catch (err) {
    console.error('加载历史详情失败', err)
  } finally {
    historyDetailLoading.value = false
  }

  scrollToBottom()
}

async function deleteHistoryItem(id: string) {
  try {
    await chatService.deleteHistory(id)
    historyList.value = historyList.value.filter(item => item.conversation_id !== id)
    emitAgentHistory()
    if (selectedConversationId.value === id) createNewConversation()
    ElMessage.success('删除成功')
  } catch (err) {
    console.error('删除历史记录失败', err)
    ElMessage.error('删除失败')
  }
}

function onDeleteHistoryFromBus(item: HistoryItemType) {
  deleteHistoryItem(item.id as string)
}

function getReportUrl(htmlUrl: string) {
  return `${window.location.origin}/pp/8IXEsfRrhEtLxm404RIup2Uq098PF8e2Wt9LOSGMAak${htmlUrl}`
}

function autoGrow(e: Event) {
  const target = e.target as HTMLTextAreaElement
  target.style.height = 'auto'
  target.style.height = `${Math.min(target.scrollHeight, 160)}px`
}

const showScrollToBottom = ref(false)
function onMessagesScroll(e: Event) {
  const el = e.target as HTMLElement
  const distance = el.scrollHeight - el.scrollTop - el.clientHeight
  showScrollToBottom.value = distance > 200
}

function scrollToBottomBtn() {
  scrollToBottom(true)
}

watch(messages, () => scrollToBottom(false), { deep: true })

onMounted(() => {
  loadHistory()
  bus.$on('on-new-chat', createNewConversation)
  bus.$on('set-agent-active-history', onSelectHistoryFromBus)
  bus.$on('delete-agent-history', onDeleteHistoryFromBus)
})

onUnmounted(() => {
  cancelPolling()
  bus.$off('on-new-chat', createNewConversation)
  bus.$off('set-agent-active-history', onSelectHistoryFromBus)
  bus.$off('delete-agent-history', onDeleteHistoryFromBus)
})

// 暴露给父组件的方法
defineExpose({ closePanel })
</script>

<template>
  <div class="chat-shell">
    <!-- 消息流 -->
    <main ref="messagesContainer" class="chat-main" @scroll="onMessagesScroll">
      <div class="chat-content">
        <!-- 空状态欢迎区 -->
        <div v-if="messages.length === 0" class="welcome">
          <div class="welcome-glow" />
          <h1 class="welcome-title">
            {{ greeting }}，我是
            <span class="gradient-text">AI 运营助手</span>
          </h1>
          <p class="welcome-sub">用自然语言查询业务数据 · 分析经营情况 · 写入业务变更</p>

          <div class="suggestion-grid">
            <button
              v-for="(item, idx) in suggestions"
              :key="idx"
              type="button"
              class="suggestion-card"
              :class="{ 'is-disabled': item.disabled }"
              :style="{ animationDelay: `${idx * 60}ms` }"
              :disabled="item.disabled"
              @click="!item.disabled && handleEmptyStateSelect(item.message)"
            >
              <div class="suggestion-icon" :class="`suggestion-icon-${idx}`">
                <div :class="item.icon" />
              </div>
              <div class="suggestion-body">
                <div class="suggestion-title">{{ item.title }}</div>
                <div class="suggestion-desc">{{ item.desc }}</div>
              </div>
            </button>
          </div>

          <div class="quick-tags">
            <span class="quick-tags-label">试试这样问：</span>
            <button v-for="tag in quickTags" :key="tag" type="button" class="quick-tag" @click="handleEmptyStateSelect(tag)">
              {{ tag }}
            </button>
          </div>
        </div>

        <!-- 对话列表 -->
        <div v-else class="message-list">
          <div v-for="message in messages" :key="message.id" class="message-row" :class="[`message-${message.role}`]">
            <!-- 用户消息 -->
            <template v-if="message.role === 'user'">
              <div class="bubble-user">
                <div class="bubble-text">{{ message.content }}</div>
                <div class="bubble-meta">{{ formatTime(message.timestamp) }}</div>
              </div>
            </template>

            <!-- 澄清卡片 -->
            <template v-else-if="message.step === 'clarify' && message.clarify_card">
              <div class="ai-block">
                <div class="ai-name-row">
                  <span class="ai-name">AI 运营助手</span>
                  <span class="ai-tag">需要补充</span>
                </div>

                <ThinkingBlock
                  v-if="message.thinking"
                  :message-id="message.id"
                  :thinking="message.thinking"
                  :expanded="expandedThinking.has(message.id)"
                  @toggle="toggleThinking"
                />

                <div class="clarify-card">
                  <div class="clarify-question">
                    <div class="i-ep-question-filled" />
                    <div class="markdown-content" v-html="renderMarkdown(message.clarify_card.question)" />
                  </div>

                  <div v-if="message.clarify_card.interaction.options.length > 0" class="clarify-options">
                    <button
                      v-for="option in message.clarify_card.interaction.options"
                      :key="option.value"
                      type="button"
                      class="clarify-chip"
                      :disabled="message.actionDisabled || isPolling"
                      @click="handleClarifyOption(option)"
                    >
                      {{ option.label }}
                    </button>
                  </div>

                  <button
                    v-if="message.clarify_card.interaction.allow_other"
                    type="button"
                    class="clarify-other"
                    :disabled="message.actionDisabled || isPolling"
                    @click="handleClarifyOther"
                  >
                    <div class="i-ep-edit" />
                    <span>{{ message.clarify_card.interaction.other_placeholder || '补充其他信息' }}</span>
                  </button>
                </div>
              </div>
            </template>

            <!-- 回答 / 思考中 / 结果 -->
            <template v-else-if="!message.step || message.step === 'thinking' || message.step === 'result'">
              <div class="ai-block">
                <div class="ai-name-row">
                  <span v-if="message.isWaiting" class="ai-tag thinking">正在思考</span>
                </div>

                <ThinkingBlock
                  v-if="message.thinking"
                  :message-id="message.id"
                  :thinking="message.thinking"
                  :expanded="expandedThinking.has(message.id)"
                  @toggle="toggleThinking"
                />

                <div class="ai-content">
                  <div class="markdown-content" v-html="renderMarkdown(message.content)" />
                  <div v-if="message.isWaiting" class="typing">
                    <span />
                    <span />
                    <span />
                  </div>

                  <a v-if="message.html_url" :href="getReportUrl(message.html_url)" target="_blank" class="report-link">
                    <div class="report-icon">
                      <div class="i-ep-data-analysis" />
                    </div>
                    <div class="report-info">
                      <div class="report-title">查看分析报告</div>
                      <div class="report-desc">点击在新窗口打开完整数据看板</div>
                    </div>
                    <div class="i-ep-top-right report-arrow" />
                  </a>
                </div>
              </div>
            </template>

            <!-- 错误卡片 -->
            <template v-else-if="message.step === 'error'">
              <div class="ai-block">
                <div class="ai-name-row">
                  <span class="ai-name ai-name-error">查询出错</span>
                </div>
                <div class="error-card">
                  <div class="markdown-content" v-html="renderMarkdown(message.error || message.content)" />
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- 回到最新 -->
      <Transition name="fade-up">
        <button v-if="showScrollToBottom" type="button" class="scroll-bottom" @click="scrollToBottomBtn">
          <div class="i-ep-arrow-down" />
        </button>
      </Transition>
    </main>

    <!-- 输入区 -->
    <footer class="chat-footer">
      <div class="footer-inner">
        <Transition name="fade">
          <div v-if="isClarifyingMode" class="clarify-banner">
            <div class="i-ep-info-filled" />
            <span>请补充澄清信息，或点击上方选项快速回答</span>
          </div>
        </Transition>

        <div class="composer" :class="{ 'composer-focused': inputMessage.length > 0 }">
          <!-- <button type="button" class="composer-side" title="附件">
            <div class="i-ep-paperclip" />
          </button> -->

          <textarea
            ref="inputRef"
            v-model="inputMessage"
            class="composer-field"
            rows="1"
            aria-label="消息输入"
            :placeholder="isClarifyingMode ? '补充信息以帮助 AI 更准确地回答...' : '有问题，尽管问，shift+enter换行'"
            @keydown="handleKeydown"
            @input="autoGrow"
          />

          <!-- <button
            type="button"
            class="composer-toggle"
            :class="{ active: deepThinkEnabled }"
            title="深度思考"
            @click="deepThinkEnabled = !deepThinkEnabled"
          >
            <div class="i-ep-magic-stick" />
            <span>深度思考</span>
          </button> -->

          <button
            type="button"
            class="send-btn"
            :disabled="!inputMessage.trim() || isPolling"
            :title="isPolling ? '正在生成' : '发送'"
            @click="sendMessage"
          >
            <div :class="isPolling ? 'i-ep-loading' : 'i-ep-top-right'" />
          </button>
        </div>

        <div class="footer-tip">
          <span>内容由 AI 生成，仅供参考</span>
          <span class="dot-sep">·</span>
          <span>请勿输入敏感信息</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
/* 全局设计 Token 已在 src/styles/gantt.scss 中定义 */

.chat-shell {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: var(--y-bg);
  color: var(--y-text-1);
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  line-height: 1.7;
  position: relative;
  overflow: hidden;
  border-left: 1px solid var(--y-border-soft);
}

/* ========== 主内容区 ========== */
.chat-main {
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
  position: relative;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--y-border);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: var(--y-text-3);
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

.chat-content {
  max-width: 1000px;
  margin: 0 auto;
  overflow-x: hidden;
  padding: 32px 24px 48px;
}

/* ========== 欢迎区 ========== */
.welcome {
  position: relative;
  padding: 80px 0 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.welcome-glow {
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, rgba(22, 120, 255, 0.08) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}

.welcome-logo {
  position: relative;
  width: 56px;
  height: 56px;
  margin-bottom: 28px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-logo-mark {
  width: 100%;
  height: 100%;
  border-radius: 18px;
  background: linear-gradient(135deg, #1678ff 0%, #4e9bff 50%, #74b3ff 100%);
  box-shadow: 0 10px 24px rgba(22, 120, 255, 0.32);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 14px;
    border-radius: 6px;
    background: linear-gradient(135deg, #ffffff 0%, #e8f3ff 100%);
    opacity: 0.92;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }
}

.welcome-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--y-text-1);
  letter-spacing: -0.5px;
  margin: 0 0 12px;
  z-index: 1;
  position: relative;
}

.gradient-text {
  background: linear-gradient(135deg, #1678ff 0%, #4e9bff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.welcome-sub {
  font-size: 14px;
  color: var(--y-text-2);
  margin: 0 0 40px;
  z-index: 1;
  position: relative;
}

/* 建议卡片 */
.suggestion-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: 100%;
  max-width: 600px;
  z-index: 1;
  position: relative;
}

.suggestion-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--y-bg-soft);
  border: 1px solid var(--y-border-soft);
  border-radius: 14px;
  cursor: pointer;
  text-align: left;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  animation: card-rise 0.5s ease-out backwards;
  box-shadow: 0 2px 8px rgba(31, 35, 41, 0.06);

  &:hover {
    border-color: var(--y-accent);
    background: var(--y-accent-soft);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(22, 120, 255, 0.12);

    .suggestion-icon {
      transform: scale(1.05);
    }
  }

  &.is-disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}

@keyframes card-rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.suggestion-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: var(--y-accent-soft);
  color: var(--y-accent);
  flex-shrink: 0;
  transition: transform 0.25s ease;
}

.suggestion-icon-0 {
  background: rgba(22, 120, 255, 0.1);
  color: #1678ff;
}
.suggestion-icon-1 {
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}
.suggestion-icon-2 {
  background: rgba(255, 125, 0, 0.1);
  color: #ff7d00;
}
.suggestion-icon-3 {
  background: rgba(156, 81, 224, 0.1);
  color: #9c51e0;
}

.suggestion-body {
  flex: 1;
  min-width: 0;
}

.suggestion-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--y-text-1);
  margin-bottom: 2px;
}

.suggestion-desc {
  font-size: 12px;
  color: var(--y-text-3);
  line-height: 1.5;
}

/* 快捷标签 */
.quick-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 28px;
  z-index: 1;
  position: relative;
}

.quick-tags-label {
  font-size: 12px;
  color: var(--y-text-3);
  margin-right: 4px;
}

.quick-tag {
  padding: 6px 14px;
  background: var(--y-bg-elevated);
  border: 1px solid var(--y-border-soft);
  border-radius: 999px;
  color: var(--y-text-2);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 4px rgba(31, 35, 41, 0.06);

  &:hover {
    background: var(--y-accent-soft);
    color: var(--y-accent);
    border-color: transparent;
    box-shadow: 0 2px 10px rgba(22, 120, 255, 0.12);
  }
}

/* ========== 消息流 ========== */
.message-list {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.message-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  animation: msg-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &.message-user {
    flex-direction: row-reverse;
  }
}

@keyframes msg-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 用户气泡 */
.bubble-user {
  max-width: 75%;
  background: #eaf3ff;
  color: #1d4ed8;
  padding: 10px 16px;
  border: 1px solid #b6d8ff;
  border-radius: 10px 10px 2px 10px;
  box-shadow: 0 2px 6px rgba(22, 120, 255, 0.06);
}

.bubble-text {
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.bubble-meta {
  font-size: 11px;
  color: rgba(29, 78, 216, 0.55);
  margin-top: 4px;
  text-align: right;
}

/* AI 块 */
.ai-block {
  flex: 1;
  min-width: 0;
  max-width: 100%;
}

.ai-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.ai-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--y-text-1);
}

.ai-name-error {
  color: var(--y-error);
}

.ai-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--y-warn-soft);
  color: var(--y-warn);
  border: 1px solid rgba(255, 125, 0, 0.15);
}

.ai-tag.thinking {
  background: var(--y-accent-soft);
  color: var(--y-accent);
  border-color: rgba(22, 120, 255, 0.15);
  position: relative;
  padding-left: 18px;

  &::before {
    content: '';
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 5px;
    height: 5px;
    background: currentColor;
    border-radius: 50%;
    animation: dot-pulse 1.2s ease-in-out infinite;
  }
}

@keyframes dot-pulse {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

/* AI 内容 */
.ai-content {
  font-size: 14px;
  color: var(--y-text-1);
  line-height: 1.75;
  word-break: break-word;
}

.typing {
  display: inline-flex;
  gap: 4px;
  padding: 8px 0;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--y-accent);
    animation: typing-bounce 1.2s ease-in-out infinite;
  }
  span:nth-child(2) {
    animation-delay: 0.15s;
  }
  span:nth-child(3) {
    animation-delay: 0.3s;
  }
}

@keyframes typing-bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-6px);
    opacity: 1;
  }
}

/* 报告链接卡片 */
.report-link {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
  padding: 12px 14px;
  background: var(--y-bg-soft);
  border: 1px solid var(--y-border-soft);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(31, 35, 41, 0.06);

  &:hover {
    border-color: var(--y-accent);
    background: var(--y-accent-soft);

    .report-arrow {
      color: var(--y-accent);
      transform: translate(2px, -2px);
    }
  }
}

.report-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--y-accent-soft);
  color: var(--y-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.report-info {
  flex: 1;
  min-width: 0;
}

.report-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--y-text-1);
}

.report-desc {
  font-size: 12px;
  color: var(--y-text-3);
  margin-top: 2px;
}

.report-arrow {
  color: var(--y-text-3);
  font-size: 14px;
  transition: all 0.2s ease;
}

/* 操作工具栏 */
.ai-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 10px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.message-row:hover .ai-actions,
.ai-actions:focus-within {
  opacity: 1;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 8px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--y-text-3);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.18s ease;
  position: relative;

  &:hover {
    background: var(--y-bg-soft);
    color: var(--y-text-1);
  }

  &.active {
    color: var(--y-accent);
    background: var(--y-accent-soft);
  }
}

.action-tip {
  font-size: 12px;
}

/* 澄清卡片 */
.clarify-card {
  background: var(--y-bg-soft);
  border: 1px solid var(--y-border-soft);
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 2px 8px rgba(31, 35, 41, 0.06);
}

.clarify-question {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 14px;
  background: var(--y-warn-soft);
  border-radius: 10px;
  color: var(--y-warn);
  font-size: 14px;
  line-height: 1.6;
  border-left: 3px solid var(--y-warn);

  & > .i-ep-question-filled {
    flex-shrink: 0;
    margin-top: 3px;
  }

  /* 澄清问题里的 markdown 文字沿用 warn 色；
     用深度选择器而非 :global()，避免污染页面里其它 .markdown-content */
  :deep(.markdown-content) {
    color: var(--y-warn);
    flex: 1;
  }
}

.clarify-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.clarify-chip {
  padding: 6px 14px;
  background: var(--y-bg-elevated);
  border: 1px solid var(--y-border-soft);
  border-radius: 999px;
  color: var(--y-text-1);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 4px rgba(31, 35, 41, 0.06);

  &:hover:not(:disabled) {
    border-color: var(--y-accent);
    color: var(--y-accent);
    background: var(--y-accent-soft);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.clarify-other {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: transparent;
  border: 1px dashed var(--y-border-soft);
  border-radius: 8px;
  color: var(--y-text-2);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: var(--y-accent);
    border-style: solid;
    color: var(--y-accent);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

/* 错误卡片 */
.error-card {
  background: var(--y-error-soft);
  border: 1px solid rgba(245, 63, 63, 0.15);
  border-radius: 12px;
  padding: 14px 16px;
  color: var(--y-error);
  font-size: 14px;
  line-height: 1.6;
}

/* ========== 回到最新 ========== */
.scroll-bottom {
  position: absolute;
  bottom: 24px;
  right: 50%;
  transform: translateX(380px);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--y-bg-elevated);
  border: 1px solid var(--y-border);
  color: var(--y-text-2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--y-shadow-md);
  transition: all 0.2s ease;
  z-index: 4;

  &:hover {
    color: var(--y-accent);
    border-color: var(--y-accent);
  }
}

/* ========== 输入区 ========== */
.chat-footer {
  flex-shrink: 0;
  padding: 14px 20px 20px;
  background: var(--y-bg);
  position: relative;
  z-index: 5;

  &::before {
    content: '';
    position: absolute;
    top: -32px;
    left: 0;
    right: 0;
    height: 32px;
    background: linear-gradient(to bottom, transparent, var(--y-bg));
    pointer-events: none;
  }
}

.footer-inner {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.clarify-banner {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--y-warn);
  padding: 6px 12px;
  background: var(--y-warn-soft);
  border-radius: 8px;
  align-self: stretch;
}

.composer {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  width: 100%;
  padding: 10px 10px 10px 14px;
  background: var(--y-bg-elevated);
  border: 1px solid var(--y-border-soft);
  border-radius: 20px;
  box-shadow: 0 3px 14px rgba(31, 35, 41, 0.08), 0 1px 4px rgba(31, 35, 41, 0.04);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: var(--y-border);
    box-shadow: 0 6px 20px rgba(31, 35, 41, 0.1);
  }

  &:focus-within {
    background: var(--y-bg-elevated);
    border-color: var(--y-accent);
    box-shadow: 0 0 0 3px rgba(22, 120, 255, 0.12), 0 4px 16px rgba(31, 35, 41, 0.08);
  }

  &.composer-focused {
    background: var(--y-bg-elevated);
    border-color: var(--y-border);
  }
}

.composer-side {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--y-text-2);
  font-size: 18px;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.18s ease;

  &:hover {
    background: var(--y-bg-soft);
    color: var(--y-accent);
  }
}

.composer-field {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  padding: 8px 4px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--y-text-1);
  font-family: inherit;
  max-height: 160px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--y-border);
    border-radius: 2px;
  }

  &::placeholder {
    color: var(--y-text-3);
  }
}

.composer-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 10px;
  background: transparent;
  border: 1px solid var(--y-border);
  border-radius: 999px;
  color: var(--y-text-2);
  font-size: 12px;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.18s ease;

  &:hover {
    color: var(--y-accent);
    border-color: var(--y-accent);
  }

  &.active {
    color: var(--y-accent);
    background: var(--y-accent-soft);
    border-color: var(--y-accent);
  }
}

.send-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1678ff 0%, #4096ff 100%);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(22, 120, 255, 0.3);

  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 6px 18px rgba(22, 120, 255, 0.4);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    background: var(--y-bg-soft);
    color: var(--y-text-3);
    box-shadow: none;
    cursor: not-allowed;
  }
}

.footer-tip {
  font-size: 11px;
  color: var(--y-text-3);
  display: flex;
  align-items: center;
  gap: 6px;
  text-align: center;

  .dot-sep {
    opacity: 0.5;
  }
}

/* ========== 过渡动画 ========== */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.25s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translate(380px, 8px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Markdown 样式已抽离到 src/styles/gantt.scss，由 main.ts 全局加载 */

/* 响应式 */
@media (max-width: 640px) {
  .chat-content {
    padding: 16px 12px 32px;
  }
  .suggestion-grid {
    grid-template-columns: 1fr;
  }
  .welcome-title {
    font-size: 22px;
  }
  .scroll-bottom {
    right: 16px;
    transform: none;
  }
  .bubble-user {
    max-width: 85%;
  }
}
</style>
