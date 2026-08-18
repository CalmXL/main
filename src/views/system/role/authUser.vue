<template>
  <PageContent>
    <template #top>
      <!-- 角色信息 + 保存按钮 -->
      <el-card class="header-card">
        <div class="header">
          <span class="title">分配用户</span>
          <div class="actions">
            <el-button type="warning" icon="Close" @click="handleClose">关闭</el-button>
            <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
          </div>
        </div>
      </el-card>

      <!-- Cascader 选择器 -->
      <el-card v-loading="loading" class="selector-card">
        <el-form>
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
            />
          </el-form-item>
        </el-form>
      </el-card>
    </template>
  </PageContent>
</template>

<script setup name="AuthUser" lang="ts">
import { getCurrentInstance, ComponentInternalInstance, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { queryDeptTreeUser } from '@/api/system/user'
import { allocatedUserList, authUserSelectAll, authUserCancelAll } from '@/api/system/role'

const route = useRoute()
const { proxy } = getCurrentInstance() as ComponentInternalInstance

// Cascader 配置
const cascaderProps = {
  multiple: true,
  label: 'label',
  value: 'id',
  children: 'children',
  emitPath: false // 只返回用户ID，不返回完整路径
}

// 数据状态
const deptTreeData = ref<any[]>([]) // 部门树数据
const selectedUsers = ref<number[]>([]) // 选中的用户ID
const originalUsers = ref<number[]>([]) // 原始已分配用户ID（用于增量计算）
const loading = ref(false)
const saving = ref(false)

/** 获取部门树数据 */
async function getDeptTreeUserData() {
  try {
    const { data } = await queryDeptTreeUser()
    deptTreeData.value = data
  } catch (error) {
    console.error('获取部门树数据失败:', error)
    proxy!.$modal.msgError('获取用户数据失败')
  }
}

/** 获取已分配用户（回显） - 使用大 pageSize 获取全量数据 */
async function getAllocatedUsers() {
  try {
    const { rows } = await allocatedUserList({
      roleId: route.params.roleId,
      pageNum: 1,
      pageSize: 999999 // 获取全量数据用于回显
    })
    const userIds = rows.map((u: any) => u.userId)
    originalUsers.value = userIds
    selectedUsers.value = [...userIds] // 回显
  } catch (error) {
    console.error('获取已分配用户失败:', error)
    proxy!.$modal.msgError('获取已分配用户失败')
  }
}

/** 保存更改 */
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
      proxy!.$modal.msgWarning('没有需要保存的更改')
      return
    }

    // 并行调用接口
    await Promise.all([
      toAdd.length > 0 ? authUserSelectAll({ roleId: route.params.roleId, userIds: toAdd }) : Promise.resolve(),
      toRemove.length > 0
        ? authUserCancelAll({ roleId: route.params.roleId, userIds: toRemove })
        : Promise.resolve()
    ])

    proxy!.$modal.msgSuccess('保存成功')
    originalUsers.value = [...selectedUsers.value]
  } catch (error) {
    console.error('保存失败:', error)
    proxy!.$modal.msgError('保存失败')
  } finally {
    saving.value = false
  }
}

/** 返回按钮 */
function handleClose() {
  // 检查是否有未保存的更改
  const hasChanges = JSON.stringify(originalUsers.value) !== JSON.stringify(selectedUsers.value)

  if (hasChanges) {
    proxy!.$modal
      .confirm('检测到有未保存的更改，是否确认离开？')
      .then(() => {
        const obj = { path: '/system/role' }
        proxy!.$tab.closeOpenPage(obj)
      })
      .catch(() => {})
  } else {
    const obj = { path: '/system/role' }
    proxy!.$tab.closeOpenPage(obj)
  }
}

/** 页面初始化 */
onMounted(async () => {
  loading.value = true
  await Promise.all([getDeptTreeUserData(), getAllocatedUsers()])
  loading.value = false
})
</script>

<style scoped>
.header-card {
  margin-bottom: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header .title {
  font-size: 16px;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 8px;
}

.selector-card {
  min-height: 200px;
}
</style>
