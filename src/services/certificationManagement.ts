/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA DOC2TS                        ##
 * ##                                                           ##
 * ## AUTHOR: space-77                                          ##
 * ## SOURCE: https://github.com/space-77/doc2ts                ##
 * ---------------------------------------------------------------
 */

import type { DocReqConfig } from 'doc2ts'
import ApiClient from './client'
import type { CertificationManagement as types } from './types'
/**
 * @name CertificationManagement
 * @description 认证管理
 */
export default class CertificationManagement extends ApiClient {
  /**
   * @summary 登出清除用户缓存
   * @description 清除当前请求 token 在 Redis 中缓存的用户信息。前端调用若依 logout 后应调用此接口，避免本项目继续使用已失效的缓存。
   */
  postLogout() {
    const config: DocReqConfig = { url: '/api/v1/auth/logout', method: 'post' }
    return this.request<types.RPostLogout>(config)
  }
}
export const certificationManagement = new CertificationManagement()
