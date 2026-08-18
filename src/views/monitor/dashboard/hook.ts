import type { EChartsOption } from 'echarts'
import { graphic } from 'echarts/core'
import { timeTypes } from '@/api/system/user'
import type { IPvUvInfo } from './type'

const PV_COLOR = '#94D793'
const UV_COLOR = '#5B76FF'

const PV_GRADIENT = new graphic.LinearGradient(0, 0, 1, 1, [
  {
    offset: 1,
    color: 'rgba(112, 202, 111, 0.7)'
  },
  {
    offset: 0,
    color: 'rgba(112, 202, 111, 0.20)'
  }
])
const UV_GRADIENT = new graphic.LinearGradient(0, 0, 1, 1, [
  {
    offset: 1,
    color: 'rgba(38, 136, 255, 0.82)'
  },
  {
    offset: 0,
    color: 'rgba(38, 136, 255, 0.20)'
  }
])

const showModuleNum = 7

const timeType = ref<timeTypes>('day')
const pvUvInfo = ref<IPvUvInfo>({
  startTime: '',
  endTime: '',
  topResp: {
    pv: 0,
    uv: 0,
    pvhb: 0,
    uvhb: 0
  },
  allTrend: [],
  org: [],
  module: []
})
const chatPvUvInfo = ref<IPvUvInfo>({
  startTime: '',
  endTime: '',
  topResp: {
    pv: 0,
    uv: 0,
    pvhb: 0,
    uvhb: 0
  },
  allTrend: [],
  org: [],
  module: []
})

export function useTimeType() {
  const setTimeType = (time: timeTypes) => {
    timeType.value = time
  }

  return {
    timeType,
    setTimeType
  }
}

export function usePvUvInfo() {
  const setPvUvInfo = (data: IPvUvInfo) => {
    pvUvInfo.value = data
  }

  return {
    pvUvInfo,
    setPvUvInfo
  }
}

export function useChatPvUvInfo() {
  const setChatPvUvInfo = (data: IPvUvInfo) => {
    chatPvUvInfo.value = data
  }

  return {
    chatPvUvInfo,
    setChatPvUvInfo
  }
}

