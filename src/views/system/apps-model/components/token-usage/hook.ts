import type { EChartsOption } from 'echarts'
import { graphic } from 'echarts/core'
import dayjs from 'dayjs'
import type { TokenUsageStatistics } from '@/services/types'
import { tokenUsageStatistics } from '@/services/tokenUsageStatistics'

const COLORS = {
  primary: '#0B75FF',
  success: '#67C23A',
  warning: '#E6A23C',
  danger: '#F56C6C',
  info: '#909399',
  gradient1: new graphic.LinearGradient(0, 0, 1, 0, [
    { offset: 0, color: 'rgba(11, 117, 255, 0.10)' },
    { offset: 1, color: 'rgba(11, 117, 255, 0.82)' }
  ]),
  gradient2: new graphic.LinearGradient(0, 0, 1, 0, [
    { offset: 0, color: 'rgba(103, 194, 58, 0.10)' },
    { offset: 1, color: 'rgba(103, 194, 58, 0.82)' }
  ]),
  gradient3: new graphic.LinearGradient(0, 0, 1, 0, [
    { offset: 0, color: 'rgba(230, 162, 60, 0.10)' },
    { offset: 1, color: 'rgba(230, 162, 60, 0.82)' }
  ])
}

type TimeGranularity = 'day' | 'week' | 'month'

const timeGranularity = ref<TimeGranularity>('day')

const overviewData = ref<TokenUsageStatistics.GetOverviewRes['data']>()
const byUserData = ref<TokenUsageStatistics.GetByUserRes['data']>()
const byModelData = ref<TokenUsageStatistics.GetByModelRes['data']>()
const byAppData = ref<TokenUsageStatistics.GetByAppRes['data']>()
const byTimeData = ref<TokenUsageStatistics.GetByTimeRes['data']>()

const drillDownAppId = ref<number | null>(null)
const drillDownAppName = ref<string>('')
const drillDownUserData = ref<TokenUsageStatistics.GetByUserRes['data']>()

export function useTimeGranularity() {
  const setTimeGranularity = (time: TimeGranularity) => {
    timeGranularity.value = time
  }

  return {
    timeGranularity,
    setTimeGranularity
  }
}

export function useTimeRange() {
  const formatDate = (date: Date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss')

  const startOfDay = (date: Date) => {
    const result = new Date(date)
    result.setHours(0, 0, 0, 0)
    return result
  }

  const endOfDay = (date: Date) => {
    const result = new Date(date)
    result.setHours(23, 59, 59, 999)
    return result
  }

  const startOfWeek = (date: Date) => {
    const result = new Date(date)
    const day = result.getDay()
    const diff = result.getDate() - day + (day === 0 ? -6 : 1)
    result.setDate(diff)
    result.setHours(0, 0, 0, 0)
    return result
  }

  const endOfWeek = (date: Date) => {
    const result = startOfWeek(date)
    result.setDate(result.getDate() + 6)
    result.setHours(23, 59, 59, 999)
    return result
  }

  const startOfMonth = (date: Date) => {
    const result = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0)
    return result
  }

  const endOfMonth = (date: Date) => {
    const result = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
    return result
  }

  const subDays = (date: Date, days: number) => {
    const result = new Date(date)
    result.setDate(result.getDate() - days)
    return result
  }

  const subWeeks = (date: Date, weeks: number) => {
    const result = new Date(date)
    result.setDate(result.getDate() - weeks * 7)
    return result
  }

  const subMonths = (date: Date, months: number) => {
    const result = new Date(date)
    result.setMonth(result.getMonth() - months)
    return result
  }

  const getTimeRange = (granularity: TimeGranularity) => {
    const now = new Date()
    let startTime: Date
    let endTime: Date

    switch (granularity) {
      case 'day':
        startTime = startOfDay(subDays(now, 7))
        endTime = endOfDay(now)
        break
      case 'week':
        startTime = startOfWeek(subWeeks(now, 4))
        endTime = endOfWeek(now)
        break
      case 'month':
        startTime = startOfMonth(subMonths(now, 6))
        endTime = endOfMonth(now)
        break
      default:
        startTime = startOfDay(subDays(now, 7))
        endTime = endOfDay(now)
    }

    return {
      start_time: formatDate(startTime),
      end_time: formatDate(endTime)
    }
  }

  return {
    getTimeRange
  }
}

export function useOverviewData() {
  const { getTimeRange } = useTimeRange()

  const fetchOverview = async () => {
    const { start_time, end_time } = getTimeRange(timeGranularity.value)
    const [, data] = await tokenUsageStatistics.getOverview({
      start_time,
      end_time
    })
    overviewData.value = data
  }

  return {
    overviewData,
    fetchOverview
  }
}

