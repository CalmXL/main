import { RouteRecordRaw } from 'vue-router'
import { isProd } from '@/config'

export function checkMenuDisabled(menu: RouteRecordRaw) {
  const { disabled, dev } = (menu.meta?.query ?? {}) as Record<string, any>
  if (dev && !isProd) return false
  return disabled ?? false
}
