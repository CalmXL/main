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
import type { ApplicationManagement as types, __common__ } from './types'
/**
 * @name ApplicationManagement
 * @description 应用配置的增删改查、模型关联、同步等功能
 */
export default class ApplicationManagement extends ApiClient {
  /**
   * @summary 获取应用列表
   * @description 分页获取应用列表，支持多种筛选和搜索方式。返回应用基本信息、关联模型列表和默认模型信息，模型数据已过滤API密钥等敏感信息
   */
  getApplications(query: types.GetApplicationsParams) {
    const url = `/api/v1/applications?${this.serialize(query)}`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetApplications>(config)
  }

  /**
   * @summary 创建新应用
   * @description 创建一个新的应用配置。支持自定义appKey、关联模型和设置默认模型。如果不提供appKey则系统自动生成唯一标识。可以在创建时同时关联多个模型并指定默认模型
   */
  postApplications(body: __common__.ModelCreateApplicationRequest) {
    const url = '/api/v1/applications'
    const config: DocReqConfig = { url, body, method: 'post' }
    return this.request<types.RPostApplications>(config)
  }

  /**
   * @param { Number } id 应用ID
   * @summary 获取应用详情
   * @description 根据ID获取应用详细信息
   */
  getApplicationsById(id: number) {
    const url = `/api/v1/applications/${id}`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetApplicationsById>(config)
  }

  /**
   * @summary 更新应用信息
   * @description 根据ID更新应用配置信息。支持更新应用名称、描述、appKey和默认模型。更新appKey时会验证唯一性，更新默认模型时会验证该模型是否已关联到此应用
   */
  putApplicationsById(params: types.PutApplicationsByIdParams1) {
    const { id, ...body } = params
    const url = `/api/v1/applications/${id}`
    const config: DocReqConfig = { url, body, method: 'put' }
    return this.request<types.RPutApplicationsById>(config)
  }

  /**
   * @param { Number } id 应用ID
   * @summary 删除应用
   * @description 根据ID删除应用配置
   */
  deleteApplicationsById(id: number) {
    const url = `/api/v1/applications/${id}`
    const config: DocReqConfig = { url, method: 'delete' }
    return this.request<types.RDeleteApplicationsById>(config)
  }

  /**
   * @param { Number } id 应用ID
   * @summary 获取应用配置信息
   * @description 获取应用的详细配置信息，包括关联的模型和默认模型
   */
  getApplicationsByIdConfig(id: number) {
    const url = `/api/v1/applications/${id}/config`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetApplicationsByIdConfig>(config)
  }

  /**
   * @param { Number } id 应用ID
   * @summary 获取应用关联的模型列表
   * @description 获取指定应用所关联的所有模型列表
   */
  getApplicationsByIdModels(id: number) {
    const url = `/api/v1/applications/${id}/models`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetApplicationsByIdModels>(config)
  }

  /**
   * @param { String } app_key 应用唯一标识密钥，格式通常为'app_'开头的字符串
   * @summary 通过AppKey获取应用详情
   * @description 根据应用的唯一标识appKey获取应用详细信息。这是除了ID查询之外的另一种精确查询方式
   */
  getApplicationsKeyByAppKey(app_key: string) {
    const url = `/api/v1/applications/key/${app_key}`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetApplicationsKeyByAppKey>(config)
  }

  /**
   * @summary 为应用添加模型
   * @description 为指定应用添加一个或多个模型，可设置默认模型
   */
  postApplicationsByIdModels(params: types.PostApplicationsByIdModelsParams1) {
    const { id, ...body } = params
    const url = `/api/v1/applications/${id}/models`
    const config: DocReqConfig = { url, body, method: 'post' }
    return this.request<types.RPostApplicationsByIdModels>(config)
  }

  /**
   * @summary 更新应用启用状态
   * @description 启用或禁用指定应用
   */
  patchApplicationsByIdStatus(params: types.PatchApplicationsByIdStatusParams1) {
    const { id, ...body } = params
    const url = `/api/v1/applications/${id}/status`
    const config: DocReqConfig = { url, body, method: 'patch' }
    return this.request<types.RPatchApplicationsByIdStatus>(config)
  }

