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

export namespace EnumLists {
  export enum Role {
    'user' = 'user',
    'assistant' = 'assistant'
  }
  export enum Function_call {
    'n1' = '1',
    'n0' = '0'
  }
  export enum Model_type {
    'chat' = 'chat',
    'embedding' = 'embedding',
    'rerank' = 'rerank',
    'images2text' = 'images2text',
    'tts' = 'tts',
    'multimodal' = 'multimodal'
  }
  export enum Api_style {
    'openai' = 'openai',
    'anthropic' = 'anthropic'
  }
  export enum Balance_query_method {
    'deepseek' = 'deepseek'
  }
  export enum Status {
    'enabled' = 'enabled',
    'disabled' = 'disabled'
  }
  export enum Role1 {
    'system' = 'system',
    'user' = 'user',
    'assistant' = 'assistant'
  }
  export enum Format {
    'xlsx' = 'xlsx',
    'csv' = 'csv'
  }
}

export namespace __common__ {
  export interface HandlerEncryptPortRequest {
    /**
     * @example 8080
     */
    port: string
  }

  export interface HandlerEncryptedPortResponse {
    /**
     * @example U2FsdGVkX19...
     */
    encrypted?: string
  }

  export interface ModelAPIKey {
    /**
     * @example 269.93
     * @description 最近查询的可用余额
     */
    balance?: number
    /**
     * @example CNY
     * @description 余额币种
     */
    balance_currency?: string
    /**
     * @description 连续失败次数
     */
    consecutive_failures?: number
    /**
     * @example 2023-01-01T00:00:00Z
     */
    created_at?: string
    /**
     * @example 10
     * @description 当天用量（请求次数）
     */
    daily_usage?: number
    /**
     * @example 1
     */
    id?: number
    /**
     * @example true
     * @description 是否可用
     */
    is_available?: boolean
    /**
     * @example sk-****-xxxx
     * @description 脱敏后的密钥
     */
    key_masked?: string
    /**
     * @example success
     * @description 上次状态：success/failure
     */
    last_status?: string
    /**
     * @example 2023-01-01T00:00:00Z
     * @description 最近使用时间
     */
    last_used_at?: string
    /**
     * @example OpenAI生产密钥
     */
    name?: string
    /**
     * @description 关联
     */
    platform?: {
      /**
       * @description 关联
       */
      api_keys?: Array<__common__.ModelAPIKey>
      /**
       * @description API风格：openai/anthropic
       */
      api_style?: string
      /**
       * @description 余额查询方式：deepseek / 空（不使用）
       */
      balance_query_method?: string
      /**
       * @description API基础URL
       */
      base_url?: string
      created_at?: string
      id?: number
      /**
       * @description 平台模型列表数据中模型描述映射字段（可选）
       */
      model_desc_mapping_field?: string
      /**
       * @description 模型列表过滤正则表达式（可选，JS正则语法）
       */
      model_list_filter?: string
      /**
       * @description 平台模型列表数据中模型列表映射字段
       */
      model_list_mapping_field?: string
      /**
       * @description 获取平台模型列表接口URL（可选）
       */
      model_list_url?: string
      /**
       * @description 平台模型列表数据中模型名称映射字段
       */
      model_name_mapping_field?: string
      models?: Array<__common__.ModelModel>
      /**
       * @description 平台名称
       */
      name?: string
      /**
       * @description 备注
       */
      remark?: string
      /**
       * @description 状态：enabled/disabled
       */
      status?: string
      /**
       * @description 是否支持 OpenAI Responses API
       */
      support_responses_api?: boolean
      updated_at?: string
    }
    /**
     * @example 1
     * @description 所属平台ID
     */
    platform_id?: number
    /**
     * @example https://example.com
     * @description Referer（可选）
     */
    referer?: string
    /**
     * @example 用于生产环境的API密钥
     * @description 备注
     */
    remark?: string
    /**
     * @example official
     * @description 来源（可选）
     */
    source?: string
    /**
     * @example enabled
     * @description 状态：enabled/disabled
     */
    status?: string
    /**
     * @example 100
     * @description 总用量（请求次数）
     */
    total_usage?: number
    /**
     * @example 2023-01-01T00:00:00Z
     */
    updated_at?: string
    /**
     * @example OpenAI
     * @description 厂商（可选）
     */
    vendor?: string
  }

  export interface ModelAPIKeyBatchCreateResult {
    /**
     * @description 重复的key（脱敏）
     */
    duplicate_keys?: Array<string>
    failed_count?: number
    /**
     * @description 失败的key（脱敏）
     */
    failed_keys?: Array<string>
    message?: string
    success_count?: number
    /**
     * @description 成功添加的key（脱敏）
     */
    success_keys?: Array<string>
  }

  export interface ModelAPIKeyResponse {
    /**
     * @example 269.93
     */
    balance?: number
    /**
     * @example CNY
     */
    balance_currency?: string
    consecutive_failures?: number
    /**
     * @example 2023-01-01T00:00:00Z
     */
    created_at?: string
    /**
     * @example 10
     */
    daily_usage?: number
    /**
     * @example 5
     * @description 从Redis读取，非DB字段
     */
    hourly_usage?: number
    /**
     * @example 1
     */
    id?: number
    /**
     * @example true
     */
    is_available?: boolean
    /**
     * @example sk-****-xxxx
     */
    key_masked?: string
    /**
     * @example success
     */
    last_status?: string
    /**
     * @example 2023-01-01T00:00:00Z
     * @description 最近使用时间
     */
    last_used_at?: string
    /**
     * @example OpenAI生产密钥
     */
    name?: string
    /**
     * @example 1
     */
    platform_id?: number
    /**
     * @example https://example.com
     */
    referer?: string
    /**
     * @example 用于生产环境的API密钥
     */
    remark?: string
    /**
     * @example official
     */
    source?: string
    /**
     * @example enabled
     */
    status?: string
    /**
     * @example 100
     */
    total_usage?: number
    /**
     * @example 2023-01-01T00:00:00Z
     */
    updated_at?: string
    /**
     * @example OpenAI
     */
    vendor?: string
  }

  export interface ModelAddModelsRequest {
    /**
     * @example 1
     * @description 默认模型ID，可选，必须在model_ids中
     */
    default_model_id?: number
    /**
     * @description 模型并发配置列表，可选
     */
    model_concurrency_configs?: Array<__common__.ModelModelConcurrencyConfig>
    /**
     * @description 要添加的模型ID列表，必填，至少一个
     */
    model_ids: Array<number>
  }

  export interface ModelAddPlatformAPIKeysRequest {
    /**
     * @example sk-key1,sk-key2,sk-key3
     * @description API密钥（支持逗号分隔批量添加）
     */
    keys: string
  }

  export interface ModelAnthropicContent {
    /**
     * @description 图像源（type=image 时使用）
     */
    source?: {
      /**
       * @example iVBORw0KGgoAAAANSUhEUg...
       * @description Base64 编码的图像数据（type=base64 时使用）
       */
      data?: string
      /**
       * @example image/jpeg
       * @description 媒体类型：image/png, image/jpeg, image/gif, image/webp
       */
      media_type?: string
      /**
       * @example base64
       * @description 源类型：base64 或 url
       */
      type?: string
      /**
       * @example https://example.com/image.jpg
       * @description 图像 URL（type=url 时使用）
       */
      url?: string
    }
    /**
     * @example Hello, how are you?
     * @description 文本内容（type=text 时使用，即使为空也要输出）
     */
    text?: string
    /**
     * @example text
     * @description 内容类型：text, image, image_url 等
     */
    type?: string
  }

  export interface ModelAnthropicErrorDetail {
    /**
     * @example max_tokens is required
     * @description 错误消息
     */
    message?: string
    /**
     * @example invalid_request_error
     * @description 错误类型
     */
    type?: string
  }

  export interface ModelAnthropicErrorResponse {
    /**
     * @description 错误详情
     */
    error?: {
      /**
       * @example max_tokens is required
       * @description 错误消息
       */
      message?: string
      /**
       * @example invalid_request_error
       * @description 错误类型
       */
      type?: string
    }
  }

  export interface ModelAnthropicImageSource {
    /**
     * @example iVBORw0KGgoAAAANSUhEUg...
     * @description Base64 编码的图像数据（type=base64 时使用）
     */
    data?: string
    /**
     * @example image/jpeg
     * @description 媒体类型：image/png, image/jpeg, image/gif, image/webp
     */
    media_type?: string
    /**
     * @example base64
     * @description 源类型：base64 或 url
     */
    type?: string
    /**
     * @example https://example.com/image.jpg
     * @description 图像 URL（type=url 时使用）
     */
    url?: string
  }

  export interface ModelAnthropicMessage {
    /**
     * @description 消息内容，支持 string 或 []AnthropicContent
     */
    content: any
    /**
     * @example user
     * @description 消息角色：user 或 assistant
     */
    role: EnumLists.Role
  }

  export interface ModelAnthropicMessagesRequest {
    /**
     * @example 4096
     * @description 最大生成令牌数，必填，Anthropic API 要求
     */
    max_tokens: number
    /**
     * @description 消息列表，必填，至少一条消息
     */
    messages: Array<__common__.ModelAnthropicMessage>
    /**
     * @description 元数据
     */
    metadata?: {
      /**
       * @example user-123
       * @description 用户 ID
       */
      user_id?: string
    }
    /**
     * @example claude-3-5-sonnet-20241022
     * @description 模型名称，必填
     */
    model: string
    /**
     * @example 1
     * @description 队列任务ID，可选
     */
    queue_id?: number
    /**
     * @description 停止序列列表
     */
    stop_sequences?: Array<string>
    /**
     * @description 是否流式输出
     */
    stream?: boolean
    /**
     * @description 系统提示词，可选，支持字符串或数组格式
     */
    system?: string
    /**
     * @example 0.7
     * @description 温度参数，0.0-1.0
     */
    temperature?: number
    /**
     * @example 40
     * @description Top-k 采样参数
     */
    top_k?: number
    /**
     * @example 1
     * @description Top-p 采样参数
     */
    top_p?: number
  }

  export interface ModelAnthropicMessagesResponse {
    /**
     * @description 内容块列表
     */
    content?: Array<__common__.ModelAnthropicContent>
    /**
     * @example msg_1a2b3c4d5e6f7g8h
     * @description 消息 ID
     */
    id?: string
    /**
     * @example claude-3-5-sonnet-20241022
     * @description 使用的模型名称
     */
    model?: string
    /**
     * @example assistant
     * @description 角色，固定为 assistant
     */
    role?: string
    /**
     * @example end_turn
     * @description 停止原因：end_turn, max_tokens, stop_sequence
     */
    stop_reason?: string
    /**
     * @example message
     * @description 响应类型，固定为 message
     */
    type?: string
    /**
     * @description 使用统计
     */
    usage?: {
      /**
       * @example 50
       * @description 输入令牌数
       */
      input_tokens?: number
      /**
       * @example 100
       * @description 输出令牌数
       */
      output_tokens?: number
    }
  }

  export interface ModelAnthropicRequestMetadata {
    /**
     * @example user-123
     * @description 用户 ID
     */
    user_id?: string
  }

  export interface ModelAnthropicUsage {
    /**
     * @example 50
     * @description 输入令牌数
     */
    input_tokens?: number
    /**
     * @example 100
     * @description 输出令牌数
     */
    output_tokens?: number
  }

  export interface ModelApplication {
    /**
     * @example app_xxx
     * @description 应用密钥，唯一
     */
    app_key?: string
    /**
     * @example 2023-01-01T00:00:00Z
     * @description 创建时间
     */
    created_at?: string
    /**
     * @example 这是一个测试应用
     * @description 应用描述
     */
    description?: string
    /**
     * @example true
     * @description 是否开启请求队列功能
     */
    enable_request_queue?: boolean
    /**
     * @example 1
     * @description 应用ID
     */
    id?: number
    /**
     * @example true
     * @description 是否启用
     */
    is_enabled?: boolean
    /**
     * @description 关联
     */
    models?: Array<__common__.ModelApplicationModel>
    /**
     * @example 我的应用
     * @description 应用名称，唯一
     */
    name?: string
    /**
     * @example 2023-01-01T00:00:00Z
     * @description 更新时间
     */
    updated_at?: string
  }

  export interface ModelApplicationChatRecord {
    /**
     * @example 你好！我是一个AI助手...
     * @description 模型回答
     */
    answer?: string
    /**
     * @example 1
     * @description API密钥ID（可空）
     */
    api_key_id?: number
    /**
     * @description 关联的应用
     */
    application?: {
      /**
       * @example app_xxx
       * @description 应用密钥，唯一
       */
      app_key?: string
      /**
       * @example 2023-01-01T00:00:00Z
       * @description 创建时间
       */
      created_at?: string
      /**
       * @example 这是一个测试应用
       * @description 应用描述
       */
      description?: string
      /**
       * @example true
       * @description 是否开启请求队列功能
       */
      enable_request_queue?: boolean
      /**
       * @example 1
       * @description 应用ID
       */
      id?: number
      /**
       * @example true
       * @description 是否启用
       */
      is_enabled?: boolean
      /**
       * @description 关联
       */
      models?: Array<__common__.ModelApplicationModel>
      /**
       * @example 我的应用
       * @description 应用名称，唯一
       */
      name?: string
      /**
       * @example 2023-01-01T00:00:00Z
       * @description 更新时间
       */
      updated_at?: string
    }
    /**
     * @example 1
     * @description 应用ID
     */
    application_id?: number
    /**
     * @description 缓存命中的token数量（OpenAI/阿里云百炼: prompt_tokens_details.cached_tokens, DeepSeek: prompt_cache_hit_tokens）
     */
    cache_hit_tokens?: number
    /**
     * @example 100
     * @description 输出token数量
     */
    completion_tokens?: number
    /**
     * @example conv_123
     * @description 对话ID，用于关联同一对话的多次交互
     */
    conversation_id?: string
    /**
     * @example 2023-01-01T00:00:00Z
     * @description 创建时间
     */
    created_at?: string
    /**
     * @example 2023-01-01T00:00:01Z
     * @description 首次响应时间点
     */
    first_response_time?: string
    /**
     * @example 800
     * @description 响应时间耗时
     */
    first_token_time_ms?: number
    /**
     * @example 1
     * @description 对话记录ID
     */
    id?: number
    /**
     * @description 是否为流式请求
     */
    is_streaming?: boolean
    /**
     * @example gpt-4-turbo
     * @description 使用的模型名称
     */
    model_name?: string
    /**
     * @example 1
     * @description 平台ID（可空）
     */
    platform_id?: number
    /**
     * @example 50
     * @description 输入token数量
     */
    prompt_tokens?: number
    /**
     * @example 你好，请介绍一下你自己
     * @description 对话内容
     */
    question?: string
    /**
     * @description 推理token数量（如果支持）
     */
    reasoning_tokens?: number
    /**
     * @example 2023-01-01T00:00:00Z
     * @description 请求时间统计
     */
    request_start_time?: string
    /**
     * @example sess_123
     * @description 会话ID，用于关联同一会话的多次对话
     */
    session_id?: string
    /**
     * @example 用户想要了解我的基本信息...
     * @description 思考过程（如果支持）
     */
    thinking?: string
    /**
     * @example 150
     * @description Token使用量统计
     */
    tokens_used?: number
    /**
     * @example 3000
     * @description 总响应时间（毫秒）
     */
    total_time_ms?: number
    /**
     * @example 2023-01-01T00:00:00Z
     * @description 更新时间
     */
    updated_at?: string
  }

