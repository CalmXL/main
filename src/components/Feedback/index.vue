<template>
  <el-dialog v-model="visible" title="意见反馈" width="720px" append-to-body destroy-on-close class="feedback-dialog">
    <el-form ref="feedbackFormRef" :model="form" :rules="rules" label-position="top" class="feedback-form">
      <div class="form-card">
        <el-form-item label="反馈标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题，简要说明问题" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="反馈类型" prop="feedType">
          <el-radio-group v-model="form.feedType">
            <el-radio value="0">问题</el-radio>
            <el-radio value="1">优化建议</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="期望解决时间" prop="expectedTime">
          <el-date-picker
            v-model="form.expectedTime"
            type="date"
            placeholder="请选择期望解决时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="反馈内容" prop="content">
          <VditorEditor v-model="form.content" :height="200" placeholder="请详细描述您遇到的问题或改进建议..." />
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <div>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="submitFeedback">提交反馈</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import VditorEditor from '@/components/VditorEditor/index.vue'
import { feedback } from '@/services/feedback/feedback'

const visible = defineModel<boolean>()

const loading = ref(false)
const feedbackFormRef = ref()

const form = reactive({
  title: '',
  content: '',
  feedType: '0',
  expectedTime: ''
})

const rules = {
  title: [
    { required: true, message: '请输入反馈标题', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入反馈内容', trigger: 'blur' },
    { min: 5, message: '内容最少 5 个字符', trigger: 'blur' }
  ],
  feedType: [{ required: true, message: '请选择反馈类型', trigger: 'change' }]
}

const submitFeedback = async () => {
  if (!feedbackFormRef.value) return
  await feedbackFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        const { title, content, feedType, expectedTime } = form
        const [err] = await feedback.postAddFeed({
          feedTitle: title,
          feedContent: content,
          feedType,
          expectedTime: expectedTime ? `${expectedTime} 23:59:59` : undefined
        })
        if (err) return
        ElMessage({ message: '提交成功！感谢您的反馈。', type: 'success', duration: 2000 })
        visible.value = false
        form.title = ''
        form.content = ''
        form.feedType = '0'
        form.expectedTime = ''
      } catch (error) {
        console.error(error)
        ElMessage.error('提交失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped lang="scss">
:deep(.feedback-dialog) {
  .el-dialog__header {
    padding: 20px 24px 16px;
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
    padding: 16px 24px 20px;
    border-top: 1px solid var(--el-border-color-lighter);
  }
}

.form-card {
  background: var(--el-fill-color-lighter);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--el-border-color-lighter);
}

.feedback-form {
  :deep(.el-form-item) {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
    padding-bottom: 8px;
  }
}
</style>
