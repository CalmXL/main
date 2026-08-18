/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA DOC2TS                        ##
 * ##                                                           ##
 * ## AUTHOR: space-77                                          ##
 * ## SOURCE: https://github.com/space-77/doc2ts                ##
 * ---------------------------------------------------------------
 */

import type { DocReqConfig } from 'doc2ts'
import ApiClient from '../client'
import type { UserManagement as types, __common__ } from './types'
/**
 * @name TeableUserManagement
 * @description Teable用户管理
 */
export default class UserManagement extends ApiClient {
  /**
   * @param { String } name
   * @summary 更新 Teable 用户名称
   * @description 更新当前用户的 Teable 用户名
   */
  patchName(name?: string) {
    const body = { name }
    const url = '/api/teable/user/name'
    const config: DocReqConfig = { url, body, method: 'patch' }
    return this.request<types.RPatchName>(config)
  }

  /**
   * @param { String } email
   * @summary 修改 Teable 用户邮箱
   * @description 修改当前用户的 Teable 邮箱，修改后自动重新登录
   */
  patchEmail(email?: string) {
    const body = { email }
    const url = '/api/teable/user/email'
    const config: DocReqConfig = { url, body, method: 'patch' }
    return this.request<types.RPatchEmail>(config)
  }

  /**
   * @summary 修改 Teable 用户密码
   * @description 修改当前用户的 Teable 密码，修改后自动重新登录
   */
  patchPassword(body: __common__.ControllersChangePasswordRequestBody) {
    const url = '/api/teable/user/password'
    const config: DocReqConfig = { url, body, method: 'patch' }
    return this.request<types.RPatchPassword>(config)
  }
}
export const userManagement = new UserManagement()
