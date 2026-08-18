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
import type { Statistics as types } from './types'
import { ModelFlowBaseUrl } from '@/config'
/**
 * @name statistics
 */
export default class Statistics extends ApiClient {
  baseURL = ModelFlowBaseUrl

  /**
   * @summary 获取任务统计数据
   * @description 获取任务统计数据，支持按优先级、用户ID和应用ID筛选
   */
  getTasksStatsPost(body: types.GetTasksStatsPostParams) {
    const url = '/stats/get_tasks_stats'
    const config: DocReqConfig = { url, method: 'post', body, config: { baseURL: this.baseURL } }
    return this.request<types.RGetTasksStatsPost>(config)
  }

  /**
   * @summary 获取记录数据
   * @description 获取所有记录数据，包含应用名称
   */
  getRecordsStatsPost() {
    const config: DocReqConfig = { url: '/stats/get_records', method: 'post', body: {}, config: { baseURL: this.baseURL } }
    return this.request<types.RGetRecordsStatsPost>(config)
  }

  /**
   * @summary 获取任务列表
   * @description 获取任务列表，支持分页和筛选
   */
  getTasksListStatsPost(body: types.GetTasksListStatsPostParams) {
    const url = '/stats/get_tasks_list'
    const config: DocReqConfig = { url, method: 'post', body, config: { baseURL: this.baseURL } }
    return this.request<types.RGetTasksListStatsPost>(config)
  }
}
export const statistics = new Statistics()
