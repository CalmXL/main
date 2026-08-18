<template>
  <div
    class="cursor-pointer transition-all duration-450 w-[calc(100%-40px)] mx-auto"
    :class="[acriveRouterPath === pathJoin(activeMenuInfo.path, nav.path) ? 'bg-[#eff4f9] rounded-lg text-[#1890ff] font-bold' : '']"
  >
    <el-popover placement="right" :popper-class="[isCollapse && hasChildren ? '' : 'hidden', '!p-none']">
      <template #reference>
        <MicroNavItemEl
          :nav="nav"
          :is-collapse="isCollapse"
          :has-active-child="hasActiveChild"
          :active-menu-info="activeMenuInfo"
          :change-router="changeRouter"
        />
      </template>
      <template #default>
        <div v-if="nav.children?.length" class="flex flex-col">
          <div
            v-for="value in nav.children"
            :key="value.path"
            :class="[acriveRouterPath === pathJoin(activeMenuInfo.path, nav.path, value.path) ? '!text-[#1890ff] !bg-[#eff4f9]' : '']"
            class="transition-all duration-450 bg-transparent h-[45px] whitespace-nowrap flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] relative cursor-pointer text-[#333]"
            @click="changeRouter(value, nav.path)"
          >
            <span>{{ value.meta?.title }}</span>
          </div>
        </div>
      </template>
    </el-popover>
    <div
      v-if="hasChildren && !isCollapse"
      class="flex flex-col overflow-hidden transition-all duration-450 ease-in-out"
      :style="{ maxHeight: isSubmenuCollapsed ? '0' : `${nav.children!.length * 44}px` }"
      :class="[isSubmenuCollapsed ? 'opacity-0' : 'opacity-100']"
    >
      <div
        v-for="value in nav.children"
        :key="value.path"
        :class="[
          acriveRouterPath === pathJoin(activeMenuInfo.path, nav.path, value.path) ? '!text-[#1890ff] !bg-[#eff4f9]' : '',
          checkMenuDisabled(value) ? 'cursor-not-allowed opacity-50' : ''
        ]"
        class="transition-all duration-450 bg-transparent h-[45px] whitespace-nowrap flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] relative cursor-pointer text-[#333]"
        @click="changeRouter(value, nav.path)"
      >
        <div class="size-6 flex justify-center items-center flex-shrink-0">
          <NavIcon :nav="value" />
        </div>
        <span class="flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
          {{ value.meta?.title }}
        </span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouteRecordRaw } from 'vue-router'
import { ref, computed } from 'vue'
import { pathJoin } from '@/utils'
import { checkMenuDisabled } from './methods'

interface Props {
  nav: RouteRecordRaw
  activeMenuInfo: RouteRecordRaw
  acriveRouterPath: string
  isCollapse?: boolean
}
interface Emits {
  (e: 'change-router', router: RouteRecordRaw, prePath?: string): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

// 判断是否有子元素被激活
const hasActiveChild = computed(() => {
  if (!Array.isArray(props.nav?.children)) return false
  return props.nav.children.some(child => props.acriveRouterPath === pathJoin(props.activeMenuInfo.path, props.nav.path, child.path))
})

const hasChildren = computed(() => Array.isArray(props.nav?.children) && props.nav.children.length > 0)

// 如果有子元素被激活则展开，否则折叠
const isSubmenuCollapsed = ref(!hasActiveChild.value)

function changeRouter(nav: RouteRecordRaw, prePath?: string) {
  if (checkMenuDisabled(nav)) return
  if (Array.isArray(nav.children) && nav.children.length > 0) {
    if (props.isCollapse) return
    isSubmenuCollapsed.value = !isSubmenuCollapsed.value
  } else {
    emit('change-router', nav, prePath)
  }
}
</script>

<style lang="scss" scoped></style>
