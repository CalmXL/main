<template>
  <el-dialog v-model="dialogVisible" title="反馈详情" width="700px" class="feedback-detail-dialog" append-to-body destroy-on-close>
    <div v-loading="loading" class="detail-content">
      <!-- 状态头部 -->
      <div class="status-header" :class="statusClass">
        <div class="status-icon">
          <el-icon size="24">
            <CircleCheck v-if="detail.feedStatus === 'processed'" />
            <CircleClose v-else-if="detail.feedStatus === 'ignored'" />
            <Warning v-else />
          </el-icon>
        </div>
        <div class="status-info">
          <div class="status-title">{{ statusText }}</div>
          <div class="status-desc">{{ statusDesc }}</div>
        </div>
      </div>

      <!-- 基本信息卡片 -->
      <div class="detail-card info-card">
        <div class="card-header">
          <div class="header-icon user-icon">
            <el-icon><User /></el-icon>
          </div>
          <span class="card-title">基本信息</span>
        </div>
        <div class="card-body">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">
                <el-icon><Avatar /></el-icon>
                反馈人
              </div>
              <div class="info-value">{{ detail.feedUserName || '匿名用户' }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">
                <el-icon><Clock /></el-icon>
                反馈时间
              </div>
              <div class="info-value time">{{ formatDate(detail.gmtCreate) }}</div>
            </div>
            <div v-if="detail.expectedTime" class="info-item">
              <div class="info-label">
                <el-icon><Timer /></el-icon>
                期望解决时间
              </div>
              <div class="info-value time">{{ formatDate(detail.expectedTime) }}</div>
            </div>
            <div v-if="detail.planTime" class="info-item">
              <div class="info-label">
                <el-icon><AlarmClock /></el-icon>
                计划解决时间
              </div>
              <div class="info-value time">{{ formatDate(detail.planTime) }}</div>
            </div>
            <div v-if="detail.backTime" class="info-item">
              <div class="info-label">
                <el-icon><CircleCheck /></el-icon>
                实际解决时间
              </div>
              <div class="info-value time">{{ formatDate(detail.backTime) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 反馈内容卡片 -->
      <div class="detail-card content-card">
        <div class="card-header">
          <div class="header-icon content-icon">
            <el-icon><Document /></el-icon>
          </div>
          <span class="card-title">反馈内容</span>
        </div>
        <div class="card-body">
          <div class="content-section">
            <div class="content-label">标题</div>
            <div class="content-title">{{ detail.feedTitle }}</div>
          </div>
          <div class="content-section">
            <div class="content-label">详细描述</div>
            <VditorReview :model-value="detail.feedContent" />
          </div>
          <div v-if="detail.fileList && detail.fileList.length > 0" class="content-section">
            <div class="content-label">图片附件</div>
            <div class="image-gallery">
              <div
                v-for="(img, index) in detail.fileList"
                :key="index"
                class="image-wrapper"
                @click="
                  showImagePreview(
                    detail.fileList.map(item => item.fileUrl),
                    index
                  )
                "
              >
                <el-image :src="img.fileUrl" fit="cover" class="detail-image" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 处理信息卡片（如果有回复内容） -->
      <div v-if="detail.backContent" class="detail-card reply-card">
        <div class="card-header">
          <div class="header-icon reply-icon">
            <el-icon><ChatDotRound /></el-icon>
          </div>
          <span class="card-title">解决方案</span>
        </div>
        <div class="card-body">
          <VditorReview :model-value="detail.backContent" />
          <div v-if="detail.backTime" class="reply-time">
            <el-icon><Timer /></el-icon>
            回复于 {{ formatDate(detail.backTime) }}
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
  <el-image-viewer v-if="showPreview" :url-list="srcList" show-progress :initial-index="initialIndex" @close="showPreview = false" />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { CircleCheck, CircleClose, Warning, User, Avatar, Clock, Document, ChatDotRound, Timer, AlarmClock } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import VditorReview from '@/components/VditorEditor/Review.vue'
import { FeedbackItem } from './types'
import { feedback } from '@/services/feedback/feedback'

const props = defineProps<{ modelValue: boolean; id?: string | null }>()

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

const loading = ref(false)
const detail = ref<FeedbackItem>({} as FeedbackItem)
const showPreview = ref(false)
const srcList = ref<string[]>([])
const initialIndex = ref(0)

const statusText = computed(() => {
  const statusMap: Record<string, string> = {
    0: '未处理',
    1: '已处理',
    2: '不处理',
    3: '处理中'
  }
  return statusMap[detail.value.feedStatus] || '未知状态'
})

const statusDesc = computed(() => {
  const descMap: Record<string, string> = {
    pending: '该反馈正在等待处理',
    processed: '该反馈已处理完成',
    ignored: '该反馈已被标记为不处理'
  }
  return descMap[detail.value.feedStatus] || ''
})

const statusClass = computed(() => {
  const classMap: Record<string, string> = {
    pending: 'status-pending',
    processed: 'status-processed',
    ignored: 'status-ignored'
  }
  return classMap[detail.value.feedStatus] || 'status-default'
})

function formatDate(date: string) {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}
const showImagePreview = (list: string[], index: number) => {
  showPreview.value = true
  srcList.value = list
  initialIndex.value = index
}

async function fetchDetail() {
  if (!props.id) {
    detail.value = {} as FeedbackItem
    return
  }
  loading.value = true
  try {
    const [err, data] = await feedback.getById(props.id)
    if (err) {
      ElMessage.error(err.message || '获取详情失败')
      return
    }
    detail.value = data as FeedbackItem
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
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
:deep(.feedback-detail-dialog) {
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

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

// 状态头部
.status-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-radius: 12px;
  transition: all 0.3s ease;

  &.status-pending {
    background: linear-gradient(135deg, #fdf6ec 0%, #f5f0e6 100%);
    border: 1px solid #f5dab1;

    .status-icon {
      background: linear-gradient(135deg, #e6a23c 0%, #eebe77 100%);
    }

    .status-title {
      color: #b88230;
    }
  }

  &.status-processed {
    background: linear-gradient(135deg, #f0f9eb 0%, #e6f2dc 100%);
    border: 1px solid #b3e19d;

    .status-icon {
      background: linear-gradient(135deg, #67c23a 0%, #95d475 100%);
    }

    .status-title {
      color: #529b2e;
    }
  }

  &.status-ignored {
    background: linear-gradient(135deg, #f4f4f5 0%, #e9e9eb 100%);
    border: 1px solid #c8c9cc;

    .status-icon {
      background: linear-gradient(135deg, #909399 0%, #a8abb2 100%);
    }

    .status-title {
      color: #606266;
    }
  }

  &.status-default {
    background: var(--el-fill-color-light);
    border: 1px solid var(--el-border-color);

    .status-icon {
      background: var(--el-color-info);
    }
  }
}

.status-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.status-info {
  flex: 1;
}

.status-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.status-desc {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

// 详情卡片
.detail-card {
  background: var(--el-fill-color-light);
  border-radius: 12px;
  border: 1px solid var(--el-border-color-lighter);
  overflow: hidden;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  &.info-card {
    background: linear-gradient(135deg, #ecf5ff 0%, #f5f7fa 100%);
  }

  &.content-card {
    background: var(--el-bg-color);
  }

  &.reply-card {
    background: linear-gradient(135deg, #f0f9ff 0%, #e6f4ff 100%);
    border-color: #b3d8ff;
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
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

  &.user-icon {
    background: linear-gradient(135deg, #409eff 0%, #79bbff 100%);
  }

  &.content-icon {
    background: linear-gradient(135deg, #67c23a 0%, #95d475 100%);
  }

  &.reply-icon {
    background: linear-gradient(135deg, #409eff 0%, #53a8ff 100%);
  }
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.card-body {
  padding: 16px 20px;
}

// 信息网格
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--el-text-color-secondary);

  .el-icon {
    font-size: 14px;
  }
}

.info-value {
  font-size: 14px;
  color: var(--el-text-color-primary);
  font-weight: 500;
  padding: 8px 12px;
  background: var(--el-bg-color);
  border-radius: 6px;
  border: 1px solid var(--el-border-color-lighter);

  &.time {
    font-size: 13px;
    color: var(--el-text-color-regular);
    font-weight: normal;
  }
}

// 内容区域
.content-section {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.content-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
  font-weight: 500;
}

.content-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  padding: 12px 16px;
  background: var(--el-color-primary-light-9);
  border-radius: 8px;
  // border-left: 4px solid var(--el-color-primary);
}

.content-body {
  font-size: 14px;
  line-height: 1.8;
  color: var(--el-text-color-regular);
  padding: 16px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  white-space: pre-wrap;
  word-break: break-word;
  min-height: 80px;
}

// 图片画廊
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

.detail-image {
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

// 回复内容
.reply-content {
  font-size: 14px;
  line-height: 1.8;
  color: var(--el-text-color-primary);
  padding: 16px;
  background: var(--el-bg-color);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
  margin-bottom: 12px;
  white-space: pre-wrap;
  word-break: break-word;
}

.reply-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--el-text-color-secondary);

  .el-icon {
    font-size: 14px;
  }
}

// 底部按钮
.dialog-footer {
  display: flex;
  justify-content: flex-end;

  .el-button {
    padding: 0 24px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
}
</style>
