<template>
<el-dialog v-model="visible" title="分配共享用户" width="500px" :close-on-click-modal="false">
    <el-form v-loading="loading" label-width="80px">
      <el-form-item label="选择用户">
        <el-cascader
          v-model="selectedUsers"
          :options="deptTreeData"
          :props="cascaderProps"
          filterable
          clearable
          collapse-tags-tooltip
          :show-all-levels="false"
          placeholder="请选择用户（支持搜索）"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button :loading="saving" type="primary" @click="handleSave">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { queryDeptTreeUser } from '@/api/system/user'
import { getUsersByBsId, updateShareUsers } from '@/api/rag' 

// 定义 props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  roleId: {
    type: [Number, String],
    default: null
  }
})

// 定义 emits
const emit = defineEmits(['update:modelValue', 'success'])

// Cascader 配置
const cascaderProps = {
  multiple: true,
  label: 'label',
  value: 'id',
  children: 'children',
  emitPath: false
}

// 数据状态
const deptTreeData = ref<any[]>([])
const selectedUsers = ref<string[]>([])
const loading = ref(false)
const saving = ref(false)

// 控制显示
const visible = ref(false)

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  val => {
    visible.value = val
    if (val && props.roleId) {
      loadData()
      getUsers(props.roleId.toString())
    }
  },
  { immediate: true }
)

// 监听 visible 变化
watch(visible, val => {
  emit('update:modelValue', val)
})

/** 加载数据 */
async function loadData() {
  loading.value = true
  try {
    // 并行获取部门树
    const treeResult = await queryDeptTreeUser()

    deptTreeData.value = treeResult.data
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

/** 保存 */
async function handleSave() {
  if (saving.value) return

  try {
    saving.value = true

    emit('success', selectedUsers.value)
    updateUsers()
    handleClose()
  } catch (error) {
    console.error('保存失败:', error)
  } finally {
    saving.value = false
  }
}

/** 关闭 */
function handleClose() {
  visible.value = false
  selectedUsers.value = []
}



async function getUsers(bsId: string) {
  const res = await getUsersByBsId(bsId)
  selectedUsers.value = res.data.user_ids || []
}

async function updateUsers() {
  const res = await updateShareUsers(props.roleId.toString(), selectedUsers.value)
  if (res.code === 0) { 
    ElMessage.success('更新成功')
  } else {
    ElMessage.error(res.msg || '更新失败')
  }
}

</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>