  /**
   * @summary 设置应用默认模型
   * @description 为指定应用设置默认使用的模型
   */
  putApplicationsByIdDefaultModel(params: types.PutApplicationsByIdDefaultModelParams1) {
    const { id, ...body } = params
    const url = `/api/v1/applications/${id}/default-model`
    const config: DocReqConfig = { url, body, method: 'put' }
    return this.request<types.RPutApplicationsByIdDefaultModel>(config)
  }

  /**
   * @summary 批量更新应用模型并发配置
   * @description 批量修改多个应用-模型关联的并发限制（app_concurrency 和 user_concurrency），支持跨应用批量修改。每项都会校验 app_concurrency 总和不超过模型并发限制。成功时 data 为 null。
   */
  putApplicationsModelsConcurrency(items: __common__.ModelBatchUpdateModelConcurrencyRequest['items']) {
    const body = { items }
    const url = '/api/v1/applications/models/concurrency'
    const config: DocReqConfig = { url, body, method: 'put' }
    return this.request<types.RPutApplicationsModelsConcurrency>(config)
  }

  /**
   * @param { Number } id 应用ID
   * @summary 同步RAG模型
   * @description 为指定应用同步RAG模型，仅当应用app_key为"RAG"时执行。使用请求头中的Authorization信息作为RAG服务的认证token。返回详细的同步结果，包括成功/失败的数量和错误详情
   */
  postApplicationsByIdSyncRagModels(id: number) {
    const url = `/api/v1/applications/${id}/sync-rag-models`
    const config: DocReqConfig = { url, method: 'post' }
    return this.request<types.RPostApplicationsByIdSyncRagModels>(config)
  }

  /**
   * @param { Number } id 应用ID
   * @summary 同步DIFY模型
   * @description 为指定应用同步DIFY模型，仅当应用app_key为"DIFY"时执行。使用请求头中的Authorization信息进行认证。返回详细的同步结果，包括成功/失败的数量和错误详情
   */
  postApplicationsByIdSyncDifyModels(id: number) {
    const url = `/api/v1/applications/${id}/sync-dify-models`
    const config: DocReqConfig = { url, method: 'post' }
    return this.request<types.RPostApplicationsByIdSyncDifyModels>(config)
  }

  /**
   * @param { Number } id 应用ID
   * @summary 同步SONIC模型
   * @description 为指定应用同步SONIC模型，仅当应用app_key为"SONIC"时执行。使用请求头中的Authorization信息作为SONIC服务的认证token。返回详细的同步结果，包括成功/失败的数量和错误详情
   */
  postApplicationsByIdSyncSonicModels(id: number) {
    const url = `/api/v1/applications/${id}/sync-sonic-models`
    const config: DocReqConfig = { url, method: 'post' }
    return this.request<types.RPostApplicationsByIdSyncSonicModels>(config)
  }

  /**
   * @param { Number } id 应用ID
   * @summary 获取应用模型并发配置列表
   * @description 查询指定应用下所有关联模型的并发限制配置（app_concurrency 和 user_concurrency），按模型关联顺序返回
   */
  getApplicationsByIdModelsConcurrency(id: number) {
    const url = `/api/v1/applications/${id}/models/concurrency`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetApplicationsByIdModelsConcurrency>(config)
  }

  /**
   * @summary 移除应用模型关联
   * @description 移除指定应用与模型的关联关系
   */
  deleteApplicationsByIdModelsByModelId({ id, model_id }: types.DeleteApplicationsByIdModelsByModelIdParams) {
    const url = `/api/v1/applications/${id}/models/${model_id}`
    const config: DocReqConfig = { url, method: 'delete' }
    return this.request<types.RDeleteApplicationsByIdModelsByModelId>(config)
  }
}
export const applicationManagement = new ApplicationManagement()
