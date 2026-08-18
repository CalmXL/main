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
import type { ModelManagement as types, __common__ } from './types'
/**
 * @name ModelManagement
 * @description 大模型配置的增删改查、健康检查、批量导入导出等功能
 */
export default class ModelManagement extends ApiClient {
  /**
   * @summary 获取模型列表
   * @description 分页获取模型列表，支持筛选和搜索。响应中每个模型包含 applications 字段，返回使用该模型的应用列表及其并发配置（app_concurrency / user_concurrency）
   */
  getModels(query: types.GetModelsParams) {
    const url = `/api/v1/models?${this.serialize(query)}`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetModels>(config)
  }

  /**
   * @summary 创建新模型
   * @description 创建一个新的大模型配置。系统会自动检查模型的可用性，只有检查通过的模型才能成功创建。支持配置温度参数、超时时间、默认参数(JSON格式)和参数优先级。
   */
  postModels(body: __common__.ModelCreateModelRequest) {
    const config: DocReqConfig = { url: '/api/v1/models', body, method: 'post' }
    return this.request<types.RPostModels>(config)
  }

  /**
   * @param { Number } id 模型ID
   * @summary 获取模型详情
   * @description 根据ID获取模型详细信息。响应中包含 applications 字段，返回使用该模型的应用列表及其并发配置（app_concurrency / user_concurrency）
   */
  getModelsById(id: number) {
    const config: DocReqConfig = { url: `/api/v1/models/${id}`, method: 'get' }
    return this.request<types.RGetModelsById>(config)
  }

  /**
   * @summary 更新模型信息
   * @description 根据ID更新模型配置信息。系统会自动检查更新后模型的可用性，只有检查通过的模型才能成功更新。支持更新默认参数(JSON格式)和参数优先级。
   */
  putModelsById(params: types.PutModelsByIdParams1) {
    const { id, ...body } = params
    const url = `/api/v1/models/${id}`
    const config: DocReqConfig = { url, body, method: 'put' }
    return this.request<types.RPutModelsById>(config)
  }

  /**
   * @summary 批量导出模型
   * @description 将模型配置导出为Excel或CSV文件
   */
  getModelsExport(query: types.GetModelsExportParams) {
    const url = `/api/v1/models/export?${this.serialize(query)}`
    const config: DocReqConfig = {
      url,
      method: 'get',
      config: {
        responseType: 'blob'
      }
    }
    return this.request<Blob>(config)
  }

  /**
   * @summary 批量导入模型
   * @description 通过Excel或CSV文件批量导入模型配置
   */
  postModelsImport(formData: FormData) {
    const config: DocReqConfig = {
      url: '/api/v1/models/import',
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    }
    return this.request<types.RPostModelsImport>(config)
  }

  /**
   * @param { Number } id 模型ID
   * @summary 删除模型
   * @description 根据ID删除模型配置
   */
  deleteModelsById(id: number) {
    const url = `/api/v1/models/${id}`
    const config: DocReqConfig = { url, method: 'delete' }
    return this.request<types.RDeleteModelsById>(config)
  }

  /**
   * @summary 获取导入模板
   * @description 下载模型批量导入的Excel模板文件
   */
  getModelsTemplate() {
    const url = '/api/v1/models/template'
    const config: DocReqConfig = {
      url,
      method: 'get',
      config: {
        responseType: 'blob'
      }
    }
    return this.request<Blob>(config)
  }

  /**
   * @summary 批量检查所有模型
   * @description 检查系统中所有模型的API连接状态
   */
  postModelsCheckAll() {
    const url = '/api/v1/models/check-all'
    const config: DocReqConfig = { url, method: 'post' }
    return this.request<types.RPostModelsCheckAll>(config)
  }

  /**
   * @param { Number } id 模型ID
   * @summary 检查模型可用性
   * @description 检查指定模型的API连接状态和响应时间
   */
  postModelsByIdCheck(id: number) {
    const url = `/api/v1/models/${id}/check`
    const config: DocReqConfig = { url, method: 'post' }
    return this.request<types.RPostModelsByIdCheck>(config)
  }

  /**
   * @summary 更新模型启用状态
   * @description 启用或禁用指定模型
   */
  patchModelsByIdStatus(params: types.PatchModelsByIdStatusParams1) {
    const { id, ...body } = params
    const url = `/api/v1/models/${id}/status`
    const config: DocReqConfig = { url, body, method: 'patch' }
    return this.request<types.RPatchModelsByIdStatus>(config)
  }

  /**
   * @summary 批量删除模型
   * @description 根据ID列表批量删除模型
   */
  deleteModelsBatchDelete(ids: __common__.ModelBatchDeleteModelRequest['ids']) {
    const body = { ids }
    const url = '/api/v1/models/batch-delete'
    const config: DocReqConfig = { url, body, method: 'delete' }
    return this.request<types.RDeleteModelsBatchDelete>(config)
  }

  /**
   * @param { Number } id 模型ID
   * @summary 获取模型检查历史
   * @description 获取指定模型的健康检查历史记录
   */
  getModelsByIdCheckHistory(id: number) {
    const url = `/api/v1/models/${id}/check-history`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetModelsByIdCheckHistory>(config)
  }

  /**
   * @summary 查询模型剩余并发
   * @description 查询指定模型的剩余并发数，支持多模型查询和可选的应用ID
   */
  getModelsConcurrencyRemaining(query: types.GetModelsConcurrencyRemainingParams) {
    const url = `/api/v1/models/concurrency-remaining?${this.serialize(query)}`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetModelsConcurrencyRemaining>(config)
  }
}
export const modelManagement = new ModelManagement()
