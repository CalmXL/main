/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA DOC2TS                        ##
 * ##                                                           ##
 * ## AUTHOR: space-77                                          ##
 * ## SOURCE: https://github.com/space-77/doc2ts                ##
 * ---------------------------------------------------------------
 */

export namespace EnumLists {}

export namespace Feedback {
  export interface PostAddFeedRes {
    msg: string
    code: number
  }

  export interface PostAddFeedParams {}

  export interface PostAddFeedBody {}

  export interface PostUpdFeedRes {
    msg: string
    code: number
  }

  export interface PostUpdFeedParams {}

  export interface PostUpdFeedBody {}

  export interface PostUpdBackRes {
    msg: string
    code: number
  }

  export interface PostUpdBackParams {}

  export interface PostUpdBackBody {}

  export interface PostQueryUserByPageRes {
    msg: string
    code: number
  }

  export interface PostQueryUserByPageParams {}

  export interface PostQueryUserByPageBody {}

  export interface PostQueryByPageRes {
    msg: string
    code: number
  }

  export interface PostQueryByPageParams {}

  export interface PostQueryByPageBody {}

  export interface GetByIdRes {
    msg: string
    code: number
    data: {
      id: string
      gmtCreate: string
      gmtModified: null
      delFlag: number
      feedUserId: string
      feedUserName: string
      feedTitle: string
      feedContent: string
      feedStatus: string
      backContent: null
      backUserId: null
      backUserName: null
      backTime: null
    }
  }

  export interface GetByIdParams {
    /**
     * @example 16c50a31c6cb4ae4b806d62eeb85e805
     */
    id: string
  }

  export interface GetDeleteByIdRes {
    msg: string
    code: number
    data: {
      id: string
      gmtCreate: string
      gmtModified: null
      delFlag: number
      feedUserId: string
      feedUserName: string
      feedTitle: string
      feedContent: string
      feedStatus: string
      backContent: null
      backUserId: null
      backUserName: null
      backTime: null
    }
  }

  export interface GetDeleteByIdParams {
    /**
     * @example 334dab9ff27947c19087ae384bd07656
     */
    id?: string
  }

  export interface PostExportRes {}

  export interface PostExportParams {}

  export interface PostExportBody {}

  export type RGetById = Promise<[any, Feedback.GetByIdRes['data'], Feedback.GetByIdRes]>
  export type RPostAddFeed = Promise<[any, unknown, Feedback.PostAddFeedRes]>
  export type RPostUpdFeed = Promise<[any, unknown, Feedback.PostUpdFeedRes]>
  export type RPostUpdBack = Promise<[any, unknown, Feedback.PostUpdBackRes]>
  export type RGetDeleteById = Promise<[any, Feedback.GetDeleteByIdRes['data'], Feedback.GetDeleteByIdRes]>
  export type RPostQueryByPage = Promise<[any, unknown, Feedback.PostQueryByPageRes]>
  export type RPostQueryUserByPage = Promise<[any, unknown, Feedback.PostQueryUserByPageRes]>
}