export function useByUserData() {
  const { getTimeRange } = useTimeRange()

  const fetchByUser = async () => {
    const { start_time, end_time } = getTimeRange(timeGranularity.value)
    const [, data] = await tokenUsageStatistics.getByUser({
      start_time,
      end_time,
      page: 1,
      page_size: 10
    })
    byUserData.value = data
  }

  const fetchByUserWithApp = async (appId: number) => {
    const { start_time, end_time } = getTimeRange(timeGranularity.value)
    const [, data] = await tokenUsageStatistics.getByUser({
      start_time,
      end_time,
      app_id: appId,
      page: 1,
      page_size: 20
    })
    drillDownUserData.value = data
  }

  return {
    byUserData,
    fetchByUser,
    fetchByUserWithApp
  }
}

export function useByModelData() {
  const { getTimeRange } = useTimeRange()

  const fetchByModel = async () => {
    const { start_time, end_time } = getTimeRange(timeGranularity.value)
    const [, data] = await tokenUsageStatistics.getByModel({
      start_time,
      end_time,
      page: 1,
      page_size: 10
    })
    byModelData.value = data
  }

  return {
    byModelData,
    fetchByModel
  }
}

export function useByAppData() {
  const { getTimeRange } = useTimeRange()

  const fetchByApp = async () => {
    const { start_time, end_time } = getTimeRange(timeGranularity.value)
    const [, data] = await tokenUsageStatistics.getByApp({
      start_time,
      end_time,
      page: 1,
      page_size: 10
    })
    byAppData.value = data
  }

  return {
    byAppData,
    fetchByApp
  }
}

export function useByTimeData() {
  const { getTimeRange } = useTimeRange()

  const fetchByTime = async () => {
    const { start_time, end_time } = getTimeRange(timeGranularity.value)
    const [, data] = await tokenUsageStatistics.getByTime({
      start_time,
      end_time,
      granularity: timeGranularity.value
    })
    byTimeData.value = data
  }

  return {
    byTimeData,
    fetchByTime
  }
}

export function useDrillDown() {
  const { fetchByUserWithApp } = useByUserData()

  const enterDrillDown = async (appId: number, appName: string) => {
    drillDownAppId.value = appId
    drillDownAppName.value = appName
    await fetchByUserWithApp(appId)
  }

  const exitDrillDown = () => {
    drillDownAppId.value = null
    drillDownAppName.value = ''
    drillDownUserData.value = undefined
  }

  const isDrillDown = computed(() => drillDownAppId.value !== null)

  return {
    drillDownAppId,
    drillDownAppName,
    drillDownUserData,
    enterDrillDown,
    exitDrillDown,
    isDrillDown
  }
}

