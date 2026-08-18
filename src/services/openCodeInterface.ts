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
import type { OpenCodeInterface as types, __common__ } from './types'
/**
 * @name OpenCodeInterface
 * @description OpenCode CLI 集成接口，提供模型发现和流式聊天能力
 */
export default class OpenCodeInterface extends ApiClient {
  /**
   * @summary 获取 OpenCode 模型列表
   * @description 从已运行的 OpenCode 服务获取所有可用的 provider 及其模型列表。返回展平后的模型列表，格式为 "{providerID}/{modelID}"。需要本地已安装并运行 OpenCode CLI。
   */
  getModels() {
    const url = '/api/opencode/v1/models'
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetModels>(config)
  }

  /**
   * @summary OpenCode 流式聊天
   * @description 通过本地的 OpenCode CLI 进行流式聊天，返回 OpenAI 兼容的 SSE 流式格式。请求体格式参考 OpenAI Chat Completions API。
   */
  postChatCompletions(body: __common__.ModelOpenCodeChatRequest) {
    const url = '/api/opencode/v1/chat/completions'
    const config: DocReqConfig = { url, body, method: 'post' }
    return this.request<types.RPostChatCompletions>(config)
  }
}
export const openCodeInterface = new OpenCodeInterface()
