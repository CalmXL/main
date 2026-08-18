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
import type { Certification as types } from './types'
/**
 * @name TeableCertification
 * @description Teable认证
 */
export default class Certification extends ApiClient {
  /**
   * @summary 自动登录 Teable 用户
   * @description 根据当前认证用户自动登录 Teable 账号，如用户不存在则自动注册
   */
  postLogin() {
    const url = '/api/teable/auth/login'
    const config: DocReqConfig = { url, method: 'post' }
    return this.request<types.RPostLogin>(config)
  }

  /**
   * @summary 自动注册 Teable 用户
   * @description 根据当前认证用户自动注册 Teable 账号，如用户已存在则自动登录
   */
  postRegister() {
    const url = '/api/teable/auth/register'
    const config: DocReqConfig = { url, method: 'post' }
    return this.request<types.RPostRegister>(config)
  }
}
export const certification = new Certification()
