<template>
  <el-dialog v-model="visible" title="应用管理" width="800px" destroy-on-close @close="handleClose">
    <div class="app-dialog-content">
      <el-table v-loading="loading" :data="appList" class="base-table" stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="app_id" label="应用ID" min-width="180" show-overflow-tooltip />
        <el-table-column prop="app_name" label="应用名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="created_at" label="创建时间" width="180" align="center">
          <template #default="{ row }">
            {{ formatTime(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-popover placement="left" width="110" popper-style="min-width: unset;" trigger="hover">
              <template #reference>
                <PopoverBtn />
              </template>
              <div>
                <el-button link type="primary" size="small" @click="handleEditApp(row)">编辑</el-button>
                <el-button link type="danger" size="small" @click="handleDeleteApp(row)">删除</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <el-button type="primary" plain @click="handleAddApp">新增应用</el-button>
      <el-button type="primary" @click="visible = false">确定</el-button>
    </template>

    <el-dialog v-model="formDialogVisible" :title="formTitle" width="500px" destroy-on-close append-to-body>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="应用ID" prop="app_id">
          <el-input v-model="formData.app_id" placeholder="请输入应用ID" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="应用名称" prop="app_name">
          <el-input v-model="formData.app_name" placeholder="请输入应用名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="formLoading" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import dayjs from 'dayjs'
import { app } from '@/services/modelFlow/app'
import type { __common__ } from '@/services/modelFlow/types'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const loading = ref(false)
const appList = ref<__common__.DataT[]>([])

const formDialogVisible = ref(false)
const formLoading = ref(false)
const formRef = ref<FormInstance>()
const isEdit = ref(false)
const formData = ref<__common__.AppCreateRequest>({
  app_id: '',
  app_name: ''
})

const formTitle = computed(() => (isEdit.value ? '编辑应用' : '新增应用'))

const formRules: FormRules = {
  app_id: [{ required: true, message: '请输入应用ID', trigger: 'blur' }],
  app_name: [{ required: true, message: '请输入应用名称', trigger: 'blur' }]
}

const formatTime = (time?: string) => {
  if (!time) return '-'
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const loadAppList = async () => {
  try {
    loading.value = true
    const [, data] = await app.getAppsAppAllPost()
    appList.value = data || []
  } catch (error) {
    ElMessage.error('加载应用列表失败')
  } finally {
    loading.value = false
  }
}

const handleAddApp = () => {
  isEdit.value = false
  formData.value = { app_id: '', app_name: '' }
  formDialogVisible.value = true
}

const handleEditApp = (row: __common__.DataT) => {
  isEdit.value = true
  formData.value = { app_id: row.app_id || '', app_name: row.app_name || '' }
  formDialogVisible.value = true
}

const handleDeleteApp = async (row: __common__.DataT) => {
  try {
    await ElMessageBox.confirm(`确定要删除应用"${row.app_name}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const [, data] = await app.deleteAppPost(row.app_id || '')
    if (data) {
      ElMessage.success('删除成功')
      await loadAppList()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async valid => {
    if (!valid) return
    try {
      formLoading.value = true
      if (isEdit.value) {
        const [, data] = await app.updateAppPost(formData.value)
        if (data) {
          ElMessage.success('更新成功')
          formDialogVisible.value = false
          await loadAppList()
        }
      } else {
        const [, data] = await app.createAppPost(formData.value)
        if (data) {
          ElMessage.success('创建成功')
          formDialogVisible.value = false
          await loadAppList()
        }
      }
    } catch (error) {
      ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
    } finally {
      formLoading.value = false
    }
  })
}

const handleClose = () => {
  appList.value = []
  formDialogVisible.value = false
}

watch(visible, newVal => {
  if (newVal) {
    loadAppList()
  }
})
</script>

<style lang="scss" scoped>
.app-dialog-content {
  min-height: 300px;
}
</style>
