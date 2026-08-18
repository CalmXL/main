<template>
  <PageContent class="">
    <template #top>
      <el-form ref="queryRef" :model="queryParams" inline>
        <el-form-item label="模型名称" prop="modelName">
          <el-input v-model="queryParams.keyword" placeholder="请输入模型名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.is_enabled" placeholder="模型状态" clearable style="width: 200px">
            <el-option v-for="dict in sysModelStatus" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
          <el-button @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['system:models:add']" type="primary" plain @click="handleAdd">新增</el-button>
          <el-button type="primary" plain @click="handleBatchCheck">批量检查</el-button>
          <el-button v-hasPermi="['system:models:upload']" type="primary" plain @click="handleUpload">批量上传</el-button>
          <el-button v-hasPermi="['system:models:export']" type="primary" plain @click="handleExport">导出数据</el-button>
          <!-- <el-button type="primary" plain @click="handleKeyManage">keys管理</el-button> -->
          <el-button type="primary" plain @click="handlePlatformManage">平台管理</el-button>
          <el-button type="primary" plain @click="openModelQueue = true">模型队列测试</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table v-loading="loading" class="base-table" stripe :data="modelList" height="100%">
      <el-table-column type="selection" width="55" align="center" fixed="left" />
      <el-table-column type="index" width="50" label="序号" align="center" fixed="left" />
      <el-table-column prop="model_name" label="模型名称" min-width="200" show-overflow-tooltip fixed="left" />
      <el-table-column prop="nickname" label="模型昵称" min-width="140" align="center" show-overflow-tooltip />
      <el-table-column prop="supports_deep_thinking" label="推理模型" width="120" align="center">
        <template #default="{ row }">
          <el-tag :type="row.supports_deep_thinking ? 'success' : 'info'" size="small">
            {{ row.supports_deep_thinking ? '支持' : '不支持' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="vendor" label="厂商" width="180" align="center" />
      <el-table-column prop="model_type" label="模型类型" width="100" align="center">
        <template #default="{ row }">
          <DictTag :value="row.model_type" :options="sysModelType" size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="context_size" label="上下文大小" width="120" align="center">
        <template #default="{ row }">
          <span>{{ row.context_size ? formatContextSize(row.context_size) : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="concurrency" label="并发数量" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.concurrency != null && row.concurrency !== 0 ? 'warning' : 'success'" size="small">
            {{ row.concurrency != null ? (row.concurrency === 0 ? '不限' : row.concurrency) : '-' }}
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
      <el-table-column prop="is_available" label="可用性" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.is_available ? 'success' : 'warning'" size="small">
            {{ row.is_available ? '可用' : '不可用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" align="center" width="140">
        <template #default="{ row }">
          <span>{{ dayjs(row.created_at).format('YY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updated_at" label="检测时间" align="center" width="140">
        <template #default="{ row }">
          <span>{{ dayjs(row.updated_at).format('YY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" align="center" fixed="right">
        <template #default="{ row }">
          <el-popover placement="left" :width="'auto'" trigger="hover">
            <template #reference>
              <PopoverBtn />
            </template>
            <div>
              <el-button v-hasPermi="['system:models:edit']" link type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button v-hasPermi="['system:models:status']" link type="primary" @click="handleStatus(row)">
                {{ row.is_enabled ? '禁用' : '启用' }}
              </el-button>
              <el-button link type="primary" :loading="row.checkLoading" @click="handleCheck(row)">检查</el-button>
              <el-button link type="primary" @click="handleQueue(row)">队列</el-button>
              <el-button v-hasPermi="['system:models:delete']" link type="danger" @click="handleDelete(row)">删除</el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <template #floor>
      <pagination
        v-model:page="queryParams.page"
        v-model:limit="queryParams.page_size"
        hide-on-single-page
        :total="total"
        @pagination="getData"
      />
    </template>

    <CreateModel v-model:open="open" :current-model="currentModel" @success="handleAddSuccess" />
    <UploadModel v-model:open="openUpload" @success="handleUploadSuccess" />
    <!-- <ApiKeyDialog v-model:open="openKeyManage" @success="getData" /> -->
    <PlatformManageDialog v-model:open="openPlatformManage" @success="getData" />
    <QueueDialog v-model:open="openQueue" :model-id="currentQueueModel?.id" :model-name="currentQueueModel?.model_name" />
    <Dialog v-model="openModelQueue" title="模型队列测试工具" width="96%" top="3vh" destroy-on-close>
      <ModelQueue />
    </Dialog>
  </PageContent>
</template>
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { saveAs } from 'file-saver'
import { useDict } from '@/utils/dict'
import CreateModel from './create.vue'
import UploadModel from './upload.vue'
import PlatformManageDialog from './PlatformManageDialog.vue'
import QueueDialog from './QueueDialog.vue'
import ModelQueue from '@/views/test/modelQueue.vue'
import { modelManagement } from '@/services'
import Pagination from '@/components/Pagination/index.vue'

const { sys_model_satus: sysModelStatus, sys_model_type: sysModelType } = useDict('sys_model_satus', 'sys_model_type')

const queryParams = reactive({
  keyword: '',
  is_enabled: undefined as boolean | undefined,
  page: 1,
  page_size: 20
})

const loading = ref(false)
const modelList = ref([])
const total = ref(0)
const pollingTimeout = ref<any>(null)
const pollingInterval = ref<any>(null)
const isPolling = ref(false)

const open = ref(false)
const openUpload = ref(false)
// const openKeyManage = ref(false)
const openPlatformManage = ref(false)
const openQueue = ref(false)
const openModelQueue = ref(false)
const currentModel = ref()
const currentQueueModel = ref()

// 格式化上下文大小显示
function formatContextSize(size: number) {
  if (size >= 1000000) {
    return `${(size / 1000000).toFixed(1)}M`
  }
  if (size >= 1000) {
    return `${(size / 1000).toFixed(1)}K`
  }
  return size.toString()
}

async function getData(showTips = true) {
  showTips && (loading.value = true)
  try {
    const params = {
      keyword: queryParams.keyword || undefined,
      is_enabled: queryParams.is_enabled ? queryParams.is_enabled : undefined,
      page: queryParams.page,
      page_size: queryParams.page_size
    }
    const [err, data] = await modelManagement.getModels(params)
    if (err) {
      showTips && ElMessage.error('获取模型列表失败')
      return
    }
    const { list, total: tl } = data ?? {}
    modelList.value = (list || []).map((item: any) => ({ ...item, checkLoading: false }))
    total.value = tl || 0
  } catch (error) {
    console.error(error)
    showTips && ElMessage.error('获取模型列表失败')
  } finally {
    showTips && (loading.value = false)
  }
}

function handleQuery() {
  queryParams.page = 1
  getData()
}

function resetQuery() {
  queryParams.keyword = ''
  queryParams.is_enabled = undefined
  queryParams.page = 1
  getData()
}

function handleAdd() {
  currentModel.value = null
  open.value = true
}

async function handleEdit(row: any) {
  try {
    // 获取最新的模型详情
    const [err, modelData] = await modelManagement.getModelsById(row.id)
    if (err) {
      ElMessage.error('获取模型详情失败')
      return
    }
    currentModel.value = modelData
    open.value = true
  } catch (error) {
    console.error(error)
    ElMessage.error('获取模型详情失败')
  }
}

function handleUpload() {
  openUpload.value = true
}

function handlePlatformManage() {
  openPlatformManage.value = true
}

function handleQueue(row: any) {
  currentQueueModel.value = row
  openQueue.value = true
}

function handleAddSuccess() {
  open.value = false
  handleQuery()
}

function handleUploadSuccess() {
  openUpload.value = false
  handleQuery()
}

async function handleExport() {
  try {
    const params = {
      keyword: queryParams.keyword || undefined,
      is_enabled: queryParams.is_enabled ? queryParams.is_enabled : undefined
    }

    // 获取文件下载链接
    const response = await modelManagement.getModelsExport(params)

    saveAs(response, `模型数据_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error(error)
    ElMessage.error('导出失败')
  }
}

async function handleStatus(row: any) {
  try {
    const newStatus = !row.is_enabled
    const confirmText = newStatus ? '启用' : '禁用'
    await ElMessageBox.confirm(`确定要${confirmText}该模型吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const [err] = await modelManagement.patchModelsByIdStatus({
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

async function handleCheck(row: any) {
  try {
    row.checkLoading = true
    const [err] = await modelManagement.postModelsByIdCheck(row.id)
    if (err) {
      ElMessage.error(err.message || '模型检查失败')
      return
    }
    ElMessage.success('模型检查任务已提交')
    setTimeout(() => {
      getData()
    }, 2000)
  } catch (error) {
    console.error(error)
    ElMessage.error('模型检查失败')
  } finally {
    row.checkLoading = false
  }
}

function startPolling() {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
  }
  isPolling.value = true
  pollingInterval.value = setInterval(() => {
    getData(false)
  }, 3 * 1000)
}

function stopPolling() {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
  isPolling.value = false
}

async function handleBatchCheck() {
  try {
    const [err] = await modelManagement.postModelsCheckAll()
    if (err) {
      ElMessage.error(err.message || '批量检查失败')
      return
    }
    ElMessage.success('批量检查任务已提交，正在轮询检查结果...')

    // 立即获取一次数据
    getData(false)

    // 开始轮询
    startPolling()

    clearTimeout(pollingTimeout.value)

    // 5分钟后自动停止轮询
    pollingTimeout.value = setTimeout(() => {
      if (isPolling.value) {
        stopPolling()
        ElMessage.info('批量检查轮询已结束')
      }
    }, 5 * 60 * 1000)
  } catch (error) {
    console.error(error)
    ElMessage.error('批量检查失败')
  }
}

async function handleDelete(row: any) {
  try {
    await ElMessageBox.confirm('确定要删除该模型吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const [err] = await modelManagement.deleteModelsById(row.id)
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

onMounted(() => {
  getData()
})

onUnmounted(() => {
  stopPolling()
})
</script>
