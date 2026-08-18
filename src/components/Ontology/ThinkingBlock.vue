<script setup lang="ts">
import { marked } from 'marked'
import { computed } from 'vue'

const props = defineProps<{
  messageId: string
  thinking: string
  expanded: boolean
}>()

const emit = defineEmits<{
  toggle: [messageId: string]
}>()

function renderMarkdown(text: string): string {
  if (!text) return ''
  return marked.parse(text) as string
}

/** 折叠态预览文本：取前 60 个字符，单行省略 */
const preview = computed(() => {
  const t = (props.thinking || '').replace(/\s+/g, ' ').trim()
  return t.length > 60 ? `${t.slice(0, 60)}…` : t
})
</script>

<template>
  <div class="thinking-block">
    <!-- 头部：可点击展开/折叠 -->
    <button
      type="button"
      class="thinking-head"
      :aria-expanded="expanded"
      @click="emit('toggle', messageId)"
    >
      <div :class="expanded ? 'i-ep-arrow-down' : 'i-ep-arrow-right'" class="thinking-icon" />
      <!-- <div class="i-ep-magic-stick thinking-spark" /> -->
      <span class="thinking-label">已深度思考</span>
      <span v-if="!expanded && preview" class="thinking-preview">{{ preview }}</span>
    </button>

    <!-- 展开后内容 -->
    <Transition name="think-expand">
      <div v-if="expanded" class="thinking-body">
        <div
          class="thinking-content markdown-content"
          v-html="renderMarkdown(thinking)"
        />
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.thinking-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 8px 0 14px;
  font-size: 13px;
  color: var(--y-text-2);
}

/* ========= 头部（折叠态主形态） ========= */
.thinking-head {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  max-width: 100%;
  padding: 5px 12px 5px 8px;
  background: linear-gradient(135deg, var(--y-accent-soft) 0%, rgba(22, 120, 255, 0.04) 100%);
  border: 1px solid rgba(22, 120, 255, 0.18);
  border-radius: 999px;
  color: var(--y-accent);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  align-self: flex-start;

  &:hover {
    background: var(--y-accent-soft);
    border-color: var(--y-accent);
    box-shadow: 0 2px 8px rgba(22, 120, 255, 0.12);
  }
}

.thinking-icon {
  font-size: 11px;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.thinking-spark {
  font-size: 13px;
  flex-shrink: 0;
}

.thinking-label {
  white-space: nowrap;
  letter-spacing: 0.2px;
}

.thinking-preview {
  display: inline-block;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--y-text-3);
  font-weight: 400;
  font-size: 12px;
  padding-left: 8px;
  border-left: 1px solid rgba(22, 120, 255, 0.2);
}

/* ========= 展开后的内容卡片 ========= */
.thinking-body {
  position: relative;
  background: linear-gradient(to right, var(--y-accent-soft) 0%, transparent 60%);
  border-left: 3px solid var(--y-accent);
  border-radius: 0 10px 10px 0;
  padding: 12px 16px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--y-text-2);
  max-height: 320px;
  overflow-y: auto;
  overflow-x: auto;

  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(22, 120, 255, 0.3);
    border-radius: 2px;
  }
}

.thinking-content {
  font-size: 13px;
  line-height: 1.7;
  color: var(--y-text-2);

  /* 思考内容样式弱化：标题、强调用次级颜色 */
  :deep(p) {
    margin: 0 0 8px;
    &:last-child { margin-bottom: 0; }
  }
  :deep(p:first-child::before) {
    content: '🤔 ';
  }
  :deep(h1), :deep(h2), :deep(h3), :deep(h4) {
    font-size: 13px;
    font-weight: 600;
    color: var(--y-text-2);
    margin: 8px 0 4px;
  }
  :deep(strong) { color: var(--y-text-1); font-weight: 600; }
  :deep(code) {
    font-size: 12px;
    background: rgba(22, 120, 255, 0.08);
    color: var(--y-accent);
  }
  :deep(pre) {
    background: rgba(22, 120, 255, 0.04);
    border: 1px solid rgba(22, 120, 255, 0.12);
  }
  :deep(ul), :deep(ol) {
    margin: 4px 0 8px;
    padding-left: 20px;
  }
  :deep(li) { margin: 2px 0; }
}

/* ========= 展开/折叠过渡 ========= */
.think-expand-enter-active,
.think-expand-leave-active {
  transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 320px;
  opacity: 1;
}

.think-expand-enter-from,
.think-expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-4px);
}
</style>
