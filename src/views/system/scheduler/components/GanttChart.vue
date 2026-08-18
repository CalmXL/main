<template>
  <el-row class="gantt-chart-box" :gutter="20">
    <el-col :span="24">
      <Card title="任务时间线">
        <div v-loading="loading" class="gantt-container">
          <v-chart
            v-if="hasData"
            class="gantt-wrapper"
            :option="chartOption"
            autoresize
            @click="handleClick"
          />
          <div v-if="!loading && tasks.length === 0" class="empty-state">
            <el-empty description="暂无任务数据" />
          </div>
        </div>
        <div v-if="total > pageSize" class="pagination-wrapper">
          <div class="pagination-info">
            共
            <span class="highlight">{{ total }}</span>
            条任务
          </div>
          <el-pagination
            :current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20, 50, 100]"
            layout="sizes, prev, pager, next"
            small
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </Card>
    </el-col>
  </el-row>
  <TaskDetailDialog v-model="showDetail" :task="selectedTask" />
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'
import * as echarts from 'echarts/core'
import { CustomChart, LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, DataZoomComponent, ToolboxComponent, MarkLineComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import dayjs from 'dayjs'
import TaskDetailDialog from './TaskDetailDialog.vue'
import Card from './Card.vue'
import type { TaskItem } from '../types'
import { TASK_STATUS_MAP } from '../types'

echarts.use([
  CustomChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  ToolboxComponent,
  MarkLineComponent,
  CanvasRenderer
])

interface Props {
  tasks: TaskItem[]
  loading?: boolean
  total?: number
  currentPage?: number
  pageSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  total: 0,
  currentPage: 1,
  pageSize: 10
})

const emit = defineEmits<{
  'update:currentPage': [value: number]
  'update:pageSize': [value: number]
  refresh: []
}>()

const selectedTask = ref<TaskItem | null>(null)
const showDetail = ref(false)

const handleSizeChange = (size: number) => {
  emit('update:pageSize', size)
  emit('update:currentPage', 1)
  emit('refresh')
}

const handleCurrentChange = (page: number) => {
  emit('update:currentPage', page)
  emit('refresh')
}

const hasData = computed(() => props.tasks && props.tasks.length > 0)

const PRIORITY_COLORS: Record<number, string> = {
  0: '#1D7A1D',
  1: '#28A428',
  2: '#3CB33C',
  3: '#67C23A',
  4: '#85D26A',
  5: '#A8E08A'
}

const getTaskColor = (status?: number, priority?: number) => {
  if (status === undefined) return TASK_STATUS_MAP[0].color
  if (status === 2 && priority !== undefined && priority >= 0 && priority <= 5) {
    return PRIORITY_COLORS[priority]
  }
  return TASK_STATUS_MAP[status as keyof typeof TASK_STATUS_MAP]?.color || TASK_STATUS_MAP[0].color
}