  export interface ModelApplicationConfig {
    /**
     * @example app_1234567890abcdef
     * @description 应用密钥
     */
    app_key?: string
    /**
     * @description 默认模型配置
     */
    default_model?: {
      /**
       * @example 5
       * @description 并发限制数，0表示不限制
       */
      concurrency?: number
      /**
       * @example 1
       * @description 模型配置ID
       */
      id?: number
      /**
       * @example true
       * @description 是否为默认模型
       */
      is_default?: boolean
      /**
       * @example gpt-4-turbo
       * @description 模型名称
       */
      model_name?: string
      /**
       * @example GPT-4 Turbo
       * @description 模型昵称
       */
      nickname?: string
      /**
       * @example OpenAI
       * @description 模型厂商
       */
      vendor?: string
    }
    /**
     * @example true
     * @description 是否开启请求队列（并发限制）
     */
    enable_request_queue?: boolean
    /**
     * @description 关联的模型配置列表
     */
    models?: Array<__common__.ModelApplicationModelConfig>
  }

  export interface ModelApplicationListItem {
    /**
     * @example app_1234567890abcdef
     * @description 应用密钥
     */
    app_key?: string
    /**
     * @example 300000000
     * @description 累计缓存命中的token数量
     */
    cache_hit_tokens?: number
    /**
     * @example 2023-01-01T00:00:00Z
     * @description 创建时间
     */
    created_at?: string
    /**
     * @description 默认模型（过滤敏感数据）
     */
    default_model?: {
      /**
       * @example 128000
       * @description 上下文大小
       */
      context_size?: number
      /**
       * @example 1
       * @description 模型配置ID
       */
      id?: number
      /**
       * @example true
       * @description 模型是否可用
       */
      is_available?: boolean
      /**
       * @example true
       * @description 是否为默认模型
       */
      is_default?: boolean
      /**
       * @example true
       * @description 模型是否启用
       */
      is_enabled?: boolean
      /**
       * @example gpt-4-turbo
       * @description 模型名称
       */
      model_name?: string
      /**
       * @example GPT-4 Turbo
       * @description 模型昵称
       */
      nickname?: string
      /**
       * @example OpenAI
       * @description 模型厂商
       */
      vendor?: string
    }
    /**
     * @example 这是一个测试应用
     * @description 应用描述
     */
    description?: string
    /**
     * @example true
     * @description 是否开启请求队列功能
     */
    enable_request_queue?: boolean
    /**
     * @example 1
     * @description 应用ID
     */
    id?: number
    /**
     * @example true
     * @description 是否启用
     */
    is_enabled?: boolean
    /**
     * @example 2023-01-01T00:00:00Z
     * @description 最后使用时间（可选）
     */
    last_used_at?: string
    /**
     * @description 关联的模型列表（过滤敏感数据）
     */
    models?: Array<__common__.ModelApplicationModelListItem>
    /**
     * @example 我的应用
     * @description 应用名称
     */
    name?: string
    /**
     * @example 5000
     * @description 累计请求数量
     */
    request_count?: number
    /**
     * @example 1500000000
     * @description 累计token使用量
     */
    total_tokens?: number
    /**
     * @example 2023-01-02T00:00:00Z
     * @description 更新时间
     */
    updated_at?: string
  }

  export interface ModelApplicationModel {
    app_concurrency?: number
    /**
     * @description 关联
     */
    application?: {
      /**
       * @example app_xxx
       * @description 应用密钥，唯一
       */
      app_key?: string
      /**
       * @example 2023-01-01T00:00:00Z
       * @description 创建时间
       */
      created_at?: string
      /**
       * @example 这是一个测试应用
       * @description 应用描述
       */
      description?: string
      /**
       * @example true
       * @description 是否开启请求队列功能
       */
      enable_request_queue?: boolean
      /**
       * @example 1
       * @description 应用ID
       */
      id?: number
      /**
       * @example true
       * @description 是否启用
       */
      is_enabled?: boolean
      /**
       * @description 关联
       */
      models?: Array<__common__.ModelApplicationModel>
      /**
       * @example 我的应用
       * @description 应用名称，唯一
       */
      name?: string
      /**
       * @example 2023-01-01T00:00:00Z
       * @description 更新时间
       */
      updated_at?: string
    }
    application_id?: number
    created_at?: string
    id?: number
    is_default?: boolean
    model?: __common__.ModelModel
    model_id?: number
    user_concurrency?: number
  }

  export interface ModelApplicationModelConfig {
    /**
     * @example 5
     * @description 并发限制数，0表示不限制
     */
    concurrency?: number
    /**
     * @example 1
     * @description 模型配置ID
     */
    id?: number
    /**
     * @example true
     * @description 是否为默认模型
     */
    is_default?: boolean
    /**
     * @example gpt-4-turbo
     * @description 模型名称
     */
    model_name?: string
    /**
     * @example GPT-4 Turbo
     * @description 模型昵称
     */
    nickname?: string
    /**
     * @example OpenAI
     * @description 模型厂商
     */
    vendor?: string
  }

  export interface ModelApplicationModelListItem {
    /**
     * @example 128000
     * @description 上下文大小
     */
    context_size?: number
    /**
     * @example 1
     * @description 模型配置ID
     */
    id?: number
    /**
     * @example true
     * @description 模型是否可用
     */
    is_available?: boolean
    /**
     * @example true
     * @description 是否为默认模型
     */
    is_default?: boolean
    /**
     * @example true
     * @description 模型是否启用
     */
    is_enabled?: boolean
    /**
     * @example gpt-4-turbo
     * @description 模型名称
     */
    model_name?: string
    /**
     * @example GPT-4 Turbo
     * @description 模型昵称
     */
    nickname?: string
    /**
     * @example OpenAI
     * @description 模型厂商
     */
    vendor?: string
  }

  export interface ModelApplicationTokenStats {
    /**
     * @description 关联的应用
     */
    application?: {
      /**
       * @example app_xxx
       * @description 应用密钥，唯一
       */
      app_key?: string
      /**
       * @example 2023-01-01T00:00:00Z
       * @description 创建时间
       */
      created_at?: string
      /**
       * @example 这是一个测试应用
       * @description 应用描述
       */
      description?: string
      /**
       * @example true
       * @description 是否开启请求队列功能
       */
      enable_request_queue?: boolean
      /**
       * @example 1
       * @description 应用ID
       */
      id?: number
      /**
       * @example true
       * @description 是否启用
       */
      is_enabled?: boolean
      /**
       * @description 关联
       */
      models?: Array<__common__.ModelApplicationModel>
      /**
       * @example 我的应用
       * @description 应用名称，唯一
       */
      name?: string
      /**
       * @example 2023-01-01T00:00:00Z
       * @description 更新时间
       */
      updated_at?: string
    }
    /**
     * @example 1
     * @description 应用ID，唯一
     */
    application_id?: number
    /**
     * @example 200000000
     * @description 累计缓存命中的token数量
     */
    cache_hit_tokens?: number
    /**
     * @example 2023-01-01T00:00:00Z
     * @description 创建时间
     */
    created_at?: string
    /**
     * @example 1
     * @description 统计记录ID
     */
    id?: number
    /**
     * @example 2023-01-01T00:00:00Z
     * @description 最后请求时间
     */
    last_request_at?: string
    /**
     * @example 5000
     * @description 累计请求数量
     */
    request_count?: number
    /**
     * @example 1000000000
     * @description 累计token使用量，使用uint64支持大数量级
     */
    total_tokens?: number
    /**
     * @example 2023-01-01T00:00:00Z
     * @description 更新时间
     */
    updated_at?: string
  }

  export interface ModelBatchDeleteModelRequest {
    /**
     * @description 要删除的模型ID列表，1-100个ID
     */
    ids: Array<number>
  }

  export interface ModelBatchUpdateConcurrencyItem {
    /**
     * @example 5
     * @description 应用层并发限制（0=不限制）
     */
    app_concurrency?: number
    /**
     * @example 1
     * @description 应用ID
     */
    application_id: number
    /**
     * @example 10
     * @description 模型ID
     */
    model_id: number
    /**
     * @example 2
     * @description 用户层并发限制（0=不限制）
     */
    user_concurrency?: number
  }

  export interface ModelBatchUpdateModelConcurrencyRequest {
    /**
     * @description 待更新的并发配置列表，至少一项
     */
    items: Array<__common__.ModelBatchUpdateConcurrencyItem>
  }

  export interface ModelChatCompletionRequest {
    /**
     * @example app_1234567890abcdef
     * @description 应用API密钥，必填，用于认证
     */
    app_key: string
    /**
     * @example true
     * @description 是否启用思考模式，true=模型思考过程会包含在响应中(阿里百炼、硅基流动)
     */
    enable_thinking?: boolean
    /**
     * @description 频率惩罚，-2.0到2.0，惩罚重复内容
     */
    frequency_penalty?: number
    /**
     * @description 对数偏置，调整特定词汇的生成概率
     */
    logit_bias?: object
    /**
     * @example 1000
     * @description 最大令牌数，限制响应长度
     */
    max_tokens?: number
    /**
     * @description 消息列表，必填，至少一条消息
     */
    messages: Array<__common__.ModelMessage>
    /**
     * @example gpt-4-turbo
     * @description 模型名称，可选，不指定、空值、"auto"或"default"时使用应用默认模型
     */
    model?: string
    /**
     * @example 1
     * @description 生成的选择数量，1-10，默认为1
     */
    n?: number
    /**
     * @description 存在惩罚，-2.0到2.0，惩罚新话题
     */
    presence_penalty?: number
    /**
     * @example 1
     * @description 队列任务ID，可选，用于指定队列中的任务
     */
    queue_id?: number
    /**
     * @description 停止词列表，遇到这些词会停止生成
     */
    stop?: Array<string>
    /**
     * @description 是否流式输出，false=一次性返回完整响应，true=流式返回
     */
    stream?: boolean
    /**
     * @example 0.7
     * @description 温度参数，控制随机性，0.0-1.0，越高越随机。接口传递的参数优先级最高，未传递时使用模型配置
     */
    temperature?: number
    /**
     * @example [object Object]
     * @description 是否启用思考模式，模型思考过程会包含在响应中(deepseek)
     */
    thinking?: object
    /**
     * @example 1
     * @description Top-p采样参数，控制词汇选择范围，0.0-1.0
     */
    top_p?: number
    /**
     * @example user123
     * @description 用户标识，用于追踪和监控
     */
    user?: string
  }

  export interface ModelChatCompletionRequestWithoutAPIKey {
    /**
     * @example true
     * @description 是否启用思考模式，true=模型思考过程会包含在响应中(阿里百炼、硅基流动)
     */
    enable_thinking?: boolean
    /**
     * @description 频率惩罚，-2.0到2.0，惩罚重复内容
     */
    frequency_penalty?: number
    /**
     * @description 对数偏置，调整特定词汇的生成概率
     */
    logit_bias?: object
    /**
     * @example 1000
     * @description 最大令牌数，限制响应长度
     */
    max_tokens?: number
    /**
     * @description 消息列表，必填，至少一条消息
     */
    messages: Array<__common__.ModelMessage>
    /**
     * @example gpt-4-turbo
     * @description 模型名称，可选，不指定、空值、"auto"或"default"时使用应用默认模型
     */
    model?: string
    /**
     * @example 1
     * @description 生成的选择数量，1-10，默认为1
     */
    n?: number
    /**
     * @description 存在惩罚，-2.0到2.0，惩罚新话题
     */
    presence_penalty?: number
    /**
     * @example 1
     * @description 队列任务ID，可选，用于指定队列中的任务
     */
    queue_id?: number
    /**
     * @description 停止词列表，遇到这些词会停止生成
     */
    stop?: Array<string>
    /**
     * @description 是否流式输出，false=一次性返回完整响应，true=流式返回
     */
    stream?: boolean
    /**
     * @example 0.7
     * @description 温度参数，控制随机性，0.0-1.0，越高越随机。接口传递的参数优先级最高，未传递时使用模型配置
     */
    temperature?: number
    /**
     * @example [object Object]
     * @description 是否启用思考模式，模型思考过程会包含在响应中(deepseek)
     */
    thinking?: object
    /**
     * @example 1
     * @description Top-p采样参数，控制词汇选择范围，0.0-1.0
     */
    top_p?: number
    /**
     * @example user123
     * @description 用户标识，用于追踪和监控
     */
    user?: string
  }

  export interface ModelChatCompletionResponse {
    /**
     * @description 生成的回复选项列表
     */
    choices?: Array<__common__.ModelChoice>
    /**
     * @example 1640995200
     * @description 创建时间戳
     */
    created?: number
    /**
     * @example chatcmpl-1234567890abcdef
     * @description 对话ID，唯一标识一次对话
     */
    id?: string
    /**
     * @example gpt-4-turbo
     * @description 使用的模型名称
     */
    model?: string
    /**
     * @example chat.completion
     * @description 对象类型，固定为chat.completion
     */
    object?: string
    /**
     * @description 令牌使用统计
     */
    usage?: {
      /**
       * @example 100
       * @description 生成回复的令牌数量
       */
      completion_tokens?: number
      /**
       * @description 完成令牌的详细信息
       */
      completion_tokens_details?: {
        /**
         * @example 20
         * @description 推理过程使用的令牌数量
         */
        reasoning_tokens?: number
      }
      /**
       * @example 2023-01-01T00:00:01Z
       * @description 首次响应时间点
       */
      first_response_time?: string
      /**
       * @example 800
       * @description 响应时间耗时
       */
      first_token_time_ms?: number
      /**
       * @example 40
       * @description 缓存命中的令牌数量（DeepSeek专用）
       */
      prompt_cache_hit_tokens?: number
      /**
       * @example 10
       * @description 缓存未命中的令牌数量（DeepSeek专用）
       */
      prompt_cache_miss_tokens?: number
      /**
       * @example 50
       * @description 输入消息的令牌数量
       */
      prompt_tokens?: number
      /**
       * @description 输入令牌的详细信息（包含缓存token）
       */
      prompt_tokens_details?: {
        /**
         * @example 40
         * @description 缓存命中的令牌数量（OpenAI/阿里云百炼）
         */
        cached_tokens?: number
      }
      /**
       * @example 2023-01-01T00:00:00Z
       * @description 时间统计
       */
      request_start_time?: string
      /**
       * @example 3000
       * @description 总响应时间（毫秒）
       */
      total_time_ms?: number
      /**
       * @example 150
       * @description 总令牌数量
       */
      total_tokens?: number
    }
  }

