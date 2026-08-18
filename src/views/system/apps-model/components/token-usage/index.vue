<template>
  <Dialog title="token详情" footer-class="hidden" v-model="visible" width="80%" append-to-body destroy-on-close :before-close="dialogBeforeClose">
    <PageContent class="token-usage">
      <div class="flex items-center justify-between mb-10px">
        <NavBar :active-type="timeGranularity" @update:active-type="setTimeGranularity" />
        <el-button :icon="Refresh" circle :loading="refreshing" @click="handleRefresh" />
      </div>

      <el-row class="mb-22px" :gutter="22">
        <el-col :span="24">
          <Card title="概览">
            <div class="grid grid-cols-4 gap-20px p-10px">
              <div class="flex flex-col items-center p-16px bg-white rounded-12px">
                <div class="text-12px text-gray-500 mb-8px">总 Token 数</div>
                <div class="text-28px font-bold text-[#0B75FF]">
                  {{ formatNumber(overviewData?.total_tokens) }}
                </div>
              </div>
              <div class="flex flex-col items-center p-16px bg-white rounded-12px">
                <div class="text-12px text-gray-500 mb-8px">提示词 Token</div>
                <div class="text-28px font-bold text-[#67C23A]">
                  {{ formatNumber(overviewData?.total_prompt_tokens) }}
                </div>
              </div>
              <div class="flex flex-col items-center p-16px bg-white rounded-12px">
                <div class="text-12px text-gray-500 mb-8px">补全 Token</div>
                <div class="text-28px font-bold text-[#E6A23C]">
                  {{ formatNumber(overviewData?.total_completion_tokens) }}
                </div>
              </div>
              <div class="flex flex-col items-center p-16px bg-white rounded-12px">
                <div class="text-12px text-gray-500 mb-8px">缓存 Token</div>
                <div class="text-28px font-bold text-[#909399]">
                  {{ formatNumber(overviewData?.total_cached_tokens) }}
                </div>
              </div>
              <div class="flex flex-col items-center p-16px bg-white rounded-12px">
                <div class="text-12px text-gray-500 mb-8px">思考 Token</div>
                <div class="text-28px font-bold text-[#F56C6C]">
                  {{ formatNumber(overviewData?.total_thinking_tokens) }}
                </div>
              </div>
              <div class="flex flex-col items-center p-16px bg-white rounded-12px">
                <div class="text-12px text-gray-500 mb-8px">总请求数</div>
                <div class="text-28px font-bold text-[#0B75FF]">
                  {{ formatNumber(overviewData?.total_requests) }}
                </div>
              </div>
              <div class="flex flex-col items-center p-16px bg-white rounded-12px">
                <div class="text-12px text-gray-500 mb-8px">成功请求</div>
                <div class="text-28px font-bold text-[#67C23A]">
                  {{ formatNumber(overviewData?.success_requests) }}
                </div>
              </div>
              <div class="flex flex-col items-center p-16px bg-white rounded-12px">
                <div class="text-12px text-gray-500 mb-8px">失败请求</div>
                <div class="text-28px font-bold text-[#F56C6C]">
                  {{ formatNumber(overviewData?.failed_requests) }}
                </div>
              </div>
            </div>
          </Card>
        </el-col>
      </el-row>

      <el-row :gutter="22" class="mb-5.5">
        <el-col :span="12" class="h-96">
          <Card v-if="!isDrillDown" title="应用（可下钻）" :date="dateRange">
            <Chart class="h-75!" :chart-options="byAppOptions" @chart-click="handleAppChartClick" />
          </Card>
          <Card v-else :title="`${drillDownAppName} - 用户使用情况`" :date="dateRange">
            <template #extra>
              <el-button type="primary" link @click="exitDrillDown">
                <el-icon><ArrowLeft /></el-icon>
                返回
              </el-button>
            </template>
            <Chart class="h-75!" :chart-options="drillDownOptions" />
          </Card>
        </el-col>
        <el-col :span="12" class="h-96">
          <Card title="时间" :date="dateRange">
            <Chart class="h-75!" :chart-options="byTimeOptions" />
          </Card>
        </el-col>
      </el-row>

      <el-row class="mb-22px" :gutter="22">
        <el-col :span="12" class="h-96">
          <Card title="用户" :date="dateRange">
            <Chart class="h-75!" :chart-options="byUserOptions" />
          </Card>
        </el-col>
        <el-col :span="12" class="h-96">
          <Card title="模型" :date="dateRange">
            <Chart class="h-75!" :chart-options="byModelOptions" />
          </Card>
        </el-col>
      </el-row>
    </PageContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { ArrowLeft, Refresh } from '@element-plus/icons-vue'
import NavBar from './NavBar.vue'
import Card from './Card.vue'
import Chart from './Chart.vue'
import {
  useTimeGranularity,
  useOverviewData,
  useByUserData,
  useByModelData,
  useByAppData,
  useByTimeData,
  useChartOptions,
  useTimeRange,
  useDrillDown
} from './hook'

const { timeGranularity, setTimeGranularity } = useTimeGranularity()
const { overviewData, fetchOverview } = useOverviewData()
const { fetchByUser } = useByUserData()
const { fetchByModel } = useByModelData()
const { fetchByApp } = useByAppData()
const { fetchByTime } = useByTimeData()
const { byUserOptions, byModelOptions, byAppOptions, byTimeOptions, drillDownOptions } = useChartOptions()
const { getTimeRange } = useTimeRange()
const { drillDownAppName, enterDrillDown, exitDrillDown, isDrillDown } = useDrillDown()

const refreshing = ref(false)

const handleRefresh = async () => {
  refreshing.value = true
  await fetchData()
  refreshing.value = false
}

const fetchData = async () => {
  await Promise.all([fetchOverview(), fetchByUser(), fetchByModel(), fetchByApp(), fetchByTime()])
}

const formatNumber = (num?: number) => {
  if (num === undefined || num === null) return '0'
  if (num < 1000) return String(num)
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`
  if (num < 1000000000) return `${(num / 1000000).toFixed(1)}M`
  return `${(num / 1000000000).toFixed(1)}B`
}

const handleAppChartClick = (params: any) => {
  if (params.data?.app_id) {
    enterDrillDown(params.data.app_id, params.data.app_name)
  }
}

watch(timeGranularity, () => {
  if (isDrillDown.value) {
    exitDrillDown()
  }
  fetchData()
})

const dateRange = computed(() => {
  const { start_time, end_time } = getTimeRange(timeGranularity.value)
  const formatDate = (dateStr: string) => {
    return dateStr.split('T')[0]
  }
  return `${formatDate(start_time)} ~ ${formatDate(end_time)}`
})

const visible = defineModel<boolean>()
const dialogBeforeClose = () => {
  visible.value = false
}

onMounted(() => {
  fetchData()
})
</script>
