<template>
  <div class="status-chart">
    <v-chart v-if="hasData" class="chart" :option="chartOption" autoresize />
    <el-empty v-else description="暂无状态数据" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { StatsData } from '../types'
import { TASK_STATUS_MAP } from '../types'

echarts.use([PieChart, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer])

interface Props {
  data?: StatsData
}

const props = defineProps<Props>()

const hasData = computed(() => props.data?.status_stats && Object.keys(props.data.status_stats).length > 0)

const chartOption = computed(() => {
  if (!hasData.value) return {}

  const statusStats = props.data!.status_stats as Record<string, number>

  // 按照 TASK_STATUS_MAP 的顺序构建数据，确保颜色匹配
  const data: Array<{ name: string; value: number; itemStyle?: { color: string } }> = []
  const colors: string[] = []

  Object.keys(TASK_STATUS_MAP).forEach(statusKey => {
    const status = Number(statusKey) as keyof typeof TASK_STATUS_MAP
    const count = statusStats[statusKey] || statusStats[String(status)]

    if (count !== undefined && count > 0) {
      const statusInfo = TASK_STATUS_MAP[status]
      data.push({
        name: statusInfo.label,
        value: count
      })
      colors.push(statusInfo.color)
    }
  })

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data,
        color: colors
      }
    ]
  }
})
</script>

<style lang="scss" scoped>
.status-chart {
  .chart {
    height: 300px;
  }
}
</style>