  export interface ModelChoice {
    /**
     * @description 流式响应的消息增量（仅流式响应时使用）
     */
    delta?: {
      /**
       * @example 你好！我是AI助手...
       * @description 消息内容增量，逐步累积形成完整响应
       */
      content?: string
      /**
       * @example 好的，让我来分析一下...
       * @description 模型思考过程，流式数据，某些模型使用此字段名
       */
      reasoning?: string
      /**
       * @example 从用户的需求来看...
       * @description 模型思考过程，流式数据，部分模型使用此字段名替代thinking
       */
      reasoning_content?: string
      /**
       * @example assistant
       * @description 消息角色增量，通常只在第一条流式消息中出现
       */
      role?: string
      /**
       * @example 首先，我需要理解用户的问题...
       * @description 模型思考过程增量，仅在思考模式下出现，实时展示推理过程
       */
      thinking?: string
      /**
       * @description 工具调用增量，用于Function Calling功能，流式响应中逐块返回
       */
      tool_calls?: Array<__common__.ModelToolCall>
    }
    /**
     * @example stop
     * @description 结束原因：stop=正常结束，length=达到长度限制
     */
    finish_reason?: string
    /**
     * @description 选择项索引，通常为0
     */
    index?: number
    /**
     * @description 生成的消息内容
     */
    message?: {
      /**
       * @description 消息内容，必填。支持string类型（传统文本）或[]MultiModalContent类型（多模态内容）
       */
      content: any
      /**
       * @example 这个问题的答案是...
       * @description 模型思考过程，某些模型使用此字段名替代thinking，用于展示推理链
       */
      reasoning_content?: string
      /**
       * @example user
       * @description 消息角色：system=系统指令，user=用户消息，assistant=助手回复
       */
      role: EnumLists.Role1
      /**
       * @example 让我思考一下如何回答这个问题...
       * @description 模型思考过程，仅assistant角色且启用思考模式时出现，展示内部推理过程
       */
      thinking?: string
      /**
       * @description 工具调用列表，用于Function Calling功能，仅assistant角色时出现
       */
      tool_calls?: Array<__common__.ModelToolCall>
    }
  }

  export interface ModelCompletionTokensDetails {
    /**
     * @example 20
     * @description 推理过程使用的令牌数量
     */
    reasoning_tokens?: number
  }

  export interface ModelConcurrencyRemainingResponse {
    /**
     * @description 应用并发限制（仅传app_id时返回）
     */
    app_concurrency?: number
    /**
     * @description 应用实时剩余并发 = 应用并发限制 - 应用当前运行数（-1=应用未设并发限制，仅传app_id时返回）
     */
    app_remaining?: number
    /**
     * @example 10
     * @description 模型总并发限制
     */
    model_concurrency?: number
    /**
     * @example 1
     * @description 模型ID
     */
    model_id?: number
    /**
     * @example 7
     * @description 模型剩余可分配并发 = 总并发 - 所有应用已配置的 app_concurrency 总和（-1=模型未设并发限制）
     */
    model_remaining?: number
    /**
     * @description 用户并发限制（仅传app_id时返回）
     */
    user_concurrency?: number
  }

  export interface ModelCreateAPIKeyRequest {
    /**
     * @example sk-xxx
     * @description 支持逗号分隔批量添加
     */
    key: string
    /**
     * @example OpenAI生产密钥
     */
    name: string
    /**
     * @example 1
     * @description 所属平台ID，可选
     */
    platform_id?: number
    /**
     * @example https://example.com
     */
    referer?: string
    /**
     * @example 用于生产环境的API密钥
     */
    remark?: string
    /**
     * @example official
     */
    source?: string
    /**
     * @example OpenAI
     */
    vendor?: string
  }

  export interface ModelCreateApplicationRequest {
    /**
     * @example app_custom_key
     * @description 应用密钥，可选，如果不提供则自动生成格式为'app_'开头的唯一标识。如果提供自定义值，系统会验证其唯一性
     */
    app_key?: string
    /**
     * @description 默认模型ID，可选，必须是model_ids中的一个。如果提供了model_ids但没有指定默认模型，则第一个模型将作为默认模型
     */
    default_model_id?: number
    /**
     * @example 这是一个测试应用
     * @description 应用描述，可选
     */
    description?: string
    /**
     * @example true
     * @description 是否开启请求队列功能，可选
     */
    enable_request_queue?: boolean
    /**
     * @description 模型并发配置列表，可选
     */
    model_concurrency_configs?: Array<__common__.ModelModelConcurrencyConfig>
    /**
     * @description 关联的模型ID列表，可选，创建应用时可以同时关联多个模型
     */
    model_ids?: Array<number>
    /**
     * @example 我的应用
     * @description 应用名称，必填，唯一
     */
    name: string
  }

  export interface ModelCreateModelRequest {
    /**
     * @example 5
     * @description 并发数量，可选，0表示不限制
     */
    concurrency?: number
    /**
     * @example 128000
     * @description 上下文大小（tokens）
     */
    context_size?: number
    /**
     * @example {"temperature":0.7}
     * @description 模型默认参数(JSON格式)，可选
     */
    default_params?: string
    /**
     * @example 1
     * @description 工具调用支持：1支持，0不支持，可选
     */
    function_call?: EnumLists.Function_call
    /**
     * @description 是否默认参数优先，可选
     */
    is_default_params_first?: boolean
    /**
     * @example true
     * @description 是否兼容OpenAI API
     */
    is_openai?: boolean
    /**
     * @example gpt-4-turbo
     * @description 模型名称，必填
     */
    model_name: string
    /**
     * @example chat
     * @description 模型类型，必填
     */
    model_type: EnumLists.Model_type
    /**
     * @example GPT-4 Turbo
     * @description 模型昵称
     */
    nickname?: string
    /**
     * @example 1
     * @description 所属平台ID，必填；厂商名称由平台提供
     */
    platform_id: number
    /**
     * @example /rerank
     * @description Rerank请求路径，仅 rerank 模型使用，默认为 /rerank
     */
    rerank_url?: string
    /**
     * @example true
     * @description 是否支持深度思考，可选
     */
    supports_deep_thinking?: boolean
    /**
     * @example 0.7
     * @description 温度参数 (0.0-1.0)，可选
     */
    temperature?: number
    /**
     * @example 60
     * @description 超时时间（秒），可选
     */
    timeout?: number
  }

  export interface ModelCreatePlatformRequest {
    /**
     * @description API密钥（支持逗号分隔），可选
     */
    api_key?: string
    /**
     * @description API风格，必填
     */
    api_style: EnumLists.Api_style
    /**
     * @description 余额查询方式：deepseek / 空（不使用）
     */
    balance_query_method?: EnumLists.Balance_query_method
    /**
     * @description API基础URL，必填
     */
    base_url: string
    /**
     * @description 模型描述映射字段，可选
     */
    model_desc_mapping_field?: string
    /**
     * @description 模型列表过滤正则表达式，可选
     */
    model_list_filter?: string
    /**
     * @description 模型列表映射字段，存在model_list_url时必填
     */
    model_list_mapping_field?: string
    /**
     * @description 获取平台模型列表接口URL，可选
     */
    model_list_url?: string
    /**
     * @description 模型名称映射字段，存在model_list_url时必填
     */
    model_name_mapping_field?: string
    /**
     * @description 平台名称，必填
     */
    name: string
    /**
     * @description 备注，可选
     */
    remark?: string
    /**
     * @description 状态，可选，默认enabled
     */
    status?: EnumLists.Status
    /**
     * @description 是否支持 OpenAI Responses API，可选，默认 false
     */
    support_responses_api?: boolean
  }

  export interface ModelDatabaseInfo {
    /**
     * @description 数据库统计信息，包含连接数、查询数等
     */
    stats?: object
    /**
     * @example connected
     * @description 数据库状态：connected=已连接，disconnected=未连接，error=连接异常
     */
    status?: string
  }

  export interface ModelDeleteChatRecordsRequest {
    /**
     * @description 应用ID（如果提供，只删除该应用的记录）
     */
    application_id?: number
    /**
     * @example 2023-01-01T00:00:00Z
     * @description 删除指定时间之前的记录
     */
    before_time?: string
    /**
     * @description 对话ID（如果提供，只删除该对话的记录）
     */
    conversation_id?: string
    /**
     * @description 要删除的记录ID列表
     */
    record_ids?: Array<number>
    /**
     * @description 会话ID（如果提供，只删除该会话的记录）
     */
    session_id?: string
  }

  export interface ModelEmbeddingData {
    /**
     * @description 向量数组或 base64 字符串
     */
    embedding?: any
    /**
     * @description 对应输入的位置索引
     */
    index?: number
    /**
     * @example embedding
     * @description 固定为 "embedding"
     */
    object?: string
  }

  export interface ModelEmbeddingRequest {
    /**
     * @example 1536
     * @description 输出维度，可选
     */
    dimensions?: number
    /**
     * @example float
     * @description 编码格式，可选：float 或 base64
     */
    encoding_format?: string
    /**
     * @description 待嵌入的文本，支持 string 或 []string
     */
    input: any
    /**
     * @example text-embedding-3-small
     * @description 模型名称，支持空值/auto/default/具体模型名
     */
    model: string
    /**
     * @example user123
     * @description 用户标识，可选
     */
    user?: string
  }

  export interface ModelEmbeddingResponse {
    /**
     * @description embedding 结果列表
     */
    data?: Array<__common__.ModelEmbeddingData>
    /**
     * @example text-embedding-3-small
     * @description 真实转发的模型名
     */
    model?: string
    /**
     * @example list
     * @description 固定为 "list"
     */
    object?: string
    /**
     * @description token 使用情况
     */
    usage?: {
      /**
       * @example 8
       * @description 输入 token 数
       */
      prompt_tokens?: number
      /**
       * @example 8
       * @description 总 token 数
       */
      total_tokens?: number
    }
  }

  export interface ModelEmbeddingUsage {
    /**
     * @example 8
     * @description 输入 token 数
     */
    prompt_tokens?: number
    /**
     * @example 8
     * @description 总 token 数
     */
    total_tokens?: number
  }

  export interface ModelErrorDetail {
    /**
     * @example invalid_api_key
     * @description 错误代码（可选）
     */
    code?: string
    /**
     * @example API密钥无效
     * @description 错误消息描述
     */
    message?: string
    /**
     * @example invalid_request_error
     * @description 错误类型
     */
    type?: string
  }

  export interface ModelErrorResponse {
    /**
     * @description 错误详情
     */
    error?: {
      /**
       * @example invalid_api_key
       * @description 错误代码（可选）
       */
      code?: string
      /**
       * @example API密钥无效
       * @description 错误消息描述
       */
      message?: string
      /**
       * @example invalid_request_error
       * @description 错误类型
       */
      type?: string
    }
  }

  export interface ModelHealthResponse {
    /**
     * @example connected
     * @description 数据库连接状态：connected=已连接，disconnected=未连接，error=连接异常
     */
    database?: string
    /**
     * @example ok
     * @description 服务状态：ok=正常，error=异常
     */
    status?: string
    /**
     * @example 2023-01-01T12:00:00Z
     * @description 检查时间戳，RFC3339格式
     */
    timestamp?: string
  }

  export interface ModelIPWhitelistRecord {
    address_group_id?: string
    created_at?: string
    id?: number
    ip_address?: string
    ports?: string
    updated_at?: string
    user_id?: string
    username?: string
  }

  export interface ModelImportResult {
    /**
     * @example ["第3行：模型名称不能为空","第5行：API密钥格式错误"]
     * @description 错误信息列表，仅在失败时提供
     */
    errors?: Array<string>
    /**
     * @example 2
     * @description 失败导入数量
     */
    failed?: number
    /**
     * @example 8
     * @description 成功导入数量
     */
    success?: number
    /**
     * @example 10
     * @description 总记录数
     */
    total?: number
  }

  export interface ModelMessage {
    /**
     * @description 消息内容，必填。支持string类型（传统文本）或[]MultiModalContent类型（多模态内容）
     */
    content: any
    /**
     * @example 这个问题的答案是...
     * @description 模型思考过程，某些模型使用此字段名替代thinking，用于展示推理链
     */
    reasoning_content?: string
    /**
     * @example user
     * @description 消息角色：system=系统指令，user=用户消息，assistant=助手回复
     */
    role: EnumLists.Role1
    /**
     * @example 让我思考一下如何回答这个问题...
     * @description 模型思考过程，仅assistant角色且启用思考模式时出现，展示内部推理过程
     */
    thinking?: string
    /**
     * @description 工具调用列表，用于Function Calling功能，仅assistant角色时出现
     */
    tool_calls?: Array<__common__.ModelToolCall>
  }

  export interface ModelMessageDelta {
    /**
     * @example 你好！我是AI助手...
     * @description 消息内容增量，逐步累积形成完整响应
     */
    content?: string
    /**
     * @example 好的，让我来分析一下...
     * @description 模型思考过程，流式数据，某些模型使用此字段名
     */
    reasoning?: string
    /**
     * @example 从用户的需求来看...
     * @description 模型思考过程，流式数据，部分模型使用此字段名替代thinking
     */
    reasoning_content?: string
    /**
     * @example assistant
     * @description 消息角色增量，通常只在第一条流式消息中出现
     */
    role?: string
    /**
     * @example 首先，我需要理解用户的问题...
     * @description 模型思考过程增量，仅在思考模式下出现，实时展示推理过程
     */
    thinking?: string
    /**
     * @description 工具调用增量，用于Function Calling功能，流式响应中逐块返回
     */
    tool_calls?: Array<__common__.ModelToolCall>
  }

