<template>
  <div class="iframe-page">
    <iframe ref="iframeRef" :src="url" />
  </div>
</template>
<script lang="ts" setup name="micro-iframe">
import { ElNotification } from 'element-plus'
import { useMicroUrl, useLogout, NotifyProps } from './hooks'
import useMicroStore from '@/store/modules/micro'

const microStore = useMicroStore()

const changeMicroRouter = (path: string) => {
  iframeRef.value?.contentWindow?.postMessage({ type: 'change-iframe-router', data: { path } }, '*')
}

const { url, route, onChnageRouter } = useMicroUrl(changeMicroRouter)
const iframeRef = ref<HTMLIFrameElement | null>(null)
const routeName = computed(() => route.name?.toString())
const iframeUrl = computed(() => (routeName.value ? route.query[routeName.value] : ''))

const { logout } = useLogout()

const notify = (options: NotifyProps) => {
  const { type = 'info', title, message, duration = 3000 } = options
  ElNotification[type]({ title, key: message, message, duration })
}

const onMessage = ({ data }: any) => {
  if (typeof data === 'object') {
    const { type, value, id, bgColor } = data
    if (type === 'setShowHeaderMask') {
      microStore.setShowHeaderMask({ show: value, id, bgColor })
    } else if (type === 'setHeaderZIndex') {
      microStore.setHeaderZIndex(value)
    } else if (type === 'logout') {
      logout()
    } else if (type === 'changeRouter') {
      const { path, replace = false } = value
      onChnageRouter(path, { replace })
    } else if (type === 'notify') {
      notify(value)
    }
  } else if (data === 'showLoading') {
    microStore.setShowLoading(true)
  } else if (data === 'hideLoading') {
    microStore.setShowLoading(false)
  }
}

const onListener = () => {
  const { contentWindow } = iframeRef.value ?? {}
  if (!contentWindow) return

  const { location } = contentWindow
  const search = location.href.replace(location.origin, '')

  if (search !== iframeUrl.value && iframeUrl.value && typeof iframeUrl.value === 'string') {
    location.href = iframeUrl.value
  }

  const originalPushState = contentWindow.history.pushState
  const originalReplaceState = contentWindow.history.replaceState

  function handleUrlChange() {
    if (!routeName.value) return
    const { location } = contentWindow!
    const url = new URL(window.location.href)
    const search = location.href.replace(location.origin, '')

    const searchData = encodeURIComponent(search)
    url.search = `?${routeName.value}=${searchData}`

    if (url.search === window.location.search) return

    window.history.replaceState(null, '', url.toString())
  }

  contentWindow.history.pushState = function (...args) {
    originalPushState.apply(this, args)
    handleUrlChange()
  }

  contentWindow.history.replaceState = function (...args) {
    originalReplaceState.apply(this, args)
    handleUrlChange()
  }

  contentWindow.addEventListener('popstate', handleUrlChange)
}

onMounted(() => {
  // 监听 iframe 发送的消息

  microStore.setShowIframe(true)
  window.addEventListener('message', onMessage)
  iframeRef.value?.addEventListener('load', onListener)
})

onUnmounted(() => {
  microStore.setShowIframe(false)
  window.removeEventListener('message', onMessage)
  iframeRef.value?.removeEventListener('load', onListener)
})
</script>

<style lang="scss" scoped>
.iframe-page {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  position: fixed;

  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
