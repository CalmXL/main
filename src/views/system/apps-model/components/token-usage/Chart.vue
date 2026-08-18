<template>
  <v-chart class="h-full w-full" :option="chartOptions" autoresize @click="handleClick" />
</template>

<script setup>
import VChart from 'vue-echarts'

import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomSliderComponent,
  DataZoomInsideComponent,
  ToolboxComponent
} from 'echarts/components'
import { BarChart, LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomSliderComponent,
  DataZoomInsideComponent,
  ToolboxComponent,
  BarChart,
  LineChart,
  CanvasRenderer
])

const props = defineProps({
  chartOptions: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['chart-click'])

const handleClick = (params) => {
  if (params.componentType === 'series') {
    emit('chart-click', params)
  }
}
</script>