export function useChartOptions() {
  const pvOptions = computed<EChartsOption>(() => {
    const data = pvUvInfo.value.allTrend.map(item => item.pv)
    const xData = pvUvInfo.value.allTrend.map(item => item.lable)

    return {
      xAxis: {
        show: false,
        type: 'category',
        data: xData
      },
      yAxis: {
        show: false,
        type: 'value'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        top: '0%',
        right: '0%',
        bottom: '0%'
      },
      legend: {
        show: false
      },
      toolbox: {
        show: true
      },
      color: PV_COLOR,
      series: [
        {
          name: 'pv',
          data,
          type: 'bar',
          tooltip: {
            valueFormatter(value) {
              return `${value}次`
            }
          }
        }
      ]
    }
  })

  const uvOptions = computed<EChartsOption>(() => {
    const data = pvUvInfo.value.allTrend.map(item => item.uv)
    const xData = pvUvInfo.value.allTrend.map(item => item.lable)

    return {
      xAxis: {
        show: false,
        type: 'category',
        data: xData
      },
      yAxis: {
        show: false,
        type: 'value'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        top: '0%',
        right: '0%',
        bottom: '0%'
      },
      legend: {
        show: false
      },
      toolbox: {
        show: true
      },
      color: UV_COLOR,
      series: [
        {
          name: 'uv',
          data,
          type: 'bar',
          tooltip: {
            valueFormatter(value) {
              return `${value}次`
            }
          }
        }
      ]
    }
  })

  const pvUvOptions = computed<EChartsOption>(() => {
    const pvData = pvUvInfo.value.allTrend.map(item => item.pv)
    const uvData = pvUvInfo.value.allTrend.map(item => item.uv)
    const xData = pvUvInfo.value.allTrend.map(item => item.lable)

    return {
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: xData,
        axisLine: {
          onZero: false
        }
      },
      yAxis: {
        type: 'value',
        name: '次'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '7%',
        top: '20%',
        right: '0%',
        bottom: '15%'
      },
      legend: {
        show: true,
        data: ['pv', 'uv']
      },
      toolbox: {
        show: true
      },
      series: [
        {
          name: 'pv',
          data: pvData,
          type: 'line',
          smooth: true,
          color: PV_COLOR,
          areaStyle: {
            opacity: 0.8,
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(112, 202, 111, 0.82)'
              },
              {
                offset: 1,
                color: 'rgba(112, 202, 111, 0.00)'
              }
            ])
          },
          tooltip: {
            valueFormatter(value) {
              return `${value}次`
            }
          }
        },
        {
          name: 'uv',
          data: uvData,
          type: 'line',
          smooth: true,
          color: UV_COLOR,
          areaStyle: {
            opacity: 0.8,
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(38, 136, 255, 0.82)'
              },
              {
                offset: 1,
                color: 'rgba(38, 136, 255, 0.00)'
              }
            ])
          },
          tooltip: {
            valueFormatter(value) {
              return `${value}次`
            }
          }
        }
      ]
    }
  })

  const pvOrgOptions = computed<EChartsOption>(() => {
    const sortData = pvUvInfo.value.org.sort((a, b) => a.pv - b.pv)
    const yData = sortData.map(item => item.lable)
    const data = sortData.map(item => item.pv)

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: yData,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      grid: {
        left: '20%',
        top: '0%',
        right: '10%',
        bottom: '15%'
      },
      series: [
        {
          type: 'bar',
          name: 'pv',
          barWidth: 10,
          data,
          label: {
            show: true,
            position: 'right'
          },
          itemStyle: {
            color: PV_GRADIENT,
            borderRadius: [0, 5, 5, 0]
          },
          tooltip: {
            valueFormatter(value) {
              return `${value}次`
            }
          }
        }
      ]
    }
  })

  const uvOrgOptions = computed<EChartsOption>(() => {
    const sortData = [...pvUvInfo.value.org].sort((a, b) => a.uv - b.uv)
    const yData = sortData.map(item => item.lable)
    const data = sortData.map(item => item.uv)

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: yData,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      grid: {
        left: '20%',
        top: '0%',
        right: '10%',
        bottom: '15%'
      },
      series: [
        {
          type: 'bar',
          name: 'pv',
          barWidth: 10,
          data,
          label: {
            show: true,
            position: 'right'
          },
          itemStyle: {
            color: UV_GRADIENT,
            borderRadius: [0, 5, 5, 0]
          },
          tooltip: {
            valueFormatter(value) {
              return `${value}次`
            }
          }
        }
      ]
    }
  })

  const pvModuleOptions = computed<EChartsOption>(() => {
    const sortData = [...pvUvInfo.value.module].sort((a, b) => a.pv - b.pv)
    const yData = sortData.map(item => item.lable)
    const data = sortData.map(item => item.pv)
    const dataZoom = sortData.length < showModuleNum ? 100 : (showModuleNum / sortData.length) * 100

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: yData,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      grid: {
        left: '20%',
        top: '2%',
        right: '20%',
        bottom: '30%'
      },
      dataZoom: [
        {
          show: true,
          start: 0,
          end: 100,
          height: 10,
          bottom: '10%'
        },
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          show: true,
          yAxisIndex: 0,
          filterMode: 'empty',
          width: 15,
          height: '80%',
          showDataShadow: false,
          left: '90%',
          start: 100 - dataZoom,
          end: 100
        }
      ],
      series: [
        {
          type: 'bar',
          name: 'pv',
          barWidth: 10,
          data,
          label: {
            show: true,
            position: 'right'
          },
          itemStyle: {
            color: PV_GRADIENT,
            borderRadius: [0, 5, 5, 0]
          },
          tooltip: {
            valueFormatter(value) {
              return `${value}次`
            }
          }
        }
      ]
    }
  })

  const uvModuleOptions = computed<EChartsOption>(() => {
    const sortData = [...pvUvInfo.value.module].sort((a, b) => a.uv - b.uv)
    const yData = sortData.map(item => item.lable)
    const data = sortData.map(item => item.uv)
    const dataZoom = sortData.length < showModuleNum ? 100 : (showModuleNum / sortData.length) * 100

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: yData,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      grid: {
        left: '20%',
        top: '2%',
        right: '20%',
        bottom: '30%'
      },
      dataZoom: [
        {
          show: true,
          start: 0,
          end: 100,
          height: 10,
          bottom: '10%'
        },
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          show: true,
          yAxisIndex: 0,
          filterMode: 'empty',
          width: 15,
          height: '80%',
          showDataShadow: false,
          left: '90%',
          start: 100 - dataZoom,
          end: 100
        }
      ],
      series: [
        {
          type: 'bar',
          name: 'uv',
          barWidth: 10,
          data,
          label: {
            show: true,
            position: 'right'
          },
          itemStyle: {
            color: UV_GRADIENT,
            borderRadius: [0, 5, 5, 0]
          },
          tooltip: {
            valueFormatter(value) {
              return `${value}次`
            }
          }
        }
      ]
    }
  })

  return {
    pvOptions,
    uvOptions,
    pvUvOptions,
    pvOrgOptions,
    uvOrgOptions,
    pvModuleOptions,
    uvModuleOptions
  }
}