  export interface ModelModel {
    /**
     * @description 关联应用
     */
    applications?: Array<__common__.ModelApplicationModel>
    /**
     * @example https://api.openai.com
     * @description API基础URL（冗余字段, 字段将废弃，作为旧数据适配使用，优先使用平台配置中的base_url）
     */
    base_url?: string
    /**
     * @description 关联
     */
    check_results?: Array<__common__.ModelModelCheckResult>
    /**
     * @example 5
     * @description 并发数量，0表示不限制
     */
    concurrency?: number
    /**
     * @example 128000
     * @description 上下文大小（tokens）
     */
    context_size?: number
    /**
     * @example 2023-01-01T00:00:00Z
     * @description 创建时间
     */
    created_at?: string
    /**
     * @example {"temperature":0.7}
     * @description 模型默认参数(JSON格式)，nil表示无默认参数
     */
    default_params?: string
    /**
     * @example 1
     * @description 工具调用支持：1支持，0不支持
     */
    function_call?: string
    /**
     * @example 1
     * @description 模型ID
     */
    id?: number
    /**
     * @example true
     * @description 是否可用
     */
    is_available?: boolean
    /**
     * @description 是否默认参数优先
     */
    is_default_params_first?: boolean
    /**
     * @example true
     * @description 禁用启用状态
     */
    is_enabled?: boolean
    /**
     * @example true
     * @description 是否符合OpenAI规范
     */
    is_openai?: boolean
    /**
     * @example gpt-4-turbo
     * @description 模型名称
     */
    model_name?: string
    /**
     * @example chat
     * @description 模型类型
     */
    model_type?: string
    /**
     * @example GPT-4 Turbo
     * @description 模型昵称
     */
    nickname?: string
    /**
     * @description 所属平台
     */
    platform?: {
      /**
       * @description 关联
       */
      api_keys?: Array<__common__.ModelAPIKey>
      /**
       * @description API风格：openai/anthropic
       */
      api_style?: string
      /**
       * @description 余额查询方式：deepseek / 空（不使用）
       */
      balance_query_method?: string
      /**
       * @description API基础URL
       */
      base_url?: string
      created_at?: string
      id?: number
      /**
       * @description 平台模型列表数据中模型描述映射字段（可选）
       */
      model_desc_mapping_field?: string
      /**
       * @description 模型列表过滤正则表达式（可选，JS正则语法）
       */
      model_list_filter?: string
      /**
       * @description 平台模型列表数据中模型列表映射字段
       */
      model_list_mapping_field?: string
      /**
       * @description 获取平台模型列表接口URL（可选）
       */
      model_list_url?: string
      /**
       * @description 平台模型列表数据中模型名称映射字段
       */
      model_name_mapping_field?: string
      models?: Array<__common__.ModelModel>
      /**
       * @description 平台名称
       */
      name?: string
      /**
       * @description 备注
       */
      remark?: string
      /**
       * @description 状态：enabled/disabled
       */
      status?: string
      /**
       * @description 是否支持 OpenAI Responses API
       */
      support_responses_api?: boolean
      updated_at?: string
    }
    /**
     * @example 1
     * @description 所属平台ID
     */
    platform_id?: number
    /**
     * @example /rerank
     * @description Rerank请求路径（仅 rerank 模型使用），默认为 /rerank
     */
    rerank_url?: string
    /**
     * @example true
     * @description 是否支持深度思考
     */
    supports_deep_thinking?: boolean
    /**
     * @example 0.7
     * @description 温度参数 (0.0-1.0)
     */
    temperature?: number
    /**
     * @example 60
     * @description 超时时间（秒）
     */
    timeout?: number
    /**
     * @example 2023-01-01T00:00:00Z
     * @description 更新时间
     */
    updated_at?: string
    /**
     * @example OpenAI
     * @description 模型厂商
     */
    vendor?: string
  }

  export interface ModelModelAppUsage {
    /**
     * @example 5
     * @description 应用层并发限制（0=不限制）
     */
    app_concurrency?: number
    /**
     * @example app_1234567890abcdef
     * @description 应用密钥
     */
    app_key?: string
    /**
     * @example 1
     * @description 应用ID
     */
    application_id?: number
    /**
     * @example 我的应用
     * @description 应用名称
     */
    application_name?: string
    /**
     * @example 2023-01-01T00:00:00Z
     * @description 关联创建时间
     */
    created_at?: string
    /**
     * @example true
     * @description 应用是否开启请求队列（并发限制）
     */
    enable_request_queue?: boolean
    /**
     * @example true
     * @description 是否为该应用的默认模型
     */
    is_default?: boolean
    /**
     * @example true
     * @description 应用是否启用
     */
    is_enabled?: boolean
    /**
     * @example 2
     * @description 用户层并发限制（0=不限制）
     */
    user_concurrency?: number
  }

  export interface ModelModelCheckResult {
    checked_at?: string
    created_at?: string
    error_msg?: string
    id?: number
    is_available?: boolean
    /**
     * @description 关联
     */
    model?: {
      /**
       * @description 关联应用
       */
      applications?: Array<__common__.ModelApplicationModel>
      /**
       * @example https://api.openai.com
       * @description API基础URL（冗余字段, 字段将废弃，作为旧数据适配使用，优先使用平台配置中的base_url）
       */
      base_url?: string
      /**
       * @description 关联
       */
      check_results?: Array<__common__.ModelModelCheckResult>
      /**
       * @example 5
       * @description 并发数量，0表示不限制
       */
      concurrency?: number
      /**
       * @example 128000
       * @description 上下文大小（tokens）
       */
      context_size?: number
      /**
       * @example 2023-01-01T00:00:00Z
       * @description 创建时间
       */
      created_at?: string
      /**
       * @example {"temperature":0.7}
       * @description 模型默认参数(JSON格式)，nil表示无默认参数
       */
      default_params?: string
      /**
       * @example 1
       * @description 工具调用支持：1支持，0不支持
       */
      function_call?: string
      /**
       * @example 1
       * @description 模型ID
       */
      id?: number
      /**
       * @example true
       * @description 是否可用
       */
      is_available?: boolean
      /**
       * @description 是否默认参数优先
       */
      is_default_params_first?: boolean
      /**
       * @example true
       * @description 禁用启用状态
       */
      is_enabled?: boolean
      /**
       * @example true
       * @description 是否符合OpenAI规范
       */
      is_openai?: boolean
      /**
       * @example gpt-4-turbo
       * @description 模型名称
       */
      model_name?: string
      /**
       * @example chat
       * @description 模型类型
       */
      model_type?: string
      /**
       * @example GPT-4 Turbo
       * @description 模型昵称
       */
      nickname?: string
      /**
       * @description 所属平台
       */
      platform?: {
        /**
         * @description 关联
         */
        api_keys?: Array<__common__.ModelAPIKey>
        /**
         * @description API风格：openai/anthropic
         */
        api_style?: string
        /**
         * @description 余额查询方式：deepseek / 空（不使用）
         */
        balance_query_method?: string
        /**
         * @description API基础URL
         */
        base_url?: string
        created_at?: string
        id?: number
        /**
         * @description 平台模型列表数据中模型描述映射字段（可选）
         */
        model_desc_mapping_field?: string
        /**
         * @description 模型列表过滤正则表达式（可选，JS正则语法）
         */
        model_list_filter?: string
        /**
         * @description 平台模型列表数据中模型列表映射字段
         */
        model_list_mapping_field?: string
        /**
         * @description 获取平台模型列表接口URL（可选）
         */
        model_list_url?: string
        /**
         * @description 平台模型列表数据中模型名称映射字段
         */
        model_name_mapping_field?: string
        models?: Array<__common__.ModelModel>
        /**
         * @description 平台名称
         */
        name?: string
        /**
         * @description 备注
         */
        remark?: string
        /**
         * @description 状态：enabled/disabled
         */
        status?: string
        /**
         * @description 是否支持 OpenAI Responses API
         */
        support_responses_api?: boolean
        updated_at?: string
      }
      /**
       * @example 1
       * @description 所属平台ID
       */
      platform_id?: number
      /**
       * @example /rerank
       * @description Rerank请求路径（仅 rerank 模型使用），默认为 /rerank
       */
      rerank_url?: string
      /**
       * @example true
       * @description 是否支持深度思考
       */
      supports_deep_thinking?: boolean
      /**
       * @example 0.7
       * @description 温度参数 (0.0-1.0)
       */
      temperature?: number
      /**
       * @example 60
       * @description 超时时间（秒）
       */
      timeout?: number
      /**
       * @example 2023-01-01T00:00:00Z
       * @description 更新时间
       */
      updated_at?: string
      /**
       * @example OpenAI
       * @description 模型厂商
       */
      vendor?: string
    }
    model_id?: number
    /**
     * @description 响应时间，毫秒
     */
    response_time?: number
  }

  export interface ModelModelConcurrencyConfig {
    /**
     * @example 3
     * @description 应用层并发限制（0=不限制）
     */
    app_concurrency?: number
    /**
     * @example 1
     * @description 模型ID
     */
    model_id: number
    /**
     * @example 2
     * @description 用户层并发限制（0=不限制）
     */
    user_concurrency?: number
  }

  export interface ModelModelConcurrencyResponse {
    /**
     * @example 5
     * @description 应用层并发限制（0=不限制）
     */
    app_concurrency?: number
    /**
     * @example 1
     * @description 应用ID
     */
    application_id?: number
    /**
     * @description 是否为该应用的默认模型
     */
    is_default?: boolean
    /**
     * @example 1
     * @description 模型ID
     */
    model_id?: number
    /**
     * @example 2
     * @description 用户层并发限制（0=不限制）
     */
    user_concurrency?: number
  }

  export interface ModelModelInfo {
    /**
     * @example 1640995200
     * @description 创建时间戳
     */
    created?: number
    /**
     * @example gpt-4-turbo
     * @description 模型ID
     */
    id?: string
    /**
     * @example model
     * @description 对象类型，固定为model
     */
    object?: string
    /**
     * @example openai
     * @description 模型所有者
     */
    owned_by?: string
  }

  export interface ModelModelRequestQueue {
    /**
     * @example 3
     * @description 创建时应用层并发限制快照
     */
    app_concurrency_limit?: number
    /**
     * @example 1
     * @description 应用ID
     */
    app_id?: number
    /**
     * @example 2023-01-01T00:00:00Z
     * @description 创建时间
     */
    created_at?: string
    /**
     * @example 2023-01-01T00:00:00Z
     * @description 可发送时间
     */
    executable_at?: string
    /**
     * @example 1
     * @description 任务ID
     */
    id?: number
    /**
     * @example true
     * @description 是否是队列任务
     */
    is_queue_task?: boolean
    /**
     * @example 1
     * @description 模型ID
     */
    model_id?: number
    /**
     * @example user123
     * @description 请求人
     */
    requester?: string
    /**
     * @example pending
     * @description 任务状态
     */
    status?: any
    /**
     * @example 10
     * @description 创建时模型总并发限制快照
     */
    total_concurrency_limit?: number
    /**
     * @example 1
     * @description 创建时用户层并发限制快照
     */
    user_concurrency_limit?: number
    /**
     * @example 42
     * @description 用户ID（0=匿名）
     */
    user_id?: number
  }

  export interface ModelModelResponse {
    /**
     * @description 使用该模型的应用列表及其并发配置
     */
    applications?: Array<__common__.ModelModelAppUsage>
    /**
     * @example 5
     * @description 并发数量
     */
    concurrency?: number
    /**
     * @example 128000
     * @description 上下文大小（tokens）
     */
    context_size?: number
    /**
     * @example 2023-01-01T00:00:00Z
     * @description 创建时间
     */
    created_at?: string
    /**
     * @example {"temperature":0.7}
     * @description 模型默认参数(JSON格式)
     */
    default_params?: string
    /**
     * @example 1
     * @description 工具调用支持：1支持，0不支持
     */
    function_call?: string
    /**
     * @example 1
     * @description 模型ID
     */
    id?: number
    /**
     * @example true
     * @description 是否可用
     */
    is_available?: boolean
    /**
     * @description 是否默认参数优先
     */
    is_default_params_first?: boolean
    /**
     * @example true
     * @description 禁用启用状态
     */
    is_enabled?: boolean
    /**
     * @example true
     * @description 是否符合OpenAI规范
     */
    is_openai?: boolean
    /**
     * @example gpt-4-turbo
     * @description 模型名称
     */
    model_name?: string
    /**
     * @example chat
     * @description 模型类型
     */
    model_type?: string
    /**
     * @example GPT-4 Turbo
     * @description 模型昵称
     */
    nickname?: string
    /**
     * @example 1
     * @description 所属平台ID
     */
    platform_id?: number
    /**
     * @example true
     * @description 是否支持深度思考
     */
    supports_deep_thinking?: boolean
    /**
     * @example 0.7
     * @description 温度参数 (0.0-2.0)
     */
    temperature?: number
    /**
     * @example 60
     * @description 超时时间（秒）
     */
    timeout?: number
    /**
     * @example 2023-01-01T00:00:00Z
     * @description 更新时间
     */
    updated_at?: string
    /**
     * @example OpenAI
     * @description 模型厂商
     */
    vendor?: string
  }

  export interface ModelModelSyncErrorDetail {
    /**
     * @example API_ERROR
     * @description 错误代码
     */
    error_code?: string
    /**
     * @example 外部服务连接超时
     * @description 失败原因的详细描述
     */
    error_reason?: string
    /**
     * @example 123
     * @description 模型ID（如果可用）
     */
    model_id?: string
    /**
     * @example gpt-4-turbo
     * @description 失败的模型名称
     */
    model_name?: string
    /**
     * @example add
     * @description 操作类型：add=添加，remove=删除
     */
    operation?: string
    /**
     * @example true
     * @description 是否可以重试
     */
    retryable?: boolean
  }

  export interface ModelModelSyncResult {
    /**
     * @example 3
     * @description 成功添加的模型数量
     */
    added_models?: number
    /**
     * @example 8
     * @description 外部项目中总模型数量
     */
    external_models?: number
    /**
     * @description 添加失败的模型详细信息
     */
    failed_adds?: Array<__common__.ModelModelSyncErrorDetail>
    /**
     * @description 删除失败的模型详细信息
     */
    failed_removals?: Array<__common__.ModelModelSyncErrorDetail>
    /**
     * @example 同步完成
     * @description 同步结果摘要信息
     */
    message?: string
    /**
     * @example 2
     * @description 成功删除的模型数量
     */
    removed_models?: number
    /**
     * @example true
     * @description 同步是否成功
     */
    success?: boolean
    /**
     * @example 2023-01-01T12:00:00Z
     * @description 同步完成时间
     */
    sync_time?: string
    /**
     * @example 10
     * @description 应用中总模型数量
     */
    total_models?: number
  }

  export interface ModelModelsInfo {
    /**
     * @example 20
     * @description 可用模型数量（API连接正常）
     */
    available?: number
    /**
     * @example 18
     * @description 启用状态模型数量
     */
    enabled?: number
    /**
     * @example 25
     * @description 模型总数量（包括已删除的）
     */
    total?: number
  }

  export interface ModelModelsResponse {
    /**
     * @description 模型信息列表
     */
    data?: Array<__common__.ModelModelInfo>
    /**
     * @example list
     * @description 对象类型，固定为list
     */
    object?: string
  }

  export interface ModelPageResponse {
    /**
     * @description 当前页的数据列表，根据具体接口返回不同类型的对象数组
     */
    list?: any
    /**
     * @example 1
     * @description 当前页码，从1开始
     */
    page?: number
    /**
     * @example 20
     * @description 每页大小，默认20，最大500
     */
    page_size?: number
    /**
     * @example 100
     * @description 总记录数（不受分页影响的总数）
     */
    total?: number
  }

