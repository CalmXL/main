<template>
  <PageContent>
    <template #top>
      <el-form ref="queryRef" :model="queryParams" inline @submit.prevent>
        <el-form-item label="应用ID">
          <el-input v-model="queryParams.app_id" placeholder="请输入应用ID" clearable style="width: 200px" @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="queryParams.user_id" placeholder="请输入用户ID" clearable style="width: 200px" @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="queryParams.priority" placeholder="请选择优先级" clearable style="width: 200px">
            <el-option v-for="i in 6" :key="i - 1" :label="`优先级 ${i - 1}`" :value="i - 1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          <el-button
            :type="autoRefreshEnabled ? 'success' : 'default'"
            :icon="autoRefreshEnabled ? 'VideoPause' : 'VideoPlay'"
            @click="toggleAutoRefresh"
          >
            {{ autoRefreshEnabled ? '停止刷新' : '自动刷新' }}
          </el-button>
          <el-button type="primary" @click="appDialogVisible = true">应用管理</el-button>
        </el-form-item>
      </el-form>
    </template>

    <el-scrollbar class="h-full overflow-hidden">
      <div class="scheduler-page">
        <div v-loading="statsLoading" class="stats-section">
          <div class="stats-grid">
            <StatsCard
              title="总任务数"
              :value="stats?.total_tasks || 0"
              :icon="DocumentCopy"
              variant="primary"
              @click="handleStatsClick('total')"
            />
            <StatsCard
              title="处理中"
              :value="stats?.processing_tasks || 0"
              :icon="Loading"
              variant="warning"
              @click="handleStatsClick('processing')"
            />
            <StatsCard
              title="排队中"
              :value="stats?.queued_tasks || 0"
              :icon="Clock"
              variant="info"
              @click="handleStatsClick('queued')"
            />
            <StatsCard
              title="成功率"
              :value="successRate"
              suffix="%"
              :icon="CircleCheck"
              variant="success"
              @click="handleStatsClick('success')"
            />
          </div>
        </div>

        <el-row class="chart-box" :gutter="20">
          <el-col class="chart-item" :span="12">
            <Card title="任务状态分布">
              <StatusChart :data="stats" />
            </Card>
          </el-col>
          <el-col class="chart-item" :span="12">
            <Card title="应用任务统计">
              <AppChart :data="stats" />
            </Card>
          </el-col>
        </el-row>

        <GanttChart
          :tasks="tasks"
          :loading="loading"
          :total="total"
          :current-page="queryParams.page"
          :page-size="queryParams.page_size"
          @update:current-page="queryParams.page = $event"
          @update:page-size="queryParams.page_size = $event"
          @refresh="refreshAll"
        />

        <el-row class="records-box" :gutter="20">
          <el-col :span="24">
            <Card title="记录数据统计">
              <el-table v-loading="recordsLoading" class="base-table" stripe :data="records" style="width: 100%" max-height="400">
                <el-table-column type="index" width="60" label="序号" align="center" />
                <el-table-column prop="user_id" label="用户ID" width="180" show-overflow-tooltip />
                <el-table-column prop="app_name" label="应用名称" width="180" show-overflow-tooltip />
                <el-table-column prop="token_consumption" label="Token消耗" width="120" align="right">
                  <template #default="{ row }">
                    {{ formatNumber(row.token_consumption) }}
                  </template>
                </el-table-column>
                <el-table-column prop="task_count" label="任务数" width="100" align="right" />
                <el-table-column prop="success_tasks" label="成功任务" width="100" align="right">
                  <template #default="{ row }">
                    <el-tag type="success" size="small">{{ row.success_tasks || 0 }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="failed_tasks" label="失败任务" width="100" align="right">
                  <template #default="{ row }">
                    <el-tag type="danger" size="small">{{ row.failed_tasks || 0 }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="last_updated" label="最后更新" min-width="180" align="center">
                  <template #default="{ row }">
                    {{ formatTime(row.last_updated) }}
                  </template>
                </el-table-column>
              </el-table>
            </Card>
          </el-col>
        </el-row>
      </div>
    </el-scrollbar>

    <AppManageDialog v-model="appDialogVisible" />
  </PageContent>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { DocumentCopy, Loading, Clock, CircleCheck } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import StatsCard from './components/StatsCard.vue'
import StatusChart from './components/StatusChart.vue'
import AppChart from './components/AppChart.vue'
import GanttChart from './components/GanttChart.vue'
import AppManageDialog from './components/AppManageDialog.vue'
import Card from './components/Card.vue'
import { useSchedulerData } from './composables/useSchedulerData'
import { useAutoRefresh } from './composables/useAutoRefresh'

const {
  loading,
  statsLoading,
  recordsLoading,
  stats,
  records,
  tasks,
  queryParams,
  total,
  successRate,
  refreshAll,
  handleQuery,
  resetQuery
} = useSchedulerData()

const { enabled: autoRefreshEnabled, start: startAutoRefresh, stop: stopAutoRefresh } = useAutoRefresh(refreshAll, 30000)

const toggleAutoRefresh = () => {
  autoRefreshEnabled.value = !autoRefreshEnabled.value
}

const formatNumber = (num?: number) => {
  if (!num) return '0'
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toLocaleString()
}

const formatTime = (time?: string) => {
  if (!time) return '-'
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

onMounted(() => {
  refreshAll()
})

const appDialogVisible = ref(false)

const handleStatsClick = (type: string) => {
  console.log('点击卡片:', type)
  // TODO: 根据类型展开显示详细信息
}
</script>

<style lang="scss" scoped>
.scheduler-page {
  overflow-x: hidden;
  .stats-section {
    margin-bottom: 24px;

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;

      @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
  }
}

.chart-box {
  margin-bottom: 22px;

  .chart-item {
    height: 380px;
  }
}

.records-box {
  margin-top: 22px;
}
</style>