export function useChatChartOptions() {
  const chatAndAppsOptions = computed<EChartsOption>(() => {
    const pvData = chatPvUvInfo.value.allTrend.map(item => item.pv)
    const uvData = pvUvInfo.value.allTrend.map(item => item.uv)
    const xData = pvUvInfo.value.allTrend.map(item => item.lable)

    return {
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: xData,
        axisLine: {
          onZero: false
        }
      },
      yAxis: {
        type: 'value',
        name: '次'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '2%',
        top: '18%',
        right: '5%',
        bottom: '15%'
      },
      legend: {
        show: true,
        data: ['pv', 'uv']
      },
      toolbox: {
        show: true
      },
      color: '#5B76FF',
      series: [
        {
          name: 'pv',
          data: pvData,
          type: 'line',
          smooth: true,
          color: '#70CA6F',
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(112, 202, 111, 0.82)'
              },
              {
                offset: 1,
                color: 'rgba(112, 202, 111, 0.00)'
              }
            ])
          },
          tooltip: {
            valueFormatter(value) {
              return `${value}次`
            }
          }
        },
        {
          name: 'uv',
          data: uvData,
          type: 'line',
          smooth: true,
          color: '#0B75FF',
          areaStyle: {
            opacity: 0.8,
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(38, 136, 255, 0.82)'
              },
              {
                offset: 1,
                color: 'rgba(38, 136, 255, 0.00)'
              }
            ])
          },
          tooltip: {
            valueFormatter(value) {
              return `${value}次`
            }
          }
        }
      ]
    }
  })

  // chatOrgOptions, chatAppOptions, repoOptions
  const chatOrgOptions = computed<EChartsOption>(() => {
    const allPvNums = chatPvUvInfo.value.org.reduce((prev, item) => prev + item.pv, 0)
    const pvData = chatPvUvInfo.value.org.map(item => item.pv) // pv 对话数
    const uvData = chatPvUvInfo.value.org.map(item => ((item.pv / allPvNums) * 100).toFixed(2)) // 占比
    const xData = chatPvUvInfo.value.org.map(item => item.lable) // x 轴

    return {
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: xData,
        axisLine: {
          onZero: false
        },
        axisTick: {
          show: false
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '次',
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          splitLine: { // 让左侧 y 轴控制网格线
            show: true
          }
        },
        {
          type: 'value',
          name: '%',
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            formatter: '{value}%'
          },
          splitLine: {
            show: false
          }
        }
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '8%',
        top: '18%',
        right: '10%',
        bottom: '10%'
      },
      legend: {
        show: true,
        data: ['次数', '占比']
      },
      toolbox: {
        show: true
      },
      series: [
        {
          name: '次数',
          data: pvData,
          type: 'bar',
          barWidth: 20,
          itemStyle: {
            borderRadius: [10, 10, 0, 0]
          },
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(38, 136, 255, 0.82)'
            },
            {
              offset: 1,
              color: 'rgba(38, 136, 255, 0.3)'
            }
          ]),
          tooltip: {
            valueFormatter(value) {
              return `${value}次`
            }
          }
        },
        {
          name: '占比',
          yAxisIndex: 1,
          data: uvData,
          type: 'line',
          smooth: true,
          color: PV_COLOR,
          tooltip: {
            valueFormatter(value) {
              return `${value}%`
            }
          }
        }
      ]
    }
  })

  const chatAppOptions = computed<EChartsOption>(() => {
    const allPvNums = chatPvUvInfo.value.org.reduce((prev, item) => prev + item.pv, 0)
    const pvData = chatPvUvInfo.value.org.map(item => item.pv) // pv 对话数
    const uvData = chatPvUvInfo.value.org.map(item => ((item.pv / allPvNums) * 100).toFixed(2)) // 占比
    const xData = chatPvUvInfo.value.org.map(item => item.lable) // x 轴

    return {
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: xData,
        axisLine: {
          onZero: false
        },
        axisTick: {
          show: false
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '次',
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          }
        },
        {
          type: 'value',
          name: '%',
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            formatter: '{value}%'
          }
        }
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '5%',
        top: '18%',
        right: '10%',
        bottom: '10%'
      },
      legend: {
        show: true,
        data: ['次数', '占比']
      },
      toolbox: {
        show: true
      },
      color: '#5B76FF',
      series: [
        {
          name: '次数',
          data: pvData,
          type: 'bar',
          color: UV_COLOR

        },
        {
          name: '占比',
          yAxisIndex: 1,
          data: uvData,
          type: 'line',
          color: PV_COLOR
        }
      ]
    }
  })

  const repoOptions = computed<EChartsOption>(() => {
    const pvData = chatPvUvInfo.value.allTrend.map(item => item.pv)
    const uvData = pvUvInfo.value.allTrend.map(item => item.uv)
    const xData = pvUvInfo.value.allTrend.map(item => item.lable)

    return {
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: xData,
        axisLine: {
          onZero: false
        }
      },
      yAxis: {
        type: 'value',
        name: '个'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '2%',
        top: '18%',
        right: '5%',
        bottom: '15%'
      },
      legend: {
        show: true,
        data: ['pv']
      },
      toolbox: {
        show: true
      },
      color: '#5B76FF',
      series: [
        {
          name: 'pv',
          data: pvData,
          type: 'bar',
          smooth: true,
          color: '#70CA6F',
          areaStyle: {
            opacity: 0.8,
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(112, 202, 111, 0.82)'
              },
              {
                offset: 1,
                color: 'rgba(112, 202, 111, 0.00)'
              }
            ])
          }
        }
      ]
    }
  })

  return {
    chatAndAppsOptions,
    chatOrgOptions,
    chatAppOptions,
    repoOptions
  }
}