  export interface ModelPaginatedResponse {
    items?: any
    page?: number
    page_size?: number
    total?: number
    total_pages?: number
  }

  export interface ModelPlatform {
    /**
     * @description 关联
     */
    api_keys?: Array<__common__.ModelAPIKey>
    /**
     * @description API风格：openai/anthropic
     */
    api_style?: string
    /**
     * @description 余额查询方式：deepseek / 空（不使用）
     */
    balance_query_method?: string
    /**
     * @description API基础URL
     */
    base_url?: string
    created_at?: string
    id?: number
    /**
     * @description 平台模型列表数据中模型描述映射字段（可选）
     */
    model_desc_mapping_field?: string
    /**
     * @description 模型列表过滤正则表达式（可选，JS正则语法）
     */
    model_list_filter?: string
    /**
     * @description 平台模型列表数据中模型列表映射字段
     */
    model_list_mapping_field?: string
    /**
     * @description 获取平台模型列表接口URL（可选）
     */
    model_list_url?: string
    /**
     * @description 平台模型列表数据中模型名称映射字段
     */
    model_name_mapping_field?: string
    models?: Array<__common__.ModelModel>
    /**
     * @description 平台名称
     */
    name?: string
    /**
     * @description 备注
     */
    remark?: string
    /**
     * @description 状态：enabled/disabled
     */
    status?: string
    /**
     * @description 是否支持 OpenAI Responses API
     */
    support_responses_api?: boolean
    updated_at?: string
  }

  export interface ModelPlatformAPIKeyPollResult {
    is_available?: boolean
    key_results?: Array<__common__.ModelPlatformAPIKeyTestResult>
    platform_id?: number
  }

  export interface ModelPlatformAPIKeyTestResult {
    api_key_id?: number
    error_msg?: string
    is_available?: boolean
  }

  export interface ModelPlatformCreateResult {
    /**
     * @description 不可用的apiKey值列表
     */
    failed_api_keys?: Array<string>
    /**
     * @description 提示信息
     */
    message?: string
    platform?: __common__.ModelPlatformResponse
    /**
     * @description 成功添加的apiKey数量
     */
    success_key_count?: number
  }

  export interface ModelPlatformModelInfo {
    description?: string
    name?: string
  }

  export interface ModelPlatformResponse {
    api_keys?: Array<__common__.ModelAPIKeyResponse>
    api_style?: string
    balance_query_method?: string
    base_url?: string
    created_at?: string
    id?: number
    model_desc_mapping_field?: string
    model_list_filter?: string
    model_list_mapping_field?: string
    model_list_url?: string
    model_name_mapping_field?: string
    name?: string
    remark?: string
    status?: string
    support_responses_api?: boolean
    updated_at?: string
  }

  export interface ModelPromptTokensDetails {
    /**
     * @example 40
     * @description 缓存命中的令牌数量（OpenAI/阿里云百炼）
     */
    cached_tokens?: number
  }

  export interface ModelQueueTaskResponse {
    /**
     * @example 2
     * @description 该应用维度的排队位置
     */
    app_wait_count?: number
    /**
     * @example 2023-01-01T00:00:00Z
     * @description 可发送时间
     */
    executable_at?: string
    /**
     * @example pending
     * @description 任务状态
     */
    status?: any
    /**
     * @example 1
     * @description 任务ID
     */
    task_id?: number
    /**
     * @example 3
     * @description 该模型下该应用的等待任务总数
     */
    total_app_wait_count?: number
    /**
     * @example 5
     * @description 前方等待任务数量（模型级别）
     */
    wait_count?: number
  }

  export interface ModelRequestTaskStatus {}

  export interface ModelRerankRequest {
    /**
     * @description 待重排序的文档列表，支持 []string 或 []map[string]string
     */
    documents: any
    /**
     * @example rerank-english-v3.0
     * @description 模型名称，支持空值/auto/default/具体模型名
     */
    model: string
    /**
     * @example What is the capital of France?
     */
    query: string
    /**
     * @description 是否在结果中返回原文，可选
     */
    return_documents?: boolean
    /**
     * @example 3
     * @description 返回 top N 个结果，可选
     */
    top_n?: number
  }

  export interface ModelRerankResponse {
    /**
     * @example rerank-abc123
     * @description 请求唯一标识
     */
    id?: string
    /**
     * @example rerank-english-v3.0
     * @description 真实转发的模型名
     */
    model?: string
    /**
     * @example list
     * @description 固定为 "list"
     */
    object?: string
    /**
     * @description 重排序结果列表
     */
    results?: Array<__common__.ModelRerankResult>
    /**
     * @description token 使用统计
     */
    usage?: {
      /**
       * @example 150
       * @description 总 token 数
       */
      total_tokens?: number
    }
  }

  export interface ModelRerankResult {
    /**
     * @description 文档原文（当 return_documents=true 时返回）
     */
    document?: any
    /**
     * @description 对应输入文档的位置索引
     */
    index?: number
    /**
     * @example 0.95
     * @description 相关性分数
     */
    relevance_score?: number
  }

  export interface ModelRerankUsage {
    /**
     * @example 150
     * @description 总 token 数
     */
    total_tokens?: number
  }

  export interface ModelResponse {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    /**
     * @description 响应数据，成功时包含具体的业务数据，失败时为null
     */
    data?: any
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface ModelResponsesContentItem {
    annotations?: Array<any>
    text?: string
    type?: string
  }

  export interface ModelResponsesCreateRequest {
    include?: Array<string>
    input: object
    instructions?: string
    max_output_tokens?: number
    metadata?: object
    model?: string
    previous_response_id?: string
    queue_id?: number
    reasoning?: object
    store?: boolean
    stream?: boolean
    temperature?: number
    tool_choice?: object
    tools?: Array<object>
    top_p?: number
    truncation?: string
  }

  export interface ModelResponsesDeleteResponse {
    deleted?: boolean
    id?: string
    object?: string
  }

  export interface ModelResponsesError {
    code?: string
    message?: string
  }

  export interface ModelResponsesIncompleteDetails {
    reason?: string
  }

  export interface ModelResponsesInputTokensDetails {
    cached_tokens?: number
  }

  export interface ModelResponsesOutputItem {
    content?: Array<__common__.ModelResponsesContentItem>
    id?: string
    role?: string
    status?: string
    summary?: Array<__common__.ModelResponsesSummaryItem>
    type?: string
  }

  export interface ModelResponsesOutputTokensDetails {
    reasoning_tokens?: number
  }

  export interface ModelResponsesResponse {
    completed_at?: number
    created_at?: number
    deleted?: boolean
    error?: __common__.ModelResponsesError
    id?: string
    incomplete_details?: __common__.ModelResponsesIncompleteDetails
    instructions?: string
    metadata?: object
    model?: string
    object?: string
    output?: Array<__common__.ModelResponsesOutputItem>
    output_text?: string
    previous_response_id?: string
    status?: string
    store?: boolean
    usage?: __common__.ModelResponsesUsage
  }

  export interface ModelResponsesSummaryItem {
    text?: string
    type?: string
  }

  export interface ModelResponsesUsage {
    input_tokens?: number
    input_tokens_details?: __common__.ModelResponsesInputTokensDetails
    output_tokens?: number
    output_tokens_details?: __common__.ModelResponsesOutputTokensDetails
    total_tokens?: number
  }

  export interface ModelSetDefaultModelRequest {
    /**
     * @example 1
     * @description 要设置为默认的模型ID，必填，必须已关联到该应用
     */
    model_id: number
  }

  export interface ModelStatusResponse {
    database?: __common__.ModelDatabaseInfo
    models?: __common__.ModelModelsInfo
    system?: __common__.ModelSystemInfo
  }

  export interface ModelSystemInfo {
    /**
     * @example go1.19.0
     * @description Go运行时版本
     */
    go_version?: string
    /**
     * @example 72h3m
     * @description 系统运行时间
     */
    uptime?: string
    /**
     * @example 1.0.0
     * @description 应用版本号
     */
    version?: string
  }

  export interface ModelTokenUsageByAppItem {
    app_id?: number
    app_name?: string
    avg_duration_ms?: number
    cached_tokens?: number
    completion_tokens?: number
    prompt_tokens?: number
    thinking_tokens?: number
    total_requests?: number
    total_tokens?: number
  }

  export interface ModelTokenUsageByAppResponse {
    list?: Array<__common__.ModelTokenUsageByAppItem>
    page?: number
    page_size?: number
    total?: number
  }

  export interface ModelTokenUsageByModelItem {
    avg_duration_ms?: number
    cached_tokens?: number
    completion_tokens?: number
    model_name?: string
    prompt_tokens?: number
    thinking_tokens?: number
    total_requests?: number
    total_tokens?: number
  }

  export interface ModelTokenUsageByModelResponse {
    list?: Array<__common__.ModelTokenUsageByModelItem>
    page?: number
    page_size?: number
    total?: number
  }

  export interface ModelTokenUsageByTimeItem {
    avg_duration_ms?: number
    completion_tokens?: number
    prompt_tokens?: number
    time?: string
    total_requests?: number
    total_tokens?: number
  }

  export interface ModelTokenUsageByTimeResponse {
    list?: Array<__common__.ModelTokenUsageByTimeItem>
  }

  export interface ModelTokenUsageByUserItem {
    avg_duration_ms?: number
    completion_tokens?: number
    prompt_tokens?: number
    total_requests?: number
    total_tokens?: number
    user_id?: string
    username?: string
  }

  export interface ModelTokenUsageByUserResponse {
    list?: Array<__common__.ModelTokenUsageByUserItem>
    page?: number
    page_size?: number
    total?: number
  }

  export interface ModelTokenUsageOverviewResponse {
    avg_duration_ms?: number
    failed_requests?: number
    success_requests?: number
    total_cached_tokens?: number
    total_completion_tokens?: number
    total_prompt_tokens?: number
    total_requests?: number
    total_thinking_tokens?: number
    total_tokens?: number
  }

  export interface ModelToolCall {
    /**
     * @description 函数调用详情
     */
    function?: {
      /**
       * @example {"location": "Beijing"}
       * @description 函数参数（JSON字符串格式）
       */
      arguments?: string
      /**
       * @example get_weather
       * @description 函数名称
       */
      name?: string
    }
    /**
     * @example call_abc123
     * @description 工具调用ID，唯一标识一次工具调用
     */
    id?: string
    /**
     * @description 工具调用索引（流式响应中使用，用于标识同一工具调用的不同部分）
     */
    index?: number
    /**
     * @example function
     * @description 调用类型，通常为"function"
     */
    type?: string
  }

  export interface ModelToolCallFunction {
    /**
     * @example {"location": "Beijing"}
     * @description 函数参数（JSON字符串格式）
     */
    arguments?: string
    /**
     * @example get_weather
     * @description 函数名称
     */
    name?: string
  }

  export interface ModelUpdateAPIKeyRequest {
    /**
     * @example sk-xxx
     */
    key?: string
    /**
     * @example OpenAI生产密钥
     */
    name?: string
    /**
     * @example 1
     */
    platform_id?: number
    /**
     * @example https://example.com
     */
    referer?: string
    /**
     * @example 用于生产环境的API密钥
     */
    remark?: string
    /**
     * @example official
     */
    source?: string
    /**
     * @example enabled
     */
    status?: EnumLists.Status
    /**
     * @example OpenAI
     */
    vendor?: string
  }

  export interface ModelUpdateApplicationRequest {
    /**
     * @example new_app_key
     * @description 应用密钥，可选，如果提供会验证唯一性，确保不与其他应用冲突
     */
    app_key?: string
    /**
     * @description 默认模型ID，可选，如果同时提供了model_ids则必须在其中，否则必须在现有关联模型中
     */
    default_model_id?: number
    /**
     * @example 更新后的应用描述
     * @description 应用描述，可选
     */
    description?: string
    /**
     * @example true
     * @description 是否开启请求队列功能，可选
     */
    enable_request_queue?: boolean
    /**
     * @description 重新设置关联的模型ID列表，可选，如果提供则会替换现有的模型关联
     */
    model_ids?: Array<number>
    /**
     * @example 更新后的应用名称
     * @description 应用名称，可选，如果提供会验证唯一性
     */
    name?: string
  }

  export interface ModelUpdateApplicationStatusRequest {
    /**
     * @example true
     * @description 是否启用应用，true=启用，false=禁用
     */
    is_enabled?: boolean
  }

  export interface ModelUpdateModelRequest {
    /**
     * @example 5
     * @description 并发数量，可选，0表示不限制
     */
    concurrency?: number
    /**
     * @example 128000
     * @description 上下文大小（tokens），可选
     */
    context_size?: number
    /**
     * @example {"temperature":0.7}
     * @description 模型默认参数(JSON格式)，可选
     */
    default_params?: string
    /**
     * @example 1
     * @description 工具调用支持：1支持，0不支持，可选
     */
    function_call?: EnumLists.Function_call
    /**
     * @description 是否默认参数优先，可选
     */
    is_default_params_first?: boolean
    /**
     * @example true
     * @description 是否兼容OpenAI API，可选
     */
    is_openai?: boolean
    /**
     * @example gpt-4-turbo
     * @description 模型名称，可选
     */
    model_name?: string
    /**
     * @example chat
     * @description 模型类型，可选
     */
    model_type?: EnumLists.Model_type
    /**
     * @example GPT-4 Turbo
     * @description 模型昵称，可选
     */
    nickname?: string
    /**
     * @example 1
     * @description 所属平台ID，可选；变更平台时厂商名称由新平台提供
     */
    platform_id?: number
    /**
     * @example /rerank
     * @description Rerank请求路径，仅 rerank 模型使用，可选
     */
    rerank_url?: string
    /**
     * @example true
     * @description 是否支持深度思考，可选
     */
    supports_deep_thinking?: boolean
    /**
     * @example 0.7
     * @description 温度参数 (0.0-1.0)，可选
     */
    temperature?: number
    /**
     * @example 60
     * @description 超时时间（秒），可选
     */
    timeout?: number
  }

  export interface ModelUpdateModelStatusRequest {
    /**
     * @example true
     * @description 是否启用模型，true=启用，false=禁用
     */
    is_enabled?: boolean
  }

  export interface ModelUpdatePlatformRequest {
    /**
     * @description 关联的API密钥，可选
     */
    api_key?: string
    /**
     * @description API风格，可选
     */
    api_style?: EnumLists.Api_style
    /**
     * @description 余额查询方式：deepseek / 空（不使用）
     */
    balance_query_method?: string
    /**
     * @description API基础URL，可选
     */
    base_url?: string
    /**
     * @description 模型描述映射字段，可选
     */
    model_desc_mapping_field?: string
    /**
     * @description 模型列表过滤正则表达式，可选
     */
    model_list_filter?: string
    /**
     * @description 模型列表映射字段，可选
     */
    model_list_mapping_field?: string
    /**
     * @description 模型列表URL，可选
     */
    model_list_url?: string
    /**
     * @description 模型名称映射字段，可选
     */
    model_name_mapping_field?: string
    /**
     * @description 平台名称，可选
     */
    name?: string
    /**
     * @description 备注，可选
     */
    remark?: string
    /**
     * @description 状态，可选
     */
    status?: EnumLists.Status
    /**
     * @description 是否支持 OpenAI Responses API，可选
     */
    support_responses_api?: boolean
  }

