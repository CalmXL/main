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

export namespace __common__ {
  export interface AppCreateRequest {
    /**
     * @description 应用ID
     */
    app_id: string
    /**
     * @description 应用中文名称
     */
    app_name: string
  }

  export interface AppDeleteRequest {
    /**
     * @description 应用ID
     */
    app_id: string
  }

  export interface HTTPValidationError {
    detail?: Array<__common__.ValidationError>
  }

  export interface MessageRequest {
    /**
     * @description 应用ID
     */
    app_id: string
    /**
     * @description 用户ID
     */
    user_id: string
    /**
     * @description 模型配置信息
     */
    llm_config: __common__.ModelConfigRequest
    /**
     * @description 回调地址，必须是有效的 URL
     */
    return_url: string
    /**
     * @description 任务参数列表
     */
    task_params: Array<__common__.TaskParams>
  }

  export interface ModelConfigRequest {
    /**
     * @description OpenAI API 密钥
     */
    api_key: string
    /**
     * @description 模型名称，默认为 'auto'
     */
    model_name?: string
    /**
     * @description 温度参数，取值范围 0-1
     */
    temperature?: number
    /**
     * @description Top-p 采样参数，取值范围 0-1
     */
    top_p?: number
    /**
     * @description 最大令牌数，必须大于 0
     */
    max_tokens?: number
    /**
     * @description 模型请求地址，必须是有效的 URL
     */
    model_url: string
    /**
     * @description 额外的请求体参数，默认为空字典
     */
    extra_body?: object
  }

  export interface TaskParams {
    /**
     * @description 任务优先级，取值范围 0-5
     */
    priority?: number
    /**
     * @description 对话消息列表，格式如 [{'role': 'user', 'content': '...'}]
     */
    prompt: Array<__common__.PromptT>
    /**
     * @description 透传字段，可以为任意可序列化的类型
     */
    raw_data?: any
  }

  export interface TaskRequest {
    /**
     * @description 任务ID列表
     */
    task_id_list: Array<string>
  }

  export interface ValidationError {
    loc: Array<any>
    msg: string
    type: string
  }

  export interface PromptT {}

  export interface DataT {
    /**
     * @description 应用记录ID
     */
    _id?: string
    /**
     * @description 应用ID
     */
    app_id?: string
    /**
     * @description 应用名称
     */
    app_name?: string
    /**
     * @description 创建时间
     */
    created_at?: string
  }

  export interface DataT1 {
    /**
     * @description 用户ID
     */
    user_id?: string
    /**
     * @description 应用ID
     */
    app_id?: string
    /**
     * @description 应用名称
     */
    app_name?: string
    /**
     * @description token消耗量
     */
    token_consumption?: number
    /**
     * @description 任务数量
     */
    task_count?: number
    /**
     * @description 成功任务数量
     */
    success_tasks?: number
    /**
     * @description 失败任务数量
     */
    failed_tasks?: number
    /**
     * @description 提示词token总数
     */
    total_prompt_tokens?: number
    /**
     * @description 完成token总数
     */
    total_completion_tokens?: number
    /**
     * @description 最后更新时间
     */
    last_updated?: string
  }

  export interface DataT2 {
    /**
     * @description 任务ID
     */
    _id?: string
    /**
     * @description 任务状态
     */
    status?: number
    /**
     * @description 应用ID
     */
    app_id?: string
    /**
     * @description 应用名称
     */
    app_name?: string
    /**
     * @description 用户ID
     */
    user_id?: string
    /**
     * @description 任务创建时间
     */
    create_time?: string
    /**
     * @description 任务开始执行时间
     */
    start_time?: string
    /**
     * @description 任务结束时间
     */
    end_time?: string
    /**
     * @description 任务优先级
     */
    priority?: number
  }
}

export namespace App {
  export interface CreateAppPostRes {
    /**
     * @description 状态码，200表示成功
     */
    code?: number
    /**
     * @description 响应消息
     */
    message?: string
    data?: {
      /**
       * @description 应用ID
       */
      app_id?: string
      /**
       * @description 应用名称
       */
      app_name?: string
    }
  }

  export interface CreateAppPostParams {}

  export interface CreateAppPostBody extends __common__.AppCreateRequest {}

  export interface DeleteAppPostRes {
    /**
     * @description 状态码，200表示成功
     */
    code?: number
    /**
     * @description 响应消息
     */
    message?: string
    data?: {
      /**
       * @description 应用ID
       */
      app_id?: string
    }
  }

  export interface DeleteAppPostParams {}

