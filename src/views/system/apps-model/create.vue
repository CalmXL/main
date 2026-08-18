<template>
  <Dialog v-model="open" :title="currentApp ? '编辑应用' : '新增应用'" width="600px" @close="cancel">
    <el-form ref="appRef" :model="app" :rules="rules" label-width="100px">
      <el-form-item label="应用名称" prop="name">
        <el-select
          v-model="app.name"
          filterable
          allow-create
          :disabled="!!currentApp && isDefApp"
          default-first-option
          :reserve-keyword="false"
          placeholder="请输入应用名称"
          @change="onchangeAppKey"
        >
          <el-option v-for="item in sysApps" :key="item.value" :label="item.label" :value="item.label" />
        </el-select>
      </el-form-item>
      <el-form-item label="app_key" prop="app_key">
        <el-input v-model="app.app_key" placeholder="请输入应用唯一标识，如：app_example" :disabled="!!currentApp || isDefApp">
          <template v-if="!currentApp" #append>
            <el-button :disabled="!!currentApp || isDefApp" @click="generateAppKey">生成</el-button>
          </template>
        </el-input>
        <div v-if="!currentApp" class="form-tip">
          <small>建议格式：app_应用名称，如：app_example</small>
        </div>
      </el-form-item>
      <el-form-item label="关联模型">
        <el-select v-model="app.model_ids" multiple placeholder="请选择关联模型" collapse-tags @change="changeMoldeList">
          <el-option v-for="item in models" :key="item.id" :label="item.nickname" :value="item.id">
            {{ item.nickname || item.model_name }} 【{{ item.vendor }}】 {{ item.is_available ? '' : '(不可用)' }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="默认模型">
        <el-select v-model="app.default_model_id" placeholder="请选择默认模型">
          <el-option
            v-for="item in defModelList"
            :key="item.id"
            :label="item.nickname"
            :value="item.id"
            :disabled="!(item.is_enabled && item.is_available)"
          >
            {{ item.nickname || item.model_name }} 【{{ item.vendor }}】 {{ item.is_available ? '' : '(不可用)' }}
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="并发限制" prop="enable_request_queue">
        <el-switch v-model="app.enable_request_queue" />
        <div class="text-xs text-gray-500 ml-2">开启后，按照使用模型的并发限制进行并发控制</div>
      </el-form-item>

      <el-form-item label="应用描述" prop="description">
        <el-input v-model="app.description" type="textarea" :rows="3" placeholder="请输入应用描述" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submitForm">确 定</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import _ from 'lodash'
import type { ElForm } from 'element-plus'
import { ElMessage } from 'element-plus'
import { applicationManagement, modelManagement } from '@/services'
import type { ApplicationItem } from './type'
import { useDict } from '@/utils/dict'

const { sys_model_apps: sysModelStatus, sys_sync_model_app: sysSyncModelApp } = useDict('sys_sync_model_app', 'sys_model_apps')
const sysApps = computed(() => _.uniqBy([...sysSyncModelApp.value, ...sysModelStatus.value], 'value'))
const defApp = computed(() => sysApps.value.map((item: any) => item.value).filter(Boolean))

const props = defineProps<{
  open: boolean
  currentApp?: ApplicationItem | null
}>()
const { open } = toRefs(props)

const models = ref<any[]>([])

async function getModels() {
  try {
    const params = { page: 1, page_size: 499, is_enabled: true }
    const [err, data] = await modelManagement.getModels(params)
    if (err) return
    models.value = data?.list || []
  } catch (error) {
    console.error(error)
    ElMessage.error('获取模型列表失败')
  }
}

const loading = ref(false)
const emit = defineEmits(['update:open', 'success'])

const app = reactive({
  name: '',
  app_key: '',
  model_ids: [] as number[],
  description: '',
  enable_request_queue: false,
  default_model_id: undefined as number | undefined
})

const isDefApp = computed(() => defApp.value.includes(app.app_key))
const defModelList = computed(() => models.value.filter(i => app.model_ids.includes(i.id)))

const changeMoldeList = (value: number[]) => {
  if (!value.includes(app.default_model_id as any)) app.default_model_id = undefined
}

const onchangeAppKey = (value: string) => {
  const defItem = sysApps.value.find((i: any) => i.label === value)
  if (defItem) app.app_key = defItem.value
  else app.app_key = ''
}

const rules = reactive({
  name: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
  app_key: [{ required: true, message: '请输入应用唯一标识api_key', trigger: 'blur' }]
})

const appRef = ref()

function resetForm() {
  Object.assign(app, {
    name: '',
    app_key: '',
    model_ids: [],
    description: '',
    enable_request_queue: false,
    default_model_id: undefined
  })
}

async function loadAppData(data: ApplicationItem) {
  // 先加载基本信息
  Object.assign(app, {
    name: data.name || '',
    app_key: data.app_key || '',
    description: data.description || '',
    enable_request_queue: data.enable_request_queue ?? false
  })

  // 获取应用的详细配置信息，包括关联的模型
  try {
    const [err, configData] = await applicationManagement.getApplicationsByIdConfig(data.id)
    if (!err) {
      // 设置关联的模型ID列表
      app.model_ids = configData?.models?.map((model: any) => model.id) || []

      // 设置默认模型ID
      app.default_model_id = configData?.default_model?.id
    } else {
      console.error('获取应用配置失败:', err)
    }
  } catch (error) {
    console.error('获取应用配置失败:', error)
  }
}

function generateAppKey() {
  const name = app.name.trim()
  if (name) {
    // 检查是否只包含字母和数字
    if (/^[a-zA-Z0-9]+$/.test(name)) {
      const sanitized = name.toLowerCase()
      app.app_key = `app_${sanitized}`
    } else {
      // 包含特殊字符或中文等，生成随机key
      app.app_key = `app_${Math.random().toString(36).substr(2, 6)}`
    }
  } else {
    app.app_key = `app_${Math.random().toString(36).substr(2, 6)}`
  }
}

async function submitForm() {
  try {
    const valid = await appRef.value.validate()
    if (!valid) return

    // 验证默认模型是否在关联模型列表中
    if (app.default_model_id && !app.model_ids.includes(app.default_model_id)) {
      ElMessage.error('默认模型必须在关联的模型列表中')
      return
    }

    const requestData: any = {
      name: app.name,
      app_key: app.app_key,
      description: app.description || undefined,
      enable_request_queue: app.enable_request_queue
    }

    // 只有选择了模型时才添加模型相关字段
    if (app.model_ids.length > 0) {
      requestData.model_ids = app.model_ids
      // 如果有默认模型，添加默认模型ID
      if (app.default_model_id) {
        requestData.default_model_id = app.default_model_id
      }
    }

    loading.value = true

    let res
    if (props.currentApp?.id) {
      // 更新应用：分两步，先更新基本信息，再更新模型关联
      const [updateErr, updateData] = await applicationManagement.putApplicationsById({
        id: props.currentApp.id,
        ...requestData
      })

      if (!updateErr && app.model_ids.length > 0) {
        // 更新模型关联
        const [defaultModelErr] = await applicationManagement.putApplicationsByIdDefaultModel({
          id: props.currentApp.id,
          model_id: app.default_model_id || app.model_ids[0]
        })
        if (defaultModelErr) {
          console.error('更新默认模型失败:', defaultModelErr)
        }
      }
      res = updateData
    } else {
      // 创建应用
      const [, createData] = await applicationManagement.postApplications(requestData)
      res = createData
    }

    if (res) {
      ElMessage.success(props.currentApp ? '更新成功' : '创建成功')
      emit('success')
    } else {
      ElMessage.error(props.currentApp ? '更新失败' : '创建失败')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error(props.currentApp ? '更新失败' : '创建失败')
  } finally {
    loading.value = false
  }
}

function cancel() {
  emit('update:open', false)
}

watch(
  () => props.open,
  async val => {
    if (val) {
      // 打开对话框时获取模型列表
      await getModels()

      if (props.currentApp) {
        await loadAppData(props.currentApp)
      } else {
        resetForm()
      }
    } else {
      appRef.value?.resetFields()
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.form-tip {
  /* margin-top: 4px; */
  color: #909399;
}
</style>
