<template>
  <div class="w-full h-full">
    <WuJie
      v-if="wujieUrl && microName && microType === 'wujie'"
      :key="microName"
      :name="microName"
      class="w-full h-full"
      :url="wujieUrl"
      sync
      alive
      :loading="is804Env ? undefined : loading"
    />
    <iframe
      v-else-if="iframeUrl && microName && microType === 'iframe'"
      :key="microName!"
      ref="iframeRef"
      :src="iframeUrl"
      class="w-full h-full"
      frameborder="0"
    />
  </div>
</template>
<script setup lang="ts">
import WuJie from 'wujie-vue3'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { is804Env, PrePath } from '@/config'
import { getToken } from '@/utils/auth'
import { getMicroTokenKey } from '@/utils'

const { bus } = WuJie

interface Props {
  isMicro: boolean
}

const route = useRoute()
const props = defineProps<Props>()

const iframeUrl = ref<string>()
const wujieUrl = ref<string>()
const microName = ref<string>()
const microType = ref<'wujie' | 'iframe'>('wujie')
const iframeRef = ref<HTMLIFrameElement>()

function getMicroName(route?: RouteLocationNormalizedLoaded) {
  if (!route) return
  const { name, meta } = route
  const query = (meta?.query || {}) as Record<string, any>
  const n = query.group || name
  if (typeof n === 'string') return n.replace(/$\//, '')
  return n as string
}

// const microName = computed(() => getMicroName(route))

const loading = document.createElement('div')
loading.style.cssText = 'display: flex; justify-content: center; align-items: center; height: 100%; width: 100%;'
loading.innerHTML = '<img src="/logo_loading.svg" style="width: 110px; height: 55px;" />'

function getNewUrl(route: RouteLocationNormalizedLoaded) {
  try {
    const { microPath } = route.meta || {}
    const { pathname } = new URL(microPath as string)
    const [, key] = pathname.replace(PrePath, '').split('/')
    let path = route.query[key] as string | undefined

    if (typeof path === 'string' && path) {
      if (!path.startsWith(pathname)) return pathname

      path = decodeURIComponent(decodeURIComponent(path))
      path = `/${key}${path}`
    }

    return path || pathname
  } catch (error) {
    console.error('处理微前端路由错误', error)
  }
}

async function setWujieUrl(route: RouteLocationNormalizedLoaded) {
  if (!props.isMicro) {
    iframeUrl.value = ''
    wujieUrl.value = ''
    microName.value = ''
    return
  }
  const { microPath, query = {} } = route.meta || {}
  const { group = '', microType: type = 'wujie' } = query as Record<string, string>

  const oldMicroName = microName.value
  microName.value = getMicroName(route)

  microType.value = type as 'wujie' | 'iframe'
  const newUrl = getNewUrl(route)

  if (type === 'iframe') {
    if (!iframeUrl.value || (microName.value && oldMicroName !== microName.value)) {
      try {
        const url = new URL(microPath as string)
        const tokenKey = getMicroTokenKey(url.pathname)
        url.searchParams.set(tokenKey, getToken() || '')

        iframeUrl.value = url.toString()
      } catch (error) {
        console.error('处理iframe路由错误', error)
      }
    }
    if (!newUrl) return

    const tokenKey = getMicroTokenKey(newUrl)

    iframeRef.value?.contentWindow?.postMessage({ type: 'change-iframe-router', value: newUrl, [tokenKey]: getToken() }, '*')
  } else if (type === 'wujie') {
    if (!wujieUrl.value || (microName.value && oldMicroName !== microName.value)) {
      const url = new URL(microPath as string)
      const token = getToken()
      if (token) url.searchParams.set('token', token)
      wujieUrl.value = url.toString()
    }

    if (!newUrl) return
    // await nextTick()

    console.log(`%c【核心】减少不必要的加载，仅通知${group}服务跳转路由`, 'color: #42b983; font-weight: bold; font-size: 14px;')
    bus.$emit('change-micro-router', { path: newUrl, microName: group })
  }
}

watch(route, setWujieUrl, { immediate: true })
</script>

<style lang="scss" scoped></style>
