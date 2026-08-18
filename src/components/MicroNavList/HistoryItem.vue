<template>
  <div
    class="flex items-center py-3 px-2.5 rounded-md cursor-pointer relative overflow-hidden group"
    :class="{ 'bg-[#f5f5f5]': item.id === activeAgentId }"
    @click="onChangeHistory(item)"
  >
    <span class="flex-1 text-sm text-[#333] truncate">{{ item.name }}</span>
    <span v-if="item.updatedDate && !isCollapsed" class="shrink-0 text-3 text-[#999]">{{ dayjs(item.updatedDate).format('M-D') }}</span>

    <div class="absolute top-1/2 -translate-y-1/2 translate-x-full right-0 group-hover:-translate-x-2.5 transition-all !duration-300">
      <el-dropdown placement="right" @command="handleCommand">
        <el-button size="small" plain class="!size-6 !rounded-s">
          <el-icon><MoreFilled /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="modify" class="flex items-center gap-2">
              修改
              <el-icon><EditPen /></el-icon>
            </el-dropdown-item>
            <el-dropdown-item v-if="item.source_type" command="permission" class="flex items-center gap-2">
              权限
              <el-icon><User /></el-icon>
            </el-dropdown-item>
            <el-dropdown-item command="delete">
              <div class="flex items-center gap-2 text-red-500">
                删除
                <el-icon><Delete /></el-icon>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <!-- 权限分配对话框 -->
  <PermissionDialog
    v-model="showPermissionDialog"
    :role-id="props.item.id"
    @success="handlePermissionSuccess"
  />
</template>
<script setup lang="ts">
import WuJie from 'wujie-vue3'
import dayjs from 'dayjs'
import { EditPen, MoreFilled, Delete } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import PermissionDialog from './PermissionDialog.vue'
import { HistoryItemType } from './types'

const { bus } = WuJie

interface Props {
  item: HistoryItemType
  isCollapsed: boolean
}

const activeAgentId = defineModel<HistoryItemType['id']>()

const props = defineProps<Props>()

// 权限对话框状态
const showPermissionDialog = ref(false)

const onChangeHistory = (item: HistoryItemType) => {
  activeAgentId.value = item.id
  bus.$emit('set-agent-active-history', item)
}

const handleCommand = (command: string) => {
  if (command === 'delete') {
    ElMessageBox.confirm('确定删除该历史记录吗？', { type: 'warning' }).then(() => {
      bus.$emit('delete-agent-history', props.item)
    })
  } else if (command === 'modify') {
    ElMessageBox.prompt('请输入新的历史记录名称', { inputValue: props.item.name }).then(({ value }) => {
      props.item.name = value
      bus.$emit('modify-agent-history', props.item)
    })
  } else if (command === 'permission') {
    showPermissionDialog.value = true
  }
}

/** 权限分配成功回调 */
const handlePermissionSuccess = () => {
  // 当权限分配成功时，通知子应用权限已更新，并传递选中的用户 ID
  // const body = {
  //   agentId: props.item.id,
  //   userIds: selectedUserIds
  // }

  // bus.$emit('agent-permission-updated', body)
}

</script>

<style lang="scss" scoped></style>
