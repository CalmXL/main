/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA DOC2TS                        ##
 * ##                                                           ##
 * ## AUTHOR: space-77                                          ##
 * ## SOURCE: https://github.com/space-77/doc2ts                ##
 * ---------------------------------------------------------------
 */

import type { DocReqConfig } from 'doc2ts'
import dayjs from 'dayjs'
import ApiClient from '../client'
import type { Feedback as types } from './types'
/**
 * @name Feedback
 * @description 意见反馈
 */
export default class Feedback extends ApiClient {
  /**
   * @param { String } id
   * @summary 获取详情
   */
  getById(id: string) {
    const config: DocReqConfig = { url: `/feedBackInfo/${id}`, method: 'get' }
    return this.request<types.RGetById>(config)
  }

  /**
   * @summary 导出
   */
  postExport(body?: any) {
    const config: DocReqConfig = { url: '/feedBackInfo/export', method: 'post', body }
    return this.download(config, `意见反馈${dayjs().format('YYYY年MM月DD日HH时mm分ss秒')}.xlsx`)
  }

  /**
   * @summary 用户端-新增意见
   */
  postAddFeed(body?: any) {
    const config: DocReqConfig = { url: '/feedBackInfo/addFeed', method: 'post', body }
    return this.request<types.RPostAddFeed>(config)
  }

  /**
   * @summary 用户端-修改意见
   */
  postUpdFeed() {
    const config: DocReqConfig = { url: '/feedBackInfo/updFeed', method: 'post' }
    return this.request<types.RPostUpdFeed>(config)
  }

  /**
   * @summary 管理端-处理意见
   */
  postUpdBack(body?: { id: string; feedStatus?: string, planTime?: string, backTime?: string, backContent?: string }) {
    const config: DocReqConfig = { url: '/feedBackInfo/updBack', method: 'post', body }
    return this.request<types.RPostUpdBack>(config)
  }

  /**
   * @param { String } id
   * @summary 删除数据
   */
  getDeleteById(id?: string) {
    const url = `/feedBackInfo/deleteById?${this.serialize({ id })}`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<types.RGetDeleteById>(config)
  }

  /**
   * @summary 管理端-分权限查询反馈意见
   */
  postQueryByPage(body?: any) {
    const url = '/feedBackInfo/queryByPage'
    const config: DocReqConfig = { url, method: 'post', body }
    return this.request<types.RPostQueryByPage>(config)
  }

  /**
   * @summary 用户端-查询自己反馈的意见
   */
  postQueryUserByPage() {
    const url = '/feedBackInfo/queryUserByPage'
    const config: DocReqConfig = { url, method: 'post' }
    return this.request<types.RPostQueryUserByPage>(config)
  }
}
export const feedback = new Feedback()
