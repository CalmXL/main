import qs from 'qs'
import { RouteLocationRaw, RouteRecordRaw } from 'vue-router'
import { getToken } from '@/utils/auth'
import { getMicroTokenKey } from '@/utils'
import useUserStore from '@/store/modules/user'
import { isHttp } from '@/utils/validate'
import { BaseLoginUrl, LoginUrl, PrePath } from '@/config'
import usePermissionStore from '@/store/modules/permission'

export type NotifyProps = {
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  duration?: number
  message: string
}

function getRoute(allRoutes: RouteRecordRaw[], path: string) {
  for (let i = 0; i < allRoutes.length; i++) {
    const { path: p } = allRoutes[i]

    if (p === path) return allRoutes[i]
  }
  return null
}

export function getMicroPath(allRoutes: RouteRecordRaw[], path?: string) {
  if (!path) return { group: null, microPath: null }
  try {
    const item = (getRoute(allRoutes, path) ?? {}) as any
    const { query, meta } = item
    const group = JSON.parse(query || '{}').group || null
    const { microPath } = meta ?? {}
    return { group, microPath }
  } catch (error) {
    return { group: null, microPath: null }
  }
}

type ChangeMicroRouter = (path: string) => void

export function useMicroUrl(changeMicroRouter?: ChangeMicroRouter) {
  const route = useRoute()
  const router = useRouter()
  const permissionStore = usePermissionStore()

  // const allRoutes = computed(() => router.getRoutes())
  const allRoutes = computed(() => permissionStore.allRoutesF)

  const microName = computed(() => {
    const { name, meta } = route
    const query = (meta?.query || {}) as Record<string, any>
    const n = query.group || name
    if (typeof n === 'string') return n.replace(/$\//, '')
    return n
  })

  const microPath = computed(() => {
    const { path: pathName, query } = route
    let path = route.meta?.microPath as string | undefined

    const queryPath = query[pathName]
    if (queryPath && typeof queryPath === 'string') {
      const url = new URL(`${window.location.origin}${queryPath}`)
      url.searchParams.set(getMicroTokenKey(route.path), encodeURIComponent(getToken()!))

      console.log('url.toString()', url.toString())

      return url.toString()
    }
    if (path) {
      if (/^\/\//.test(path)) path = `${window.location.protocol}${path}`
      const { search, origin, pathname, hash } = new URL(path)

      const query = { ...qs.parse(search.substring(1)), [getMicroTokenKey(route.path)]: encodeURIComponent(getToken()!) }
      const url = `${origin}${pathname}?${qs.stringify(query)}${hash}`

      console.log('url', url)
      return url
    }
    return ''
  })

  const onChnageRouter = (to: RouteLocationRaw, { replace = false }: { replace: boolean }) => {
    if (replace) {
      router.replace(to)
    } else {
      router.push(to)
    }
  }

  const showGroup = computed(() => getMicroPath(allRoutes.value, route.path)?.group)

  const url = ref('')
  watch(
    route,
    (newVal, oldVal) => {
      const { group: newPath, microPath: newMicroPath } = getMicroPath(allRoutes.value, newVal.path)
      const { group: oldPath } = getMicroPath(allRoutes.value, oldVal?.path)

      if (newPath !== oldPath || typeof changeMicroRouter !== 'function') {
        url.value = newMicroPath
      } else {
        try {
          const { pathname } = new URL(newMicroPath)
          const [, key] = pathname.replace(PrePath, '').split('/')
          let path = route.query[key] as string | undefined
          if (typeof path === 'string' && path) {
            path = decodeURIComponent(decodeURIComponent(path))
            path = `/${key}${path}`
          }

          changeMicroRouter(path || pathname)
        } catch (error) {
          url.value = microPath.value
        }
      }

      if (!url.value) {
        url.value = microPath.value
      }
    },
    { immediate: true }
  )

  return {
    url,
    route,
    showGroup,
    microName,
    microPath,
    permissionStore,
    onChnageRouter
  }
}

export function useLogout() {
  const router = useRouter()
  const userStore = useUserStore()

  const logout = () => {
    userStore.logOut().then(() => {
      if (isHttp(LoginUrl)) {
        window.location.href = LoginUrl
      } else {
        router.replace(BaseLoginUrl)
      }
    })
  }

  return {
    logout
  }
}
