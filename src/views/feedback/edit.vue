<template>
  <el-dialog v-model="dialogVisible" title="编辑反馈" width="700px" class="feedback-edit-dialog" append-to-body destroy-on-close>
    <el-form v-loading="loading" :model="form" label-position="top">
      <!-- 反馈内容卡片 -->
      <div class="section-card content-section">
        <div class="section-header">
          <div class="header-icon content-icon">
            <el-icon><Document /></el-icon>
          </div>
          <span class="section-title">反馈内容</span>
        </div>
        <div class="section-content">
          <el-form-item label="标题">
            <div class="display-value title-value w-full">{{ form.feedTitle }}</div>
          </el-form-item>
          <el-form-item label="详细内容">
            <VditorReview :model-value="form.feedContent" />
          </el-form-item>
          <el-form-item v-if="form.fileList && form.fileList.length > 0" label="图片附件">
            <div class="image-gallery">
              <div
                v-for="(img, index) in form.fileList"
                :key="index"
                class="image-wrapper"
                @click="
                  showImagePreview(
                    form.fileList.map(item => item.fileUrl),
                    index
                  )
                "
              >
                <el-image :src="img.fileUrl" fit="cover" class="feedback-image" />
                <div class="image-overlay">
                  <el-icon><ZoomIn /></el-icon>
                </div>
              </div>
            </div>
          </el-form-item>
        </div>
      </div>

      <!-- 处理操作卡片 -->
      <div class="section-card action-section">
        <div class="section-header">
          <div class="header-icon action-icon">
            <el-icon><EditPen /></el-icon>
          </div>
          <span class="section-title">处理操作</span>
        </div>
        <div class="section-content">
          <el-form-item label="状态" required class="!w-full">
            <el-select v-model="form.feedStatus" placeholder="请选择处理状态" class="!w-full">
              <el-option label="未处理" value="0">
                <div class="status-option">
                  <span class="status-dot pending" />
                  <span>未处理</span>
                </div>
              </el-option>
              <el-option label="处理中" value="3">
                <div class="status-option">
                  <span class="status-dot primary" />
                  <span>处理中</span>
                </div>
              </el-option>
              <el-option label="已处理" value="1">
                <div class="status-option">
                  <span class="status-dot processed" />
                  <span>已处理</span>
                </div>
              </el-option>
              <el-option label="不处理" value="2">
                <div class="status-option">
                  <span class="status-dot ignored" />
                  <span>不处理</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.feedStatus === '3'" label="计划解决时间" required class="!w-full">
            <el-date-picker
              v-model="form.planTime"
              type="datetime"
              placeholder="请选择计划解决时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss"
              class="!w-full"
            />
          </el-form-item>
          <el-form-item v-if="form.feedStatus === '1'" label="实际解决时间" required class="!w-full">
            <el-date-picker
              v-model="form.backTime"
              type="date"
              placeholder="请选择实际解决时间"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD HH:mm:ss"
              class="!w-full"
            />
          </el-form-item>
          <el-form-item v-if="form.feedStatus === '1'" label="解决方案" required class="!w-full">
            <el-input
              v-model="form.backContent"
              type="textarea"
              :rows="4"
              placeholder="请输入回复内容，给用户反馈处理结果（可选）"
              maxlength="500"
              show-word-limit
              class="reply-textarea"
            />
          </el-form-item>
        </div>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存修改</el-button>
      </div>
    </template>
  </el-dialog>
  <el-image-viewer v-if="showPreview" :url-list="srcList" show-progress :initial-index="initialIndex" @close="showPreview = false" />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, EditPen, ZoomIn } from '@element-plus/icons-vue'
import VditorReview from '@/components/VditorEditor/Review.vue'
import { FeedbackItem } from './types'
import { feedback } from '@/services/feedback/feedback'

