<script setup lang="ts">
import { useFormItem } from 'element-plus'
import Vditor from 'vditor'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { CDN_URL, is804Env, isProd } from '@/config'
import { getToken } from '@/utils/auth'
import 'vditor/dist/index.css'

// import { useAppStore } from '@/stores/app'

// 定义文件上传返回的类型
interface UploadResult {
  file_name?: string
  url?: string
}

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  height?: number | string
  mode?: 'sv' | 'ir' | 'wysiwyg'
  theme?: 'classic' | 'dark'
  toolbar?: any[]
  hideToolbar?: boolean
  cache?: {
    enable?: boolean
    id?: string
  }
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'blur'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入内容...',
  height: 200,
  mode: 'ir',
  theme: 'classic',
  hideToolbar: false,
  cache: () => ({
    enable: false
  })
})

const emit = defineEmits<Emits>()

const disabled = computed(() => props.disabled)

const { formItem } = useFormItem()

// 计算校验错误状态
const hasError = computed(() => formItem?.validateState === 'error')

const disabledTimer = ref<ReturnType<typeof setTimeout>>()
const vditorRef = ref<HTMLElement>()
// 使用 WeakMap 来管理实例，避免内存泄漏
const vditorWeakMap = new WeakMap<HTMLElement, Vditor>()

// 默认工具栏配置
const defaultToolbar = [
  'headings',
  'bold',
  'italic',
  'strike',
  'link',
  '|',
  'check',
  'outdent',
  'indent',
  '|',
  'quote',
  'line',
  'table',
  'upload'
]

// 获取 Vditor 实例的辅助函数
function getVditorInstance(): Vditor | null {
  if (!vditorRef.value) return null
  return vditorWeakMap.get(vditorRef.value) || null
}

