<template>
  <div class="p-6 space-y-6">
    <div class="flex gap-2">
      <el-card class="flex-1" shadow="never">
        <template #header>
          <span font-bold>模型队列测试工具</span>
        </template>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" size="default">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="应用" prop="appId">
                <el-select v-model="form.appId" filterable clearable placeholder="请选择应用" style="width: 100%" @change="handleAppChange">
                  <el-option
                    v-for="item in appList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    :disabled="!item.enable_request_queue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="模型" prop="modelId">
                <el-select v-model="form.modelId" filterable clearable placeholder="请先选择应用" style="width: 100%">
                  <el-option
                    v-for="item in modelList"
                    :key="item.id"
                    :label="item.nickname || item.model_name"
                    :value="item.id"
                    :disabled="item.concurrency === 0"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="并发数量" prop="concurrency">
                <el-input-number v-model="form.concurrency" :min="1" :max="100" style="width: 100%" controls-position="right" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="请求内容">
            <el-input v-model="form.requestBody" type="textarea" :rows="6" font-mono />
          </el-form-item>
          <el-form-item>
            <el-button v-if="!polling" type="primary" :loading="sending" @click="startTest">开始测试</el-button>
            <el-button v-else type="danger" @click="stopTest">停止测试</el-button>
            <el-button @click="refreshQueue">刷新队列</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="flex-1" shadow="never">
        <template #header>
          <div flex items-center justify-between>
            <span font-bold>队列信息</span>
            <div flex items-center gap-4>
              <span class="flex items-center gap-1 text-xs">
                <span>自动刷新</span>
                <el-switch v-model="autoRefresh" size="small" />
              </span>
              <el-button :icon="Refresh" circle size="small" @click="refreshQueue" />
            </div>
          </div>
        </template>
        <el-tabs v-model="activeTab">
          <el-tab-pane label="正在运行" name="running">
            <el-table v-loading="runningLoading" :data="runningList" stripe height="300" class="base-table">
              <el-table-column type="index" width="50" label="序号" align="center" />
              <el-table-column prop="id" label="任务ID" width="80" align="center" />
              <el-table-column prop="status" label="状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="statusTag(row.status)">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="requester" label="请求人" width="120" align="center" />
              <el-table-column prop="created_at" label="创建时间" width="160" align="center">
                <template #default="{ row }">
                  <span>{{ row.created_at ? dayjs(row.created_at).format('YY-MM-DD HH:mm:ss') : '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="app_name" label="来源应用" min-width="150" show-overflow-tooltip />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="等待中" name="pending">
            <el-table v-loading="pendingLoading" :data="pendingList" stripe height="300" class="base-table">
              <el-table-column type="index" width="50" label="序号" align="center" />
              <el-table-column prop="id" label="任务ID" width="80" align="center" />
              <el-table-column prop="status" label="状态" width="100" align="center" min-width="100">
                <template #default="{ row }">
                  <el-tag :type="statusTag(row.status)">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="requester" label="请求人" width="120" align="center" />
              <el-table-column prop="created_at" label="创建时间" width="160" align="center">
                <template #default="{ row }">
                  <span>{{ row.created_at ? dayjs(row.created_at).format('YY-MM-DD HH:mm:ss') : '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="app_name" label="来源应用" min-width="150" show-overflow-tooltip />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <!-- 并发测试状态与结果 -->
    <el-card v-if="testRequests.length" shadow="never" class="mt-4">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-bold">并发测试实时状态 (共 {{ testRequests.length }} 个并发)</span>
          <el-tag v-if="polling" type="primary" effect="plain" class="animate-pulse">测试进行中...</el-tag>
          <el-tag v-else type="info" effect="plain">测试已结束</el-tag>
        </div>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-1">
        <div
          v-for="item in testRequests"
          :key="item.index"
          class="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
          :style="{
            borderLeft: `4px solid ${
              item.status === 'success'
                ? '#10b981'
                : item.status === 'failed'
                ? '#ef4444'
                : item.status === 'queued'
                ? '#f59e0b'
                : '#3b82f6'
            }`
          }"
        >
          <div>
            <div class="flex justify-between items-center mb-3">
              <span class="font-bold text-sm text-gray-700">并发请求 #{{ item.index }}</span>
              <el-tag :type="getRequestStatusTag(item.status)" size="small" effect="dark">
                {{ getRequestStatusText(item.status) }}
              </el-tag>
            </div>

            <div class="space-y-2 text-xs text-gray-600">
              <div v-if="item.status === 'queued' && item.taskId" class="flex items-center justify-between bg-gray-50 p-1.5 rounded">
                <span>排队任务 ID:</span>
                <span class="font-mono font-medium text-gray-800">{{ item.taskId }}</span>
              </div>

              <!-- Waiting count display with a nice visual badge -->
              <div
                v-if="item.status === 'queued'"
                class="flex items-center justify-between bg-amber-50 text-amber-800 p-2 rounded border border-amber-100"
              >
                <span class="flex items-center gap-1 font-semibold">
                  <el-icon class="animate-pulse"><User /></el-icon>
                  前方排队人数:
                </span>
                <span class="text-sm font-bold">{{ item.waitCount }} 人</span>
              </div>

              <div v-if="item.time" class="flex items-center justify-between">
                <span>响应时间:</span>
                <span class="text-gray-800">{{ item.time }}</span>
              </div>
            </div>
          </div>

          <!-- Result / Response content -->
          <div v-if="item.result" class="mt-3 pt-3 border-t border-gray-100">
            <div class="font-semibold text-xs text-gray-700 mb-1 flex items-center justify-between">
              <span>模型返回结果:</span>
              <el-tag v-if="item.status === 'success'" type="success" size="small" class="scale-90 origin-right">SUCCESS</el-tag>
              <el-tag v-else type="danger" size="small" class="scale-90 origin-right">ERROR</el-tag>
            </div>

            <div class="max-h-[180px] overflow-y-auto border border-gray-100 rounded bg-gray-50 p-2 font-mono text-[11px] text-gray-700">
              <div
                v-if="getExtractedContent(item.result)"
                class="font-sans text-xs text-gray-800 whitespace-pre-wrap leading-relaxed select-all mb-2 pb-2 border-b border-gray-200/60"
              >
                {{ getExtractedContent(item.result) }}
              </div>
              <el-collapse v-if="typeof item.result === 'object'" class="raw-json-collapse border-none">
                <el-collapse-item title="查看原始 JSON" name="1" class="bg-transparent">
                  <pre class="m-0 text-[10px] text-gray-500 whitespace-pre-wrap leading-normal font-mono">{{
                    JSON.stringify(item.result, null, 2)
                  }}</pre>
                </el-collapse-item>
              </el-collapse>
              <pre v-else class="m-0 whitespace-pre-wrap">{{ item.result }}</pre>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card v-if="pollDataList.length" shadow="never">
      <template #header>
        <span font-bold>轮询历史记录</span>
      </template>
      <div class="space-y-2 max-h-400 overflow-auto">
        <div v-for="(item, idx) in pollDataList" :key="idx" class="border border-gray-200 rounded p-3">
          <div class="mb-1 text-xs text-gray-400">#{{ idx + 1 }} - {{ item.time }}</div>
          <pre class="m-0 text-sm whitespace-pre-wrap">{{ item.data }}</pre>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ElForm, ElMessage, FormRules } from 'element-plus'
import { Refresh, User } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { queueManagement, applicationManagement } from '@/services'
import { isProd } from '@/config'

const formRef = ref<InstanceType<typeof ElForm>>()

const rules: FormRules = {
  appId: [{ required: true, message: '请选择应用', trigger: 'change' }],
  modelId: [{ required: true, message: '请选择模型', trigger: 'change' }],
  concurrency: [{ required: true, message: '请输入并发数量', trigger: 'blur' }]
}

const form = reactive({
  modelId: undefined as number | undefined,
  appId: undefined as number | undefined,
  concurrency: undefined as number | undefined,
  appKey: '',
  requestBody: `{
  "messages": [
    {
      "role": "user",
      "content": "hi"
    }
  ],
  "stream": false,
  "extra_body": {
    "enable_thinking": false
  }
}`
})

const modelList = ref<any[]>([])
const appList = ref<any[]>([])

async function fetchApps() {
  const [, data] = await applicationManagement.getApplications({ page: 1, page_size: 499 })
  appList.value = data?.list || []
}

async function fetchAppModels(appId: number) {
  if (!appId) {
    modelList.value = []
    return
  }
  const [, data] = await applicationManagement.getApplicationsByIdConfig(appId)
  modelList.value = data?.models || []
}

function handleAppChange(val: number) {
  form.modelId = undefined as any
  fetchAppModels(val)
  const app = appList.value.find(a => a.id === val)
  if (app) form.appKey = app.app_key || ''
}

const sending = ref(false)
const polling = ref(false)

const activeTab = ref('running')
const runningLoading = ref(false)
const pendingLoading = ref(false)
const runningList = ref<any[]>([])
const pendingList = ref<any[]>([])
const autoRefresh = ref(false)
let autoRefreshTimer: ReturnType<typeof setInterval> | null = null

const pollDataList = ref<Array<{ time: string; data: any }>>([])

// 并发请求的状态列表
const testRequests = ref<any[]>([])

function getRequestStatusTag(status: string) {
  const map: Record<string, string> = {
    requesting: 'primary',
    queued: 'warning',
    success: 'success',
    failed: 'danger'
  }
  return map[status] || 'info'
}

function getRequestStatusText(status: string) {
  const map: Record<string, string> = {
    requesting: '请求中...',
    queued: '排队中',
    success: '成功',
    failed: '失败'
  }
  return map[status] || status
}

function getExtractedContent(result: any) {
  if (!result) return ''
  if (typeof result === 'string') return result
  if (result.choices && result.choices[0] && result.choices[0].message) {
    return result.choices[0].message.content || ''
  }
  if (result.data?.choices && result.data.choices[0]?.message) {
    return result.data.choices[0].message.content || ''
  }
  return ''
}

function statusTag(status: string): 'success' | 'warning' | 'primary' | 'info' | 'danger' {
  const map: Record<string, string> = {
    running: 'success',
    pending: 'warning',
    executable: 'primary',
    cancelled: 'info',
    failed: 'danger'
  }
  return (map[status] || 'info') as any
}

async function fetchQueueData(showLoading = true) {
  if (!form.modelId) return
  if (showLoading) {
    runningLoading.value = true
    pendingLoading.value = true
  }
  try {
    const [runErr, runData] = await queueManagement.getModelsByModelIdQueueTasks({
      modelId: form.modelId,
      page: 1,
      page_size: 100
    })
    if (runErr) {
      console.error('获取队列任务失败', runErr)
    } else {
      const list = runData?.list || []
      runningList.value = list.filter((item: any) => item.status === 'running')
      pendingList.value = list.filter((item: any) => item.status === 'pending' || item.status === 'executable')
    }
  } catch (error) {
    console.error(error)
  } finally {
    runningLoading.value = false
    pendingLoading.value = false
  }
}

function refreshQueue() {
  fetchQueueData()
}

async function fetchModelApi(url: string, parsed: any, item: any) {
  try {
    const selectedModel = modelList.value.find(m => m.id === form.modelId)
    if (selectedModel) {
      parsed.model = selectedModel.model_name
    }
    const response = await fetch(url, { method: 'POST', body: JSON.stringify(parsed) })
    if (response.status === 429) {
      let data: any
      try {
        data = await response.json()
      } catch (err) {
        console.error('解析429响应失败', err)
      }
      const taskId = data?.task_id || ''
      item.status = 'queued'
      item.taskId = Number(taskId)

      while (polling.value) {
        // eslint-disable-next-line no-await-in-loop
        const [pollErr, pollData] = await queueManagement.getQueueTasksByTaskId({ taskId: Number(taskId), waitTime: 1 })
        if (pollErr) {
          item.status = 'failed'
          item.result = `轮询失败: ${pollErr.message || '未知错误'}`
          break
        }
        if (pollData) {
          console.log(pollData)
          const status = pollData.status || ''
          item.waitCount = pollData.wait_count ?? 0

          if (status === 'executable' && taskId) {
            item.status = 'requesting'
            parsed.extra_body = parsed.extra_body || {}
            parsed.extra_body.queue_id = Number(taskId)
            return fetchModelApi(url, parsed, item)
          }
          if (status !== 'pending') {
            item.status = 'failed'
            item.result = `排队取消或失败，状态: ${status}`
            break
          }
        }
        // eslint-disable-next-line no-promise-executor-return
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } else {
      if (!response.ok) {
        const errText = await response.text()
        item.status = 'failed'
        item.result = `请求失败 (${response.status}): ${errText}`
        return
      }

      let data: any
      try {
        data = await response.json()
      } catch {
        data = await response.text()
      }

      item.status = 'success'
      item.time = dayjs().format('HH:mm:ss')
      item.result = data

      pollDataList.value.push({
        time: item.time,
        data: typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data)
      })

      return data
    }
  } catch (error: any) {
    item.status = 'failed'
    item.result = `请求异常: ${error.message || '未知错误'}`
  }
}

async function startTest() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  if (!form.requestBody.trim()) {
    ElMessage.warning('请输入请求内容')
    return
  }

  let parsed: any
  try {
    parsed = JSON.parse(form.requestBody)
  } catch {
    ElMessage.warning('请求内容不是有效的 JSON')
    return
  }

  sending.value = true
  polling.value = true
  pollDataList.value = []

  testRequests.value = Array.from({ length: form.concurrency || 1 }).map((_, index) => ({
    index: index + 1,
    status: 'requesting',
    waitCount: 0
  }))

  try {
    const url = `${isProd ? '/pp/7puG2H61QiHoNhPk8xwIcZh9BR60L3wWAHtcR1hbQa4' : '/queueTest'}/${form.appKey}/v1/chat/completions`
    const promises = testRequests.value.map(item => {
      const parsedClone = JSON.parse(JSON.stringify(parsed))
      return fetchModelApi(url, parsedClone, item)
    })

    await Promise.all(promises)
  } catch (error: any) {
    ElMessage.error(`请求异常: ${error.message || '未知错误'}`)
  } finally {
    sending.value = false
    polling.value = false
  }
}

function stopTest() {
  polling.value = false
  testRequests.value.forEach(item => {
    if (item.status === 'queued' && item.taskId) {
      queueManagement.deleteQueueTasksByTaskId(item.taskId).catch(err => {
        console.error(`取消任务 ${item.taskId} 失败:`, err)
      })
      item.status = 'failed'
      item.result = '测试手动停止，排队已取消'
    }
  })
}

function startAutoRefresh() {
  stopAutoRefresh()
  if (autoRefresh.value) {
    autoRefreshTimer = setInterval(() => {
      fetchQueueData(false)
    }, 1000)
  }
}

function stopAutoRefresh() {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer)
    autoRefreshTimer = null
  }
}

watch(autoRefresh, val => {
  if (val) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
})

onMounted(() => {
  fetchApps()
  fetchQueueData()
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style lang="scss" scoped>
.max-h-400 {
  max-height: 400px;
}
.raw-json-collapse {
  :deep(.el-collapse-item__header) {
    height: 28px;
    line-height: 28px;
    font-size: 11px;
    background-color: transparent;
    border-bottom: none;
    color: #9ca3af;
  }
  :deep(.el-collapse-item__wrap) {
    background-color: transparent;
    border-bottom: none;
  }
  :deep(.el-collapse-item__content) {
    padding-bottom: 8px;
  }
}
</style>
