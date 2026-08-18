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
import type { ModelForwardingInterface as types, __common__ } from './types'
/**
 * @name ModelForwardingInterface
 * @description 提供带思考标签的聊天完成API，思考内容用<thinking>标签包裹
 */
export default class ModelForwardingInterface extends ApiClient {
  /**
   * @summary Rerank 模型转发
   * @description 提供通用 Rerank API，通过路径参数传递 appKey。model 参数支持空字符串、"auto"、"default"（使用应用默认模型），或指定具体模型名。
   */
  postByAppKeyV1Rerank(params: types.PostByAppKeyV1RerankParams1) {
    const { appKey, ...body } = params
    const url = `/${appKey}/v1/rerank`
    const config: DocReqConfig = { url, body, method: 'post' }
    return this.request<types.RPostByAppKeyV1Rerank>(config)
  }

  /**
   * @summary OpenAI模型转发（已废弃）
   * @description 已废弃，请使用 /{appKey}/v1/chat/completions 代替。提供OpenAI兼容的聊天完成API，支持多厂商模型。通过app_key参数指定应用。model参数支持：空字符串、"auto"、"default"（使用应用默认模型），或指定具体模型名（必须存在且可用）。如果指定的模型不存在，会返回错误。支持enable_thinking参数控制思考模式。当应用启用请求队列且并发达到上限时，会返回QueueTaskResponse（包含task_id、status、wait_count、executable_at字段）
   * @deprecated
   */
  postV1ChatCompletions(body: __common__.ModelChatCompletionRequest) {
    const url = '/v1/chat/completions'
    const config: DocReqConfig = { url, body, method: 'post' }
    return this.request<types.RPostV1ChatCompletions>(config)
  }

  /**
   * @summary OpenAI Responses API 转发
   * @description 提供 OpenAI Responses API 兼容接口，支持原生转发与 chat/completions 适配
   */
  postByAppKeyV1Responses(params: types.PostByAppKeyV1ResponsesParams1) {
    const { appKey, ...body } = params
    const url = `/${appKey}/v1/responses`
    const config: DocReqConfig = { url, body, method: 'post' }
    return this.request<types.RPostByAppKeyV1Responses>(config)
  }

  /**
   * @summary OpenAI Embeddings 模型转发
   * @description 提供 OpenAI 兼容的 Embeddings API，通过路径参数传递 appKey。model 参数支持空字符串、"auto"、"default"（使用应用默认模型），或指定具体模型名（必须存在且可用）。input 支持单个字符串或字符串数组。
   */
  postByAppKeyV1Embeddings(params: types.PostByAppKeyV1EmbeddingsParams1) {
    const { appKey, ...body } = params
    const url = `/${appKey}/v1/embeddings`
    const config: DocReqConfig = { url, body, method: 'post' }
    return this.request<types.RPostByAppKeyV1Embeddings>(config)
  }

  /**
   * @summary OpenAI模型转发 - ThinkTag（已废弃）
   * @description 已废弃，请使用 /thinkTag/{appKey}/v1/chat/completions 代替。提供OpenAI兼容的聊天完成API，支持多厂商模型。通过app_key参数指定应用，思考内容会用<thinking>标签包裹。model参数支持：空字符串、"auto"、"default"（使用应用默认模型），或指定具体模型名（必须存在且可用）。如果指定的模型不存在，会返回错误。支持enable_thinking参数控制思考模式。当应用启用请求队列且并发达到上限时，会返回QueueTaskResponse（包含task_id、status、wait_count、executable_at字段）
   * @deprecated
   */
  postThinkTagV1ChatCompletions(body: __common__.ModelChatCompletionRequest) {
    const url = '/thinkTag/v1/chat/completions'
    const config: DocReqConfig = { url, body, method: 'post' }
    return this.request<types.RPostThinkTagV1ChatCompletions>(config)
  }

  /**
   * @summary OpenAI模型转发
   * @description 提供OpenAI兼容的聊天完成API，通过路径参数传递appKey。model参数支持：空字符串、"auto"、"default"（使用应用默认模型），或指定具体模型名（必须存在且可用）。如果指定的模型不存在，会返回错误。支持enable_thinking参数控制思考模式。当应用启用请求队列且并发达到上限时，会返回QueueTaskResponse（包含task_id、status、wait_count、executable_at字段）
   */
  postByAppKeyV1ChatCompletions(params: types.PostByAppKeyV1ChatCompletionsParams1) {
    const { appKey, ...body } = params
    const url = `/${appKey}/v1/chat/completions`
    const config: DocReqConfig = { url, body, method: 'post' }
    return this.request<types.RPostByAppKeyV1ChatCompletions>(config)
  }

  /**
   * @summary Anthropic模型转发
   * @description 接收 Anthropic Messages API 格式的请求，转换为 OpenAI 格式发送，响应再转换回 Anthropic 格式。当应用启用请求队列且并发达到上限时，会返回QueueTaskResponse（包含task_id、status、wait_count、executable_at字段）
   */
  postByAppKeyAnthropicV1Messages(params: types.PostByAppKeyAnthropicV1MessagesParams1) {
    const { appKey, ...body } = params
    const url = `/${appKey}/anthropic/v1/messages`
    const config: DocReqConfig = { url, body, method: 'post' }
    return this.request<types.RPostByAppKeyAnthropicV1Messages>(config)
  }

  /**
   * @summary 获取已存储的 Response
   */
  getByAppKeyV1ResponsesByResponseId({ appKey, response_id }: types.GetByAppKeyV1ResponsesByResponseIdParams) {
    const url = `/${appKey}/v1/responses/${response_id}`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetByAppKeyV1ResponsesByResponseId>(config)
  }

  /**
   * @summary OpenAI模型转发 - ThinkTag
   * @description 提供OpenAI兼容的聊天完成API，通过路径参数传递appKey。思考内容会用<thinking>标签包裹。model参数支持：空字符串、"auto"、"default"（使用应用默认模型），或指定具体模型名（必须存在且可用）。如果指定的模型不存在，会返回错误。支持enable_thinking参数控制思考模式。当应用启用请求队列且并发达到上限时，会返回QueueTaskResponse（包含task_id、status、wait_count、executable_at字段）
   */
  postThinkTagByAppKeyV1ChatCompletions(params: types.PostThinkTagByAppKeyV1ChatCompletionsParams1) {
    const { appKey, ...body } = params
    const url = `/thinkTag/${appKey}/v1/chat/completions`
    const config: DocReqConfig = { url, body, method: 'post' }
    return this.request<types.RPostThinkTagByAppKeyV1ChatCompletions>(config)
  }

  /**
   * @summary 删除已存储的 Response
   */
  deleteByAppKeyV1ResponsesByResponseId({ appKey, response_id }: types.DeleteByAppKeyV1ResponsesByResponseIdParams) {
    const url = `/${appKey}/v1/responses/${response_id}`
    const config: DocReqConfig = { url, method: 'delete' }
    return this.request<types.RDeleteByAppKeyV1ResponsesByResponseId>(config)
  }

  /**
   * @summary 取消进行中的 Response
   */
  postByAppKeyV1ResponsesByResponseIdCancel({ appKey, response_id }: types.PostByAppKeyV1ResponsesByResponseIdCancelParams) {
    const url = `/${appKey}/v1/responses/${response_id}/cancel`
    const config: DocReqConfig = { url, method: 'post' }
    return this.request<types.RPostByAppKeyV1ResponsesByResponseIdCancel>(config)
  }
}
export const modelForwardingInterface = new ModelForwardingInterface()
