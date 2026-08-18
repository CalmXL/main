<template>
  <v-chart class="chart" :option="chartOptions" autoresize />
</template>

<script setup>
import { defineProps, computed } from 'vue'
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
</script>
