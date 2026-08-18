<template>
  <PageContent class="dashboard">
    <NavBar :active-type="timeType" @update:active-type="setTimeType" />

    <el-row class="trend-box" :gutter="22">
      <el-col :span="12">
        <Card title="浏览量(PV)/访问用户数(UV)" :date="date">
          <el-row class="inner-card" :gutter="20">
            <el-col :span="12">
              <div class="content">
                <DataCard :times="pvUvInfo.topResp.pv" :percent="pvUvInfo.topResp.pvhb" />
                <Chart class="chart" :chart-options="pvOptions" />
              </div>
            </el-col>
            <el-col :span="12">
              <div class="content">
                <DataCard :times="pvUvInfo.topResp.uv" :percent="pvUvInfo.topResp.uvhb" />
                <Chart class="chart" :chart-options="uvOptions" />
              </div>
            </el-col>
          </el-row>
        </Card>
      </el-col>
      <el-col :span="12">
        <Card title="PV趋势、UV趋势" :date="date">
          <Chart class="line-chart" :chart-options="pvUvOptions" />
        </Card>
      </el-col>
    </el-row>

    <el-row class="org-model-box" :gutter="20">
      <el-col class="org-item" :span="12">
        <Card title="部门访问排名 (PV)">
          <Chart class="line-chart" :chart-options="pvOrgOptions" />
        </Card>
      </el-col>
      <el-col class="org-item" :span="12">
        <Card title="部门访问排名 (UV)">
          <Chart class="line-chart" :chart-options="uvOrgOptions" />
        </Card>
      </el-col>
    </el-row>

    <el-row class="org-model-box" :gutter="20">
      <el-col class="org-item" :span="12">
        <Card title="各功能浏览量 (PV)">
          <Chart class="line-chart" :chart-options="pvModuleOptions" />
        </Card>
      </el-col>
      <el-col class="org-item" :span="12">
        <Card title="各功能访问量 (UV)">
          <Chart class="line-chart" :chart-options="uvModuleOptions" />
        </Card>
      </el-col>
    </el-row>

    <!-- <el-row class="chat-app-box">
      <el-col class="chat-item" :span="24">
        <Card title="应用数、对话数" :date="date">
          <Chart class="line-chart" :chartOptions="chatAndAppsOptions"/>
        </Card>
      </el-col>
    </el-row> -->

    <el-row :gutter="20">
      <el-col class="chat-repo-item" :span="12">
        <Card title="对话数 - 分部门" :date="date">
          <Chart class="line-chart" :chart-options="chatOrgOptions" />
        </Card>
      </el-col>

      <!-- <el-col class="chat-repo-item" :span="8">
        <Card title="对话数(万) - 分应用" :date="date">
          <Chart class="line-chart" :chartOptions="chatAppOptions"/>
        </Card>
      </el-col>

      <el-col class="chat-repo-item" :span="8">
        <Card title="知识库文档统计" :date="date">
          <Chart class="line-chart" :chartOptions="repoOptions"/>
        </Card>
      </el-col> -->
    </el-row>
  </PageContent>
</template>

<script lang="ts" setup>
import NavBar from './NavBar.vue'
import Card from './Card.vue'
import DataCard from './DataCard.vue'
import Chart from './Chart.vue'

import { queryPvUv, queryChatPvUv } from '@/api/system/user'
import { useTimeType, usePvUvInfo, useChatPvUvInfo, useChartOptions, useChatChartOptions } from './hook'

const { timeType, setTimeType } = useTimeType()
const { pvUvInfo, setPvUvInfo } = usePvUvInfo()
const { chatPvUvInfo, setChatPvUvInfo } = useChatPvUvInfo()
const { pvOptions, uvOptions, pvUvOptions, pvOrgOptions, uvOrgOptions, pvModuleOptions, uvModuleOptions } = useChartOptions()

const { chatOrgOptions, chatAppOptions, repoOptions } = useChatChartOptions()

watch(timeType, (newValue, oldValue) => {
  getPvUvInfo()
  getChatAppsInfo()
})

const getPvUvInfo = async () => {
  const res = await queryPvUv(timeType.value)
  setPvUvInfo(res.data)
}

const getChatAppsInfo = async () => {
  const res = await queryChatPvUv(timeType.value)
  setChatPvUvInfo(res.data)
}

getPvUvInfo()
getChatAppsInfo()

const date = computed(() => {
  const allTrendData = pvUvInfo.value.allTrend
  return `${allTrendData[0]?.lable} ~ ${allTrendData[allTrendData.length - 1]?.lable}`
})
</script>

<style lang="scss" scoped>
.dashboard {
  :deep(.content-box) {
    overflow-y: auto;
  }
  .title {
    color: #333;
    font-size: 28px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
  }

  .trend-box {
    margin-bottom: 22px;
  }

  .org-model-box {
    margin-bottom: 22px;

    .org-item {
      height: 299px;

      .chart {
        height: 230px;
      }
    }
  }

  .chat-app-box {
    margin-bottom: 22px;

    .chat-item {
      height: 403px;

      .chart {
        height: 353px;
      }
    }
  }

  .chat-repo-item {
    height: 418px;

    .chart {
      height: 360px;
    }
  }

  .content {
    position: relative;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    border-radius: 16px;

    .chart {
      width: 114px;
      height: 55px;
      position: absolute;
      bottom: 20px;
      right: 27px;
    }
  }

  .chart {
    height: 155px;
  }
}
</style>
