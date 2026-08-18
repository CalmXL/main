/* eslint-disable camelcase */
import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'
import { upperFirst, camelCase } from 'lodash'
import auth from '@/plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import { getRouters } from '@/api/menu'
// import Home from '@/layout/Home.vue'
import MicroHome from '@/views/micro/index.vue'
import IframePage from '@/views/micro/iframePage.vue'
import InnerLink from '@/layout/components/InnerLink/index.vue'
import ParentView from '@/components/ParentView/index.vue'
import EmptyPage from '@/layout/EmptyPage.vue'
// import Dashboard from '@/views/dashboard/index.vue'
import { deppEachFormatMicro, formatMicroPath, pathJoin } from '@/utils'
import { is804Env, isProd } from '@/config'
import { getDifyPublishList } from '@/api/system/appsModel'
import { getToken } from '@/utils/auth'

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue')

function routerRename(routerList: any[], prePath?: string): RouteRecordRaw | undefined {
  let flowItem: RouteRecordRaw | undefined

  routerList.forEach(item => {
    const { path, children = [] } = item
    item.name = upperFirst(camelCase(pathJoin(prePath, path).split('/').filter(Boolean).join('_')))
    if (item.name === 'WorkbenchFlow') flowItem = item
    if (Array.isArray(children) && children.length) {
      const res = routerRename(children, pathJoin(prePath, item.path))
      if (res) flowItem = res
    }
  })

  return flowItem
}

const usePermissionStore = defineStore('permission', {
  state: (): {
    routes: RouteRecordRaw[]
    navIndex: number
    addRoutes: RouteRecordRaw[]
    defaultRoutes: RouteRecordRaw[]
    topbarRouters: RouteRecordRaw[]
    sidebarRouters: RouteRecordRaw[]
  } => ({
    routes: [],
    navIndex: 0,
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: []
  }),
  actions: {
    setRoutes(routes: RouteRecordRaw[]) {
      this.addRoutes = routes
      this.routes = constantRoutes.concat(routes)
    },
    setDefaultRoutes(routes: RouteRecordRaw[]) {
      this.defaultRoutes = constantRoutes.concat(routes)
    },
    setTopbarRoutes(routes: RouteRecordRaw[]) {
      this.topbarRouters = routes
    },
    setSidebarRouters(routes: RouteRecordRaw[]) {
      this.sidebarRouters = routes
    },
    generateRoutes() {
      return new Promise<any[]>(resolve => {
        // 向后端请求路由数据
        getRouters().then(async ({ data = [] }) => {
          const flowItem = routerRename(data) as any
          if (flowItem) {
            flowItem.redirect = 'noRedirect'
            flowItem.alwaysShow = true
            flowItem.component = 'ParentView'

            flowItem.meta.isMicro = undefined
            let openLink = false

            try {
              openLink = JSON.parse(flowItem.query || '{}').openLink
            } catch (error) {
              console.error(error)
            }

            const tokenKey = 'access_token'

            try {
              const { result, workflow_list = [] } = (await getDifyPublishList(1000)) as any
              if (result === 'success' && Array.isArray(workflow_list) && workflow_list.length > 0) {
                flowItem.children = workflow_list.map(item => {
                  if (openLink) {
                    const link = `${window.location.origin}${pathJoin('/dify', item.route)}?${tokenKey}=${getToken()}`
                    return {
                      component: 'Layout',
                      hidden: false,
                      name: item.route,
                      path: link,
                      query: '{"disabled":false,"group":"dify","showHistory":false}',
                      meta: { icon: '#', isMicro: '1', link, noCache: false, title: item.name }
                    }
                  }
                  return {
                    component: pathJoin('/dify', item.route) as any,
                    hidden: false,
                    name: item.route,
                    path: item.route,
                    query: `{"disabled":false,"group":"dify","showHistory":false, "microType": "iframe", "tokenKey": "${tokenKey}"}`,
                    meta: { icon: '#', isMicro: '0', link: null, noCache: false, title: item.name }
                  }
                })

                flowItem.hidden = (flowItem.children?.length ?? 0) === 0
              } else {
                flowItem.hidden = true
              }
            } catch (error) {
              console.error('工作流接口报错', error)
            }
          }

          sessionStorage.setItem('main-routes', JSON.stringify(data))

          data.forEach((item: any) => {
            const { path, hidden, children = [] } = item
            if (path === '/' && !hidden && Array.isArray(children) && children.length === 1) {
              const [menu] = children
              const { meta, name, component } = menu
              item.meta = meta
              item.name = name
              item.path = menu.path
              item.children = null

              // 设置微应用的地址
              if (meta && meta.isMicro === '0') meta.microPath = formatMicroPath(component)
            } else if (Array.isArray(children) && children.length > 0) {
              deppEachFormatMicro([item])
            }
          })

          const sdata = JSON.parse(JSON.stringify(data))
          const rdata = JSON.parse(JSON.stringify(data))
          const defaultData = JSON.parse(JSON.stringify(data))
          const sidebarRoutes = filterAsyncRouter(sdata)
          const rewriteRoutes = filterAsyncRouter(rdata, false, true) // 渲染的路由
          const defaultRoutes = filterAsyncRouter(defaultData)
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes)

          asyncRoutes.forEach(router.addRoute)
          this.setRoutes(rewriteRoutes)
          this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))
          this.setDefaultRoutes(sidebarRoutes)
          this.setTopbarRoutes(defaultRoutes)
          resolve(rewriteRoutes)
        })
      })
    },
    setNavIndex(index: number) {
      this.navIndex = index
    }
  },
  getters: {
    allRoutes(): RouteRecordRaw[] {
      return this.topbarRouters // .filter(i => !i.hidden)
    },
    allRoutesF(): RouteRecordRaw[] {
      const routers: RouteRecordRaw[] = []

      function filterChildren(children: RouteRecordRaw[], prePath = '') {
        children.forEach(child => {
          const thatPath = `/${pathJoin(prePath, child.path)}`
          if (child.children) filterChildren(child.children, thatPath)
          routers.push({ ...child, path: thatPath })
        })
      }

      filterChildren(this.topbarRouters)
      return routers // .filter(i => !i.hidden)
    },
    navList(): RouteRecordRaw[] {
      return this.topbarRouters.filter(i => {
        let dev = false
        try {
          const query = (i as any)?.query || '{}'
          if (query) dev = JSON.parse(query)?.dev
        } catch {}

        if (!isProd && dev) return true

        if (is804Env) {
          if (i.path === '/qa') return true
          return !i.hidden
        }
        return !i.hidden
      })
    },
    activeMenuInfo(): RouteRecordRaw {
      const { navIndex, navList } = this
      return navList[navIndex]
    }
  }
})

