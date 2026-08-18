import type { __common__ } from '@/services/modelFlow/types'

export type TaskStatus = 0 | 1 | 2 | 3 | 5

export interface TaskItem {
  _id?: string
  status?: TaskStatus
  app_id?: string
  app_name?: string
  user_id?: string
  create_time?: string
  start_time?: string
  end_time?: string
  priority?: number
}

export interface RecordItem {
  user_id?: string
  app_id?: string
  app_name?: string
  token_consumption?: number
  task_count?: number
  success_tasks?: number
  failed_tasks?: number
  total_prompt_tokens?: number
  total_completion_tokens?: number
  last_updated?: string
}

export interface StatsData {
  total_tasks?: number
  processing_tasks?: number
  queued_tasks?: number
  status_stats?: object
  app_stats?: object
  user_stats?: object
  priority_stats?: object
}

export interface GanttTask {
  id: string
  name: string
  start: string
  end: string
  progress: number
  custom_class?: string
  taskData?: TaskItem
}

export type GanttViewMode = 'Quarter Day' | 'Half Day' | 'Day' | 'Week' | 'Month'

export interface QueryParams {
  page: number
  page_size: number
  app_id?: string
  user_id?: string
  priority?: number
}

export const TASK_STATUS_MAP: Record<TaskStatus, { label: string; color: string; bgColor: string }> = {
  0: { label: '排队中', color: '#909399', bgColor: '#F4F4F5' },
  1: { label: '处理中', color: '#409EFF', bgColor: '#ECF5FF' },
  2: { label: '成功', color: '#67C23A', bgColor: '#F0F9EB' },
  3: { label: '失败', color: '#F56C6C', bgColor: '#FEF0F0' },
  5: { label: '特殊排队', color: '#E6A23C', bgColor: '#FDF6EC' }
}
