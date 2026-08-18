import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import router from './router'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { isHttp } from '@/utils/validate'
import { isRelogin } from '@/utils/request'
import useUserStore from '@/store/modules/user'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'
import HomePage from '@/layout/Home.vue'
import { BaseLoginUrl, LoginUrl } from './config'
import { getRoutePath } from './utils'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/register']

router.beforeEach((to, from, next) => {
  NProgress.start()

  const userStore = useUserStore()

  if (getToken()) {
    const { meta } = to
    const settingsStore = useSettingsStore()

    meta.title && settingsStore.setTitle(meta.title)
    /* has token */
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else if (userStore.roles.length === 0) {
      isRelogin.show = true
      // 判断当前用户是否已拉取完user_info信息
      userStore
        .getInfo()
        .then(() => {
          isRelogin.show = false
          usePermissionStore()
            .generateRoutes()
            .then(accessRoutes => {
              // 根据roles权限生成可访问的路由表
              const children = accessRoutes.filter(route => {
                if (route?.meta?.isMicro === '0') {
                  // delete route.redirect
                  delete route.alwaysShow
                }

                // 动态添加可访问路由表
                if (isHttp(route.path)) return false
                if (!/^\//.test(route.path)) route.path = `/${route.path}`

                return true
              })

              router.addRoute({ path: '/', component: HomePage, children })

              const allRoutes = router.getRoutes()
              const hasNextPathAuth = allRoutes.some(route => route.path === to.path)

              if (hasNextPathAuth) {
                userStore.pagePuv(to)
                next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
              } else {
                const firstRoute = children?.[0]
                userStore.pagePuv(firstRoute)
                next({ path: getRoutePath(firstRoute) || '/' })
              }
            })
        })
        .catch(err => {
          userStore.logOut().then(() => {
            ElMessage.error(err)
            next({ path: '/' })
          })
        })
    } else {
      userStore.pagePuv(to)
      next()
    }
  } else {
    // 没有token
    // eslint-disable-next-line no-lonely-if
    if (whiteList.includes(to.path)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      if (isHttp(LoginUrl)) {
        window.location.href = LoginUrl
      } else {
        next(`${BaseLoginUrl}?redirect=${encodeURIComponent(to.fullPath)}`) // 否则全部重定向到登录页
      }
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