// 文件上传处理函数
async function uploadHandler(files: File[]): Promise<UploadResult[]> {
  try {
    const file = files[0]
    if (!file) {
      return []
    }

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${import.meta.env.VITE_APP_BASE_API}/common/upload/minio`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
      body: formData
    })

    const data = await response.json()

    if (data.code === 200 && data.webNgUrl) {
      return [{ file_name: data.fileName, url: `${location.origin}${data.webNgUrl}` }]
    }

    return []
  } catch (error) {
    console.error('Upload failed:', error)
    throw error
  }
}

function setDisabled(val: boolean) {
  clearTimeout(disabledTimer.value)

  disabledTimer.value = setTimeout(async () => {
    await nextTick()
    const instance = getVditorInstance()

    try {
      if (val) {
        instance?.disabled()
      } else {
        instance?.enable()
      }
    } catch (err) {
      console.error(err)
    }
  }, 200)
}

// 初始化 Vditor
onMounted(() => {
  if (!vditorRef.value) return

  const vditorInstance = new Vditor(vditorRef.value, {
    width: '100%',
    height: props.height,
    mode: props.mode,
    theme: props.theme,
    // debugger: !isProd,
    placeholder: props.placeholder,
    toolbar: props.toolbar || defaultToolbar,
    cache: props.cache,
    value: props.modelValue || '',
    cdn: !isProd ? '/vditor' : `${CDN_URL}/vditor@3.11.2`,
    // 上传配置
    upload: {
      accept: 'image/*, video/*, .pdf, .doc, .docx, .xls, .xlsx, .txt, .zip, .rar',
      url: '/system/upload', // 这个会被自定义上传函数覆盖
      linkToImgUrl: '', // 图片链接转图片上传的接口
      filename: (name: string) => name.replace(/[^a-z0-9\u4E00-\u9FA5.]/gi, ''),
      handler: async (files: File[]) => {
        const result = await uploadHandler(files)

        // return result.map(item => item.url || '').join('\n')

        if (vditorInstance && result.length > 0) {
          const imgText = result.map(item => `![${item.file_name}](${item.url})`).join('\n')
          vditorInstance.insertValue(imgText)
        }
        return null
      },
      // 文件大小限制，默认 10MB
      max: 10 * 1024 * 1024,
      // 是否上传后自动插入
      success: (_element: HTMLElement, msg: string) => {
        console.log('Upload success:', msg)
      },
      error: (msg: string) => {
        console.error('Upload error:', msg)
      }
    },
    input: (value: string) => {
      emit('update:modelValue', value)
      emit('change', value)
      formItem?.validate?.('change')
    },
    blur: () => {
      formItem?.validate?.('blur')
    },
    after: () => {
      // 确保值正确设置
      const instance = getVditorInstance()
      if (props.modelValue && instance && instance.getValue() !== props.modelValue) {
        instance.setValue(props.modelValue)
      }
    }
  })

  // 将实例存储到 WeakMap
  vditorWeakMap.set(vditorRef.value, vditorInstance)
})

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  newValue => {
    try {
      const instance = getVditorInstance()
      if (instance && typeof instance.getValue === 'function' && instance.getValue() !== newValue) {
        instance.setValue(newValue || '')
      }
    } catch (error) {
      console.error('Vditor setValue error:', error)
    }
  }
)

// // 监听主题变化
// watch(
//   () => appStore.isDark,
//   newIsDark => {
//     const instance = getVditorInstance()
//     if (instance) {
//       instance.setTheme(newIsDark ? 'dark' : 'classic')
//     }
//   }
// )

// 销毁编辑器
onBeforeUnmount(() => {
  if (vditorRef.value) {
    const instance = getVditorInstance()
    if (instance) {
      try {
        instance.destroy()
      } catch (error) {
        console.warn('Vditor destroy error:', error)
      } finally {
        // 从 WeakMap 中删除
        vditorWeakMap.delete(vditorRef.value)
      }
    }
  }
})

// 暴露方法给父组件
defineExpose({
  getVditor: getVditorInstance,
  getValue: () => getVditorInstance()?.getValue() || '',
  setValue: (value: string) => getVditorInstance()?.setValue(value),
  insertValue: (value: string, render = true) => getVditorInstance()?.insertValue(value, render),
  focus: () => getVditorInstance()?.focus(),
  blur: () => getVditorInstance()?.blur(),
  disabled: () => getVditorInstance()?.disabled(),
  enable: () => getVditorInstance()?.enable()
})

watch(disabled, setDisabled, { immediate: true })
</script>

<template>
  <div
    class="relative w-full"
    :class="{
      inputMode: hideToolbar,
      'is-error': hasError,
      'vditor-error': hasError,
      disabled: props.disabled
    }"
  >
    <div ref="vditorRef" class="vditor-editor" :style="{ minHeight: `${props.height}px` }" />
  </div>
</template>

<style scoped lang="scss">
.inputMode {
  :deep(.vditor-toolbar) {
    display: none;
  }
}

.disabled {
  :deep(.vditor-toolbar) {
    display: none;
  }

  .vditor-editor {
    :deep(.vditor-reset) {
      opacity: 1 !important;
      background-color: var(--el-fill-color-light) !important;
    }
  }
}

// 错误状态
.is-error,
.vditor-error {
  .vditor-editor {
    border-color: var(--el-color-danger) !important;

    &:focus-within {
      border-color: var(--el-color-danger) !important;
      box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2);
    }
  }
}

.vditor-editor {
  overflow: hidden;
  border-radius: var(--el-border-radius-base);
  border: 1px solid var(--el-border-color-light);
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--el-border-color-hover);
  }

  &:focus-within {
    border-color: var(--el-color-primary);
  }

  :deep(.vditor-reset) {
    padding: 10px !important;
    background-color: var(--el-input-bg-color, var(--el-fill-color-blank)) !important;

    p {
      margin-bottom: 0 !important;
    }

    ul,
    ol {
      padding-left: 18px;
    }
  }

  :deep(.vditor-toolbar) {
    padding-left: 10px !important;
    background-color: var(--el-bg-color) !important;
    border-bottom-color: var(--el-border-color) !important;
  }

  :deep(.vditor) {
    border: none;
    border-radius: 0;
  }
}
</style>

<style lang="scss">
// 暗黑主题适配
.dark {
  .vditor-reset {
    color: var(--el-text-color-primary) !important;
    background-color: var(--el-bg-color) !important;

    &:empty {
      &::before {
        color: var(--el-text-color-placeholder) !important;
      }
    }
  }

  .vditor-editor {
    border-color: var(--el-border-color) !important;

    &:hover {
      border-color: var(--el-border-color-hover) !important;
    }

    &:focus-within {
      border-color: var(--el-color-primary) !important;
    }

    .vditor-toolbar {
      background-color: var(--el-bg-color) !important;
      border-bottom-color: var(--el-border-color) !important;
    }

    .vditor-tooltipped {
      color: var(--el-text-color-regular) !important;
      &.vditor-menu--disabled {
        color: var(--el-text-color-disabled) !important;
      }

      // background-color: var(--el-bg-color);
      // border-color: var(--el-border-color);
    }
  }
  .is-error,
  .vditor-error {
    .vditor-editor {
      border-color: var(--el-color-danger) !important;

      &:focus-within {
        box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2);
      }
    }
  }
}
</style>
