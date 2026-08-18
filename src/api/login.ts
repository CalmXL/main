import { ModelBaseUrl } from '@/config'
import { getToken } from '@/utils/auth'
import request from '@/utils/request'

// 登录方法 单账号方式登录
export function newLogin(tempToken: string) {
  return request({
    url: `/loginToken?tempToken=${tempToken}`,
    headers: { isToken: false },
    method: 'get'
  })
}

// 登录方法 原若依登录
export function login(username: string, password: string, code?: string, uuid?: string) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data
  })
}

// 注册方法
export function register(data: any) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({ url: '/getInfo', method: 'get' })
}

// 退出方法
export function logout() {
  fetch(`${window.location.origin}${ModelBaseUrl}/api/v1/auth/logout`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` }
  })

  return request({ url: '/logout', method: 'post' })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}
