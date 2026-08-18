<template>
  <Dialog v-model="open" destroy-on-close title="使用方式" width="1000px" @close="cancel">
    <el-table :data="list" class="base-table" stripe>
      <el-table-column label="方式" prop="mode" align="center" width="140px" />
      <el-table-column label="地址" prop="url" align="left" header-align="center">
        <template #default="scope">
          <div class="flex gap-1">
            <el-tag class="cursor-pointer" type="success" @click="copyUrl(scope.row.baseUrl)">{{ scope.row.baseUrl }}</el-tag>
            <el-tag class="cursor-pointer" type="primary" @click="copyUrl(scope.row.url)">{{ scope.row.url }}</el-tag>
            <el-button link type="primary" size="small" @click="copyUrl(`${scope.row.baseUrl}${scope.row.url}`)">
              <el-icon><CopyDocument /></el-icon>
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="说明" prop="description" width="240px" align="left" header-align="center" />
    </el-table>
    <div class="usage-notes mt-4">
      <div class="usage-notes__title">
        <span>使用事项</span>
      </div>
      <div class="usage-notes__item">
        <span class="usage-notes__index">1</span>
        <span>模型名称使用 <code>auto</code>、<code>default</code> 或<code>不传</code>，则使用默认模型</span>
      </div>
      <div class="usage-notes__item">
        <span class="usage-notes__index">2</span>
        <span>apiKey 使用用户请求头中的 <code>Authorization</code> 信息</span>
      </div>
      <div class="usage-notes__item">
        <span class="usage-notes__index">3</span>
        <span>Responses API 需关联平台开启 <code>support_responses_api</code> 配置，支持创建、查询、删除及取消响应</span>
      </div>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import { is804Env, ServerIp } from '@/config'
import { ApplicationItem } from './type'

const props = defineProps<{
  open: boolean
  currentApp?: ApplicationItem | null
}>()

const { open } = toRefs(props)

const list = computed(() => {
  if (!props.currentApp) return []
  return [
    {
      mode: '无think标签',
      baseUrl: `http://${ServerIp}:8020/${props.currentApp.app_key}/v1`,
      url: '/chat/completions',
      description: '常规openai api规范请求'
    },
    {
      mode: '有think标签',
      baseUrl: `http://${ServerIp}:8020/thinkTag/${props.currentApp.app_key}/v1`,
      url: '/chat/completions',
      description: '思考过程会使用<think>标签包裹（旧版DeepSeek思考过程规范）'
    },
    // {
    //   mode: '无think标签',
    //   baseUrl: `http://${ServerIp}:8020`,
    //   url: `/v1/chat/completions`,
    //   description: '需要在body添加 app_key 参数'
    // },
    // {
    //   mode: '有think标签',
    //   baseUrl: `http://${ServerIp}:8020/thinkTag`,
    //   url: `/v1/chat/completions`,
    //   description: '需要在body添加 app_key 参数'
    // },
    {
      mode: 'Embeddings',
      baseUrl: `http://${ServerIp}:8020/${props.currentApp.app_key}/v1`,
      url: '/embeddings',
      description: 'OpenAI Embeddings API 兼容接口，支持文本向量化'
    },
    {
      mode: 'Responses API',
      baseUrl: `http://${ServerIp}:8020/${props.currentApp.app_key}/v1`,
      url: '/responses',
      description: 'OpenAI Responses API 兼容接口，支持创建、查询、删除及取消响应'
    },
    {
      mode: 'anthropic',
      baseUrl: `http://${ServerIp}:8020/${props.currentApp.app_key}/anthropic/v1`,
      url: '/messages',
      description: 'anthropic api规范请求'
    },
    {
      mode: 'Rerank',
      baseUrl: `http://${ServerIp}:8020/${props.currentApp.app_key}/v1`,
      url: '/rerank',
      description: 'Rerank API 兼容接口，支持文档重排序'
    }
  ]
})
const emit = defineEmits(['update:open', 'success'])
function cancel() {
  emit('update:open', false)
}

function copyUrl(url: string) {
  if (!url) return
  const input = document.createElement('input')
  input.value = url
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
  ElMessage.success('复制成功')
}
</script>

<style lang="scss" scoped>
.usage-notes {
  margin-top: 16px;
  padding: 16px 20px;
  background: var(--el-fill-color-light);
  border-left: 3px solid var(--el-color-primary);
  border-radius: 6px;

  &__title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    font-size: 14px;
    color: var(--el-text-color-primary);
    margin-bottom: 10px;
  }

  &__item {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-size: 13px;
    color: var(--el-text-color-regular);
    line-height: 1.8;

    & + & {
      margin-top: 4px;
    }
  }

  &__index {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
    border-radius: 50%;
  }

  code {
    padding: 1px 6px;
    font-size: 12px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
    border-radius: 3px;
  }
}
</style>