  export interface ModelUsage {
    /**
     * @example 100
     * @description 生成回复的令牌数量
     */
    completion_tokens?: number
    /**
     * @description 完成令牌的详细信息
     */
    completion_tokens_details?: {
      /**
       * @example 20
       * @description 推理过程使用的令牌数量
       */
      reasoning_tokens?: number
    }
    /**
     * @example 2023-01-01T00:00:01Z
     * @description 首次响应时间点
     */
    first_response_time?: string
    /**
     * @example 800
     * @description 响应时间耗时
     */
    first_token_time_ms?: number
    /**
     * @example 40
     * @description 缓存命中的令牌数量（DeepSeek专用）
     */
    prompt_cache_hit_tokens?: number
    /**
     * @example 10
     * @description 缓存未命中的令牌数量（DeepSeek专用）
     */
    prompt_cache_miss_tokens?: number
    /**
     * @example 50
     * @description 输入消息的令牌数量
     */
    prompt_tokens?: number
    /**
     * @description 输入令牌的详细信息（包含缓存token）
     */
    prompt_tokens_details?: {
      /**
       * @example 40
       * @description 缓存命中的令牌数量（OpenAI/阿里云百炼）
       */
      cached_tokens?: number
    }
    /**
     * @example 2023-01-01T00:00:00Z
     * @description 时间统计
     */
    request_start_time?: string
    /**
     * @example 3000
     * @description 总响应时间（毫秒）
     */
    total_time_ms?: number
    /**
     * @example 150
     * @description 总令牌数量
     */
    total_tokens?: number
  }

  export interface UtilsResponse {
    code?: number
    data?: any
    msg?: string
  }

  /**
   * @description 聊天请求，必须包含app_key参数。model参数支持空值/auto/default使用默认模型，或指定具体模型名。enable_thinking为可选参数，控制是否启用思考模式。queue_id为可选参数，用于指定队列中的任务
   */
  export interface ModelChatCompletionRequest1 extends ModelChatCompletionRequest {}

  /**
   * @description 聊天请求，不需要包含api_key参数。model参数支持空值/auto/default使用默认模型，或指定具体模型名。enable_thinking为可选参数，控制是否启用思考模式。queue_id为可选参数，用于指定队列中的任务
   */
  export interface ModelChatCompletionRequestWithoutAPIKey1 extends ModelChatCompletionRequestWithoutAPIKey {}

  export type RGetPpByPortCipherByPath = Promise<[any, unknown]>
  export type RGetProxyByPortCipherByPath = Promise<[any, unknown]>
}

export namespace ProxyForwarding {
  export interface PostApiProxyEncryptRes {
    code?: number
    data?: __common__.HandlerEncryptedPortResponse
    msg?: string
  }

  /**
   * @description 加密端口请求参数
   */
  export interface PostApiProxyEncryptBody extends __common__.HandlerEncryptPortRequest {}

  export interface GetPpByPortCipherByPathParams {
    /**
     * @description 端口密文
     */
    portCipher: string
    /**
     * @description 转发的目标子路径
     */
    path: string
  }

  export interface GetProxyByPortCipherByPathParams {
    /**
     * @description 端口密文
     */
    portCipher: string
    /**
     * @description 转发的目标子路径
     */
    path: string
    /**
     * @description 若依认证Token (格式: Bearer {token})
     */
    Authorization: string
    /**
     * @description 是否获取并附加Teable Session Token (1-附加, 0-不附加)
     */
    addTeableToekn?: string
  }

  export type RPostApiProxyEncrypt = Promise<[any, ProxyForwarding.PostApiProxyEncryptRes['data'], ProxyForwarding.PostApiProxyEncryptRes]>
}

export namespace APIKeyManagement {
  export interface GetApiKeysRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelPageResponse
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetApiKeysParams {
    /**
     * @description 页码
     */
    page?: number
    /**
     * @description 每页数量
     */
    page_size?: number
    /**
     * @description 厂商筛选
     */
    vendor?: string
    /**
     * @description 平台ID筛选
     */
    platform_id?: number
    /**
     * @description 关键字搜索
     */
    keyword?: string
  }

  export interface PostApiKeysRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelAPIKeyResponse
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  /**
   * @description API密钥信息
   */
  export interface PostApiKeysBody extends __common__.ModelCreateAPIKeyRequest {}

  export interface GetApiKeysByIdRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelAPIKeyResponse
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetApiKeysByIdParams {
    /**
     * @description API密钥ID
     */
    id: number
  }

  export interface PutApiKeysByIdRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelAPIKeyResponse
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface PutApiKeysByIdParams {
    /**
     * @description API密钥ID
     */
    id: number
  }

  /**
   * @description 更新的API密钥信息
   */
  export interface PutApiKeysByIdBody extends __common__.ModelUpdateAPIKeyRequest {}

  export interface DeleteApiKeysByIdRes extends __common__.ModelResponse {}

  export interface DeleteApiKeysByIdParams {
    /**
     * @description API密钥ID
     */
    id: number
  }

  export interface PostApiKeysByIdTestRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelPlatformAPIKeyTestResult
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface PostApiKeysByIdTestParams {
    /**
     * @description API密钥ID
     */
    id: number
  }

  export type RGetApiKeys = Promise<[any, APIKeyManagement.GetApiKeysRes['data'], APIKeyManagement.GetApiKeysRes]>
  export type RPostApiKeys = Promise<[any, APIKeyManagement.PostApiKeysRes['data'], APIKeyManagement.PostApiKeysRes]>
  export type RGetApiKeysById = Promise<[any, APIKeyManagement.GetApiKeysByIdRes['data'], APIKeyManagement.GetApiKeysByIdRes]>
  export type PutApiKeysByIdParams1 = PutApiKeysByIdParams & __common__.ModelUpdateAPIKeyRequest

  export type RPutApiKeysById = Promise<[any, APIKeyManagement.PutApiKeysByIdRes['data'], APIKeyManagement.PutApiKeysByIdRes]>
  export type RDeleteApiKeysById = Promise<[any, __common__.ModelResponse['data'], __common__.ModelResponse]>
  export type RPostApiKeysByIdTest = Promise<
    [any, APIKeyManagement.PostApiKeysByIdTestRes['data'], APIKeyManagement.PostApiKeysByIdTestRes]
  >
}

export namespace ApplicationManagement {
  export interface GetApplicationsRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: {
      list?: Array<__common__.ModelApplicationListItem>
      /**
       * @example 1
       * @description 当前页码，从1开始
       */
      page?: number
      /**
       * @example 20
       * @description 每页大小，默认20，最大500
       */
      page_size?: number
      /**
       * @example 100
       * @description 总记录数（不受分页影响的总数）
       */
      total?: number
    }
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetApplicationsParams {
    /**
     * @description 页码，从1开始
     */
    page?: number
    /**
     * @description 每页数量，最大500
     */
    page_size?: number
    /**
     * @description 启用状态筛选，true=仅启用，false=仅禁用，不传=全部
     */
    is_enabled?: boolean
    /**
     * @example "测试"
     * @description 关键字模糊搜索，会在应用名称、描述和appKey中搜索匹配的内容
     */
    keyword?: string
    /**
     * @example "app_1234567890abcdef"
     * @description 应用密钥精确查询，用于查找特定appKey的应用
     */
    app_key?: string
  }

  export interface PostApplicationsRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelApplication
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  /**
   * @description 应用信息。name为必填项，其他字段为可选。model_ids为要关联的模型ID列表，default_model_id为默认模型ID（必须在model_ids中）。如果提供model_ids但未指定default_model_id，则第一个模型将作为默认模型
   */
  export interface PostApplicationsBody extends __common__.ModelCreateApplicationRequest {}

  export interface GetApplicationsKeyByAppKeyRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelApplication
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetApplicationsKeyByAppKeyParams {
    /**
     * @example "app_1234567890abcdef"
     * @description 应用唯一标识密钥，格式通常为'app_'开头的字符串
     */
    app_key: string
  }

  export interface PutApplicationsModelsConcurrencyRes extends __common__.ModelResponse {}

  /**
   * @description 批量并发配置请求体
   */
  export interface PutApplicationsModelsConcurrencyBody extends __common__.ModelBatchUpdateModelConcurrencyRequest {}

  export interface GetApplicationsByIdRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelApplication
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetApplicationsByIdParams {
    /**
     * @description 应用ID
     */
    id: number
  }

  export interface PutApplicationsByIdRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelApplication
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface PutApplicationsByIdParams {
    /**
     * @description 应用ID
     */
    id: number
  }

  /**
   * @description 更新的应用信息。所有字段都是可选的，只更新提供的字段。default_model_id必须是该应用已关联的模型ID
   */
  export interface PutApplicationsByIdBody extends __common__.ModelUpdateApplicationRequest {}

  export interface DeleteApplicationsByIdRes extends __common__.ModelResponse {}

  export interface DeleteApplicationsByIdParams {
    /**
     * @description 应用ID
     */
    id: number
  }

  export interface GetApplicationsByIdConfigRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelApplicationConfig
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetApplicationsByIdConfigParams {
    /**
     * @description 应用ID
     */
    id: number
  }

  export interface PutApplicationsByIdDefaultModelRes extends __common__.ModelResponse {}

  export interface PutApplicationsByIdDefaultModelParams {
    /**
     * @description 应用ID
     */
    id: number
  }

  /**
   * @description 默认模型信息
   */
  export interface PutApplicationsByIdDefaultModelBody extends __common__.ModelSetDefaultModelRequest {}

  export interface GetApplicationsByIdModelsRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: Array<__common__.ModelApplicationModel>
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetApplicationsByIdModelsParams {
    /**
     * @description 应用ID
     */
    id: number
  }

  export interface PostApplicationsByIdModelsRes extends __common__.ModelResponse {}

  export interface PostApplicationsByIdModelsParams {
    /**
     * @description 应用ID
     */
    id: number
  }

  /**
   * @description 添加的模型信息
   */
  export interface PostApplicationsByIdModelsBody extends __common__.ModelAddModelsRequest {}

  export interface GetApplicationsByIdModelsConcurrencyRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: Array<__common__.ModelModelConcurrencyResponse>
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetApplicationsByIdModelsConcurrencyParams {
    /**
     * @description 应用ID
     */
    id: number
  }

  export interface DeleteApplicationsByIdModelsByModelIdRes extends __common__.ModelResponse {}

  export interface DeleteApplicationsByIdModelsByModelIdParams {
    /**
     * @description 应用ID
     */
    id: number
    /**
     * @description 模型ID
     */
    model_id: number
  }

  export interface PatchApplicationsByIdStatusRes extends __common__.ModelResponse {}

  export interface PatchApplicationsByIdStatusParams {
    /**
     * @description 应用ID
     */
    id: number
  }

  /**
   * @description 状态信息
   */
  export interface PatchApplicationsByIdStatusBody extends __common__.ModelUpdateApplicationStatusRequest {}

  export interface PostApplicationsByIdSyncDifyModelsRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelModelSyncResult
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface PostApplicationsByIdSyncDifyModelsParams {
    /**
     * @description 应用ID
     */
    id: number
  }

  export interface PostApplicationsByIdSyncRagModelsRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelModelSyncResult
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface PostApplicationsByIdSyncRagModelsParams {
    /**
     * @description 应用ID
     */
    id: number
  }

  export interface PostApplicationsByIdSyncSonicModelsRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelModelSyncResult
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface PostApplicationsByIdSyncSonicModelsParams {
    /**
     * @description 应用ID
     */
    id: number
  }

  export type RGetApplications = Promise<
    [any, ApplicationManagement.GetApplicationsRes['data'], ApplicationManagement.GetApplicationsRes]
  >
  export type RPostApplications = Promise<
    [any, ApplicationManagement.PostApplicationsRes['data'], ApplicationManagement.PostApplicationsRes]
  >
  export type RGetApplicationsById = Promise<
    [any, ApplicationManagement.GetApplicationsByIdRes['data'], ApplicationManagement.GetApplicationsByIdRes]
  >
  export type PutApplicationsByIdParams1 = PutApplicationsByIdParams & __common__.ModelUpdateApplicationRequest

  export type RPutApplicationsById = Promise<
    [any, ApplicationManagement.PutApplicationsByIdRes['data'], ApplicationManagement.PutApplicationsByIdRes]
  >
  export type RDeleteApplicationsById = Promise<[any, __common__.ModelResponse['data'], __common__.ModelResponse]>
  export type RGetApplicationsByIdConfig = Promise<
    [
      any,
      ApplicationManagement.GetApplicationsByIdConfigRes['data'],
      ApplicationManagement.GetApplicationsByIdConfigRes
    ]
  >
  export type RGetApplicationsByIdModels = Promise<
    [
      any,
      ApplicationManagement.GetApplicationsByIdModelsRes['data'],
      ApplicationManagement.GetApplicationsByIdModelsRes
    ]
  >
  export type RGetApplicationsKeyByAppKey = Promise<
    [any, ApplicationManagement.GetApplicationsKeyByAppKeyRes['data'], ApplicationManagement.GetApplicationsKeyByAppKeyRes]
  >
  export type PostApplicationsByIdModelsParams1 = PostApplicationsByIdModelsParams & __common__.ModelAddModelsRequest

  export type RPostApplicationsByIdModels = Promise<[any, __common__.ModelResponse['data'], __common__.ModelResponse]>
  export type PatchApplicationsByIdStatusParams1 = PatchApplicationsByIdStatusParams & __common__.ModelUpdateApplicationStatusRequest

  export type RPatchApplicationsByIdStatus = Promise<[any, __common__.ModelResponse['data'], __common__.ModelResponse]>
  export type PutApplicationsByIdDefaultModelParams1 = PutApplicationsByIdDefaultModelParams &
    __common__.ModelSetDefaultModelRequest

