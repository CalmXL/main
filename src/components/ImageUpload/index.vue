<template>
  <div class="component-upload-image">
    <!-- 上传提示 -->
    <div v-if="showTip" class="el-upload__tip mb10">
      支持
      <template v-if="fileType">
        <b style="color: #f56c6c">{{ fileType.join('/') }}</b>
      </template>
      <slot name="tip">
        最大不超过
        <b style="color: #f56c6c">{{ fileSize }}{{ unit }}</b>
        建议:不低于500像素 比例1:1.4
      </slot>
    </div>
    <el-upload
      ref="imageUpload"
      multiple
      :accept="acceptType"
      :action="uploadImgUrl"
      list-type="picture-card"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :show-file-list="true"
      :headers="headers"
      :file-list="fileList"
      :class="{ hide: fileList.length >= limit }"
      drag
    >
      <template #file="{ file }">
        <img v-if="type === 1" :src="file.url" alt="" class="el-upload-list__item-thumbnail" />
        <video v-else class="el-upload-list__item-thumbnail" style="width: 100%; height: 100%" :src="file.url">
          <source :src="file.url" type="video/mp4" />
          <source :src="file.url" type="video/mov" />
          <source :src="file.url" type="video/avi" />
        </video>
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <el-icon><zoom-in /></el-icon>
          </span>
          <span v-if="!disabledBtn" class="el-upload-list__item-delete" @click="handleDelete(file)">
            <el-icon>
              <Delete />
            </el-icon>
          </span>
        </span>
      </template>
      <div class="el-upload__text">
        <div>
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        </div>
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
    </el-upload>
    <el-dialog
      v-model="dialogVisible"
      style="max-height: 800px"
      title="预览"
      width="800px"
      append-to-body
      @close="handleDialog"
    >
      <img v-if="type === 1" :src="dialogImageUrl" style="display: block; max-width: 100%; margin: 0 auto" />
      <video
        v-else
        w-full
        style="width: auto; height: auto; max-height: 600px; margin: 0 auto; display: block"
        controls
        autoplay
        :src="dialogImageUrl"
      >
        <source :src="dialogImageUrl" type="video/mp4" />
        <source :src="dialogImageUrl" type="video/mov" />
        <source :src="dialogImageUrl" type="video/avi" />
      </video>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, ComponentInternalInstance, ref, computed, watch } from 'vue'
import { getToken } from '@/utils/auth'

const props = defineProps({
  modelValue: [String, Object, Array],
  // 图片数量限制
  limit: {
    type: Number,
    default: 5
  },
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 5
  },
  unit: {
    type: String,
    default: 'MB'
  },
  // 文件类型, 例如['png', 'jpg', 'jpeg']
  fileType: {
    type: Array,
    default: () => ['png', 'jpg']
  },
  acceptType: {
    type: String,
    default: '.png,.jpg'
  },
  // 是否显示提示
  isShowTip: {
    type: Boolean,
    default: true
  },
  // 视频还是图片
  type: {
    type: Number,
    default: 1
  }
})

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const emit = defineEmits(['update:modelValue'])
const number = ref(0)
const uploadList = ref<any[]>([])
const dialogVisible = ref(false)
const baseUrl = import.meta.env.VITE_APP_BASE_API
const uploadImgUrl = ref(`${import.meta.env.VITE_APP_BASE_API}/common/upload`) // 上传的图片服务器地址
const headers = ref({ Authorization: `Bearer ${getToken()}` })
const fileList = ref<any[]>([])
const showTip = computed(() => props.isShowTip && (props.fileType || props.fileSize))
const disabledBtn = ref(false)
const dialogImageUrl = ref()
watch(
  () => props.modelValue,
  val => {
    if (val) {
      // 首先将值转为数组
      const list: any[] = Array.isArray(val) ? val : (props.modelValue as any).split(',')
      // 然后将数组转为对象数组
      fileList.value = list.map(item => {
        if (typeof item === 'string') {
          if (item.indexOf(baseUrl) === -1) {
            item = { name: baseUrl + item, url: baseUrl + item }
          } else {
            item = { name: item, url: item }
          }
        }
        return item
      })
    } else {
      fileList.value = []
      return []
    }
  },
  { deep: true, immediate: true }
)

