<template>
  <div class="app-chart">
    <v-chart v-if="hasData" class="chart" :option="chartOption" autoresize />
    <el-empty v-else description="暂无应用数据" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { StatsData } from '../types'

echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

interface Props {
  data?: StatsData
}

const props = defineProps<Props>()

const hasData = computed(() => props.data?.app_stats && Object.keys(props.data.app_stats).length > 0)

const chartOption = computed(() => {
  if (!hasData.value) return {}

  const appStats = props.data!.app_stats as Record<string, number>
  const sortedData = Object.entries(appStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  const xData = sortedData.map(([name]) => name)
  const yData = sortedData.map(([, count]) => count)

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xData,
      axisLabel: {
        rotate: 30,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      name: '任务数'
    },
    series: [
      {
        type: 'bar',
        data: yData,
        barWidth: 20,
        itemStyle: {
          borderRadius: [20, 20, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        },
        emphasis: {
          itemStyle: {
            borderRadius: [20, 20, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2378f7' },
              { offset: 0.7, color: '#2378f7' },
              { offset: 1, color: '#83bff6' }
            ])
          }
        }
      }
    ]
  }
})
</script>

<style lang="scss" scoped>
.app-chart {
  .chart {
    height: 300px;
  }
}
</style>
