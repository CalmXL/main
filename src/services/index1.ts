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
import type { Index1 as types } from './types'
/**
 * @name index
 * @description Method without tag
 */
export default class Index1 extends ApiClient {
  /**
   * @summary 通过路径参数的带思考标签OpenAI兼容聊天接口
   * @description 提供OpenAI兼容的聊天完成API，通过路径参数传递appKey。思考内容会用<thinking>标签包裹。model参数支持：空字符串、"auto"、"default"（使用应用默认模型），或指定具体模型名（必须存在且可用）。如果指定的模型不存在，会返回错误。支持enable_thinking参数控制思考模式
   */
  postCompletions(params: types.PostCompletionsParams1) {
    const { appKey, ...body } = params
    const url = `/thinkTag/${appKey}/v1/chat/completions`
    const config: DocReqConfig = { url, body, method: 'post' }
    return this.request<types.RPostCompletions>(config)
  }
}
export const index1 = new Index1()
