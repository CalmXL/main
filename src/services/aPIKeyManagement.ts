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
import type { APIKeyManagement as types, __common__ } from './types'
/**
 * @name APIKeyManagement
 * @description API密钥的增删改查、密钥脱敏显示等功能
 */
export default class APIKeyManagement extends ApiClient {
  /**
   * @summary 获取API密钥列表
   * @description 分页获取API密钥列表，支持筛选和搜索，密钥会脱敏显示
   */
  getApiKeys(query: types.GetApiKeysParams) {
    const url = `/api/v1/api-keys?${this.serialize(query)}`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetApiKeys>(config)
  }

  /**
   * @summary 创建新的API密钥
   * @description 创建一个新的API密钥配置，密钥会被脱敏显示
   */
  postApiKeys(body: __common__.ModelCreateAPIKeyRequest) {
    const config: DocReqConfig = { url: '/api/v1/api-keys', body, method: 'post' }
    return this.request<types.RPostApiKeys>(config)
  }

  /**
   * @param { Number } id API密钥ID
   * @summary 获取API密钥详情
   * @description 根据ID获取API密钥详细信息，密钥会脱敏显示
   */
  getApiKeysById(id: number) {
    const config: DocReqConfig = { url: `/api/v1/api-keys/${id}`, method: 'get' }
    return this.request<types.RGetApiKeysById>(config)
  }

  /**
   * @summary 更新API密钥信息
   * @description 根据ID更新API密钥配置信息，密钥会脱敏显示
   */
  putApiKeysById(params: types.PutApiKeysByIdParams1) {
    const { id, ...body } = params
    const url = `/api/v1/api-keys/${id}`
    const config: DocReqConfig = { url, body, method: 'put' }
    return this.request<types.RPutApiKeysById>(config)
  }

  /**
   * @param { Number } id API密钥ID
   * @summary 删除API密钥
   * @description 根据ID删除API密钥配置
   */
  deleteApiKeysById(id: number) {
    const url = `/api/v1/api-keys/${id}`
    const config: DocReqConfig = { url, method: 'delete' }
    return this.request<types.RDeleteApiKeysById>(config)
  }

  /**
   * @param { Number } id API密钥ID
   * @summary 测试API密钥可用性
   * @description 测试指定API密钥是否可用
   */
  postApiKeysByIdTest(id: number) {
    const url = `/api/v1/api-keys/${id}/test`
    const config: DocReqConfig = { url, method: 'post' }
    return this.request<types.RPostApiKeysByIdTest>(config)
  }
}
export const aPIKeyManagement = new APIKeyManagement()
