<template>
  <div class="w-full h-full relative flex">
    <MicroNavList v-if="!hideNav" :router-list="routerList" :active-menu-info="activeMenuInfo" />
    <div class="flex-1 h-full w-0">
      <WuJieList v-show="isMicro" :is-micro="isMicro" />
      <router-view v-if="!isMicro" />
    </div>
  </div>
</template>
<script setup lang="ts" name="micro">
import WuJie from 'wujie-vue3'
import { RouteLocationRaw } from 'vue-router'
import { upperFirst } from 'lodash'
import { microPaths } from '@/config'
import { useMicroUrl, useLogout } from './hooks'
import useMicroStore from '@/store/modules/micro'
import eventBus from '@/utils/bus'
import usePermissionStore from '@/store/modules/permission'

const { bus } = WuJie
const route = useRoute()
const permissionStore = usePermissionStore()
const activeMenuInfo = computed(() => permissionStore.activeMenuInfo)

const filterHiddenItems = (items: any[]): any[] => {
  const filtered = items
    .filter(item => !item.hidden)
    .map(item => ({
      ...item,
      children: item.children ? filterHiddenItems(item.children) : undefined
    }))
  return filtered.filter(item => !item.children || item.children.length > 0)
}

const routerList = computed(() => filterHiddenItems(activeMenuInfo.value.children || []))

const changeMicroRouter = (path: string) => {
  bus.$emit('change-micro-router', { path })
}

const { logout } = useLogout()
const microStore = useMicroStore()
const { showGroup, onChnageRouter } = useMicroUrl(changeMicroRouter)
const isMicro = computed(() => route.meta?.isMicro === '0')
const hideNav = computed(() => {
  const query = (activeMenuInfo.value.meta?.query || {}) as Record<string, any>
  return !!query?.hideNav as boolean
})

const routerChange = (to: RouteLocationRaw, { replace = false }: { replace?: boolean } = {}) => {
  onChnageRouter(to, { replace })
}

const openWindow = (url: string) => {
  const info = microPaths.find(item => url.startsWith(item.path))
  if (!info) {
    console.error('未找到匹配的微服务路径')
    return
  }

  if (info.path === '/rag') {
    // window.open(info.devServer, '_blank')
  } else if (info.path === '/sonic') {
    const path = url.replace(info.path, '')
    const [, routePath] = path.split('/')
    const { origin } = window.location
    window.open(`${origin}${info.prefix}/${routePath}?${upperFirst(routePath)}=${encodeURIComponent(url)}`, '_blank')
  }
}

const onReload = () => {
  window.location.reload()
}

const setNavLoading = (loading: boolean) => {
  microStore.navLoading = loading
}

watch(showGroup, microStore.setShowGroup, { immediate: true })

onMounted(() => {
  console.log('壳初始化了')
  bus.$on('logout', logout)
  bus.$on('reload', onReload)
  bus.$on('open-window', openWindow)
  bus.$on('router-change', routerChange)
  bus.$on('set-nav-loading', setNavLoading)

  eventBus.on('change-micro-router', changeMicroRouter)
})

onBeforeUnmount(() => {
  microStore.setShowGroup(null)
  bus.$off('logout', logout)
  bus.$off('reload', onReload)
  bus.$off('open-window', openWindow)
  bus.$off('router-change', routerChange)
  bus.$off('set-nav-loading', setNavLoading)
  eventBus.off('change-micro-router', changeMicroRouter)
})
</script>

<style lang="scss" scoped>
.micro-page {
  width: 100%;
  height: 100%;
  margin-left: 0px;
  transition: margin-left 0.3s ease-in-out;

  .wu-jie {
    width: 100%;
    height: 100%;
  }
}
</style>
