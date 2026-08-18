<template>
  <Dialog v-model="visible" :title="`任务队列 - ${props.modelName}`" footer-class="hidden" width="900px" @close="handleClose">
    <div flex items-center gap-8 class="relative">
      <el-tabs v-model="activeTab" flex-1>
        <el-tab-pane label="正在运行" name="running">
          <el-table v-loading="runningLoading" :data="runningList" stripe class="base-table" height="400">
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
            <el-table-column label="操作" width="80" align="center" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="handleDetail(row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="等待中" name="pending">
          <el-table v-loading="pendingLoading" :data="pendingList" stripe height="400">
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
            <el-table-column label="操作" width="80" align="center" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="handleDetail(row)">详情</el-button>
                <el-button v-if="row.status === 'pending' || row.status === 'executable'" link type="danger" @click="handleCancel(row)">
                  取消
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div class="absolute top-0 right-0 flex items-center gap-4">
        <div class="flex items-center gap-1">
          <span class="text-xs">自动刷新</span>
          <el-switch v-model="autoRefresh" size="small" />
        </div>
        <el-button :icon="Refresh" circle size="small" @click="handleRefresh" />
      </div>
    </div>

    <Dialog v-model="detailVisible" title="任务详情" width="500px" append-to-body>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="任务ID">{{ detailData?.id }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="statusTag(detailData?.status)">{{ detailData?.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="请求人">{{ detailData?.requester || '-' }}</el-descriptions-item>
        <el-descriptions-item label="来源应用">{{ detailData?.app_name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="应用ID">{{ detailData?.app_id ?? '-' }}</el-descriptions-item>
        <el-descriptions-item label="模型ID">{{ detailData?.model_id ?? '-' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ detailData?.created_at ? dayjs(detailData.created_at).format('YY-MM-DD HH:mm:ss') : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="可发送时间">
          {{ detailData?.executable_at ? dayjs(detailData.executable_at).format('YY-MM-DD HH:mm:ss') : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="是否队列任务">
          <el-tag :type="detailData?.is_queue_task ? 'warning' : 'info'">{{ detailData?.is_queue_task ? '是' : '否' }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </Dialog>
  </Dialog>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { queueManagement } from '@/services'

const props = defineProps<{
  open: boolean
  modelId?: number
  modelName?: string
}>()

const emit = defineEmits(['update:open'])

const visible = computed({
  get: () => props.open,
  set: val => emit('update:open', val)
})

const activeTab = ref('running')
const runningLoading = ref(false)
const pendingLoading = ref(false)
const runningList = ref<any[]>([])
const pendingList = ref<any[]>([])
const detailVisible = ref(false)
const detailData = ref<any>(null)
const autoRefresh = ref(false)
const AUTO_REFRESH_INTERVAL = 1000 * 1
let autoRefreshTimer: ReturnType<typeof setInterval> | null = null

function statusTag(status: string): 'success' | 'warning' | 'primary' | 'info' | 'danger' {
  const map: Record<string, string> = {
    running: 'success',
    pending: 'warning',
    executable: 'primary',
    cancelled: 'info',
    failed: 'danger'
  }
  return map[status] || ('info' as any)
}

async function fetchQueueData(showLoading = true) {
  if (!props.modelId) return

  if (showLoading) {
    runningLoading.value = true
    pendingLoading.value = true
  }

  try {
    const [runErr, runData] = await queueManagement.getModelsByModelIdQueueTasks({
      modelId: props.modelId,
      page: 1,
      page_size: 100
    })
    if (runErr) {
      console.error('获取运行任务失败', runErr)
    } else {
      const list = runData?.list || []
      runningList.value = list.filter((item: any) => item.status === 'running')
      pendingList.value = list.filter((item: any) => item.status === 'pending' || item.status === 'executable')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('获取队列数据失败')
  } finally {
    runningLoading.value = false
    pendingLoading.value = false
  }
}

function handleRefresh() {
  fetchQueueData()
}

function handleDetail(row: any) {
  detailData.value = row
  detailVisible.value = true
}

async function handleCancel(row: any) {
  try {
    await ElMessageBox.confirm(`确定要取消任务 #${row.id} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const [err] = await queueManagement.deleteQueueTasksByTaskId(row.id)
    if (err) {
      ElMessage.error(err.message || '取消失败')
      return
    }
    ElMessage.success('取消成功')
    fetchQueueData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
      ElMessage.error('操作失败')
    }
  }
}

function startAutoRefresh() {
  stopAutoRefresh()
  if (props.open && autoRefresh.value) {
    autoRefreshTimer = setInterval(() => {
      fetchQueueData(false)
    }, AUTO_REFRESH_INTERVAL)
  }
}

function stopAutoRefresh() {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer)
    autoRefreshTimer = null
  }
}

function handleClose() {
  stopAutoRefresh()
  visible.value = false
}

watch(
  () => props.open,
  val => {
    if (val) {
      activeTab.value = 'running'
      fetchQueueData()
      if (autoRefresh.value) startAutoRefresh()
    } else {
      stopAutoRefresh()
    }
  },
  { immediate: true }
)

watch(autoRefresh, val => {
  if (val && props.open) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>
