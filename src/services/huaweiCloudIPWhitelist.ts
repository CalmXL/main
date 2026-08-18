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
import type { HuaweiCloudIPWhitelist as types } from './types'
/**
 * @name HuaweiCloudIPWhitelist
 * @description 华为云IP白名单
 */
export default class HuaweiCloudIPWhitelist extends ApiClient {
  /**
   * @summary 添加IP白名单
   * @description 将当前认证用户的客户端 IPv4 自动加入华为云 VPC IP 地址组，"先删后加"更新策略
   */
  postIpWhitelist() {
    const config: DocReqConfig = { url: '/api/v1/ip-whitelist', method: 'post' }
    return this.request<types.RPostIpWhitelist>(config)
  }
}
export const huaweiCloudIPWhitelist = new HuaweiCloudIPWhitelist()
