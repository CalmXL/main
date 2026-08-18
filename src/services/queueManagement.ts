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
import type { QueueManagement as types } from './types'
/**
 * @name QueueManagement
 * @description 队列管理
 */
export default class QueueManagement extends ApiClient {
  /**
   * @summary 查询队列任务状态
   * @description 通过任务ID查询该任务是否符合发送条件，支持长轮询（可选等待时间0-10秒，默认0即立即返回），优先通过Lua脚本从Redis原子读取状态与排队统计
   */
  getQueueTasksByTaskId(params: types.GetQueueTasksByTaskIdParams) {
    const { taskId, ...query } = params
    const url = `/api/v1/queue/tasks/${taskId}?${this.serialize(query)}`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetQueueTasksByTaskId>(config)
  }

  /**
   * @param { Number } taskId 任务ID
   * @summary 取消排队中的任务
   * @description 仅允许取消状态为 pending 或 executable 的任务
   */
  deleteQueueTasksByTaskId(taskId: number) {
    const url = `/api/v1/queue/tasks/${taskId}`
    const config: DocReqConfig = { url, method: 'delete' }
    return this.request<types.RDeleteQueueTasksByTaskId>(config)
  }

  /**
   * @summary 获取模型维度的任务队列
   * @description 返回指定模型下 running、pending、executable 状态的任务列表
   */
  getModelsByModelIdQueueTasks(params: types.GetModelsByModelIdQueueTasksParams) {
    const { modelId, ...query } = params
    const url = `/api/v1/models/${modelId}/queue-tasks?${this.serialize(query)}`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetModelsByModelIdQueueTasks>(config)
  }
}
export const queueManagement = new QueueManagement()
