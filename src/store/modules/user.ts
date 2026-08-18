import qs from 'qs'
import { defineStore } from 'pinia'
import { RouteLocationNormalized } from 'vue-router'
import { logout, getInfo, login } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import defAva from '@/assets/images/profile.jpg'
import { stopAiWorkTask, stopRagTask } from '@/api/rag'
import { dataTrack } from '@/api/system/user'

export function checkImplant() {
  const { token, timestamp } = qs.parse(window.location.search.substring(1))
  return {
    qeToken: token as string | undefined,
    timestamp: timestamp as string | undefined,
    isImplant: !!token && !!timestamp
  }
}

type UserInfo = {
  token?: string
  qeToken?: string
  timestamp?: string
  name: string
  nickName: string
  avatar: string
  roles: any[]
  isImplant: boolean
  permissions: string[]
  userId: string
  phone: string
  email: string
}

const useUserStore = defineStore('user', {
  state: (): UserInfo => ({
    token: getToken(),
    name: '',
    nickName: '',
    avatar: '',
    roles: [],
    permissions: [],
    userId: '',
    phone: '',
    email: '',
    ...checkImplant()
  }),
  actions: {
    // 登录
    login(userInfo: { username: string; password: string; code: string; uuid: string }) {
      const username = userInfo.username.trim()
      const password = userInfo.password.trim()
      const code = userInfo.code?.trim()
      const uuid = userInfo.uuid?.trim()
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid)
          .then((res: any) => {
            setToken(res.token)
            this.token = res.token
            resolve(1)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res: any) => {
            const { user } = res
            const { avatar: _avatar } = user
            const avatar = _avatar === '' || _avatar == null ? defAva : import.meta.env.VITE_APP_BASE_API + _avatar

            if (res.roles && res.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              this.roles = res.roles
              this.permissions = res.permissions
            } else {
              this.roles = ['ROLE_DEFAULT']
            }
            // 处理手机号
            this.name = user.userName
            this.phone = user.phonenumber || ''
            this.avatar = avatar
            this.userId = user.userId
            this.nickName = user.nickName || ''
            this.email = user.email || ''
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 退出系统
    logOut() {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            this.token = ''
            this.roles = []
            this.permissions = []
            removeToken()
            resolve(1)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 页面埋点
    pagePuv(route?: RouteLocationNormalized) {
      if (!route) return
      const { fullPath, meta } = route
      const { isMicro, microPath, title, query } = meta
      let moduleRoute = fullPath || (query as any)?.moduleRoute || ''
      if (isMicro === '0' && microPath) {
        try {
          const { pathname } = new URL(microPath as string)
          moduleRoute = pathname
        } catch (error) {
          moduleRoute = ''
          console.error(error)
        }
      }

      if (title && moduleRoute) {
        dataTrack({ moduleRoute, moduleName: title })
      }
    },

    // 停止上次任务
    async stopTask() {
      // 获取上次任务
      await Promise.all([stopAiWorkTask(), stopRagTask()])
      console.log('停止历史任务成功')
    }
  }
})

export default useUserStore
