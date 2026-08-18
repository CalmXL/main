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
import type { ConversationRecord as types, __common__ } from './types'
/**
 * @name ConversationRecord
 * @description 对话记录
 */
export default class ConversationRecord extends ApiClient {
  /**
   * @summary 获取对话记录
   * @description 获取应用的对话记录列表，支持按应用ID、会话ID、对话ID、模型名称、时间范围和关键字筛选，支持分页
   */
  getChatRecords(query: types.GetChatRecordsParams) {
    const url = `/api/v1/chat-records?${this.serialize(query)}`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetChatRecords>(config)
  }

  /**
   * @summary 删除对话记录
   * @description 批量删除对话记录，支持按记录ID列表、应用ID、会话ID、对话ID或时间范围删除
   */
  deleteChatRecords(body: __common__.ModelDeleteChatRecordsRequest) {
    const url = '/api/v1/chat-records'
    const config: DocReqConfig = { url, body, method: 'delete' }
    return this.request<types.RDeleteChatRecords>(config)
  }

  /**
   * @summary 清理对话记录
   * @description 清理所有应用的旧对话记录，删除超过配置最大数量的记录
   */
  postChatRecordsCleanup() {
    const url = '/api/v1/chat-records/cleanup'
    const config: DocReqConfig = { url, method: 'post' }
    return this.request<types.RPostChatRecordsCleanup>(config)
  }
}
export const conversationRecord = new ConversationRecord()
