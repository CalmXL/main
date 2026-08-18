import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import Gantt from 'frappe-gantt'
import dayjs from 'dayjs'
import type { TaskItem, GanttTask, GanttViewMode } from '../types'
import { TASK_STATUS_MAP } from '../types'

export function useGantt(tasks: Ref<TaskItem[]>) {
  const ganttRef = ref<HTMLElement | null>(null)
  const ganttInstance = ref<Gantt | null>(null)
  const viewMode = ref<GanttViewMode>('Day')
  const selectedTask = ref<TaskItem | null>(null)

  const transformTasksToGantt = (taskList: TaskItem[]): GanttTask[] => {
    if (!taskList || taskList.length === 0) return []

    return taskList
      .filter(task => task._id && task.create_time)
      .map(task => {
        const startTime = task.start_time || task.create_time
        const endTime = task.end_time || dayjs().toISOString()

        let progress = 0
        if (task.status === 2) progress = 100
        else if (task.status === 1) progress = 50
        else if (task.status === 3) progress = 100

        const customClass = task.status !== undefined
          ? `task-status-${task.status}`
          : 'task-status-0'

        return {
          id: task._id!,
          name: `${task.app_name || 'Unknown'} - ${task.user_id || 'Unknown'}`,
          start: startTime!,
          end: endTime!,
          progress,
          custom_class: customClass,
          taskData: task
        }
      })
  }

  const initGantt = () => {
    if (!ganttRef.value) return

    const ganttTasks = transformTasksToGantt(tasks.value)

    ganttInstance.value = new Gantt(ganttRef.value, ganttTasks, {
      view_mode: viewMode.value,
      date_format: 'YYYY-MM-DD HH:mm',
      language: 'zh',
      custom_popup_html: null,
      on_click: (task: any) => {
        selectedTask.value = task.taskData || null
      }
    })
  }

  const updateGantt = () => {
    if (!ganttInstance.value) {
      initGantt()
      return
    }

    const ganttTasks = transformTasksToGantt(tasks.value)
    ganttInstance.value.refresh(ganttTasks)
  }

  const changeViewMode = (mode: GanttViewMode) => {
    viewMode.value = mode
    if (ganttInstance.value) {
      ganttInstance.value.change_view_mode(mode)
    }
  }

  watch(tasks, () => {
    updateGantt()
  }, { deep: true })

  onMounted(() => {
    if (tasks.value && tasks.value.length > 0) {
      initGantt()
    }
  })

  onUnmounted(() => {
    ganttInstance.value = null
  })

  return {
    ganttRef,
    ganttInstance,
    viewMode,
    selectedTask,
    initGantt,
    updateGantt,
    changeViewMode
  }
}
