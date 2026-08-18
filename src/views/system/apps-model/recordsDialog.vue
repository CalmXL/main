<template>
  <Dialog v-model="open" destroy-on-close title="对话记录" width="90vw" @close="cancel">
    <div class="dialog-content">
      <!-- 搜索和筛选区域 -->
      <el-form ref="queryRef" :model="queryParams" inline>
        <el-form-item label="对话ID">
          <el-input v-model="queryParams.conversation_id" placeholder="请输入对话ID" clearable />
        </el-form-item>
        <el-form-item label="模型名称">
          <el-input v-model="queryParams.model_name" placeholder="请输入模型名称" clearable />
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="queryParams.keyword" placeholder="搜索问题和回答" clearable />
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          <el-button
            v-hasPermi="['system:apps:delete']"
            type="danger"
            icon="Delete"
            :disabled="selectedIds.length === 0"
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <div class="table-area">
        <el-table v-loading="loading" :data="recordList" height="400px" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" fixed="left" />
          <!-- <el-table-column prop="session_id" label="会话ID" width="180" /> -->
          <el-table-column prop="model_name" label="模型名称" width="150" fixed="left" />
          <el-table-column prop="conversation_id" label="对话ID" width="180" show-overflow-tooltip />
          <el-table-column prop="question" label="用户问题" min-width="200">
            <template #default="{ row }">
              <el-tooltip :content="row.question" effect="light" placement="top" :show-after="300" popper-class="custom-tooltip">
                <div class="ellipsis-text">{{ row.question.trim() }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="answer" label="模型回答" min-width="200">
            <template #default="{ row }">
              <el-tooltip :content="row.answer" effect="light" placement="top" :show-after="300" popper-class="custom-tooltip">
                <div class="ellipsis-text">{{ row.answer.trim() }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="thinking" label="思考过程" min-width="200">
            <template #default="{ row }">
              <el-tooltip v-if="row.thinking" :content="row.thinking" effect="light" placement="top" :show-after="300" popper-class="custom-tooltip">
                <div class="ellipsis-text">{{ row.thinking?.trim() }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="prompt_tokens" label="输入Tokens" width="120" align="center" />
          <el-table-column prop="completion_tokens" label="输出Tokens" width="120" align="center" />
          <el-table-column prop="reasoning_tokens" label="思考Tokens" width="120" align="center" />
          <el-table-column prop="cache_hit_tokens" label="缓存命中Tokens" width="140" align="center" />
          <el-table-column prop="is_streaming" label="流式请求" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.is_streaming ? 'success' : 'info'" size="small">
                {{ row.is_streaming ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="first_token_time_ms" label="响应耗时(ms)" width="160" align="center" />
          <el-table-column prop="total_time_ms" label="总耗时(ms)" width="160" align="center" />
          <el-table-column prop="created_at" label="创建时间" width="160" align="center">
            <template #default="{ row }">
              <span>{{ dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center" fixed="right">
            <template #default="{ row }">
              <el-button v-hasPermi="['system:apps:delete']" link type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页区域 -->
      <div class="pagination-area">
        <pagination
          v-model:page="queryParams.page"
          v-model:limit="queryParams.page_size"
          hide-on-single-page
          :total="total"
          @pagination="getData"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { conversationRecord } from '@/services/conversationRecord'
import Pagination from '@/components/Pagination/index.vue'
import type { ApplicationItem } from './type'

const props = defineProps<{
  open: boolean
  currentApp: ApplicationItem | null
}>()

const { open } = toRefs(props)
const emit = defineEmits(['update:open'])

// 查询参数
const queryParams = reactive({
  application_id: 0,
  session_id: '',
  conversation_id: '',
  model_name: '',
  keyword: '',
  start_date: '',
  end_date: '',
  page: 1,
  page_size: 20
})

// 日期范围
const dateRange = ref<[string, string]>(['', ''])

// 数据状态
const loading = ref(false)
const recordList = ref<any[]>([])
const total = ref(0)
const selectedIds = ref<number[]>([])

// 处理表格选择变化
function handleSelectionChange(selection: any[]) {
  selectedIds.value = selection.map(item => item.id)
}

// 获取对话记录数据
async function getData() {
  if (!props.currentApp) return

  loading.value = true
  try {
    queryParams.application_id = props.currentApp.id
    const [err, data] = await conversationRecord.getChatRecords(queryParams)

    if (err) {
      ElMessage.error('获取对话记录失败')
      return
    }

    const { items, total: count } = data ?? {}
    recordList.value = items || []
    total.value = count || 0
  } catch (error) {
    console.error(error)
    ElMessage.error('获取对话记录失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理
function handleQuery() {
  queryParams.page = 1
  // 处理日期范围
  if (dateRange.value && dateRange.value.length === 2) {
    queryParams.start_date = dateRange.value[0]
    queryParams.end_date = dateRange.value[1]
  } else {
    queryParams.start_date = ''
    queryParams.end_date = ''
  }
  getData()
}

// 重置搜索
function resetQuery() {
  queryParams.session_id = ''
  queryParams.conversation_id = ''
  queryParams.model_name = ''
  queryParams.keyword = ''
  queryParams.start_date = ''
  queryParams.end_date = ''
  dateRange.value = ['', '']
  queryParams.page = 1
  getData()
}

// 删除单条记录
async function handleDelete(row: any) {
  try {
    await ElMessageBox.confirm('确定要删除这条对话记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const [err] = await conversationRecord.deleteChatRecords({
      record_ids: [row.id]
    })

    if (err) {
      ElMessage.error(err.message || '删除失败')
      return
    }

    ElMessage.success('删除成功')
    getData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
      ElMessage.error('删除失败')
    }
  }
}

// 批量删除
async function handleBatchDelete() {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条对话记录吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const [err] = await conversationRecord.deleteChatRecords({
      record_ids: selectedIds.value
    })

    if (err) {
      ElMessage.error(err.message || '批量删除失败')
      return
    }

    ElMessage.success('批量删除成功')
    selectedIds.value = []
    getData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
      ElMessage.error('批量删除失败')
    }
  }
}

// 监听对话框打开状态
watch(
  () => props.open,
  newVal => {
    if (newVal) {
      // 重置查询参数
      resetQuery()
    }
  }
)

getData()

function cancel() {
  emit('update:open', false)
}
</script>

<style lang="scss" scoped>
.dialog-content {
  .search-area {
    margin-bottom: 16px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 6px;

    .el-form {
      margin: 0;
    }
  }

  .table-area {
    margin-bottom: 16px;

    .ellipsis-text {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;

      &:hover {
        color: #409eff;
      }
    }
  }

  .pagination-area {
    display: flex;
    justify-content: center;
  }
}
</style>

<style lang="scss">
/* 全局样式，用于自定义tooltip */
.custom-tooltip {
  max-width: 800px !important;
  max-height: 400px !important;
  overflow-y: auto !important;
  word-wrap: break-word !important;
  white-space: pre-wrap !important;
  // line-height: 1.5 !important;
  // padding: 12px !important;
  font-size: 14px !important;
  // background-color: #fff !important;
  // color: #606266 !important;
  // border: 1px solid #e4e7ed !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2) !important;
}
</style>
