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
import type { AppliedStatistics as types } from './types'
/**
 * @name AppliedStatistics
 * @description 应用统计
 */
export default class AppliedStatistics extends ApiClient {
  /**
   * @summary 获取所有应用token统计
   * @description 获取所有应用的累计token使用统计信息，支持按应用ID列表筛选
   */
  getTokenStats(application_ids: types.GetTokenStatsParams['application_ids']) {
    const url = `/api/v1/applications/token-stats?${this.serialize({ application_ids })}`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetTokenStats>(config)
  }

  /**
   * @param { Number } id 应用ID
   * @summary 获取应用对话统计
   * @description 获取指定应用的详细对话统计信息，包括总对话数、总请求数、总token使用量、流式请求占比和最后使用时间
   */
  getByIdChatStats(id: number) {
    const url = `/api/v1/applications/${id}/chat-stats`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetByIdChatStats>(config)
  }

  /**
   * @param { Number } id 应用ID
   * @summary 获取应用token统计
   * @description 获取指定应用的累计token使用统计信息，包括总token数量、请求数量和最后请求时间
   */
  getByIdTokenStats(id: number) {
    const url = `/api/v1/applications/${id}/token-stats`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetByIdTokenStats>(config)
  }
}
export const appliedStatistics = new AppliedStatistics()
