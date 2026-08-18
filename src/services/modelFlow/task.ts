/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA DOC2TS                        ##
 * ##                                                           ##
 * ## AUTHOR: space-77                                          ##
 * ## SOURCE: https://github.com/space-77/doc2ts                ##
 * ---------------------------------------------------------------
 */

import type { DocReqConfig } from 'doc2ts'
import ApiClient from '../client'
import type { Task as types, __common__ } from './types'
/**
 * @name task
 */
export default class Task extends ApiClient {
  /**
   * @summary Create Task
   * @description 校验数据，写入mongo
   */
  createTaskPost(body: __common__.MessageRequest) {
    const config: DocReqConfig = { url: '/create_task/', body, method: 'post' }
    return this.request<types.RCreateTaskPost>(config)
  }

  /**
   * @summary Cancel Task
   */
  cancelTaskPost(task_id_list: __common__.TaskRequest['task_id_list']) {
    const body = { task_id_list }
    const config: DocReqConfig = { url: '/cancel_task/', body, method: 'post' }
    return this.request<types.RCancelTaskPost>(config)
  }
}
export const task = new Task()
