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
import type { PlatformManagement as types, __common__ } from './types'
/**
 * @name PlatformManagement
 * @description 平台管理
 */
export default class PlatformManagement extends ApiClient {
  /**
   * @summary 获取平台列表
   * @description 分页获取平台列表
   */
  getPlatforms(query: types.GetPlatformsParams) {
    const url = `/api/v1/platforms?${this.serialize(query)}`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetPlatforms>(config)
  }

  /**
   * @summary 创建平台
   * @description 创建一个新的平台配置
   */
  postPlatforms(body: __common__.ModelCreatePlatformRequest) {
    const url = '/api/v1/platforms'
    const config: DocReqConfig = { url, body, method: 'post' }
    return this.request<types.RPostPlatforms>(config)
  }

  /**
   * @param { Number } id 平台ID
   * @summary 获取平台详情
   * @description 根据ID获取平台详细信息
   */
  getPlatformsById(id: number) {
    const url = `/api/v1/platforms/${id}`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetPlatformsById>(config)
  }

  /**
   * @summary 更新平台
   * @description 根据ID更新平台配置
   */
  putPlatformsById(params: types.PutPlatformsByIdParams1) {
    const { id, ...body } = params
    const url = `/api/v1/platforms/${id}`
    const config: DocReqConfig = { url, body, method: 'put' }
    return this.request<types.RPutPlatformsById>(config)
  }

  /**
   * @param { Number } id 平台ID
   * @summary 删除平台
   * @description 根据ID删除平台配置
   */
  deletePlatformsById(id: number) {
    const url = `/api/v1/platforms/${id}`
    const config: DocReqConfig = { url, method: 'delete' }
    return this.request<types.RDeletePlatformsById>(config)
  }

  /**
   * @param { Number } id 平台ID
   * @summary 轮询平台apiKey可用性
   * @description 测试平台关联的所有apiKey的可用性
   */
  postPlatformsByIdPoll(id: number) {
    const url = `/api/v1/platforms/${id}/poll`
    const config: DocReqConfig = { url, method: 'post' }
    return this.request<types.RPostPlatformsByIdPoll>(config)
  }

  /**
   * @param { Number } id 平台ID
   * @summary 获取平台可用模型列表
   * @description 根据平台配置获取可用的模型列表
   */
  getPlatformsByIdModels(id: number) {
    const url = `/api/v1/platforms/${id}/models`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetPlatformsByIdModels>(config)
  }

  /**
   * @summary 为平台添加API密钥
   * @description 为指定平台批量添加API密钥，支持逗号分隔添加多个密钥
   */
  postPlatformsByIdApiKeys(params: types.PostPlatformsByIdApiKeysParams1) {
    const { id, ...body } = params
    const url = `/api/v1/platforms/${id}/api-keys`
    const config: DocReqConfig = { url, body, method: 'post' }
    return this.request<types.RPostPlatformsByIdApiKeys>(config)
  }
}
export const platformManagement = new PlatformManagement()
