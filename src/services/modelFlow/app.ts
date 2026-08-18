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
import type { App as types, __common__ } from './types'
import { ModelFlowBaseUrl } from '@/config'
/**
 * @name app
 */
export default class App extends ApiClient {
  baseURL = ModelFlowBaseUrl

  /**
   * @summary 创建应用
   * @description 创建应用记录
   */
  createAppPost(body: __common__.AppCreateRequest) {
    const config: DocReqConfig = { url: '/app/create/', body, method: 'post', config: { baseURL: this.baseURL } }
    return this.request<types.RCreateAppPost>(config)
  }

  /**
   * @param { String } app_id 应用ID
   * @summary 删除应用
   * @description 删除应用记录
   */
  deleteAppPost(app_id: string) {
    const body = { app_id }
    const config: DocReqConfig = { url: '/app/delete/', body, method: 'post', config: { baseURL: this.baseURL } }
    return this.request<types.RDeleteAppPost>(config)
  }

  /**
   * @summary 更新应用
   * @description 更新应用记录，如果表里面没有数据，就新增，如果表里面有数据，就修改
   */
  updateAppPost(body: __common__.AppCreateRequest) {
    const config: DocReqConfig = { url: '/app/update/', body, method: 'post', config: { baseURL: this.baseURL } }
    return this.request<types.RUpdateAppPost>(config)
  }

  /**
   * @summary 获取所有应用
   * @description 获取所有应用记录
   */
  getAppsAppAllPost() {
    const config: DocReqConfig = { url: '/app/get_all/', body: {}, method: 'post', config: { baseURL: this.baseURL } }
    return this.request<types.RGetAppsAppAllPost>(config)
  }
}
export const app = new App()
