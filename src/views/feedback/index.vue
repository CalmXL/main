<template>
  <PageContent class="">
    <template #top>
      <el-form ref="queryRef" :model="queryParams" inline @submit.prevent>
        <el-form-item label="关键词">
          <el-input v-model="queryParams.feedTitle" placeholder="请输入标题或内容" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.feedStatus" placeholder="请选择状态" clearable filterable class="w-40" @change="handleQuery">
            <el-option label="未处理" value="0" />
            <el-option label="已处理" value="1" />
            <el-option label="不处理" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          <el-button type="success" icon="Download" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table v-loading="loading" :data="feedbackList" class="base-table" stripe height="100%">
      <el-table-column type="index" width="80" align="center" label="序号" fixed="left" />
      <el-table-column prop="feedUserName" label="反馈人" width="120" fixed="left">
        <template #default="{ row }">
          <span>{{ row.feedUserName || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="feedTitle" label="标题" width="180" show-overflow-tooltip />
      <el-table-column prop="feedContent" label="内容" min-width="200" show-overflow-tooltip />
      <el-table-column prop="feedStatus" label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.feedStatus)" size="small">
            {{ getStatusText(row.feedStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="expectedTime" label="期望解决时间" align="center" width="160">
        <template #default="{ row }">
          <span v-if="row.expectedTime">{{ formatDate(row.expectedTime, 'YYYY-MM-DD') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="gmtCreate" label="反馈时间" align="center" width="160">
        <template #default="{ row }">
          <span>{{ formatDate(row.gmtCreate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template #default="{ row }">
          <el-popover placement="left" :width="'auto'" trigger="hover">
            <template #reference>
              <PopoverBtn />
            </template>
            <div>
              <el-button link type="primary" @click.stop="handleView(row)">查看</el-button>
              <el-button link type="primary" @click.stop="handleEdit(row)">编辑</el-button>
              <el-button link type="danger" @click.stop="handleDelete(row)">删除</el-button>
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
    <feedback-detail :id="currentFeedbackId" v-model="detailVisible" />
    <feedback-edit :id="currentFeedbackId" v-model="editVisible" @success="getData" />
    <el-image-viewer v-if="showPreview" :url-list="srcList" show-progress :initial-index="0" @close="showPreview = false" />
  </PageContent>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { FeedbackItem } from './types'
import FeedbackDetail from './detail.vue'
import FeedbackEdit from './edit.vue'
import { feedback } from '@/services/feedback/feedback'
import Pagination from '@/components/Pagination/index.vue'

const queryParams = reactive({ page: 1, page_size: 20, feedTitle: '', feedStatus: '' })

const loading = ref(false)
const feedbackList = ref<FeedbackItem[]>([])
const total = ref(0)
const detailVisible = ref(false)
const editVisible = ref(false)
const currentFeedbackId = ref<string | null>(null)
const showPreview = ref(false)
const initialIndex = ref(0)
const srcList = ref<string[]>([])

async function getData() {
  loading.value = true
  try {
    const { page, page_size: pageSize, feedTitle, feedStatus } = queryParams
    const body = { page: page - 1, size: pageSize, feedTitle: feedTitle || undefined, feedStatus: feedStatus || undefined }
    const [err, data] = await feedback.postQueryByPage(body)
    if (err) return

    const { recordList, totailCount } = data as any

    feedbackList.value = recordList // .map(mapApiToItem)
    total.value = totailCount || 0
  } catch (error) {
    console.error(error)
    ElMessage.error('获取反馈列表失败')
  } finally {
    loading.value = false
  }
}

const showImagePreview = (list: string[], index: number) => {
  showPreview.value = true
  srcList.value = list
  initialIndex.value = index
}

function handleQuery() {
  queryParams.page = 1
  getData()
}

function resetQuery() {
  queryParams.feedTitle = ''
  queryParams.feedStatus = ''
  queryParams.page = 1
  getData()
}

function handleView(row: FeedbackItem) {
  currentFeedbackId.value = row.id
  detailVisible.value = true
}

function handleEdit(row: FeedbackItem) {
  currentFeedbackId.value = row.id
  editVisible.value = true
}

function getStatusText(status: string) {
  const statusMap: Record<string, string> = {
    0: '未处理',
    1: '已处理',
    2: '不处理',
    3: '处理中'
  }
  return statusMap[status] || '-'
}

function getStatusType(status: string) {
  const typeMap: Record<string, 'warning' | 'success' | 'info' | 'primary'> = {
    0: 'warning',
    1: 'success',
    2: 'info',
    3: 'primary'
  }
  return typeMap[status] || 'info'
}

function formatDate(date: string, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(date).format(format)
}

async function handleStatusChange(row: FeedbackItem, status: string) {
  try {
    const statusText = getStatusText(status)
    await ElMessageBox.confirm(`确定将该反馈状态更改为"${statusText}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })

    const [err] = await feedback.postUpdBack({ id: row.id, feedStatus: status })
    if (err) {
      ElMessage.error(err.message || '状态修改失败')
      return
    }
    ElMessage.success('状态修改成功')
    getData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
      ElMessage.error('操作失败')
    }
  }
}

async function handleDelete(row: FeedbackItem) {
  try {
    await ElMessageBox.confirm('确定要删除该反馈吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const [err] = await feedback.getDeleteById(String(row.id))
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

async function handleExport() {
  try {
    await feedback.postExport({})
    ElMessage.success('导出成功')
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  getData()
})
</script>