  export type RPutApplicationsByIdDefaultModel = Promise<[any, __common__.ModelResponse['data'], __common__.ModelResponse]>
  export type RPutApplicationsModelsConcurrency = Promise<[any, __common__.ModelResponse['data'], __common__.ModelResponse]>
  export type RPostApplicationsByIdSyncRagModels = Promise<
    [
      any,
      ApplicationManagement.PostApplicationsByIdSyncRagModelsRes['data'],
      ApplicationManagement.PostApplicationsByIdSyncRagModelsRes
    ]
  >
  export type RPostApplicationsByIdSyncDifyModels = Promise<
    [
      any,
      ApplicationManagement.PostApplicationsByIdSyncDifyModelsRes['data'],
      ApplicationManagement.PostApplicationsByIdSyncDifyModelsRes
    ]
  >
  export type RPostApplicationsByIdSyncSonicModels = Promise<
    [
      any,
      ApplicationManagement.PostApplicationsByIdSyncSonicModelsRes['data'],
      ApplicationManagement.PostApplicationsByIdSyncSonicModelsRes
    ]
  >
  export type RGetApplicationsByIdModelsConcurrency = Promise<
    [
      any,
      ApplicationManagement.GetApplicationsByIdModelsConcurrencyRes['data'],
      ApplicationManagement.GetApplicationsByIdModelsConcurrencyRes
    ]
  >
  export type RDeleteApplicationsByIdModelsByModelId = Promise<[any, __common__.ModelResponse['data'], __common__.ModelResponse]>
}

export namespace AppliedStatistics {
  export interface GetTokenStatsRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: Array<__common__.ModelApplicationTokenStats>
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetTokenStatsParams {
    /**
     * @description 应用ID列表，用逗号分隔
     */
    application_ids?: Array<number>
  }

  export interface GetByIdChatStatsRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: object
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetByIdChatStatsParams {
    /**
     * @description 应用ID
     */
    id: number
  }

  export interface GetByIdTokenStatsRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelApplicationTokenStats
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetByIdTokenStatsParams {
    /**
     * @description 应用ID
     */
    id: number
  }

  export type RGetTokenStats = Promise<
    [any, AppliedStatistics.GetTokenStatsRes['data'], AppliedStatistics.GetTokenStatsRes]
  >
  export type RGetByIdChatStats = Promise<
    [any, AppliedStatistics.GetByIdChatStatsRes['data'], AppliedStatistics.GetByIdChatStatsRes]
  >
  export type RGetByIdTokenStats = Promise<
    [any, AppliedStatistics.GetByIdTokenStatsRes['data'], AppliedStatistics.GetByIdTokenStatsRes]
  >
}

export namespace CertificationManagement {
  export interface PostLogoutRes {
    code?: number
    data?: object
    msg?: string
  }

  export type RPostLogout = Promise<[any, CertificationManagement.PostLogoutRes['data'], CertificationManagement.PostLogoutRes]>
}

export namespace ConversationRecord {
  export interface GetChatRecordsRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: {
      items?: any
      page?: number
      page_size?: number
      total?: number
      total_pages?: number
      data?: Array<__common__.ModelApplicationChatRecord>
    }
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetChatRecordsParams {
    /**
     * @description 应用ID筛选
     */
    application_id?: number
    /**
     * @description 会话ID筛选
     */
    session_id?: string
    /**
     * @description 对话ID筛选
     */
    conversation_id?: string
    /**
     * @description 模型名称筛选
     */
    model_name?: string
    /**
     * @description 开始日期筛选(格式: 2023-01-01)
     */
    start_date?: string
    /**
     * @description 结束日期筛选(格式: 2023-01-31)
     */
    end_date?: string
    /**
     * @description 关键字搜索(在问题和回答中搜索)
     */
    keyword?: string
    /**
     * @description 页码，从1开始
     */
    page?: number
    /**
     * @description 每页数量，最大100
     */
    page_size?: number
    /**
     * @description 排序字段
     */
    sort_by?: string
    /**
     * @description 排序方向
     */
    sort_order?: string
  }

  export interface DeleteChatRecordsRes extends __common__.ModelResponse {}

  /**
   * @description 删除请求参数
   */
  export interface DeleteChatRecordsBody extends __common__.ModelDeleteChatRecordsRequest {}

  export interface PostChatRecordsCleanupRes extends __common__.ModelResponse {}

  export type RGetChatRecords = Promise<
    [any, ConversationRecord.GetChatRecordsRes['data'], ConversationRecord.GetChatRecordsRes]
  >
  export type RDeleteChatRecords = Promise<[any, __common__.ModelResponse['data'], __common__.ModelResponse]>
  export type RPostChatRecordsCleanup = Promise<[any, __common__.ModelResponse['data'], __common__.ModelResponse]>
}

export namespace HuaweiCloudIPWhitelist {
  export interface PostIpWhitelistRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelIPWhitelistRecord
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export type RPostIpWhitelist = Promise<
    [any, HuaweiCloudIPWhitelist.PostIpWhitelistRes['data'], HuaweiCloudIPWhitelist.PostIpWhitelistRes]
  >
}

export namespace ModelManagement {
  export interface GetModelsRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: {
      list?: Array<__common__.ModelModelResponse>
      /**
       * @example 1
       * @description 当前页码，从1开始
       */
      page?: number
      /**
       * @example 20
       * @description 每页大小，默认20，最大500
       */
      page_size?: number
      /**
       * @example 100
       * @description 总记录数（不受分页影响的总数）
       */
      total?: number
    }
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetModelsParams {
    /**
     * @description 页码
     */
    page?: number
    /**
     * @description 每页数量
     */
    page_size?: number
    /**
     * @description 厂商筛选
     */
    vendor?: string
    /**
     * @description 模型类型筛选(chat,embedding,rerank,images2text,tts)
     */
    model_type?: string
    /**
     * @description 工具调用支持筛选(1,0)
     */
    function_call?: string
    /**
     * @description 启用状态筛选
     */
    is_enabled?: boolean
    /**
     * @description 关键字搜索
     */
    keyword?: string
  }

  export interface PostModelsRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelModel
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  /**
   * @description 模型信息，支持 default_params(JSON格式) 和 is_default_params_first(布尔) 字段
   */
  export interface PostModelsBody extends __common__.ModelCreateModelRequest {}

  export interface DeleteModelsBatchDeleteRes extends __common__.ModelResponse {}

  /**
   * @description 批量删除请求
   */
  export interface DeleteModelsBatchDeleteBody extends __common__.ModelBatchDeleteModelRequest {}

  export interface PostModelsCheckAllRes extends __common__.ModelResponse {}

  export interface GetModelsConcurrencyRemainingRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: Array<__common__.ModelConcurrencyRemainingResponse>
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetModelsConcurrencyRemainingParams {
    /**
     * @description 模型ID列表，逗号分隔
     */
    model_ids: string
    /**
     * @description 应用ID，可选，查询应用维度的剩余并发
     */
    app_id?: number
  }

  export interface GetModelsExportRes {}

  export interface GetModelsExportParams {
    /**
     * @description 导出格式
     */
    format?: EnumLists.Format
    /**
     * @description 厂商筛选
     */
    vendor?: string
    /**
     * @description 模型类型筛选(chat,embedding,rerank,images2text,tts)
     */
    model_type?: string
    /**
     * @description 工具调用支持筛选(1,0)
     */
    function_call?: string
    /**
     * @description 启用状态筛选
     */
    is_enabled?: boolean
  }

  export interface PostModelsImportRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelImportResult
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  /**
   * @description 导入文件(Excel或CSV格式)
   */
  export interface PostModelsImportBody {}

  export interface GetModelsTemplateRes {}

  export interface GetModelsByIdRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelModelResponse
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetModelsByIdParams {
    /**
     * @description 模型ID
     */
    id: number
  }

  export interface PutModelsByIdRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelModel
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface PutModelsByIdParams {
    /**
     * @description 模型ID
     */
    id: number
  }

  /**
   * @description 更新的模型信息，支持 default_params 和 is_default_params_first 字段
   */
  export interface PutModelsByIdBody extends __common__.ModelUpdateModelRequest {}

  export interface DeleteModelsByIdRes extends __common__.ModelResponse {}

  export interface DeleteModelsByIdParams {
    /**
     * @description 模型ID
     */
    id: number
  }

  export interface PostModelsByIdCheckRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelModelCheckResult
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface PostModelsByIdCheckParams {
    /**
     * @description 模型ID
     */
    id: number
  }

  export interface GetModelsByIdCheckHistoryRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: Array<__common__.ModelModelCheckResult>
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetModelsByIdCheckHistoryParams {
    /**
     * @description 模型ID
     */
    id: number
  }

  export interface PatchModelsByIdStatusRes extends __common__.ModelResponse {}

  export interface PatchModelsByIdStatusParams {
    /**
     * @description 模型ID
     */
    id: number
  }

  /**
   * @description 状态信息
   */
  export interface PatchModelsByIdStatusBody extends __common__.ModelUpdateModelStatusRequest {}

  export type RGetModels = Promise<[any, ModelManagement.GetModelsRes['data'], ModelManagement.GetModelsRes]>
  export type RPostModels = Promise<[any, ModelManagement.PostModelsRes['data'], ModelManagement.PostModelsRes]>
  export type RGetModelsById = Promise<[any, ModelManagement.GetModelsByIdRes['data'], ModelManagement.GetModelsByIdRes]>
  export type PutModelsByIdParams1 = PutModelsByIdParams & __common__.ModelUpdateModelRequest

  export type RPutModelsById = Promise<[any, ModelManagement.PutModelsByIdRes['data'], ModelManagement.PutModelsByIdRes]>
  export type RGetModelsExport = Promise<[any, unknown, ModelManagement.GetModelsExportRes]>
  export type RPostModelsImport = Promise<[any, ModelManagement.PostModelsImportRes['data'], ModelManagement.PostModelsImportRes]>
  export type RDeleteModelsById = Promise<[any, __common__.ModelResponse['data'], __common__.ModelResponse]>
  export type RGetModelsTemplate = Promise<[any, unknown, ModelManagement.GetModelsTemplateRes]>
  export type RPostModelsCheckAll = Promise<[any, __common__.ModelResponse['data'], __common__.ModelResponse]>
  export type RPostModelsByIdCheck = Promise<[any, ModelManagement.PostModelsByIdCheckRes['data'], ModelManagement.PostModelsByIdCheckRes]>
  export type PatchModelsByIdStatusParams1 = PatchModelsByIdStatusParams & __common__.ModelUpdateModelStatusRequest

  export type RPatchModelsByIdStatus = Promise<[any, __common__.ModelResponse['data'], __common__.ModelResponse]>
  export type RDeleteModelsBatchDelete = Promise<[any, __common__.ModelResponse['data'], __common__.ModelResponse]>
  export type RGetModelsByIdCheckHistory = Promise<
    [any, ModelManagement.GetModelsByIdCheckHistoryRes['data'], ModelManagement.GetModelsByIdCheckHistoryRes]
  >
  export type RGetModelsConcurrencyRemaining = Promise<
    [any, ModelManagement.GetModelsConcurrencyRemainingRes['data'], ModelManagement.GetModelsConcurrencyRemainingRes]
  >
}

export namespace QueueManagement {
  export interface GetModelsByModelIdQueueTasksRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: {
      list?: Array<__common__.ModelModelRequestQueue>
      /**
       * @example 1
       * @description 当前页码，从1开始
       */
      page?: number
      /**
       * @example 20
       * @description 每页大小，默认20，最大500
       */
      page_size?: number
      /**
       * @example 100
       * @description 总记录数（不受分页影响的总数）
       */
      total?: number
    }
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetModelsByModelIdQueueTasksParams {
    /**
     * @description 模型ID
     */
    modelId: number
    /**
     * @description 页码，默认1
     */
    page?: number
    /**
     * @description 每页数量，默认20
     */
    page_size?: number
  }

  export interface GetQueueTasksByTaskIdRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelQueueTaskResponse
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetQueueTasksByTaskIdParams {
    /**
     * @description 任务ID
     */
    taskId: number
    /**
     * @description 等待时间（秒），范围0-10，默认0立即返回当前状态，大于0则长轮询等待终态或可执行态
     */
    waitTime?: number
  }

  export interface DeleteQueueTasksByTaskIdRes extends __common__.ModelResponse {}

  export interface DeleteQueueTasksByTaskIdParams {
    /**
     * @description 任务ID
     */
    taskId: number
  }

  export type RGetQueueTasksByTaskId = Promise<
    [any, QueueManagement.GetQueueTasksByTaskIdRes['data'], QueueManagement.GetQueueTasksByTaskIdRes]
  >
  export type RDeleteQueueTasksByTaskId = Promise<[any, __common__.ModelResponse['data'], __common__.ModelResponse]>
  export type RGetModelsByModelIdQueueTasks = Promise<
    [any, QueueManagement.GetModelsByModelIdQueueTasksRes['data'], QueueManagement.GetModelsByModelIdQueueTasksRes]
  >
}

export namespace PlatformManagement {
  export interface GetPlatformsRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelPageResponse
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetPlatformsParams {
    /**
     * @description 页码
     */
    page?: number
    /**
     * @description 每页数量
     */
    page_size?: number
    /**
     * @description 状态筛选
     */
    status?: string
    /**
     * @description API风格筛选
     */
    api_style?: string
    /**
     * @description 关键字搜索
     */
    keyword?: string
  }

  export interface PostPlatformsRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelPlatformCreateResult
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  /**
   * @description 平台信息
   */
  export interface PostPlatformsBody extends __common__.ModelCreatePlatformRequest {}

  export interface GetPlatformsByIdRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelPlatformResponse
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetPlatformsByIdParams {
    /**
     * @description 平台ID
     */
    id: number
  }

  export interface PutPlatformsByIdRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelPlatformCreateResult
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface PutPlatformsByIdParams {
    /**
     * @description 平台ID
     */
    id: number
  }

  /**
   * @description 更新的平台信息
   */
  export interface PutPlatformsByIdBody extends __common__.ModelUpdatePlatformRequest {}

  export interface DeletePlatformsByIdRes extends __common__.ModelResponse {}

  export interface DeletePlatformsByIdParams {
    /**
     * @description 平台ID
     */
    id: number
  }

  export interface PostPlatformsByIdApiKeysRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelAPIKeyBatchCreateResult
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface PostPlatformsByIdApiKeysParams {
    /**
     * @description 平台ID
     */
    id: number
  }

  /**
   * @description API密钥列表
   */
  export interface PostPlatformsByIdApiKeysBody extends __common__.ModelAddPlatformAPIKeysRequest {}

  export interface GetPlatformsByIdModelsRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: Array<__common__.ModelPlatformModelInfo>
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetPlatformsByIdModelsParams {
    /**
     * @description 平台ID
     */
    id: number
  }

  export interface PostPlatformsByIdPollRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelPlatformAPIKeyPollResult
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface PostPlatformsByIdPollParams {
    /**
     * @description 平台ID
     */
    id: number
  }

  export type RGetPlatforms = Promise<[any, PlatformManagement.GetPlatformsRes['data'], PlatformManagement.GetPlatformsRes]>
  export type RPostPlatforms = Promise<[any, PlatformManagement.PostPlatformsRes['data'], PlatformManagement.PostPlatformsRes]>
  export type RGetPlatformsById = Promise<[any, PlatformManagement.GetPlatformsByIdRes['data'], PlatformManagement.GetPlatformsByIdRes]>
  export type PutPlatformsByIdParams1 = PutPlatformsByIdParams & __common__.ModelUpdatePlatformRequest

