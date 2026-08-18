<template>
  <el-dialog :model-value="open" title="API密钥管理" width="1000px" @update:model-value="cancel">
    <el-table v-loading="loading" :data="keyList" class="base-table" stripe>
      <el-table-column type="index" width="50" label="序号" align="center" />
      <el-table-column prop="name" label="密钥名称" min-width="100" show-overflow-tooltip />
      <el-table-column prop="vendor" label="厂商" min-width="120" align="center" />
      <el-table-column prop="key_masked" label="密钥" min-width="260" show-overflow-tooltip />
      <el-table-column prop="remark" label="备注" min-width="140" show-overflow-tooltip />
      <el-table-column prop="created_at" label="创建时间" width="140" align="center">
        <template #default="{ row }">
          <span>{{ dayjs(row.created_at).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="cancel">关 闭</el-button>
      <el-button type="primary" plain icon="Plus" @click="handleAdd">新增密钥</el-button>
      <el-button type="primary" @click="cancel">确 认</el-button>
    </template>
    <pagination
      v-model:page="queryParams.page"
      v-model:limit="queryParams.page_size"
      hide-on-single-page
      :total="total"
      @pagination="getData"
    />
    <el-dialog v-model="openForm" :title="currentKey ? '编辑密钥' : '新增密钥'" width="500px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="密钥名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入密钥名称" />
        </el-form-item>
        <el-form-item label="厂商" prop="vendor">
          <el-select v-model="form.vendor" placeholder="请选择厂商" allow-create filterable clearable :reserve-keyword="false">
            <el-option v-for="item in sys_model_suppliers" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="API密钥" prop="key">
          <el-input v-model="form.key" type="password" placeholder="请输入API密钥" show-password />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="openForm = false">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { aPIKeyManagement } from '@/services'
import { useDict } from '@/utils/dict'
import Pagination from '@/components/Pagination/index.vue'

const { sys_model_suppliers } = useDict('sys_model_suppliers')

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits(['update:open', 'success'])

const loading = ref(false)
const submitLoading = ref(false)
const keyList = ref<any[]>([])
const total = ref(0)
const currentKey = ref<any>(null)
const openForm = ref(false)

const queryParams = reactive({
  page: 1,
  page_size: 10,
  keyword: '',
  vendor: ''
})

const form = reactive({
  name: '',
  vendor: '',
  key: '',
  remark: ''
})

const rules = reactive({
  name: [{ required: true, message: '请输入密钥名称', trigger: 'blur' }],
  key: [{ required: true, message: '请输入API密钥', trigger: 'blur' }]
})

const formRef = ref()

async function getData() {
  loading.value = true
  try {
    const params: any = {
      page: queryParams.page,
      page_size: queryParams.page_size
    }
    if (queryParams.keyword) params.keyword = queryParams.keyword
    if (queryParams.vendor) params.vendor = queryParams.vendor

    const [err, data] = await aPIKeyManagement.getApiKeys(params)
    if (err) {
      ElMessage.error('获取密钥列表失败')
      return
    }
    const { list, total: tl } = data ?? {}
    keyList.value = list || []
    total.value = tl || 0
  } catch (error) {
    console.error(error)
    ElMessage.error('获取密钥列表失败')
  } finally {
    loading.value = false
  }
}

function handleAdd() {
  currentKey.value = null
  Object.assign(form, { name: '', vendor: '', key: '', remark: '' })
  rules.key = [{ required: true, message: '请输入API密钥', trigger: 'blur' }]
  openForm.value = true
}

async function handleEdit(row: any) {
  currentKey.value = row
  Object.assign(form, {
    name: row.name || '',
    vendor: row.vendor || '',
    key: '',
    remark: row.remark || ''
  })
  rules.key = []
  openForm.value = true
}

async function handleDelete(row: any) {
  try {
    await ElMessageBox.confirm('确定要删除该密钥吗？删除后无法恢复。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const [err] = await aPIKeyManagement.deleteApiKeysById(row.id)
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

async function submitForm() {
  try {
    const valid = await formRef.value?.validate()
    if (!valid) return

    submitLoading.value = true
    const vItem = sys_model_suppliers.value.find((item: any) => item.value === form.vendor)
    const vendor = vItem?.label || form.vendor

    if (currentKey.value) {
      const updateData: any = {
        id: currentKey.value.id,
        name: form.name,
        vendor,
        remark: form.remark || undefined
      }
      if (form.key) updateData.key = form.key

      const [err] = await aPIKeyManagement.putApiKeysById(updateData)
      if (err) {
        ElMessage.error('更新失败')
        return
      }
      ElMessage.success('更新成功')
    } else {
      const [err] = await aPIKeyManagement.postApiKeys({
        name: form.name,
        vendor,
        key: form.key,
        remark: form.remark || undefined
      })
      if (err) {
        ElMessage.error('创建失败')
        return
      }
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
