<template>
  <div class="h-full flex flex-col">
    <div class="shrink-0 flex items-center justify-between text-[#999] pt-4 pb-2.5 px-5" :class="[isCollapsed ? 'flex-col gap-2' : '']">
      <div class="flex items-center gap-1">
        <SvgIcon icon-class="nav-history" />
        <span v-if="!isCollapsed" class="text-3">历史记录</span>
      </div>
      <div
        class="size-7.5 cursor-pointer flex items-center justify-center bg-[rgba(11,117,255,0.1)] rounded-md text-[#1890ff]"
        @click="onNewChat"
      >
        <el-icon><Plus /></el-icon>
      </div>
    </div>
    <el-scrollbar class="flex-1 px-5">
      <HistoryItem
        v-for="item in historyList"
        v-if="historyList.length"
        :key="item.id"
        v-model="activeAgentId"
        :item="item"
        :is-collapsed="isCollapsed"
      />
      <el-empty
        v-else-if="!isCollapsed"
        class="h-full flex items-center justify-center !py-none"
        description="暂无历史记录"
        :image-size="80"
      />
    </el-scrollbar>
  </div>
</template>
<script setup lang="ts">
import WuJie from 'wujie-vue3'
import { Plus } from '@element-plus/icons-vue'
import { HistoryItemType } from './types'
import HistoryItem from './HistoryItem.vue'

interface Props {
  isCollapsed: boolean
}

defineProps<Props>()

const { bus } = WuJie

const historyList = ref<HistoryItemType[]>([])
const activeAgentId = ref<HistoryItemType['id']>()

const onChangeAgentHistory = (data: HistoryItemType[]) => {
  console.log('AgentHistory.vue', data)

  historyList.value = data
}

const setActiveAgentId = (id: HistoryItemType['id']) => {
  activeAgentId.value = id
}

const onNewChat = () => {
  bus.$emit('on-new-chat')
}

onMounted(() => {
  bus.$on('set-agent-active-id', setActiveAgentId)
  bus.$on('set-agent-history', onChangeAgentHistory)
})

onUnmounted(() => {
  bus.$off('set-agent-active-id', setActiveAgentId)
  bus.$off('set-agent-history', onChangeAgentHistory)
})
</script>

<style lang="scss" scoped></style>
