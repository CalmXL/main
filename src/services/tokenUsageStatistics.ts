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
import type { TokenUsageStatistics as types } from './types'
/**
 * @name TokenUsageStatistics
 * @description Token使用统计
 */
export default class TokenUsageStatistics extends ApiClient {
  /**
   * @summary 按应用查询token使用情况
   * @description 按应用维度统计token使用情况，支持分页
   */
  getByApp(query: types.GetByAppParams) {
    const url = `/api/v1/token-usage/by-app?${this.serialize(query)}`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetByApp>(config)
  }

  /**
   * @summary 按时间查询token使用情况
   * @description 按日、周、月粒度统计token使用情况
   */
  getByTime(query: types.GetByTimeParams) {
    const url = `/api/v1/token-usage/by-time?${this.serialize(query)}`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetByTime>(config)
  }

  /**
   * @summary 按用户查询token使用情况
   * @description 按用户维度统计token使用情况，支持分页
   */
  getByUser(query: types.GetByUserParams) {
    const url = `/api/v1/token-usage/by-user?${this.serialize(query)}`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetByUser>(config)
  }

  /**
   * @summary 按模型名称查询token使用情况
   * @description 按模型名称维度统计token使用情况，支持分页
   */
  getByModel(query: types.GetByModelParams) {
    const url = `/api/v1/token-usage/by-model?${this.serialize(query)}`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetByModel>(config)
  }

  /**
   * @summary 获取token使用概览
   * @description 获取指定时间范围和应用内的token使用统计概览
   */
  getOverview(query: types.GetOverviewParams) {
    const url = `/api/v1/token-usage/overview?${this.serialize(query)}`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetOverview>(config)
  }
}
export const tokenUsageStatistics = new TokenUsageStatistics()