export function useChartOptions() {
  const byUserOptions = computed<EChartsOption>(() => {
    if (!byUserData.value?.list) return {}
    const sortData = [...byUserData.value.list].sort((a, b) => (a.total_tokens || 0) - (b.total_tokens || 0))
    const yData = sortData.map(item => item.username || item.user_id || 'Unknown')
    const data = sortData.map(item => item.total_tokens || 0)

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const item = params[0]
          const originalData = sortData[item.dataIndex]
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 8px;">${item.name}</div>
              <div>总 Token: ${originalData.total_tokens?.toLocaleString() || 0}</div>
              <div>提示词 Token: ${originalData.prompt_tokens?.toLocaleString() || 0}</div>
              <div>补全 Token: ${originalData.completion_tokens?.toLocaleString() || 0}</div>
              <div>请求数: ${originalData.total_requests?.toLocaleString() || 0}</div>
            </div>
          `
        }
      },
      xAxis: { type: 'value', name: 'Token 数' },
      yAxis: {
        type: 'category',
        data: yData,
        axisLine: { show: false },
        axisTick: { show: false }
      },
      grid: {
        left: '15%',
        top: '5%',
        right: '15%',
        bottom: '15%'
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          yAxisIndex: 0,
          filterMode: 'filter',
          width: 10,
          height: '70%',
          right: 5,
          start: 0,
          end: 100,
          borderColor: 'transparent',
          backgroundColor: 'rgba(0,0,0,0.1)',
          fillerColor: 'rgba(11, 117, 255, 0.3)',
          handleStyle: {
            color: '#0B75FF'
          },
          textStyle: {
            show: false
          }
        },
        {
          type: 'inside',
          yAxisIndex: 0,
          filterMode: 'filter',
          start: 0,
          end: 100,
          zoomOnMouseWheel: false,
          moveOnMouseMove: true,
          moveOnMouseWheel: true
        }
      ],
      series: [
        {
          type: 'bar',
          name: '总 Token',
          barWidth: 12,
          data,
          label: {
            show: true,
            position: 'right',
            formatter: (params: any) => params.value?.toLocaleString()
          },
          itemStyle: {
            color: COLORS.gradient1,
            borderRadius: [0, 6, 6, 0]
          }
        }
      ]
    }
  })

  const byModelOptions = computed<EChartsOption>(() => {
    if (!byModelData.value?.list) return {}
    const sortData = [...byModelData.value.list].sort((a, b) => (a.total_tokens || 0) - (b.total_tokens || 0))
    const yData = sortData.map(item => item.model_name || 'Unknown')
    const data = sortData.map(item => item.total_tokens || 0)

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const item = params[0]
          const originalData = sortData[item.dataIndex]
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 8px;">${item.name}</div>
              <div>总 Token: ${originalData.total_tokens?.toLocaleString() || 0}</div>
              <div>提示词 Token: ${originalData.prompt_tokens?.toLocaleString() || 0}</div>
              <div>补全 Token: ${originalData.completion_tokens?.toLocaleString() || 0}</div>
              <div>缓存 Token: ${originalData.cached_tokens?.toLocaleString() || 0}</div>
              <div>请求数: ${originalData.total_requests?.toLocaleString() || 0}</div>
            </div>
          `
        }
      },
      xAxis: { type: 'value', name: 'Token 数' },
      yAxis: {
        type: 'category',
        data: yData,
        axisLine: { show: false },
        axisTick: { show: false }
      },
      grid: {
        left: '15%',
        top: '5%',
        right: '15%',
        bottom: '15%'
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          yAxisIndex: 0,
          filterMode: 'filter',
          width: 10,
          height: '70%',
          right: 5,
          start: 0,
          end: 100,
          borderColor: 'transparent',
          backgroundColor: 'rgba(0,0,0,0.1)',
          fillerColor: 'rgba(103, 194, 58, 0.3)',
          handleStyle: {
            color: '#67C23A'
          },
          textStyle: {
            show: false
          }
        },
        {
          type: 'inside',
          yAxisIndex: 0,
          filterMode: 'filter',
          start: 0,
          end: 100,
          zoomOnMouseWheel: false,
          moveOnMouseMove: true,
          moveOnMouseWheel: true
        }
      ],
      series: [
        {
          type: 'bar',
          name: '总 Token',
          barWidth: 12,
          data,
          label: {
            show: true,
            position: 'right',
            formatter: (params: any) => params.value?.toLocaleString()
          },
          itemStyle: {
            color: COLORS.gradient2,
            borderRadius: [0, 6, 6, 0]
          }
        }
      ]
    }
  })

  const byAppOptions = computed<EChartsOption>(() => {
    if (!byAppData.value?.list) return {}
    const sortData = [...byAppData.value.list].sort((a, b) => (a.total_tokens || 0) - (b.total_tokens || 0))
    const yData = sortData.map(item => item.app_name || `App ${item.app_id}` || 'Unknown')
    const data = sortData.map(item => ({
      value: item.total_tokens || 0,
      app_id: item.app_id,
      app_name: item.app_name || `App ${item.app_id}`
    }))

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const item = params[0]
          const originalData = sortData[item.dataIndex]
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 8px;">${item.name}</div>
              <div style="margin-top: 8px;">总 Token: ${originalData.total_tokens?.toLocaleString() || 0}</div>
              <div>提示词 Token: ${originalData.prompt_tokens?.toLocaleString() || 0}</div>
              <div>补全 Token: ${originalData.completion_tokens?.toLocaleString() || 0}</div>
              <div>缓存 Token: ${originalData.cached_tokens?.toLocaleString() || 0}</div>
              <div>思考 Token: ${originalData.thinking_tokens?.toLocaleString() || 0}</div>
              <div>请求数: ${originalData.total_requests?.toLocaleString() || 0}</div>
            </div>
          `
        }
      },
      xAxis: { type: 'value', name: 'Token 数' },
      yAxis: {
        type: 'category',
        data: yData,
        axisLine: { show: false },
        axisTick: { show: false }
      },
      grid: {
        left: '15%',
        top: '5%',
        right: '15%',
        bottom: '15%'
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          yAxisIndex: 0,
          filterMode: 'filter',
          width: 10,
          height: '70%',
          right: 5,
          start: 0,
          end: 100,
          borderColor: 'transparent',
          backgroundColor: 'rgba(0,0,0,0.1)',
          fillerColor: 'rgba(230, 162, 60, 0.3)',
          handleStyle: {
            color: '#E6A23C'
          },
          textStyle: {
            show: false
          }
        },
        {
          type: 'inside',
          yAxisIndex: 0,
          filterMode: 'filter',
          start: 0,
          end: 100,
          zoomOnMouseWheel: false,
          moveOnMouseMove: true,
          moveOnMouseWheel: true
        }
      ],
      series: [
        {
          type: 'bar',
          name: '总 Token',
          barWidth: 12,
          data,
          label: {
            show: true,
            position: 'right',
            formatter: (params: any) => params.value?.toLocaleString()
          },
          itemStyle: {
            color: COLORS.gradient3,
            borderRadius: [0, 6, 6, 0]
          }
        }
      ]
    }
  })

  const drillDownOptions = computed<EChartsOption>(() => {
    if (!drillDownUserData.value?.list) return {}
    const sortData = [...drillDownUserData.value.list].sort((a, b) => (a.total_tokens || 0) - (b.total_tokens || 0))
    const yData = sortData.map(item => item.username || item.user_id || 'Unknown')
    const data = sortData.map(item => item.total_tokens || 0)

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const item = params[0]
          const originalData = sortData[item.dataIndex]
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 8px;">${item.name}</div>
              <div>总 Token: ${originalData.total_tokens?.toLocaleString() || 0}</div>
              <div>提示词 Token: ${originalData.prompt_tokens?.toLocaleString() || 0}</div>
              <div>补全 Token: ${originalData.completion_tokens?.toLocaleString() || 0}</div>
              <div>请求数: ${originalData.total_requests?.toLocaleString() || 0}</div>
            </div>
          `
        }
      },
      xAxis: { type: 'value', name: 'Token 数' },
      yAxis: {
        type: 'category',
        data: yData,
        axisLine: { show: false },
        axisTick: { show: false }
      },
      grid: {
        left: '15%',
        top: '5%',
        right: '15%',
        bottom: '15%'
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          yAxisIndex: 0,
          filterMode: 'filter',
          width: 10,
          height: '70%',
          right: 5,
          start: 0,
          end: 100,
          borderColor: 'transparent',
          backgroundColor: 'rgba(0,0,0,0.1)',
          fillerColor: 'rgba(11, 117, 255, 0.3)',
          handleStyle: {
            color: '#0B75FF'
          },
          textStyle: {
            show: false
          }
        },
        {
          type: 'inside',
          yAxisIndex: 0,
          filterMode: 'filter',
          start: 0,
          end: 100,
          zoomOnMouseWheel: false,
          moveOnMouseMove: true,
          moveOnMouseWheel: true
        }
      ],
      series: [
        {
          type: 'bar',
          name: '总 Token',
          barWidth: 12,
          data,
          label: {
            show: true,
            position: 'right',
            formatter: (params: any) => params.value?.toLocaleString()
          },
          itemStyle: {
            color: COLORS.gradient1,
            borderRadius: [0, 6, 6, 0]
          }
        }
      ]
    }
  })

  const byTimeOptions = computed<EChartsOption>(() => {
    if (!byTimeData.value?.list) return {}
    const timeList = byTimeData.value.list
    const xData = timeList.map(item => item.time || '')
    const totalTokens = timeList.map(item => item.total_tokens || 0)
    const promptTokens = timeList.map(item => item.prompt_tokens || 0)
    const completionTokens = timeList.map(item => item.completion_tokens || 0)

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      legend: {
        data: ['总 Token', '提示词 Token', '补全 Token'],
        top: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xData
      },
      yAxis: {
        type: 'value',
        name: 'Token 数'
      },
      series: [
        {
          name: '总 Token',
          type: 'line',
          smooth: true,
          data: totalTokens,
          areaStyle: {
            opacity: 0.3,
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(11, 117, 255, 0.5)' },
              { offset: 1, color: 'rgba(11, 117, 255, 0.05)' }
            ])
          },
          lineStyle: { color: COLORS.primary, width: 2 },
          itemStyle: { color: COLORS.primary }
        },
        {
          name: '提示词 Token',
          type: 'line',
          smooth: true,
          data: promptTokens,
          areaStyle: {
            opacity: 0.3,
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(103, 194, 58, 0.5)' },
              { offset: 1, color: 'rgba(103, 194, 58, 0.05)' }
            ])
          },
          lineStyle: { color: COLORS.success, width: 2 },
          itemStyle: { color: COLORS.success }
        },
        {
          name: '补全 Token',
          type: 'line',
          smooth: true,
          data: completionTokens,
          areaStyle: {
            opacity: 0.3,
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(230, 162, 60, 0.5)' },
              { offset: 1, color: 'rgba(230, 162, 60, 0.05)' }
            ])
          },
          lineStyle: { color: COLORS.warning, width: 2 },
          itemStyle: { color: COLORS.warning }
        }
      ]
    }
  })

  return {
    byUserOptions,
    byModelOptions,
    byAppOptions,
    byTimeOptions,
    drillDownOptions
  }
}