  export type RPutPlatformsById = Promise<[any, PlatformManagement.PutPlatformsByIdRes['data'], PlatformManagement.PutPlatformsByIdRes]>
  export type RDeletePlatformsById = Promise<[any, __common__.ModelResponse['data'], __common__.ModelResponse]>
  export type RPostPlatformsByIdPoll = Promise<
    [any, PlatformManagement.PostPlatformsByIdPollRes['data'], PlatformManagement.PostPlatformsByIdPollRes]
  >
  export type RGetPlatformsByIdModels = Promise<
    [any, PlatformManagement.GetPlatformsByIdModelsRes['data'], PlatformManagement.GetPlatformsByIdModelsRes]
  >
  export type PostPlatformsByIdApiKeysParams1 = PostPlatformsByIdApiKeysParams & __common__.ModelAddPlatformAPIKeysRequest

  export type RPostPlatformsByIdApiKeys = Promise<
    [any, PlatformManagement.PostPlatformsByIdApiKeysRes['data'], PlatformManagement.PostPlatformsByIdApiKeysRes]
  >
}

export namespace TokenUsageStatistics {
  export interface GetByAppRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelTokenUsageByAppResponse
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetByAppParams {
    /**
     * @description 开始时间 (格式: YYYY-MM-DD HH:mm:ss)
     */
    start_time?: string
    /**
     * @description 结束时间 (格式: YYYY-MM-DD HH:mm:ss)
     */
    end_time?: string
    /**
     * @description 应用ID
     */
    app_id?: number
    /**
     * @description 页码
     */
    page?: number
    /**
     * @description 每页数量
     */
    page_size?: number
  }

  export interface GetByModelRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelTokenUsageByModelResponse
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetByModelParams {
    /**
     * @description 开始时间 (格式: YYYY-MM-DD HH:mm:ss)
     */
    start_time?: string
    /**
     * @description 结束时间 (格式: YYYY-MM-DD HH:mm:ss)
     */
    end_time?: string
    /**
     * @description 模型名称
     */
    model_name?: string
    /**
     * @description 页码
     */
    page?: number
    /**
     * @description 每页数量
     */
    page_size?: number
  }

  export interface GetByTimeRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelTokenUsageByTimeResponse
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetByTimeParams {
    /**
     * @description 开始时间 (格式: YYYY-MM-DD HH:mm:ss)
     */
    start_time: string
    /**
     * @description 结束时间 (格式: YYYY-MM-DD HH:mm:ss)
     */
    end_time: string
    /**
     * @description 统计粒度 (day/week/month)
     */
    granularity: string
    /**
     * @description 应用ID
     */
    app_id?: number
  }

  export interface GetByUserRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelTokenUsageByUserResponse
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetByUserParams {
    /**
     * @description 开始时间 (格式: YYYY-MM-DD HH:mm:ss)
     */
    start_time?: string
    /**
     * @description 结束时间 (格式: YYYY-MM-DD HH:mm:ss)
     */
    end_time?: string
    /**
     * @description 用户ID
     */
    user_id?: string
    /**
     * @description 应用ID
     */
    app_id?: number
    /**
     * @description 页码
     */
    page?: number
    /**
     * @description 每页数量
     */
    page_size?: number
  }

  export interface GetOverviewRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelTokenUsageOverviewResponse
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetOverviewParams {
    /**
     * @description 开始时间 (格式: YYYY-MM-DD HH:mm:ss)
     */
    start_time?: string
    /**
     * @description 结束时间 (格式: YYYY-MM-DD HH:mm:ss)
     */
    end_time?: string
    /**
     * @description 应用ID
     */
    app_id?: number
  }

  export type RGetByApp = Promise<[any, TokenUsageStatistics.GetByAppRes['data'], TokenUsageStatistics.GetByAppRes]>
  export type RGetByTime = Promise<[any, TokenUsageStatistics.GetByTimeRes['data'], TokenUsageStatistics.GetByTimeRes]>
  export type RGetByUser = Promise<[any, TokenUsageStatistics.GetByUserRes['data'], TokenUsageStatistics.GetByUserRes]>
  export type RGetByModel = Promise<[any, TokenUsageStatistics.GetByModelRes['data'], TokenUsageStatistics.GetByModelRes]>
  export type RGetOverview = Promise<[any, TokenUsageStatistics.GetOverviewRes['data'], TokenUsageStatistics.GetOverviewRes]>
}

export namespace SystemMonitoring {
  export interface GetHealthRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelHealthResponse
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export interface GetStatusRes {
    /**
     * @example 200
     * @description 响应状态码：200=成功，400=请求错误，401=未授权，404=不存在，500=服务器错误
     */
    code?: number
    data?: __common__.ModelStatusResponse
    /**
     * @example 操作成功
     * @description 响应消息，成功时返回"成功"，失败时返回具体的错误信息
     */
    message?: string
  }

  export type RGetHealth = Promise<[any, SystemMonitoring.GetHealthRes['data'], SystemMonitoring.GetHealthRes]>
  export type RGetStatus = Promise<[any, SystemMonitoring.GetStatusRes['data'], SystemMonitoring.GetStatusRes]>
}

export namespace ModelForwardingInterface {
  export interface PostThinkTagV1ChatCompletionsRes extends __common__.ModelChatCompletionResponse {}

  export interface PostThinkTagV1ChatCompletionsBody extends __common__.ModelChatCompletionRequest1 {}

  export interface PostThinkTagByAppKeyV1ChatCompletionsRes extends __common__.ModelChatCompletionResponse {}

  export interface PostThinkTagByAppKeyV1ChatCompletionsParams {
    /**
     * @example "app_1234567890abcdef"
     * @description 应用API密钥
     */
    appKey: string
  }

  export interface PostThinkTagByAppKeyV1ChatCompletionsBody extends __common__.ModelChatCompletionRequestWithoutAPIKey1 {}

  export interface PostV1ChatCompletionsRes extends __common__.ModelChatCompletionResponse {}

  export interface PostV1ChatCompletionsBody extends __common__.ModelChatCompletionRequest1 {}

  export interface PostByAppKeyAnthropicV1MessagesRes extends __common__.ModelAnthropicMessagesResponse {}

  export interface PostByAppKeyAnthropicV1MessagesParams {
    /**
     * @description 应用API密钥
     */
    appKey: string
  }

  /**
   * @description Anthropic Messages 请求,max_tokens必填。queue_id为可选参数，用于指定队列中的任务
   */
  export interface PostByAppKeyAnthropicV1MessagesBody extends __common__.ModelAnthropicMessagesRequest {}

  export interface PostByAppKeyV1ChatCompletionsRes extends __common__.ModelChatCompletionResponse {}

  export interface PostByAppKeyV1ChatCompletionsParams {
    /**
     * @example "app_1234567890abcdef"
     * @description 应用API密钥
     */
    appKey: string
  }

  export interface PostByAppKeyV1ChatCompletionsBody extends __common__.ModelChatCompletionRequestWithoutAPIKey1 {}

  export interface PostByAppKeyV1EmbeddingsRes extends __common__.ModelEmbeddingResponse {}

  export interface PostByAppKeyV1EmbeddingsParams {
    /**
     * @example "app_1234567890abcdef"
     * @description 应用API密钥
     */
    appKey: string
  }

  /**
   * @description Embeddings 请求，必须包含 input 和 model 字段
   */
  export interface PostByAppKeyV1EmbeddingsBody extends __common__.ModelEmbeddingRequest {}

  export interface PostByAppKeyV1RerankRes extends __common__.ModelRerankResponse {}

  export interface PostByAppKeyV1RerankParams {
    /**
     * @example "app_1234567890abcdef"
     * @description 应用API密钥
     */
    appKey: string
  }

  /**
   * @description Rerank 请求，必须包含 model、query 和 documents 字段
   */
  export interface PostByAppKeyV1RerankBody extends __common__.ModelRerankRequest {}

  export interface PostByAppKeyV1ResponsesRes extends __common__.ModelResponsesResponse {}

  export interface PostByAppKeyV1ResponsesParams {
    /**
     * @description 应用API密钥
     */
    appKey: string
  }

  /**
   * @description Responses 请求
   */
  export interface PostByAppKeyV1ResponsesBody extends __common__.ModelResponsesCreateRequest {}

  export interface GetByAppKeyV1ResponsesByResponseIdRes extends __common__.ModelResponsesResponse {}

  export interface GetByAppKeyV1ResponsesByResponseIdParams {
    /**
     * @description 应用API密钥
     */
    appKey: string
    /**
     * @description Response ID
     */
    response_id: string
  }

  export interface DeleteByAppKeyV1ResponsesByResponseIdRes extends __common__.ModelResponsesDeleteResponse {}

  export interface DeleteByAppKeyV1ResponsesByResponseIdParams {
    /**
     * @description 应用API密钥
     */
    appKey: string
    /**
     * @description Response ID
     */
    response_id: string
  }

  export interface PostByAppKeyV1ResponsesByResponseIdCancelRes extends __common__.ModelResponsesResponse {}

  export interface PostByAppKeyV1ResponsesByResponseIdCancelParams {
    /**
     * @description 应用API密钥
     */
    appKey: string
    /**
     * @description Response ID
     */
    response_id: string
  }

  export type PostByAppKeyV1RerankParams1 = PostByAppKeyV1RerankParams & __common__.ModelRerankRequest

  export type RPostByAppKeyV1Rerank = Promise<[any, unknown, __common__.ModelRerankResponse]>
  export type RPostV1ChatCompletions = Promise<[any, unknown, __common__.ModelChatCompletionResponse]>
  export type PostByAppKeyV1ResponsesParams1 = PostByAppKeyV1ResponsesParams & __common__.ModelResponsesCreateRequest

  export type RPostByAppKeyV1Responses = Promise<[any, unknown, __common__.ModelResponsesResponse]>
  export type PostByAppKeyV1EmbeddingsParams1 = PostByAppKeyV1EmbeddingsParams & __common__.ModelEmbeddingRequest

  export type RPostByAppKeyV1Embeddings = Promise<[any, __common__.ModelEmbeddingResponse['data'], __common__.ModelEmbeddingResponse]>
  export type RPostThinkTagV1ChatCompletions = Promise<[any, unknown, __common__.ModelChatCompletionResponse]>
  export type PostByAppKeyV1ChatCompletionsParams1 = PostByAppKeyV1ChatCompletionsParams &
    __common__.ModelChatCompletionRequestWithoutAPIKey

  export type RPostByAppKeyV1ChatCompletions = Promise<[any, unknown, __common__.ModelChatCompletionResponse]>
  export type PostByAppKeyAnthropicV1MessagesParams1 = PostByAppKeyAnthropicV1MessagesParams & __common__.ModelAnthropicMessagesRequest

  export type RPostByAppKeyAnthropicV1Messages = Promise<[any, unknown, __common__.ModelAnthropicMessagesResponse]>
  export type RGetByAppKeyV1ResponsesByResponseId = Promise<[any, unknown, __common__.ModelResponsesResponse]>
  export type PostThinkTagByAppKeyV1ChatCompletionsParams1 = PostThinkTagByAppKeyV1ChatCompletionsParams &
    __common__.ModelChatCompletionRequestWithoutAPIKey

  export type RPostThinkTagByAppKeyV1ChatCompletions = Promise<[any, unknown, __common__.ModelChatCompletionResponse]>
  export type RDeleteByAppKeyV1ResponsesByResponseId = Promise<[any, unknown, __common__.ModelResponsesDeleteResponse]>
  export type RPostByAppKeyV1ResponsesByResponseIdCancel = Promise<[any, unknown, __common__.ModelResponsesResponse]>
}

export namespace OpenAICompatibleInterface {
  export interface GetModelsRes extends __common__.ModelModelsResponse {}

  export type RGetModels = Promise<[any, __common__.ModelModelsResponse['data'], __common__.ModelModelsResponse]>
}


export namespace Chat {
  export interface SubmitRequest {
    conversation_id?: string | null
    user_input: string
  }

  export interface ClarifyRequest {
    conversation_id: string
    supplement_text: string
    user_input?: string
  }

  export interface ClarifyOption {
    label: string
    value: string
  }

  export interface ClarifyInteraction {
    type: string
    slot_name: string
    problem_type: string
    options: Array<ClarifyOption>
    allow_other: boolean
    other_placeholder?: string
  }

  export interface ClarifyCard {
    question: string
    interaction: ClarifyInteraction
  }

  export type TaskState = 'running' | 'clarifying' | 'done' | 'error'
  export type ResultStatus = 'running' | 'success' | 'partial_success' | 'no_data' | 'sql_failed' | 'error' | 'aborted'
  export type StepName = 'thinking' | 'clarify' | 'result' | 'error'

  export interface SubmitResponse {
    conversation_id: string
    message_id: string
    task_state: TaskState
  }

  export interface ThinkingResponse {
    conversation_id: string
    message_id: string
    task_state: TaskState
    thinking: string | null
    step?: string
    total_steps?: number
    current_step?: number
    status?: string
    error?: string | null
  }

  export interface ResultData {
    status: ResultStatus
    task_state?: string
    result: {
      status?: string
      ai_response?: string | null
      html_url?: string | null
    } | null
    errorMessage: string | null
    queries?: string[]
    query_results?: unknown[]
  }

  export interface ClarifyResultResponse {
    code: number
    status: 'clarifying'
    task_state: 'clarifying'
    conversation_id: string
    message_id: string
    ai_response: string
    clarify_question: string
    interaction: ClarifyInteraction
  }

  export interface RunningResultResponse {
    code: number
    conversation_id: string
    message_id: string
    data: ResultData
  }

  export interface HealthResponse {
    ok: boolean
  }

  export type RPostChatSubmit = SubmitResponse
  export type RPostChatClarify = SubmitResponse
  export type RGetChatThinking = ThinkingResponse
  export type RGetChatResult = ClarifyResultResponse | RunningResultResponse
  export type RGetHealth = HealthResponse

  export interface HistoryItem {
    conversation_id: string
    title: string
    updated_at: string | null
    created_at: string | null
  }

  export interface HistoryResponse {
    items: Array<HistoryItem>
    total: number
  }

  export interface HistoryTurn {
    id: string
    message_id?: string
    turn_number: number
    user_input: string
    ai_thinking: string | null
    ai_response: string | null
    html_url: string | null
    status: string
    created_at: string | null
    clarify_question?: string
    interaction?: ClarifyInteraction
  }

  export interface HistoryDetailResponse {
    conversation_id: string
    title: string
    turns: Array<HistoryTurn>
  }

  export type RGetHistory = HistoryResponse
  export type RGetHistoryDetail = HistoryDetailResponse
}
