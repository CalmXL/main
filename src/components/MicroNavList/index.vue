<template>
  <template v-if="isMobile && show">
    <div
      class="fixed z-501 active:scale-90"
      :style="{
        right: `${fabPos.right}px`,
        bottom: `${fabPos.bottom}px`,
        transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)'
      }"
      @touchstart="onTouchStart"
      @touchmove.prevent="onTouchMove"
      @touchend="onTouchEnd"
    >
      <el-button type="primary" plain class="!w-11 !h-11 !rounded-lg">
        <el-icon size="22px"><Menu /></el-icon>
      </el-button>
    </div>
    <el-drawer v-model="mobileDrawerVisible" :with-header="false" direction="rtl" size="75%" :append-to-body="true" body-class="!p-none">
      <div class="h-full flex flex-col bg-white">
        <div class="p-4 text-lg font-bold border-b border-[#e4e7ed]">导航列表</div>
        <div class="flex-1 overflow-hidden flex flex-col">
          <el-scrollbar class="flex-1">
            <div class="pt-2.5 w-full" />
            <MicroNavItem
              v-for="item in routerList"
              :key="item.path"
              :nav="item"
              :is-collapse="false"
              :active-menu-info="activeMenuInfo"
              :acrive-router-path="acriveRouterPath"
              @change-router="changeRouter"
            />
          </el-scrollbar>
          <div v-if="showHistory" class="h-[300px] border-t border-[#e4e7ed] shrink-0">
            <AgentHistory v-loading="store.navLoading" :is-collapsed="false" />
          </div>
        </div>
      </div>
    </el-drawer>
  </template>
  <div
    v-else-if="show"
    class="bg-white h-full flex flex-col gap-1 shrink-0 transition-all duration-300 ease-in-out border-r-1 border-r-[#e4e7ed] border-r-solid"
    :style="{ width: `${navWidth}px` }"
  >
    <el-splitter layout="vertical" class="flex-1" @resize-start="resizeStart">
      <el-splitter-panel :size="splitterSize" :max="'80%'" :min="'20%'">
        <el-scrollbar :class="['h-full']">
          <div class="pt-2.5 w-full" />
          <MicroNavItem
            v-for="item in routerList"
            :key="item.path"
            :nav="item"
            :is-collapse="isCollapsed"
            :active-menu-info="activeMenuInfo"
            :acrive-router-path="acriveRouterPath"
            @change-router="changeRouter"
          />
        </el-scrollbar>
      </el-splitter-panel>
      <el-splitter-panel v-if="showHistory">
        <AgentHistory v-loading="store.navLoading" :is-collapsed="isCollapsed" />
      </el-splitter-panel>
    </el-splitter>
    <div class="shrink-0 border-t border-t-solid border-t-[#e4e7ed] pl-5">
      <div class="size-12 flex items-center justify-center cursor-pointer" @click="toggleCollapse">
        <el-icon size="22">
          <component :is="isCollapsed ? Expand : Fold" />
        </el-icon>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import WuJie from 'wujie-vue3'
import { RouteRecordRaw } from 'vue-router'
import { Fold, Expand, Menu } from '@element-plus/icons-vue'
import { pathJoin } from '@/utils'
import AgentHistory from './AgentHistory.vue'
import useMicroStore from '@/store/modules/micro'
import { isMobile } from '@/config'
import useUserStore from '@/store/modules/user.js'

const userStore = useUserStore()
const props = defineProps({
  routerList: { type: Array as PropType<RouteRecordRaw[]>, default: () => [] },
  activeMenuInfo: { type: Object as PropType<RouteRecordRaw>, default: () => ({}) }
})

const navWidth = ref(272)

const store = useMicroStore()
const isCollapsed = ref(false)
const mobileDrawerVisible = ref(false)

const FAB_POS_KEY = 'micro-nav-fab-pos'
const fabPos = ref({ right: 24, bottom: 80 })
const isDragging = ref(false)
let startX = 0
let startY = 0
let startRight = 0
let startBottom = 0
let isDragGesture = false

