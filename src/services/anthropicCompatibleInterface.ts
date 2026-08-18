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
import type { AnthropicCompatibleInterface as types } from './types'
/**
 * @name AnthropicCompatibleInterface
 * @description Anthropic兼容接口
 */
export default class AnthropicCompatibleInterface extends ApiClient {
  /**
   * @param { String } appKey 应用API密钥
   * @summary Anthropic 兼容的 Messages 接口
   * @description 接收 Anthropic Messages API 格式的请求，转换为 OpenAI 格式发送，响应再转换回 Anthropic 格式。当应用启用请求队列且并发达到上限时，会返回QueueTaskResponse（包含task_id、status、wait_count、executable_at字段）
   */
  postMessages(appKey: string) {
    const url = `/${appKey}/anthropic/v1/messages`
    const config: DocReqConfig = { url, method: 'post' }
    return this.request<types.RPostMessages>(config)
  }
}
export const anthropicCompatibleInterface = new AnthropicCompatibleInterface()