// 上传前loading加载
function handleBeforeUpload(file: any) {
  let isImg = false
  if (props.fileType.length) {
    let fileExtension = ''
    if (file.name.lastIndexOf('.') > -1) {
      fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1)
    }
    isImg = props.fileType.some((type: any) => {
      if (file.type.indexOf(type) > -1) return true
      if (fileExtension && fileExtension.indexOf(type) > -1) return true
      return false
    })
  } else {
    isImg = file.type.indexOf('image') > -1
  }
  if (!isImg) {
    proxy!.$modal.msgError(`文件格式不正确, 请上传${props.fileType.join('/')}图片格式文件!`)
    return false
  }
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize
    if (!isLt) {
      proxy!.$modal.msgError(`上传头像图片大小不能超过 ${props.fileSize} MB!`)
      return false
    }
  }
  proxy!.$modal.loading('正在上传图片，请稍候...')
  number.value++
}

// 文件个数超出
function handleExceed() {
  proxy!.$modal.msgError(`上传文件数量不能超过 ${props.limit} 个!`)
}

// 上传成功回调
function handleUploadSuccess(res: any, file: any) {
  if (res.code === 200) {
    uploadList.value.push({ name: res.fileName, url: res.url })
    uploadedSuccessfully()
  } else {
    number.value--
    proxy!.$modal.closeLoading()
    proxy!.$modal
      .msgError(res.msg)(proxy!.$refs.imageUpload as any)
      .handleRemove(file)
    uploadedSuccessfully()
  }
}

// 删除图片
function handleDelete(file: any) {
  const findex = fileList.value.map(f => f.name).indexOf(file.name)
  if (findex > -1 && uploadList.value.length === number.value) {
    fileList.value.splice(findex, 1)
    emit('update:modelValue', listToString(fileList.value))
    return false
  }
}

// 上传结束处理
function uploadedSuccessfully() {
  if (number.value > 0 && uploadList.value.length === number.value) {
    fileList.value = fileList.value.filter(f => f.url !== undefined).concat(uploadList.value)
    uploadList.value = []
    number.value = 0
    emit('update:modelValue', listToString(fileList.value))
    proxy!.$modal.closeLoading()
  }
}

// 上传失败
function handleUploadError() {
  proxy!.$modal.msgError('上传图片失败')
  proxy!.$modal.closeLoading()
}

// 预览
function handlePictureCardPreview(file) {
  dialogVisible.value = true
  dialogImageUrl.value = file.url
  console.log(dialogImageUrl.value, 'dialogImageUrl.value')
}

// 关闭预览
function handleDialog() {
  dialogImageUrl.value = ''
}

// 对象转成指定字符串分隔
function listToString(list: any, separator?: any) {
  let strs = ''
  separator = separator || ','
  for (const i in list) {
    if (undefined !== list[i].url && list[i].url.indexOf('blob:') !== 0) {
      strs += list[i].url.replace(baseUrl, '') + separator
    }
  }
  return strs !== '' ? strs.substr(0, strs.length - 1) : ''
}
</script>

<style scoped lang="scss">
:deep(.el-upload__tip) {
  line-height: 20px;
}
:deep(.el-upload-dragger) {
  border: none;
}
:deep(.hide .el-upload--picture-card) {
  display: none;
}
:deep(.el-upload__text) {
  color: #606266;
  font-size: 14px;
  text-align: center;
  em {
    color: #409eff;
    font-style: normal;
  }
}
:deep(.el-icon) {
  font-size: 67px;
  color: rgba(0, 0, 0, 0.5);
  opacity: 0.6;
  margin-bottom: 16px;
}
:deep(.el-upload--picture-card),
:deep(.el-upload-list__item) {
  // width: 240px !important;
  height: 204px !important;
}
:deep(.hideUpload) {
  .el-upload--picture-card {
    display: none;
  }
}
:deep(.el-upload-list) {
  display: flex;
  justify-content: flex-start;
}
// ::v-deep .el-upload-list--picture-card{
//   flex-wrap: nowrap;
// }
</style>