  export interface DeleteAppPostBody extends __common__.AppDeleteRequest {}

  export interface GetAppsAppAllPostRes {
    /**
     * @description 状态码，200表示成功
     */
    code?: number
    /**
     * @description 响应消息
     */
    message?: string
    data?: Array<__common__.DataT>
  }

  export interface GetAppsAppAllPostParams {}

  export interface UpdateAppPostRes {
    /**
     * @description 状态码，200表示成功
     */
    code?: number
    /**
     * @description 响应消息
     */
    message?: string
    data?: {
      /**
       * @description 应用ID
       */
      app_id?: string
      /**
       * @description 应用名称
       */
      app_name?: string
    }
  }

  export interface UpdateAppPostParams {}

  export interface UpdateAppPostBody extends __common__.AppCreateRequest {}

  export type RCreateAppPost = Promise<[any, App.CreateAppPostRes['data'], App.CreateAppPostRes]>
  export type RDeleteAppPost = Promise<[any, App.DeleteAppPostRes['data'], App.DeleteAppPostRes]>
  export type RUpdateAppPost = Promise<[any, App.UpdateAppPostRes['data'], App.UpdateAppPostRes]>
  export type RGetAppsAppAllPost = Promise<[any, App.GetAppsAppAllPostRes['data'], App.GetAppsAppAllPostRes]>
}

export namespace Statistics {
  export interface GetRecordsStatsPostRes {
    /**
     * @description 状态码，200表示成功
     */
    code?: number
    /**
     * @description 响应消息
     */
    message?: string
    data?: Array<__common__.DataT1>
  }

  export interface GetRecordsStatsPostParams {}

  export interface GetTasksStatsPostRes {
    /**
     * @description 状态码，200表示成功
     */
    code?: number
    /**
     * @description 响应消息
     */
    message?: string
    data?: {
      /**
       * @description 总任务数
       */
      total_tasks?: number
      /**
       * @description 处理中的任务数量（状态为1）
       */
      processing_tasks?: number
      /**
       * @description 排队中的任务数量（状态为0和5）
       */
      queued_tasks?: number
      /**
       * @description 按状态统计
       */
      status_stats?: object
      /**
       * @description 按应用统计
       */
      app_stats?: object
      /**
       * @description 按用户统计
       */
      user_stats?: object
      /**
       * @description 按优先级统计
       */
      priority_stats?: object
    }
  }

  export interface GetTasksStatsPostParams {
    /**
     * @description 优先级筛选条件
     */
    priority?: number
    /**
     * @description 用户ID筛选条件
     */
    user_id?: string
    /**
     * @description 应用ID筛选条件
     */
    app_id?: string
  }

  export interface GetTasksListStatsPostRes {
    /**
     * @description 状态码，200表示成功
     */
    code?: number
    /**
     * @description 响应消息
     */
    message?: string
    data?: {
      /**
       * @description 总任务数
       */
      total?: number
      /**
       * @description 当前页码
       */
      page?: number
      /**
       * @description 每页数量
       */
      page_size?: number
      /**
       * @description 总页数
       */
      total_pages?: number
      data?: Array<__common__.DataT2>
    }
  }

  export interface GetTasksListStatsPostParams {
    /**
     * @description 页码，默认1
     */
    page?: number
    /**
     * @description 每页数量，默认10
     */
    page_size?: number
    /**
     * @description 应用ID筛选条件
     */
    app_id?: string
    /**
     * @description 用户ID筛选条件
     */
    user_id?: string
    /**
     * @description 优先级筛选条件
     */
    priority?: number
  }

  export type RGetTasksStatsPost = Promise<[any, Statistics.GetTasksStatsPostRes['data'], Statistics.GetTasksStatsPostRes]>
  export type RGetRecordsStatsPost = Promise<[any, Statistics.GetRecordsStatsPostRes['data'], Statistics.GetRecordsStatsPostRes]>
  export type RGetTasksListStatsPost = Promise<[any, Statistics.GetTasksListStatsPostRes['data'], Statistics.GetTasksListStatsPostRes]>
}

export namespace Task {
  export interface CreateTaskPostRes {}

  export interface CreateTaskPostParams {}

  export interface CreateTaskPostBody extends __common__.MessageRequest {}

  export interface CancelTaskPostRes {}

  export interface CancelTaskPostParams {}

  export interface CancelTaskPostBody extends __common__.TaskRequest {}

  export type RCreateTaskPost = Promise<[any, unknown, Task.CreateTaskPostRes]>
  export type RCancelTaskPost = Promise<[any, unknown, Task.CancelTaskPostRes]>
}