const chartOption = computed(() => {
  if (!hasData.value) return {}

  const tasks = props.tasks.map((task, index) => {
    const startTime = task.start_time || task.create_time
    const endTime = task.end_time || dayjs().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss')

    return {
      name: `${task.app_name || task.app_id || 'Unknown'} - ${task.user_id || 'Unknown'}`,
      value: [index, dayjs(startTime).valueOf(), dayjs(endTime).valueOf(), task.status, task],
itemStyle: {
        color: getTaskColor(task.status, task.priority)
      }
    }
  })

  const minTime = Math.min(...tasks.map(t => t.value[1] as number))
  const maxTime = Math.max(...tasks.map(t => t.value[2] as number))
  const timeRange = maxTime - minTime
  const padding = timeRange * 0.15

  const now = dayjs().valueOf()
  const showTodayLine = now >= minTime && now <= maxTime

  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e0e0',
      borderWidth: 1,
      padding: [12, 16],
      textStyle: {
        color: '#333',
        fontSize: 13
      },
      formatter: (params: any) => {
        const task = params.data.value[4]
        const start = dayjs(params.data.value[1]).format('YYYY-MM-DD HH:mm:ss')
        const end = dayjs(params.data.value[2]).format('YYYY-MM-DD HH:mm:ss')
        const status = TASK_STATUS_MAP[task.status as keyof typeof TASK_STATUS_MAP]?.label || '未知'
        const duration = dayjs(params.data.value[2]).diff(dayjs(params.data.value[1]), 'second', true).toFixed(1)
        return `
          <div style="padding: 4px 0;">
            <div style="font-weight: 600; margin-bottom: 8px; font-size: 14px;">${params.data.name}</div>
            <div style="display: flex; justify-content: space-between; margin: 4px 0;">
              <span style="color: #666;">开始时间：</span>
              <span style="font-weight: 500;">${start}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 4px 0;">
              <span style="color: #666;">结束时间：</span>
              <span style="font-weight: 500;">${end}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 4px 0;">
              <span style="color: #666;">持续时间：</span>
              <span style="font-weight: 500;">${duration} 秒</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 4px 0;">
              <span style="color: #666;">状态：</span>
              <span style="font-weight: 500;">${status}</span>
            </div>
          </div>
        `
      }
    },
    grid: {
      left: '100px',
      right: '3%',
      top: 50,
      bottom: 80,
      containLabel: false
    },
    xAxis: {
      type: 'time',
      position: 'top',
      min: minTime - padding,
      max: maxTime + padding,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ddd'
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#ddd'
        }
      },
      axisLabel: {
        color: '#666',
        fontSize: 12,
        margin: 8,
        formatter: (value: number) => {
          const date = dayjs(value)
          return date.format('MM-DD HH:mm:ss')
        }
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'category',
      data: tasks.map(t => t.name),
      inverse: true,
      position: 'left',
      boundaryGap: true,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#333',
        fontSize: 13,
        width: 200,
        overflow: 'truncate',
        ellipsis: '...',
        align: 'right',
        verticalAlign: 'middle',
        margin: 15
      },
      splitLine: {
        show: false
      }
    },
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: 0,
        filterMode: 'none',
        height: 28,
        bottom: 20,
        start: 0,
        end: 100,
        borderColor: '#e0e0e0',
        fillerColor: 'rgba(64, 158, 255, 0.15)',
        handleStyle: {
          color: '#409eff',
          borderColor: '#409eff'
        },
        textStyle: {
          color: '#666'
        },
        dataBackground: {
          lineStyle: {
            color: '#e0e0e0'
          },
          areaStyle: {
            color: '#f5f5f5'
          }
        }
      },
      {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'none'
      },
      {
        type: 'slider',
        yAxisIndex: 0,
        filterMode: 'none',
        width: 20,
        right: 10,
        start: 0,
        end: 100,
        borderColor: '#e0e0e0',
        fillerColor: 'rgba(64, 158, 255, 0.15)',
        handleStyle: {
          color: '#409eff',
          borderColor: '#409eff'
        },
        textStyle: {
          color: '#666'
        }
      },
      {
        type: 'inside',
        yAxisIndex: 0,
        filterMode: 'none'
      }
    ],
    series: [
      {
        type: 'custom',
        renderItem: (params: any, api: any) => {
          const categoryIndex = api.value(0)
          const start = api.coord([api.value(1), categoryIndex])
          const end = api.coord([api.value(2), categoryIndex])
          const height = 20
          const gap = 10

          const rectShape = echarts.graphic.clipRectByRect(
            {
              x: start[0],
              y: start[1] - height / 2 - gap / 2,
              width: Math.max(end[0] - start[0], 2),
              height
            },
            {
              x: params.coordSys.x,
              y: params.coordSys.y,
              width: params.coordSys.width,
              height: params.coordSys.height
            }
          )

          return (
            rectShape && {
              type: 'group',
              children: [
                {
                  type: 'rect',
                  shape: {
                    ...rectShape,
                    r: 4
                  },
                  style: {
                    fill: api.visual('color'),
                    shadowBlur: 4,
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowOffsetX: 1,
                    shadowOffsetY: 2
                  },
                  emphasis: {
                    style: {
                      shadowBlur: 8,
                      shadowColor: 'rgba(0, 0, 0, 0.2)'
                    }
                  }
                }
              ]
            }
          )
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        },
        encode: {
          x: [1, 2],
          y: 0
        },
        data: tasks
      },
      ...(showTodayLine
        ? [
          {
            type: 'line',
            markLine: {
              silent: true,
              symbol: 'none',
              data: [
                {
                  xAxis: now,
                  lineStyle: {
                    color: '#f56c6c',
                    width: 2,
                    type: 'solid'
                  },
                  label: {
                    show: true,
                    formatter: '现在',
                    position: 'start',
                    color: '#f56c6c',
                    fontSize: 12,
                    fontWeight: 'bold'
                  }
                }
              ]
            }
          }
        ]
        : [])
    ]
  }
})

const handleClick = (params: any) => {
  if (params.componentType === 'series') {
    selectedTask.value = params.data.value[4] || null
    showDetail.value = true
  }
}
</script>

<style lang="scss" scoped>
.gantt-chart-box {
  .gantt-container {
    height: 600px;
    position: relative;
  }

  .gantt-wrapper {
    width: 100%;
    height: 100%;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
  }

  .pagination-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0 0;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    margin-top: 16px;

    .pagination-info {
      font-size: 14px;
      color: #606266;

      .highlight {
        color: #409eff;
        font-weight: 600;
        margin: 0 2px;
      }
    }

    :deep(.el-pagination) {
      .el-pagination__sizes {
        margin-right: 8px;
      }

      .btn-prev,
      .btn-next,
      .el-pager li {
        background: transparent;
        min-width: 28px;
        height: 28px;
        line-height: 28px;
        font-weight: 400;

        &:hover {
          color: #409eff;
        }
      }

      .el-pager li.is-active {
        background: #409eff;
        color: #fff;
        border-radius: 4px;
      }
    }
  }
}
</style>
