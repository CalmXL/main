<template>
  <el-dialog v-model="visible" title="修改用户信息" width="500px" :close-on-click-modal="false" @closed="handleClose">
    <el-form ref="userRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户昵称" prop="nickName">
        <el-input v-model="form.nickName" maxlength="30" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phonenumber">
        <el-input v-model="form.phonenumber" maxlength="11" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" maxlength="50" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.sex">
          <el-radio label="0">男</el-radio>
          <el-radio label="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { updateUserProfile } from '@/api/system/user'
import useUserStore from '@/store/modules/user'

const visible = defineModel<boolean>({ default: false })

const userStore = useUserStore()
const userRef = ref()

const form = reactive({
  nickName: '',
  phonenumber: '',
  email: '',
  sex: '0'
})

const rules = ref({
  nickName: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
  email: [
    { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
    { type: 'email' as const, message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  phonenumber: [
    { required: true, message: '手机号码不能为空', trigger: 'blur' },
    { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
})

watch(visible, val => {
  if (val) {
    Object.assign(form, {
      nickName: userStore.nickName || '',
      phonenumber: userStore.phone || '',
      email: userStore.email || '',
      sex: '0'
    })
  }
})

function submit() {
  (userRef.value as any).validate((valid: boolean) => {
    if (valid) {
      updateUserProfile(form).then(() => {
        ElMessage.success('修改成功')
        visible.value = false
        userStore.getUserInfo()
      })
    }
  })
}

function handleClose() {
  visible.value = false
  userRef.value?.resetFields()
}
</script>
