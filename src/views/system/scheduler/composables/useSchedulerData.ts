import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { statistics } from '@/services'
import type { StatsData, RecordItem, TaskItem, QueryParams } from '../types'

export function useSchedulerData() {
  const loading = ref(false)
  const statsLoading = ref(false)
  const recordsLoading = ref(false)

  const stats = ref<StatsData | null>(null)
  const records = ref<RecordItem[]>([])
  const tasks = ref<TaskItem[]>([])

  const queryParams = ref<QueryParams>({
    page: 1,
    page_size: 20,
    app_id: undefined,
    user_id: undefined,
    priority: undefined
  })

  const total = ref(0)
  const totalPages = ref(0)

  const successRate = computed(() => {
    if (!stats.value || !stats.value.total_tasks) return 0
    const { total_tasks, status_stats } = stats.value
    if (total_tasks === 0) return 0
    const successCount = (status_stats as Record<string, number>)?.['2'] || 0
    return ((successCount / total_tasks) * 100).toFixed(1)
  })

  const getStats = async () => {
    statsLoading.value = true
    try {
      const [err, data] = await statistics.getTasksStatsPost({
        app_id: queryParams.value.app_id,
        user_id: queryParams.value.user_id,
        priority: queryParams.value.priority
      })
      if (err) {
        ElMessage.error('获取统计数据失败')
        return
      }
      stats.value = data || null
    } catch (error) {
      console.error(error)
      ElMessage.error('获取统计数据失败')
    } finally {
      statsLoading.value = false
    }
  }

  const getRecords = async () => {
    recordsLoading.value = true
    try {
      const [err, data] = await statistics.getRecordsStatsPost()
      if (err) {
        ElMessage.error('获取记录数据失败')
        return
      }
      records.value = data || []
    } catch (error) {
      console.error(error)
      ElMessage.error('获取记录数据失败')
    } finally {
      recordsLoading.value = false
    }
  }

  const getTasks = async () => {
    loading.value = true
    try {
      const [err, data] = await statistics.getTasksListStatsPost(queryParams.value)
      if (err) {
        ElMessage.error('获取任务列表失败')
        return
      }
      if (data) {
        tasks.value = (data.data || []) as TaskItem[]
        total.value = data.total || 0
        totalPages.value = data.total_pages || 0
      }
    } catch (error) {
      console.error(error)
      ElMessage.error('获取任务列表失败')
    } finally {
      loading.value = false
    }
  }

  const refreshAll = async () => {
    await Promise.all([getStats(), getRecords(), getTasks()])
  }

  const handleQuery = () => {
    queryParams.value.page = 1
    refreshAll()
  }

  const resetQuery = () => {
    queryParams.value = {
      page: 1,
      page_size: 20,
      app_id: undefined,
      user_id: undefined,
      priority: undefined
    }
    refreshAll()
  }

  return {
    loading,
    statsLoading,
    recordsLoading,
    stats,
    records,
    tasks,
    queryParams,
    total,
    totalPages,
    successRate,
    getStats,
    getRecords,
    getTasks,
    refreshAll,
    handleQuery,
    resetQuery
  }
}
