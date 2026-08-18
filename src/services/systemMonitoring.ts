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
import type { SystemMonitoring as types } from './types'
/**
 * @name SystemMonitoring
 * @description 健康检查和系统状态监控接口
 */
export default class SystemMonitoring extends ApiClient {
  /**
   * @summary 健康检查
   * @description 检查服务基本健康状态
   */
  getHealth() {
    const config: DocReqConfig = { url: '/health', method: 'get' }
    return this.request<types.RGetHealth>(config)
  }

  /**
   * @summary 系统状态检查
   * @description 获取系统详细状态信息，包括数据库、模型统计等
   */
  getStatus() {
    const config: DocReqConfig = { url: '/status', method: 'get' }
    return this.request<types.RGetStatus>(config)
  }
}
export const systemMonitoring = new SystemMonitoring()