const props = defineProps<{
  modelValue: boolean
  id?: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: []
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

const loading = ref(false)
const saving = ref(false)
const form = ref<FeedbackItem & { backContent?: string; planTime?: string; backTime?: string }>({} as FeedbackItem & { backContent?: string; planTime?: string; backTime?: string })
const showPreview = ref(false)
const srcList = ref<string[]>([])
const initialIndex = ref(0)

const showImagePreview = (list: string[], index: number) => {
  showPreview.value = true
  srcList.value = list
  initialIndex.value = index
}

async function fetchDetail() {
  if (!props.id) {
    form.value = {} as FeedbackItem & { backContent?: string; planTime?: string; backTime?: string }
    return
  }
  loading.value = true
  try {
    const [err, data] = await feedback.getById(props.id)
    if (err) {
      ElMessage.error(err.message || '获取详情失败')
      return
    }

    // if (data.feedStatus === '0') {
    //   data.feedStatus = 'pending'
    // } else if (data.feedStatus === '1') {
    //   data.feedStatus = 'processed'
    // } else if (data.feedStatus === '2') {
    //   data.feedStatus = 'ignored'
    // }
    form.value = { ...(data as FeedbackItem), backContent: '' }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  if (!props.id) return

  saving.value = true
  try {
    const [err] = await feedback.postUpdBack({
      id: props.id,
      feedStatus: form.value.feedStatus,
      backContent: form.value.backContent,
      planTime: form.value.planTime,
      backTime: form.value.backTime
    })
    if (err) {
      ElMessage.error(err.message || '保存失败')
      return
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    emit('success')
  } catch (error) {
    console.error(error)
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

watch(
  () => props.id,
  newId => {
    if (newId && props.modelValue) {
      fetchDetail()
    }
  },
  { immediate: true }
)

watch(
  () => props.modelValue,
  visible => {
    if (visible && props.id) {
      fetchDetail()
    }
  }
)
</script>

<style scoped lang="scss">
:deep(.feedback-edit-dialog) {
  .el-dialog__header {
    padding: 24px 24px 16px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    margin-right: 0;

    .el-dialog__title {
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .el-dialog__body {
    padding: 20px 24px;
  }

  .el-dialog__footer {
    padding: 16px 24px 24px;
    border-top: 1px solid var(--el-border-color-lighter);
  }
}

.section-card {
  background: var(--el-fill-color-light);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid var(--el-border-color-lighter);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  &.info-section {
    background: linear-gradient(135deg, var(--el-color-primary-light-9) 0%, var(--el-fill-color-light) 100%);
  }

  &.content-section {
    background: var(--el-bg-color);
  }

  &.action-section {
    background: linear-gradient(135deg, var(--el-color-warning-light-9) 0%, var(--el-fill-color-light) 100%);
  }
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px dashed var(--el-border-color);
}

.header-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;

  &.info-icon {
    background: linear-gradient(135deg, #409eff 0%, #79bbff 100%);
  }

  &.content-icon {
    background: linear-gradient(135deg, #67c23a 0%, #95d475 100%);
  }

  &.action-icon {
    background: linear-gradient(135deg, #e6a23c 0%, #eebe77 100%);
  }
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.section-content {
  :deep(.el-form-item) {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }

    .el-form-item__label {
      font-weight: 500;
      color: var(--el-text-color-regular);
      padding-bottom: 4px;
    }
  }
}

.display-value {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--el-bg-color);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
  font-size: 14px;
  color: var(--el-text-color-primary);
  min-height: 40px;

  .user-icon,
  .time-icon {
    font-size: 16px;
    color: var(--el-color-primary);
  }
}

.user-name {
  font-weight: 500;
}

.time-value {
  color: var(--el-text-color-regular);
  font-size: 13px;
}

.title-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary-light-5);
}

.content-box {
  padding: 16px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
  font-size: 14px;
  line-height: 1.8;
  color: var(--el-text-color-regular);
  white-space: pre-wrap;
  word-break: break-word;
  min-height: 80px;
}

.image-gallery {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.image-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

    .image-overlay {
      opacity: 1;
    }
  }
}

.feedback-image {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  .el-icon {
    font-size: 28px;
    color: #fff;
  }
}

.status-select {
  width: 100%;
}

.status-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;

  &.pending {
    background: var(--el-color-warning);
  }

  &.primary {
    background: var(--el-color-primary);
  }

  &.processed {
    background: var(--el-color-success);
  }

  &.ignored {
    background: var(--el-color-info);
  }
}

.reply-textarea {
  :deep(.el-textarea__inner) {
    border-radius: 8px;
    padding: 12px;
    line-height: 1.6;
    resize: none;

    &:focus {
      box-shadow: 0 0 0 2px var(--el-color-warning-light-7);
    }
  }
}
</style>
