<template>
  <el-dialog v-model="open" title="批量上传模型" width="600px">
    <div class="flex flex-col gap-2">
      <div class="text-[16px] text-[#333] font-bold">
        <span>上传前请先</span>
        <span class="text-[#409EFF] cursor-pointer" @click="downloadTemplate">下载模板</span>
        <span>，并按说明填写</span>
      </div>
      <el-upload
        ref="uploadRef"
        drag
        accept=".xlsx, .xls"
        class="upload-demo"
        :auto-upload="false"
        :limit="1"
        :on-change="handleFileChange"
        :file-list="fileList"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">仅允许导入xls、xlsx格式文件。</div>
        </template>
      </el-upload>
    </div>
    <template #footer>
      <el-button type="primary" :loading="uploading" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import type { UploadInstance, UploadFile } from 'element-plus'
import dayjs from 'dayjs'
import { saveAs } from 'file-saver'
import { modelManagement } from '@/services'

const uploadRef = ref<UploadInstance>()
const uploading = ref(false)
const fileList = ref<UploadFile[]>([])
const selectedFile = ref<File | null>(null)

const props = defineProps<{ open: boolean }>()
const { open } = toRefs(props)

const emit = defineEmits(['update:open', 'success'])

async function downloadTemplate() {
  try {
    const response = await modelManagement.getModelsTemplate()

    saveAs(response, `模型导入模板_${dayjs().format('YYYY-MM-DD')}.xlsx`)

    ElMessage.success('模板下载成功')
  } catch (error) {
    console.error(error)
    ElMessage.error('模板下载失败')
  }
}

function handleFileChange(file: UploadFile) {
  selectedFile.value = file.raw || null
}

async function submitForm() {
  if (!selectedFile.value) {
    ElMessage.warning('请选择要上传的文件')
    return
  }

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const [err, response] = await modelManagement.postModelsImport(formData)
    if (err) {
      ElMessage.error('导入失败')
      return
    }

    const { total, success, failed = 0, errors } = response ?? {}
    let message = `导入完成！总计：${total}，成功：${success}`
    if (failed > 0) {
      message += `，失败：${failed}`
      if (errors && errors.length > 0) {
        message += `，错误：${errors.join('、')}`
      }
    }
    ElMessage.success(message)
    emit('success')
  } catch (error) {
    console.error(error)
    ElMessage.error('导入失败')
  } finally {
    uploading.value = false
  }
}

function cancel() {
  emit('update:open', false)
}

watch(open, val => {
  if (!val) {
    uploadRef.value?.clearFiles()
    fileList.value = []
    selectedFile.value = null
  }
})
</script>
