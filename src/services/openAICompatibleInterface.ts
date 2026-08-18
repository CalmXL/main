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
import type { OpenAICompatibleInterface as types } from './types'
/**
 * @name OpenAICompatibleInterface
 * @description OpenAI兼容接口
 */
export default class OpenAICompatibleInterface extends ApiClient {
  /**
   * @summary 获取可用模型列表
   * @description 获取当前应用可使用的模型列表
   */
  getModels() {
    const config: DocReqConfig = { url: '/v1/models', method: 'get' }
    return this.request<types.RGetModels>(config)
  }
}
export const openAICompatibleInterface = new OpenAICompatibleInterface()
