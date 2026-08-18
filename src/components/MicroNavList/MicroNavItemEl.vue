<template>
  <div class="flex items-center gap-2 py-2.5 pl-3 relative w-full overflow-hidden" :class="{ 'cursor-not-allowed opacity-50': disabled }" @click="onChangeRouter(nav)">
    <div class="h-6 w-6 flex justify-center items-center shrink-0">
      <NavIcon :nav="nav" />
    </div>
    <transition name="fade">
      <span v-show="!isCollapse" class="flex-1 truncate transition-all duration-300">
        {{ nav.meta?.title }}
      </span>
    </transition>

    <div
      v-if="Array.isArray(nav.children) && nav.children.length > 0"
      class="absolute top-1/2 right-2 -translate-y-1/2 transition-transform duration-450"
      :class="[isSubmenuCollapsed ? '-rotate-90' : 'rotate-0', isCollapse ? '!-right-1' : '']"
    >
      <el-icon><CaretBottom /></el-icon>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouteRecordRaw } from 'vue-router'
import { CaretBottom } from '@element-plus/icons-vue'
import { checkMenuDisabled } from './methods'

interface Props {
  nav: RouteRecordRaw
  activeMenuInfo: RouteRecordRaw
  isCollapse?: boolean
  hasActiveChild: boolean
  changeRouter: (nav: RouteRecordRaw, prePath?: string) => void
}

const props = defineProps<Props>()
const disabled = computed(() => checkMenuDisabled(props.nav))

// 如果有子元素被激活则展开，否则折叠
const isSubmenuCollapsed = ref(!props.hasActiveChild)

function onChangeRouter(nav: RouteRecordRaw) {
  if (Array.isArray(nav.children) && nav.children.length > 0) isSubmenuCollapsed.value = !isSubmenuCollapsed.value
  props.changeRouter(nav)
}
</script>

<style lang="scss" scoped></style>
