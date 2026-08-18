<template>
  <el-dialog v-model="open" :title="currentModel ? '编辑模型' : '新增模型'" width="600px" @close="cancel">
    <el-form ref="modelRef" :model="model" :rules="rules" label-width="140px">
      <el-form-item label="模型平台" prop="platform_id">
        <el-select v-model="model.platform_id" placeholder="请选择模型平台" filterable clearable>
          <el-option v-for="item in platformList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="模型名称" prop="model_name">
        <el-select v-model="model.model_name" placeholder="请输入模型名称" allow-create filterable clearable :reserve-keyword="false">
          <el-option v-for="item in platformModelList" :key="item.name" :label="item.name" :value="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="模型昵称" prop="nickname">
        <el-input v-model="model.nickname" placeholder="请输入模型昵称" />
      </el-form-item>
      <el-form-item label="模型类型" prop="model_type">
        <el-select v-model="model.model_type" placeholder="请选择模型类型">
          <el-option v-for="dict in sys_model_type" :key="dict.value" :value="dict.value" :label="dict.label">
            {{ dict.label }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="OpenAI规范" prop="is_openai">
        <el-switch v-model="model.is_openai" />
      </el-form-item>
      <el-form-item label="支持推理" prop="supports_deep_thinking">
        <el-switch v-model="model.supports_deep_thinking" />
      </el-form-item>
      <div v-if="isLLM" class="px-4">
        <el-collapse v-model="llmCollapseActiveNames">
          <el-collapse-item name="advanced" title="高级配置（可选）">
            <el-form-item label="上下文大小" prop="context_size">
              <el-input v-model.number="model.context_size" :min="0" :max="2000000" placeholder="请输入上下文大小" />
            </el-form-item>
            <el-form-item label="并发数量" prop="concurrency">
              <el-input-number v-model="model.concurrency" :min="0" :max="999" placeholder="0表示不限制" style="width: 200px" />
              <div class="form-tip">0表示不限制并发数，大于0为最大并发数</div>
            </el-form-item>
            <el-form-item label="温度" prop="temperature">
              <el-slider v-model="model.temperature" :step="0.01" :min="0.0" :max="1.0" show-stops size="small" />
            </el-form-item>
            <el-form-item label="超时时间" prop="timeout">
              <el-input v-model.number="model.timeout" :min="1" :max="600" placeholder="请输入超时时间(单位：秒)" />
            </el-form-item>
            <el-form-item label="默认参数" prop="default_params">
              <el-input
                v-model="model.default_params"
                type="textarea"
                :rows="3"
                placeholder='请输入JSON格式的默认参数，例如：{"temperature": 0.7}'
              />
            </el-form-item>
            <el-form-item label="参数优先级" prop="is_default_params_first">
              <el-switch v-model="model.is_default_params_first" active-text="默认参数优先" inactive-text="请求参数优先" />
            </el-form-item>
            <el-form-item label="支持工具调用" prop="function_call">
              <el-select v-model="model.function_call" placeholder="请选择是否支持工具调用">
                <el-option value="1" label="支持" />
                <el-option value="0" label="不支持" />
              </el-select>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </div>
      <el-form-item v-if="isRerank" label="Rerank URL" prop="rerank_url">
        <el-input v-model="model.rerank_url" placeholder="请输入 rerank 地址" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submitForm">确 定</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { modelManagement, platformManagement } from '@/services'
import { useDict } from '@/utils/dict'

const { sys_model_type } = useDict('sys_model_type')

const props = defineProps<{
  open: boolean
  currentModel?: any
}>()
const { open } = toRefs(props)

const loading = ref(false)
const emit = defineEmits(['update:open', 'success'])

const platformList = ref<any[]>([])
const platformModelList = ref<any[]>([])
const llmCollapseActiveNames = ref<string[]>([])

const model = reactive({
  is_openai: true,
  model_type: '',
  nickname: '',
  model_name: '',
  platform_id: undefined as number | undefined,
  function_call: '',
  supports_deep_thinking: true,
  context_size: undefined as number | undefined,
  concurrency: undefined as number | undefined,
  temperature: undefined as number | undefined,
  timeout: undefined as number | undefined,
  default_params: '',
  is_default_params_first: false,
  rerank_url: ''
})

const isLLM = computed(() => ['chat', 'multimodal'].includes(model.model_type))
const isRerank = computed(() => model.model_type === 'rerank')

const rules: any = reactive({
  model_type: [{ required: true, message: '请选择模型类型', trigger: 'change' }],
  model_name: [{ required: true, message: '请输入模型名称', trigger: 'change' }],
  platform_id: [{ required: true, message: '请选择模型平台', trigger: 'change' }],
  context_size: [
    { type: 'number', message: '请输入有效的数字', trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value && (value < 0 || value > 2000000)) {
          callback(new Error('上下文大小必须在0-2000000之间'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  temperature: [
    { type: 'number', message: '请输入有效的数字', trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value && (value < 0 || value > 1)) {
          callback(new Error('温度参数必须在0.0-1.0之间'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  timeout: [
    { type: 'number', message: '请输入有效的数字', trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value && (value < 1 || value > 300)) {
          callback(new Error('超时时间必须在1-300秒之间'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

const modelRef = ref()

async function getPlatformList() {
  try {
    const [err, data] = await platformManagement.getPlatforms({ page: 1, page_size: 499 })
    if (err) {
      console.error('获取模型平台列表失败')
      return
    }
    const { list } = data ?? {}
    platformList.value = list || []
  } catch (error) {
    console.error(error)
  }
}

async function getPlatformModels(platformId: number) {
  try {
    const [err, data] = await platformManagement.getPlatformsByIdModels(platformId)
    if (err) {
      platformModelList.value = []
    } else {
      platformModelList.value = data || []
    }
  } catch (error) {
    console.error(error)
  }
}

function resetForm() {
  Object.assign(model, {
    is_openai: true,
    model_type: 'chat',
    nickname: '',
    platform_id: undefined,
    model_name: '',
    function_call: '',
    context_size: undefined,
    concurrency: undefined,
    temperature: undefined,
    timeout: undefined,
    supports_deep_thinking: false,
    default_params: '',
    is_default_params_first: false,
    rerank_url: ''
  })
}

function loadModelData(data: any) {
  let default_params = ''
  try {
    const params = JSON.parse(data.default_params)
    default_params = JSON.stringify(params, null, 2)
  // eslint-disable-next-line no-empty
  } catch {}

  Object.assign(model, {
    is_openai: data.is_openai ?? true,
    model_type: data.model_type || 'chat',
    nickname: data.nickname || '',
    platform_id: data.platform_id || undefined,
    model_name: data.model_name || '',
    function_call: data.function_call || '',
    supports_deep_thinking: data.supports_deep_thinking ?? false,
    context_size: data.context_size || undefined,
    concurrency: data.concurrency ?? undefined,
    temperature: data.temperature || undefined,
    timeout: data.timeout || undefined,
    default_params: default_params || '',
    is_default_params_first: data.is_default_params_first ?? false,
    rerank_url: data.rerank_url || ''
  })
}

async function submitForm() {
  try {
    const valid = await modelRef.value.validate()
    if (!valid) return

    const { is_openai, model_type, nickname, supports_deep_thinking } = model
    const {
      model_name,
      platform_id,
      context_size,
      concurrency,
      function_call,
      temperature,
      timeout,
      default_params,
      is_default_params_first,
      rerank_url
    } = model

    const requestData: any = {
      is_openai,
      model_type,
      nickname: nickname || undefined,
      model_name,
      supports_deep_thinking,
      function_call: function_call || undefined,
      concurrency: isLLM.value ? concurrency ?? undefined : undefined,
      context_size: isLLM.value ? context_size || undefined : undefined,
      temperature: isLLM.value ? temperature || undefined : undefined,
      timeout: isLLM.value ? timeout || undefined : undefined,
      default_params: default_params,
      is_default_params_first,
      rerank_url: isRerank.value ? rerank_url || undefined : undefined
    }

    if (platform_id) {
      requestData.platform_id = platform_id
    }

    loading.value = true

    if (props.currentModel?.id) {
      await modelManagement.putModelsById({
        id: props.currentModel.id,
        ...requestData
      })
    } else {
      await modelManagement.postModels(requestData)
    }

    ElMessage.success(props.currentModel ? '更新成功' : '创建成功')
    emit('success')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

function cancel() {
  emit('update:open', false)
}

watch(
  () => model.platform_id,
  val => {
    if (val) {
      getPlatformModels(val)
    } else {
      platformModelList.value = []
    }
  },
  { immediate: true }
)

watch(
  () => props.open,
  val => {
    if (val) {
      getPlatformList()
      if (props.currentModel) {
        loadModelData(props.currentModel)
      } else {
        resetForm()
        modelRef.value?.resetFields()
      }
    } else {
      resetForm()
      modelRef.value?.resetFields()
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.form-tip {
  margin-top: 4px;
  color: #909399;
}
</style>
