<template>
  <el-dialog
    v-model="visible"
    title="重置密码"
    width="400px"
    @close="onClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码" show-password />
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="onSubmit">确认重置</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: { type: Boolean, required: true }
})
const emit = defineEmits(['update:modelValue', 'submit'])

const visible = ref(props.modelValue)
watch(() => props.modelValue, val => (visible.value = val))
watch(visible, val => emit('update:modelValue', val))

const formRef = ref()
const form = reactive({
  newPassword: '',
  confirmPassword: ''
})

const rules = {
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 5, max: 20, message: '密码必须介于5-20位之间', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_, value) => {
        if (value !== form.newPassword) {
          return new Error('两次密码不一致')
        }
        return true
      },
      trigger: 'blur'
    }
  ]
}

const onClose = () => {
  visible.value = false
}

const onSubmit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      emit('submit', { password: form.confirmPassword })
      ElMessage.success('密码重置成功')
      onClose()
    }
  })
}
</script>

<style scoped>
</style>
