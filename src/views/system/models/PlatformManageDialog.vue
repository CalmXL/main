<template>
  <Dialog :model-value="open" title="平台管理" width="1200px" @update:model-value="cancel">
    <el-table v-loading="loading" :data="platformList" class="base-table" stripe>
      <el-table-column type="index" width="50" label="序号" align="center" />
      <el-table-column prop="name" label="平台名称" width="120" show-overflow-tooltip />
      <el-table-column prop="api_style" label="API风格" width="100" align="center" />
      <el-table-column prop="base_url" label="基础URL" min-width="200" show-overflow-tooltip />
      <el-table-column prop="count" label="key数量" min-width="80" align="center">
        <template #default="{ row }">
          <el-tag size="small" class="pointer" @click="handleManageKeys(row)">{{ row.count }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 'enabled' ? 'success' : 'danger'" size="small">
            {{ row.status === 'enabled' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="140" align="center">
        <template #default="{ row }">
          <span>{{ dayjs(row.created_at).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template #default="{ row }">
          <el-popover placement="left" :width="'auto'" trigger="hover">
            <template #reference>
              <PopoverBtn />
            </template>
            <div>
              <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button link type="primary" @click="handleManageKeys(row)">密钥</el-button>
              <el-button link type="primary" :loading="checkingId === row.id" @click="handleCheckPlatform(row)">检测</el-button>
              <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="cancel">关 闭</el-button>
      <el-button type="primary" plain @click="handleAdd">新增平台</el-button>
      <el-button type="primary" @click="cancel">确 认</el-button>
    </template>
    <pagination
      v-model:page="queryParams.page"
      v-model:limit="queryParams.page_size"
      hide-on-single-page
      :total="total"
      @pagination="getData"
    />
    <Dialog v-model="openForm" :title="currentPlatform ? '编辑平台' : '新增平台'" width="600px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="平台名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入平台名称" />
        </el-form-item>
        <el-form-item label="API风格" prop="api_style">
          <el-select v-model="form.api_style" placeholder="请选择API风格" style="width: 100%">
            <el-option label="OpenAI" value="openai" />
            <el-option label="Anthropic" value="anthropic" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.api_style === 'openai'" label="Responses API" prop="support_responses_api">
          <el-switch v-model="form.support_responses_api" active-text="支持" inactive-text="不支持" />
        </el-form-item>
        <el-form-item label="余额查询方式" prop="balance_query_method">
          <el-select v-model="form.balance_query_method" placeholder="请选择余额查询方式（可选）" clearable style="width: 100%">
            <el-option label="DeepSeek" value="deepseek" />
          </el-select>
        </el-form-item>
        <el-form-item label="基础URL" prop="base_url">
          <el-input v-model="form.base_url" placeholder="例如: https://api.openai.com" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio value="enabled">启用</el-radio>
            <el-radio value="disabled">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="API密钥" prop="api_key">
          <el-input v-model="form.api_key" type="textarea" :rows="2" placeholder="请输入API密钥，多个支持逗号分隔" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" />
        </el-form-item>
        <el-divider content-position="left">模型同步配置 (可选)</el-divider>
        <el-form-item label="模型列表URL" prop="model_list_url">
          <el-input v-model="form.model_list_url" placeholder="例如: /v1/models" />
        </el-form-item>
        <el-form-item label="列表映射字段" prop="model_list_mapping_field">
          <el-input v-model="form.model_list_mapping_field" placeholder="例如: data" />
        </el-form-item>
        <el-form-item label="名称映射字段" prop="model_name_mapping_field">
          <el-input v-model="form.model_name_mapping_field" placeholder="例如: id" />
        </el-form-item>
        <el-form-item label="列表过滤正则" prop="model_list_filter">
          <el-input v-model="form.model_list_filter" placeholder="例如: ^deepseek-（JS正则语法）" />
        </el-form-item>
        <!-- <el-form-item label="描述映射字段" prop="model_desc_mapping_field">
          <el-input v-model="form.model_desc_mapping_field" placeholder="例如: id" />
        </el-form-item> -->
      </el-form>
      <template #footer>
        <el-button @click="openForm = false">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">确 定</el-button>
      </template>
    </Dialog>
    <Dialog
      v-model="keyDialogVisible"
      :title="`密钥管理 - ${keyPlatformName}`"
      width="1000px"
      append-to-body
      @close="keyDialogVisible = false"
    >
      <div style="display: flex; gap: 10px; margin-bottom: 16px">
        <el-input v-model="newKeys" placeholder="请输入API密钥，多个支持逗号分隔" />
        <el-button type="primary" :loading="addKeyLoading" @click="handleAddKeys">添加</el-button>
        <el-button class="ml-0!" @click="loadKeys">刷新</el-button>
      </div>
      <el-table v-loading="keyLoading" :data="keyList" stripe max-height="600" class="base-table">
        <el-table-column type="index" width="50" label="序号" align="center" />
        <el-table-column prop="key_masked" label="密钥" min-width="200" show-overflow-tooltip />
        <el-table-column prop="name" label="名称" width="120" show-overflow-tooltip />
        <el-table-column label="余额" width="130" align="center">
          <template #default="{ row }">
            <span v-if="row.balance != null">{{ row.balance }}{{ row.balance_currency || '' }}</span>
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row?.is_available ? 'success' : 'danger'" size="small">
              {{ row?.is_available ? '可用' : '不可用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="今日请求" width="90" align="center">
          <template #default="{ row }">
            {{ row.daily_usage ?? 0 }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="一小时请求" width="90" align="center">
          <template #default="{ row }">
            {{ row.hourly_usage ?? 0 }}
          </template>
        </el-table-column> -->
        <el-table-column label="总请求" width="80" align="center">
          <template #default="{ row }">
            {{ row.total_usage ?? 0 }}
          </template>
        </el-table-column>
        <el-table-column label="最近使用" width="150" align="center">
          <template #default="{ row }">
            <span v-if="row.last_used_at">{{ dayjs(row.last_used_at).format('YYYY-MM-DD HH:mm') }}</span>
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>
        <el-table-column label="启用状态" width="90" align="center">
          <template #default="{ row }">
            <el-switch
              :model-value="row.status === 'enabled'"
              size="small"
              :loading="togglingKeyId === row.id"
              @change="handleToggleKeyStatus(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template #default="{ row }">
            <el-button link type="danger" :loading="deletingKeyId === row.id" @click="handleDeleteKey(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </Dialog>
    <Dialog
      v-model="checkDialogVisible"
      :title="`APIKey 检测结果 - ${checkPlatformName}`"
      width="700px"
      append-to-body
      @close="closeCheckDialog"
    >
      <div v-if="checkResult" style="margin-bottom: 16px">
        <el-alert
          :type="checkResult.is_available ? 'success' : 'error'"
          :title="checkResult.is_available ? '平台所有 APIKey 均可用' : '平台存在不可用的 APIKey'"
          show-icon
          :closable="false"
        />
      </div>
      <el-table v-loading="checkLoading" :data="checkResult?.key_results || []" stripe class="base-table">
        <el-table-column type="index" width="50" label="序号" align="center" />
        <el-table-column prop="api_key_id" label="Key ID" width="100" align="center" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row?.is_available ? 'success' : 'danger'" size="small">
              {{ row?.is_available ? '可用' : '不可用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="error_msg" label="错误信息" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <span v-if="row?.error_msg">{{ row.error_msg }}</span>
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="checkDialogVisible = false">关 闭</el-button>
      </template>
    </Dialog>
  </Dialog>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { platformManagement, aPIKeyManagement } from '@/services'
import Pagination from '@/components/Pagination/index.vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits(['update:open', 'success'])

const loading = ref(false)
const submitLoading = ref(false)
const platformList = ref<any[]>([])
const total = ref(0)
const currentPlatform = ref<any>(null)
const openForm = ref(false)

const queryParams = reactive({
  page: 1,
  page_size: 10,
  keyword: ''
})

const form = reactive({
  name: '',
  api_style: '',
  balance_query_method: '',
  base_url: '',
  status: 'enabled',
  support_responses_api: false,
  model_list_url: '',
  model_list_mapping_field: '',
  model_name_mapping_field: '',
  model_list_filter: '',
  model_desc_mapping_field: '',
  api_key: '',
  remark: ''
})

const rules = reactive({
  name: [{ required: true, message: '请输入平台名称', trigger: 'blur' }],
  api_style: [{ required: true, message: '请选择API风格', trigger: 'change' }],
  base_url: [{ required: true, message: '请输入基础URL', trigger: 'blur' }]
})

const formRef = ref()

// 密钥管理
const keyDialogVisible = ref(false)
const keyPlatformName = ref('')
const keyPlatformId = ref<number | null>(null)
const keyList = ref<any[]>([])
const keyLoading = ref(false)
const newKeys = ref('')
const addKeyLoading = ref(false)
const deletingKeyId = ref<number | null>(null)
const togglingKeyId = ref<number | null>(null)

// APIKey 检测
const checkDialogVisible = ref(false)
const checkLoading = ref(false)
const checkResult = ref<any>(null)
const checkingId = ref<number | null>(null)
const checkPlatformName = ref('')

async function getData() {
  loading.value = true
  try {
    const params: any = {
      page: queryParams.page,
      page_size: queryParams.page_size
    }
    if (queryParams.keyword) params.keyword = queryParams.keyword

    const [err, data] = await platformManagement.getPlatforms(params)
    if (err) {
      ElMessage.error('获取平台列表失败')
      return
    }
    const { list, total: tl } = data ?? {}

    list.forEach((item: any) => {
      item.count = item.api_keys?.length ?? 0
    })
    platformList.value = list || []
    total.value = tl || 0
  } catch (error) {
    console.error(error)
    ElMessage.error('获取平台列表失败')
  } finally {
    loading.value = false
  }
}

function handleAdd() {
  currentPlatform.value = null
  Object.assign(form, {
    name: '',
    api_style: 'openai',
    balance_query_method: '',
    base_url: '',
    status: 'enabled',
    support_responses_api: false,
    model_list_url: '',
    model_list_mapping_field: '',
    model_name_mapping_field: '',
    model_list_filter: '',
    model_desc_mapping_field: '',
    api_key: '',
    remark: ''
  })
  openForm.value = true
}

async function handleEdit(row: any) {
  try {
    const [err, data] = await platformManagement.getPlatformsById(row.id)
    if (err) {
      ElMessage.error('获取平台详情失败')
      return
    }
    currentPlatform.value = data
    Object.assign(form, {
      name: data.name || '',
      api_style: data.api_style || 'openai',
      balance_query_method: data.balance_query_method || '',
      base_url: data.base_url || '',
      status: data.status || 'enabled',
      support_responses_api: data.support_responses_api ?? false,
      model_list_url: data.model_list_url || '',
      model_list_mapping_field: data.model_list_mapping_field || '',
      model_name_mapping_field: data.model_name_mapping_field || '',
      model_list_filter: data.model_list_filter || '',
      model_desc_mapping_field: data.model_desc_mapping_field || '',
      api_key: '',
      remark: data.remark || ''
    })
    openForm.value = true
  } catch (error) {
    console.error(error)
    ElMessage.error('获取平台详情失败')
  }
}

async function handleDelete(row: any) {
  try {
    await ElMessageBox.confirm('确定要删除该平台吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const [err] = await platformManagement.deletePlatformsById(row.id)
    if (err) {
      ElMessage.error(err.message || '删除失败')
      return
    }
    ElMessage.success('删除成功')
    getData()
    emit('success')
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
      ElMessage.error('删除失败')
    }
  }
}

function handleManageKeys(row: any) {
  keyPlatformName.value = row.name
  keyPlatformId.value = row.id
  keyList.value = row.api_keys || []
  newKeys.value = ''
  keyDialogVisible.value = true
}

async function handleAddKeys() {
  if (!newKeys.value.trim()) {
    ElMessage.warning('请输入API密钥')
    return
  }
  addKeyLoading.value = true
  try {
    const [err] = await platformManagement.postPlatformsByIdApiKeys({
      id: keyPlatformId.value!,
      keys: newKeys.value
    })
    if (err) {
      ElMessage.error(err.message || '添加失败')
      return
    }
    ElMessage.success('添加成功')
    newKeys.value = ''
    await loadKeys()
    getData()
  } catch (error) {
    console.error(error)
    ElMessage.error('添加失败')
  } finally {
    addKeyLoading.value = false
  }
}

async function loadKeys() {
  keyLoading.value = true
  try {
    const [err, data] = await platformManagement.getPlatformsById(keyPlatformId.value!)
    if (err) return
    keyList.value = data?.api_keys || []
  } catch (error) {
    console.error(error)
  } finally {
    keyLoading.value = false
  }
}

async function handleDeleteKey(row: any) {
  try {
    await ElMessageBox.confirm('确定要删除该密钥吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    return
  }
  deletingKeyId.value = row.id
  try {
    const [err] = await aPIKeyManagement.deleteApiKeysById(row.id)
    if (err) {
      ElMessage.error(err.message || '删除失败')
      return
    }
    ElMessage.success('删除成功')
    await loadKeys()
    getData()
  } catch (error) {
    console.error(error)
    ElMessage.error('删除失败')
  } finally {
    deletingKeyId.value = null
  }
}

async function handleToggleKeyStatus(row: any) {
  const newStatus = row.status === 'enabled' ? 'disabled' : 'enabled'
  togglingKeyId.value = row.id
  try {
    const [err] = await aPIKeyManagement.putApiKeysById({ id: row.id, status: newStatus })
    if (err) {
      ElMessage.error(err.message || '操作失败')
      return
    }
    ElMessage.success(newStatus === 'enabled' ? '已启用' : '已禁用')
    await loadKeys()
    getData()
  } catch (error) {
    console.error(error)
    ElMessage.error('操作失败')
  } finally {
    togglingKeyId.value = null
  }
}

async function handleCheckPlatform(row: any) {
  checkPlatformName.value = row.name
  checkResult.value = null
  checkDialogVisible.value = true
  checkingId.value = row.id
  checkLoading.value = true
  try {
    const [err, data] = await platformManagement.postPlatformsByIdPoll(row.id)
    if (err) {
      ElMessage.error(err.message || '检测失败')
      return
    }
    checkResult.value = data
  } catch (error) {
    console.error(error)
    ElMessage.error('检测失败')
  } finally {
    checkLoading.value = false
    checkingId.value = null
  }
}

function closeCheckDialog() {
  checkDialogVisible.value = false
  checkResult.value = null
  checkPlatformName.value = ''
}

async function submitForm() {
  try {
    const valid = await formRef.value?.validate()
    if (!valid) return

    submitLoading.value = true

    const submitData: any = { ...form }

    // 如果 api_key 为空，则不传递该字段以免覆盖原有数据
    if (!submitData.api_key) {
      delete submitData.api_key
    }

    if (currentPlatform.value) {
      submitData.id = currentPlatform.value.id
      const [err] = await platformManagement.putPlatformsById(submitData)
      if (err) return
      ElMessage.success('更新成功')
    } else {
      const [err] = await platformManagement.postPlatforms(submitData)
      if (err) return
      ElMessage.success('创建成功')
    }

    openForm.value = false
    getData()
    emit('success')
  } catch (error) {
    console.error(error)
  } finally {
    submitLoading.value = false
  }
}

function cancel() {
  emit('update:open', false)
}

watch(
  () => form.api_style,
  val => {
    if (val !== 'openai') {
      form.support_responses_api = false
    }
  }
)

watch(
  () => form.base_url,
  val => {
    if (currentPlatform.value) return
    if (val) {
      try {
        const url = new URL(val)
        if (url.origin) {
          form.model_list_url = `${url}/models`
          form.model_list_mapping_field = 'data'
          form.model_name_mapping_field = 'id'
          return
        }
      } catch {
        // URL 不完整或无效，不做处理
      }
    }

    form.model_list_url = ''
    form.model_list_mapping_field = ''
    form.model_name_mapping_field = ''
    form.model_list_filter = ''
  }
)

watch(
  () => props.open,
  val => {
    if (val) {
      getData()
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.form-tip {
  margin-top: 4px;
  color: #909399;
  font-size: 12px;
}
</style>
