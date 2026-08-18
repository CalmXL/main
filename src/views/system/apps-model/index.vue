<template>
  <PageContent class="">
    <template #top>
      <el-form ref="queryRef" :model="queryParams" inline @submit.prevent>
        <el-form-item label="应用名称">
          <el-input v-model="queryParams.keyword" placeholder="请输入应用名称" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="primary" plain @click="handleTokenUsage">token详情</el-button>
          <el-button v-hasPermi="['system:apps:add']" type="primary" plain @click="handleAdd">创建应用</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table v-loading="loading" class="base-table" stripe :data="appList" height="100%">
      <el-table-column type="index" width="80" align="center" label="序号" fixed="left" />
      <el-table-column prop="name" label="应用名称" width="180" fixed="left" />
      <el-table-column prop="app_key" label="appKey" width="140" show-overflow-tooltip />
      <el-table-column label="关联模型" align="center" min-width="220">
        <template #default="{ row }">
          <el-tag
            v-for="value in row.models ?? []"
            :key="value.id"
            size="small"
            class="cursor-pointer"
            :type="value.is_enabled && value.is_available ? 'primary' : 'danger'"
            @click="copyModel(value)"
          >
            {{ value.nickname || value.model_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="default_model_id" label="默认模型" align="center" min-width="220">
        <template #default="{ row }">
          <el-tag
            v-if="row.default_model"
            size="small"
            :type="row.default_model.is_enabled && row.default_model.is_available ? 'success' : 'danger'"
            class="cursor-pointer"
            @click="copyModel(row.default_model)"
          >
            {{ row.default_model.nickname || row.default_model.model_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="应用描述" header-align="center" min-width="140" width="180" show-overflow-tooltip />
      <el-table-column prop="enable_request_queue" label="请求队列" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.enable_request_queue ? 'success' : 'info'" size="small">
            {{ row.enable_request_queue ? '开启' : '关闭' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_enabled" label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.is_enabled ? 'success' : 'danger'" size="small">
            {{ row.is_enabled ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="request_count" width="100" label="请求次数" align="center" />
      <el-table-column prop="total_tokens" width="100" label="token使用量" align="center">
        <template #default="{ row }">
          <span>{{ formatTokenCount(row.total_tokens) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cache_hit_tokens" width="100" label="缓存命中" align="center">
        <template #default="{ row }">
          <span>{{ formatTokenCount(row.cache_hit_tokens) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" align="center" width="160">
        <template #default="{ row }">
          <span>{{ dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updated_at" label="更新时间" align="center" width="160">
        <template #default="{ row }">
          <span>{{ dayjs(row.updated_at).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" align="center" fixed="right">
        <template #default="{ row }">
          <el-popover placement="left" :width="'auto'" trigger="hover">
            <template #reference>
              <PopoverBtn />
            </template>
            <div>
              <el-button v-hasPermi="['system:apps:edit']" link type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button v-hasPermi="['system:apps:use']" link type="primary" @click="handleUse(row)">使用</el-button>
              <el-button v-hasPermi="['system:apps:records']" link type="primary" @click="handleRecords(row)">记录</el-button>
              <el-button v-hasPermi="['system:apps:status']" link type="warning" @click="handleStatus(row)">
                {{ row.is_enabled ? '禁用' : '启用' }}
              </el-button>
              <el-button v-if="syncApps.includes(row.app_key)" link type="warning" :loading="row.loading" @click="handleSyncModel(row)">
                同步
              </el-button>
              <el-button v-hasPermi="['system:apps:delete']" link type="danger" @click="handleDelete(row)">删除</el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <template #floor>
      <pagination
        v-model:page="queryParams.page"
        v-model:limit="queryParams.pageSize"
        hide-on-single-page
        :total="total"
        @pagination="getData"
      />
    </template>
    <create-apps-model v-model:open="open" :current-app="currentApp" @success="handleSuccess" />
    <use-dialog v-model:open="openDialog" :current-app="currentApp" />
    <records-dialog v-model:open="openRecordsDialog" :current-app="recordsRow" />
    <token-usage v-model="tokenUsageVisible" />
  </PageContent>
</template>
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { ApplicationItem } from './type'
import CreateAppsModel from './create.vue'
import UseDialog from './useDialog.vue'
import TokenUsage from './components/token-usage/index.vue'
import { applicationManagement } from '@/services'
import Pagination from '@/components/Pagination/index.vue'
import { useDict } from '@/utils/dict'
import RecordsDialog from './recordsDialog.vue'

const { sys_sync_model_app: syncModelStatus } = useDict('sys_sync_model_app')

// 格式化token数量显示
function formatTokenCount(tokens: number) {
  if (!tokens || tokens < 1000) return tokens

  if (tokens < 1000000) {
    return `${(tokens / 1000).toFixed(1)}K`
  }
  if (tokens < 1000000000) {
    return `${(tokens / 1000000).toFixed(1)}M`
  }
  return `${(tokens / 1000000000).toFixed(1)}B`
}
const syncApps = computed(() => syncModelStatus.value.map((item: any) => item.value).filter(Boolean) as string[])

const queryParams = reactive({
  page: 1,
  keyword: '',
  pageSize: 20
})

const loading = ref(false)
const appList = ref<ApplicationItem[]>([])
const total = ref(0)

const open = ref(false)
const currentApp = ref<ApplicationItem | null>(null)

const openDialog = ref(false)

async function getData() {
  loading.value = true
  try {
    const { keyword, page, pageSize } = queryParams
    const params = { keyword, page, page_size: pageSize }
    const [err, data] = await applicationManagement.getApplications(params)
    if (err) {
      ElMessage.error('获取应用列表失败')
      return
    }

    const { list, total: tl } = data ?? {}
    appList.value = (list || []).map((item: any) => ({ ...item, loading: false }))
    total.value = tl || 0
  } catch (error) {
    console.error(error)
    ElMessage.error('获取应用列表失败')
  } finally {
    loading.value = false
  }
}

function handleQuery() {
  queryParams.page = 1
  getData()
}

function resetQuery() {
  queryParams.keyword = ''
  queryParams.page = 1
  getData()
}

function handleAdd() {
  currentApp.value = null
  open.value = true
}

function handleUse(row: ApplicationItem) {
  currentApp.value = row
  openDialog.value = true
}

function copyModel(model: any) {
  // eslint-disable-next-line camelcase
  const { model_name } = model
  navigator.clipboard
    .writeText(model_name)
    .then(() => {
      ElMessage.success('复制成功')
    })
    .catch(() => {
      ElMessage.error('复制失败')
    })
}

async function handleEdit(row: ApplicationItem) {
  try {
    // 获取最新的应用详情
    const [err, appData] = await applicationManagement.getApplicationsById(row.id)
    if (err || !appData) {
      ElMessage.error('获取应用详情失败')
      return
    }
    currentApp.value = appData as any
    open.value = true
  } catch (error) {
    console.error(error)
    ElMessage.error('获取应用详情失败')
  }
}

async function handleStatus(row: ApplicationItem) {
  try {
    const newStatus = !row.is_enabled
    const confirmText = newStatus ? '启用' : '禁用'
    await ElMessageBox.confirm(`确定要${confirmText}该应用吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const [err] = await applicationManagement.patchApplicationsByIdStatus({
      id: row.id,
      is_enabled: newStatus
    })
    if (err) {
      ElMessage.error(err.message || `${confirmText}失败`)
      return
    }
    ElMessage.success(`${confirmText}成功`)
    getData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
      ElMessage.error('操作失败')
    }
  }
}

async function handleSyncModel(row: ApplicationItem & { loading: boolean }) {
  try {
    row.loading = true
    let err
    if (/rag/i.test(row.app_key)) {
      [err] = await applicationManagement.postApplicationsByIdSyncRagModels(row.id)
    } else if (/sonic/i.test(row.app_key)) {
      [err] = await applicationManagement.postApplicationsByIdSyncSonicModels(row.id)
    } else if (/dify/i.test(row.app_key)) {
      [err] = await applicationManagement.postApplicationsByIdSyncDifyModels(row.id)
    }
    if (!err) ElMessage.success('同步成功')
  } catch (error) {
    console.error(error)
  }
  row.loading = false
}

async function handleDelete(row: ApplicationItem) {
  try {
    await ElMessageBox.confirm('确定要删除该应用吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const [err] = await applicationManagement.deleteApplicationsById(row.id)
    if (err) {
      ElMessage.error(err.message || '删除失败')
      return
    }
    ElMessage.success('删除成功')
    handleQuery()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
      ElMessage.error('删除失败')
    }
  }
}

function handleSuccess() {
  open.value = false
  handleQuery()
}

const recordsRow = ref<ApplicationItem | null>(null)
const openRecordsDialog = ref(false)

function handleRecords(row: ApplicationItem) {
  recordsRow.value = row
  openRecordsDialog.value = true
}

const tokenUsageVisible = ref(false)
function handleTokenUsage() {
  tokenUsageVisible.value = true
}

onMounted(() => {
  getData()
})
</script>
