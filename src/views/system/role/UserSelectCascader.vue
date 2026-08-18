<template>
  <el-dialog v-model="visible" title="分配用户" width="500px" :close-on-click-modal="false">
    <el-form v-loading="loading" label-width="80px">
      <el-form-item label="选择用户">
        <el-cascader
          v-model="selectedUsers"
          :options="deptTreeData"
          :props="cascaderProps"
          filterable
          clearable
          collapse-tags
          collapse-tags-tooltip
          :show-all-levels="false"
          placeholder="请选择用户（支持搜索）"
          style="width: 100%"
          :max-collapse-tags="60"
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
import { allocatedUserList, authUserSelectAll, authUserCancelAll } from '@/api/system/role'

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
const selectedUsers = ref<number[]>([])
const originalUsers = ref<number[]>([])
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
    // 并行获取部门树和已分配用户
    const [treeResult, allocResult] = await Promise.all([
      queryDeptTreeUser(),
      allocatedUserList({
        roleId: props.roleId,
        pageNum: 1,
        pageSize: 999999
      })
    ])

    deptTreeData.value = treeResult.data
    const userIds = allocResult.rows.map((u: any) => u.userId)
    originalUsers.value = userIds
    selectedUsers.value = [...userIds]
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

    // 计算增量
    const originalSet = new Set(originalUsers.value)
    const selectedSet = new Set(selectedUsers.value)

    const toAdd = selectedUsers.value.filter(id => !originalSet.has(id))
    const toRemove = originalUsers.value.filter(id => !selectedSet.has(id))

    // 如果没有变化
    if (toAdd.length === 0 && toRemove.length === 0) {
      handleClose()
      return
    }

    // 并行调用接口
    await Promise.all([
      toAdd.length > 0 ? authUserSelectAll({ roleId: props.roleId, userIds: toAdd }) : Promise.resolve(),
      toRemove.length > 0 ? authUserCancelAll({ roleId: props.roleId, userIds: toRemove }) : Promise.resolve()
    ])

    // 成功后关闭弹窗并通知父组件
    emit('success')
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
  originalUsers.value = []
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
