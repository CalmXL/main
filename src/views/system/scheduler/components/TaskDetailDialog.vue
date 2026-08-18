<template>
  <el-dialog v-model="visible" title="任务详情" width="600px" destroy-on-close>
    <el-descriptions v-if="task" :column="2" border>
      <el-descriptions-item label="任务ID" :span="2">
        {{ task._id }}
      </el-descriptions-item>

      <el-descriptions-item label="创建时间" :span="2">
        {{ formatTime(task.create_time) }}
      </el-descriptions-item>
      <el-descriptions-item label="应用名称">
        {{ task.app_name }}
      </el-descriptions-item>
      <el-descriptions-item label="用户ID">
        {{ task.user_id }}
      </el-descriptions-item>
      <el-descriptions-item label="任务状态">
        <el-tag :type="getStatusType(task.status)">
          {{ getStatusLabel(task.status) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="优先级">
        <el-tag type="info">{{ task.priority }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="开始时间">
        {{ formatTime(task.start_time) }}
      </el-descriptions-item>
      <el-descriptions-item label="结束时间">
        {{ formatTime(task.end_time) }}
      </el-descriptions-item>
      <el-descriptions-item v-if="duration" label="执行时长" :span="2">
        <el-tag type="success">{{ duration }}</el-tag>
      </el-descriptions-item>
    </el-descriptions>
    <el-empty v-else description="暂无任务数据" />
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import type { TaskItem, TaskStatus } from '../types'
import { TASK_STATUS_MAP } from '../types'

interface Props {
  modelValue: boolean
  task: TaskItem | null
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

const getStatusLabel = (status?: TaskStatus) => {
  if (status === undefined) return '未知'
  return TASK_STATUS_MAP[status]?.label || '未知'
}

const getStatusType = (status?: TaskStatus) => {
  if (status === undefined) return 'info'
  switch (status) {
    case 0: return 'info'
    case 1: return 'primary'
    case 2: return 'success'
    case 3: return 'danger'
    case 5: return 'warning'
    default: return 'info'
  }
}

const formatTime = (time?: string) => {
  if (!time) return '-'
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const duration = computed(() => {
  if (!props.task?.start_time || !props.task?.end_time) return null

  const start = dayjs(props.task.start_time)
  const end = dayjs(props.task.end_time)
  const diff = end.diff(start, 'second')

  if (diff < 60) return `${diff}秒`
  if (diff < 3600) return `${Math.floor(diff / 60)}分${diff % 60}秒`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时${Math.floor((diff % 3600) / 60)}分`
  return `${Math.floor(diff / 86400)}天${Math.floor((diff % 86400) / 3600)}小时`
})
</script>

<style lang="scss" scoped>
:deep(.el-descriptions__label) {
  font-weight: 600;
}
</style>