function onTouchStart(e: TouchEvent) {
  isDragging.value = true
  startX = e.touches[0].clientX
  startY = e.touches[0].clientY
  startRight = fabPos.value.right
  startBottom = fabPos.value.bottom
  isDragGesture = false
}

function onTouchMove(e: TouchEvent) {
  const currentX = e.touches[0].clientX
  const currentY = e.touches[0].clientY

  const deltaX = startX - currentX
  const deltaY = startY - currentY

  if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
    isDragGesture = true
  }

  if (isDragGesture) {
    let newRight = startRight + deltaX
    let newBottom = startBottom + deltaY

    const maxRight = window.innerWidth - 48
    const maxBottom = window.innerHeight - 48

    newRight = Math.max(0, Math.min(newRight, maxRight))
    newBottom = Math.max(0, Math.min(newBottom, maxBottom))

    fabPos.value = { right: newRight, bottom: newBottom }
  }
}

function onTouchEnd(e: TouchEvent) {
  isDragging.value = false
  if (!isDragGesture) {
    if (e.cancelable) e.preventDefault() // Prevent ghost click
    mobileDrawerVisible.value = true
  } else {
    // Auto snap to nearest edge
    const screenWidth = window.innerWidth
    const currentRight = fabPos.value.right
    const currentLeft = screenWidth - currentRight - 48 // 48 is fab width

    if (currentRight < currentLeft) {
      fabPos.value.right = 24 // Snap to right
    } else {
      fabPos.value.right = screenWidth - 48 - 24 // Snap to left
    }

    localStorage.setItem(FAB_POS_KEY, JSON.stringify(fabPos.value))
  }
}

const activeMenuInfo = toRef(props, 'activeMenuInfo')

const { bus } = WuJie

const sessionKey = 'workbench-splitter-size'

const route = useRoute()
const splitterSize = ref(sessionStorage.getItem(sessionKey) || '70%')
const acriveRouterPath = ref('')

const router = useRouter()
const showHistory = computed(() => {
  const query = (route.meta?.query || {}) as Record<string, any>
  return (query?.showHistory || false) as boolean
})

const show = computed(() => Array.isArray(props.routerList) && props.routerList.length > 0)

function changeRouter(target: RouteRecordRaw, prePath?: string) {
  const { path: targetPath, meta = {} } = target ?? {}
  const httpUrl = (meta?.query as any)?.httpUrl as string
  if (/https?:\/\//.test(targetPath)) {
    userStore.pagePuv(target as any)
    if (/https?:\/\/location\.origin/.test(targetPath)) {
      const url = new URL(targetPath)
      url.hostname = window.location.hostname
      url.protocol = window.location.protocol
      window.open(url.href, '_blank')
    } else if (window.location.protocol === 'http:' && httpUrl) {
      window.open(httpUrl, '_blank')
    } else {
      window.open(targetPath, '_blank')
    }
    return
  }

  if (Array.isArray(target.children) && target.children.length > 0) return
  const basePath = activeMenuInfo.value.path
  const path = pathJoin(basePath, prePath, target.path)
  router.replace({ path })
  acriveRouterPath.value = path
  if (isMobile) mobileDrawerVisible.value = false
}

watch(
  () => route.path,
  value => {
    acriveRouterPath.value = value
  },
  { immediate: true }
)

function resizeStart() {
  sessionStorage.setItem(sessionKey, splitterSize.value)
}

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
  navWidth.value = isCollapsed.value ? 86 : 272

  bus.$emit('collapse-change', isCollapsed.value)
}

onMounted(() => {
  bus.$on('change-collapse', toggleCollapse)
  const cached = localStorage.getItem(FAB_POS_KEY)
  if (cached) {
    try {
      // fabPos.value = JSON.parse(cached)
    } catch (e) {
      console.error('Failed to parse fab position', e)
    }
  }
})

onBeforeUnmount(() => {
  bus.$off('change-collapse', toggleCollapse)
})
</script>

<style lang="scss" scoped>
:deep(.el-scrollbar__wrap) {
  transition: padding-right 0.3s ease-in-out;
}
</style>
