import { defineStore } from 'pinia'
import { ref } from 'vue'
import qs from 'qs'
import type { ChatHistory } from './types'
import { getDicts } from '@/api/system/dict/data'

type MicroPath = {
  path: string
  name: string
  prefix: string
  tokenKey?: string
  devServer: string
}

const useMicroStore = defineStore('micro', () => {
  const init = ref(false)
  const headerMasks = ref<{ show: boolean; id: string; bgColor?: string }[]>([])
  const showIframe = ref(false)
  const showGroup = ref<string | null>(null)
  const showMicroLoading = ref(false)
  const showHeaderColor = ref<string | undefined>(undefined)
  const headerZIndex = ref<'low' | 'high'>('high')
  const appHistory = ref<ChatHistory[]>([])
  const microPaths = ref<MicroPath[]>([])
  const navLoading = ref(false)
  // const { micro_app_list: microAppList } = useDict('micro_app_list')

  function setShowGroup(group: string | null) {
    showGroup.value = group
  }

  function setShowIframe(show: boolean) {
    showIframe.value = show
  }

  function setHeaderZIndex(zIndex: 'low' | 'high') {
    headerZIndex.value = zIndex
  }

  function setShowHeaderColor(color?: string) {
    if (!color) return
    showHeaderColor.value = color
  }

  function setShowHeaderMask({ show, id, bgColor }: { show: boolean; id: string; bgColor?: string }) {
    if (show) {
      headerMasks.value.push({ show, id, bgColor })
    } else {
      headerMasks.value = headerMasks.value.filter(item => item.id !== id)
    }
  }

  function setShowLoading(show: boolean) {
    showMicroLoading.value = show
  }

  function setAppHistory(history: ChatHistory[]) {
    appHistory.value = history
  }

  function formattedMicroPaths(data: any[]) {
    if (!data || data.length === 0) return
    microPaths.value = data
      .map(({ dictValue: value }) => {
        try {
          const { pathname, search } = new URL(value)
          const { name, tokenKey, prefix = '' } = qs.parse(search.replace('?', '')) as Record<string, string>
          return { path: pathname, name: name || pathname, prefix, tokenKey, devServer: `${window.location.origin}${pathname}` }
        } catch (error) {
          console.log(error)
        }
      })
      .filter(Boolean) as MicroPath[]

    console.log(microPaths.value)
  }

  // watch(microAppList, formattedMicroPaths, { immediate: true })
  async function getMicroPaths() {
    try {
      const { code, data } = (await getDicts('micro_app_list')) as any
      if (code === 200) {
        init.value = true
        formattedMicroPaths(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {
    init,
    navLoading,
    headerMasks,
    showIframe,
    showGroup,
    showMicroLoading,
    showHeaderColor,
    headerZIndex,
    appHistory,
    microPaths,
    setShowGroup,
    setShowIframe,
    setHeaderZIndex,
    setShowHeaderColor,
    setShowHeaderMask,
    setShowLoading,
    setAppHistory,
    getMicroPaths
  }
})

export default useMicroStore