const MicroUrlRegex = /^(\S+)\/http:\/location\.origin\//

function formatMicroUrlPath(path?: string) {
  if (!path) return path
  if (path.startsWith('http://location.origin/')) {
    path = path.replace('http://location.origin/', '')
    const [, ...paths] = path.split('/')
    return paths.join('/')
  }

  return path
}
// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap: any[], lastRouter = false, type = false, level = 0) {
  return asyncRouterMap.filter(route => {
    const { meta, query, children, path } = route

    route.path = formatMicroUrlPath(path)

    if (MicroUrlRegex.test(route.path)) {
      route.path = route.path.replace(MicroUrlRegex, '')
    }

    if (level > 0 && route.path.startsWith('/')) {
      route.path = path.replace(/^\/+/, '')
    }

    const { isMicro = '1' } = meta ?? {}

    if (type && children) {
      route.children = filterChildren(children)
    }

    let microType = ''
    try {
      const q = JSON.parse(query || '{}')
      microType = q?.microType
      if (!route.meta) route.meta = {}
      route.meta.query = q
    } catch (error) {
      console.error(error)
    }

    if (isMicro === '0') {
      meta.link = null

      if (microType === 'iframe') {
        route.component = IframePage
      } else {
        route.component = MicroHome
      }
    } else if (route.component) {
      // Layout ParentView 组件特殊处理

      if (route.component === 'Layout') {
        route.component = EmptyPage
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      const children = filterAsyncRouter(route.children, route, type, level + 1)

      if (Array.isArray(children) && children.length > 0) route.redirect = pathJoin(route.path, route.children[0].path)

      route.children = children
    } else {
      delete route.children
      delete route.redirect
    }
    return true
  })
}

function filterChildren(childrenMap: any[], lastRouter: any = false) {
  let children: any[] = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach((c: any) => {
          c.path = pathJoin(el.path, c.path) // .replace(/^\/+/, '')
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = pathJoin(lastRouter.path, el.path) // .replace(/^\/+/, '')
    }
    children = children.concat(el)
  })
  return children
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes: any[]) {
  const res: any[] = []
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}

export const loadView = (view: any) => {
  let res

  // Object.entries(modules)
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0]
    if (dir === view) {
      res = () => modules[path]()
    }
  }
  return res
}

export default usePermissionStore
