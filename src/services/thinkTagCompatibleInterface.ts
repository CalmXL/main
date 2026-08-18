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
import type { ThinkTagCompatibleInterface as types, __common__ } from './types'
/**
 * @name ThinkTagCompatibleInterface
 * @description 提供带思考标签的聊天完成API，思考内容用<thinking>标签包裹
 */
export default class ThinkTagCompatibleInterface extends ApiClient {
  /**
   * @summary 带思考标签的OpenAI兼容聊天接口
   * @description 提供OpenAI兼容的聊天完成API，支持多厂商模型。通过app_key参数指定应用，思考内容会用<thinking>标签包裹。model参数支持：空字符串、"auto"、"default"（使用应用默认模型），或指定具体模型名（必须存在且可用）。如果指定的模型不存在，会返回错误。支持enable_thinking参数控制思考模式。当应用启用请求队列且并发达到上限时，会返回QueueTaskResponse（包含task_id、status、wait_count、executable_at字段）
   */
  postCompletions(body: __common__.ModelChatCompletionRequest) {
    const url = '/thinkTag/v1/chat/completions'
    const config: DocReqConfig = { url, body, method: 'post' }
    return this.request<types.RPostCompletions>(config)
  }
}
export const thinkTagCompatibleInterface = new ThinkTagCompatibleInterface()
