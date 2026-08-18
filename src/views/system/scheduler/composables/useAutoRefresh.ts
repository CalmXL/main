import { ref, watch, onUnmounted } from 'vue'

export function useAutoRefresh(callback: () => void, defaultInterval = 30000) {
  const enabled = ref(false)
  const interval = ref(defaultInterval)
  let timer: number | null = null

  const start = () => {
    if (timer) clearInterval(timer)
    timer = window.setInterval(callback, interval.value)
  }

  const stop = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  watch(enabled, val => {
    if (val) {
      start()
    } else {
      stop()
    }
  })

  watch(interval, () => {
    if (enabled.value) {
      stop()
      start()
    }
  })

  onUnmounted(() => {
    stop()
  })

  return {
    enabled,
    interval,
    start,
    stop
  }
}
