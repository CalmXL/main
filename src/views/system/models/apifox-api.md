# 大模型管理服务 API 文档

## 基本信息

- **API 基础路径**: `http://localhost:8080`
- **API 版本**: `v1`
- **认证方式**: Bearer Token (AppKey)
- **数据格式**: JSON

## 认证说明

所有 API 请求都需要在请求头中包含认证信息：

```
Authorization: Bearer {app_key}
```

其中 `{app_key}` 是在创建应用时生成的应用密钥。

## 通用响应格式

### 成功响应
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

### 错误响应
```json
{
  "code": 400,
  "message": "错误描述",
  "data": null
}
```

## 状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 认证失败 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 1. 健康检查接口

### 1.1 健康检查

**接口描述**: 检查服务运行状态

**请求方式**: `GET`

**接口地址**: `/health`

**认证要求**: 无需认证

**请求参数**: 无

**响应示例**:
```json
{
  "status": "ok",
  "timestamp": "2025-09-14T10:30:00Z",
  "version": "1.0.0"
}
```

### 1.2 服务状态

**接口描述**: 获取服务详细状态信息

**请求方式**: `GET`

**接口地址**: `/status`

**认证要求**: 无需认证

**请求参数**: 无

**响应示例**:
```json
{
  "status": "healthy",
  "database": "connected",
  "uptime": "2h30m",
  "goroutines": 15,
  "memory_usage": "45MB"
}
```

---

## 2. 模型管理接口

### 2.1 创建模型

**接口描述**: 创建新的模型配置

**请求方式**: `POST`

**接口地址**: `/api/v1/models`

**认证要求**: 需要认证

**请求参数**:
```json
{
  "vendor": "硅基流动",
  "base_url": "https://api.siliconflow.cn/",
  "is_openai": true,
  "model_type": "chat",
  "nickname": "通义千问",
  "model_name": "Qwen/Qwen3-8B",
  "api_key": "sk-1234567890abcdef"
}
```

**参数说明**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| vendor | string | 是 | 模型厂商名称 |
| base_url | string | 是 | 模型API基础地址 |
| is_openai | boolean | 是 | 是否符合OpenAI规范 |
| model_type | string | 是 | 模型类型 (chat, embedding, etc.) |
| nickname | string | 否 | 模型昵称 |
| model_name | string | 是 | 模型名称 |
| api_key | string | 是 | API密钥 |

**响应示例**:
```json
{
  "code": 200,
  "message": "模型创建成功",
  "data": {
    "id": 1,
    "vendor": "硅基流动",
    "base_url": "https://api.siliconflow.cn/",
    "is_openai": true,
    "model_type": "chat",
    "nickname": "通义千问",
    "model_name": "Qwen/Qwen3-8B",
    "is_available": true,
    "is_enabled": true,
    "created_at": "2025-09-14T10:30:00Z",
    "updated_at": "2025-09-14T10:30:00Z"
  }
}
```

### 2.2 获取模型列表

**接口描述**: 分页获取模型列表

**请求方式**: `GET`

**接口地址**: `/api/v1/models`

**认证要求**: 需要认证

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | int | 否 | 页码，默认1 |
| size | int | 否 | 每页数量，默认10 |
| vendor | string | 否 | 厂商过滤 |
| is_enabled | boolean | 否 | 启用状态过滤 |

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 25,
    "items": [
      {
        "id": 1,
        "vendor": "硅基流动",
        "base_url": "https://api.siliconflow.cn/",
        "is_openai": true,
        "model_type": "chat",
        "nickname": "通义千问",
        "model_name": "Qwen/Qwen3-8B",
        "is_available": true,
        "is_enabled": true,
        "created_at": "2025-09-14T10:30:00Z"
      }
    ]
  }
}
```

### 2.3 获取单个模型

**接口描述**: 根据ID获取模型详情

**请求方式**: `GET`

**接口地址**: `/api/v1/models/{id}`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | int | 是 | 模型ID |

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "vendor": "硅基流动",
    "base_url": "https://api.siliconflow.cn/",
    "is_openai": true,
    "model_type": "chat",
    "nickname": "通义千问",
    "model_name": "Qwen/Qwen3-8B",
    "is_available": true,
    "is_enabled": true,
    "created_at": "2025-09-14T10:30:00Z",
    "updated_at": "2025-09-14T10:30:00Z"
  }
}
```

### 2.4 更新模型

**接口描述**: 更新模型信息

**请求方式**: `PUT`

**接口地址**: `/api/v1/models/{id}`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | int | 是 | 模型ID |

**请求参数**:
```json
{
  "vendor": "新的厂商名称",
  "base_url": "https://new-api.example.com/",
  "is_openai": false,
  "model_type": "chat",
  "nickname": "新的昵称",
  "model_name": "new-model-name",
  "api_key": "new-api-key"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "模型更新成功",
  "data": {
    "id": 1,
    "vendor": "新的厂商名称",
    "base_url": "https://new-api.example.com/",
    "is_openai": false,
    "model_type": "chat",
    "nickname": "新的昵称",
    "model_name": "new-model-name",
    "is_available": true,
    "is_enabled": true,
    "created_at": "2025-09-14T10:30:00Z",
    "updated_at": "2025-09-14T11:00:00Z"
  }
}
```

### 2.5 删除模型

**接口描述**: 删除模型

**请求方式**: `DELETE`

**接口地址**: `/api/v1/models/{id}`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | int | 是 | 模型ID |

**响应示例**:
```json
{
  "code": 200,
  "message": "模型删除成功",
  "data": null
}
```

### 2.6 更新模型状态

**接口描述**: 启用或禁用模型

**请求方式**: `PUT`

**接口地址**: `/api/v1/models/{id}/status`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | int | 是 | 模型ID |

**请求参数**:
```json
{
  "is_enabled": true
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "模型状态更新成功",
  "data": {
    "id": 1,
    "is_enabled": true
  }
}
```

### 2.7 检查模型可用性

**接口描述**: 检查指定模型的可用性

**请求方式**: `POST`

**接口地址**: `/api/v1/models/{id}/check`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | int | 是 | 模型ID |

**响应示例**:
```json
{
  "code": 200,
  "message": "模型检查任务已提交",
  "data": {
    "model_id": 1,
    "status": "checking"
  }
}
```

### 2.8 获取模型检查历史

**接口描述**: 获取模型的可用性检查历史

**请求方式**: `GET`

**接口地址**: `/api/v1/models/{id}/history`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | int | 是 | 模型ID |

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | int | 否 | 页码，默认1 |
| size | int | 否 | 每页数量，默认10 |

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 10,
    "items": [
      {
        "id": 1,
        "model_id": 1,
        "is_available": true,
        "response_time": 150,
        "error_msg": "",
        "checked_at": "2025-09-14T10:30:00Z"
      }
    ]
  }
}
```

### 2.9 批量导入模型

**接口描述**: 通过Excel文件批量导入模型

**请求方式**: `POST`

**接口地址**: `/api/v1/models/import`

**认证要求**: 需要认证

**请求参数**: `multipart/form-data`

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| file | file | 是 | Excel文件 |

**Excel文件格式**:
| vendor | base_url | is_openai | model_type | nickname | model_name | api_key |
|--------|----------|-----------|------------|----------|------------|---------|
| 硅基流动 | https://api.siliconflow.cn/ | TRUE | chat | 通义千问 | Qwen/Qwen3-8B | sk-xxx |
| OpenAI | https://api.openai.com/ | TRUE | chat | GPT-4 | gpt-4 | sk-xxx |

**响应示例**:
```json
{
  "code": 200,
  "message": "导入成功",
  "data": {
    "total": 10,
    "success": 8,
    "failed": 2,
    "errors": [
      {
        "row": 3,
        "reason": "base_url格式错误"
      }
    ]
  }
}
```

### 2.10 批量导出模型

**接口描述**: 导出模型数据为Excel文件

**请求方式**: `GET`

**接口地址**: `/api/v1/models/export`

**认证要求**: 需要认证

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| vendor | string | 否 | 厂商过滤 |
| is_enabled | boolean | 否 | 启用状态过滤 |

**响应**: Excel文件下载

### 2.11 批量检查所有模型

**接口描述**: 检查所有可用模型的可用性

**请求方式**: `POST`

**接口地址**: `/api/v1/models/check-all`

**认证要求**: 需要认证

**响应示例**:
```json
{
  "code": 200,
  "message": "批量检查任务已提交",
  "data": {
    "total_models": 15,
    "checking_models": 15
  }
}
```

---

## 3. 应用管理接口

### 3.1 创建应用

**接口描述**: 创建新的应用

**请求方式**: `POST`

**接口地址**: `/api/v1/applications`

**认证要求**: 需要认证

**请求参数**:
```json
{
  "name": "智能客服",
  "description": "客服机器人应用"
}
```

**参数说明**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 应用名称 |
| description | string | 否 | 应用描述 |

**响应示例**:
```json
{
  "code": 200,
  "message": "应用创建成功",
  "data": {
    "id": 1,
    "name": "智能客服",
    "description": "客服机器人应用",
    "app_key": "app_1234567890abcdef",
    "is_enabled": true,
    "created_at": "2025-09-14T10:30:00Z",
    "updated_at": "2025-09-14T10:30:00Z"
  }
}
```

### 3.2 获取应用列表

**接口描述**: 分页获取应用列表

**请求方式**: `GET`

**接口地址**: `/api/v1/applications`

**认证要求**: 需要认证

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | int | 否 | 页码，默认1 |
| size | int | 否 | 每页数量，默认10 |
| is_enabled | boolean | 否 | 启用状态过滤 |

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 5,
    "items": [
      {
        "id": 1,
        "name": "智能客服",
        "description": "客服机器人应用",
        "app_key": "app_1234567890abcdef",
        "is_enabled": true,
        "created_at": "2025-09-14T10:30:00Z"
      }
    ]
  }
}
```

### 3.3 获取单个应用

**接口描述**: 根据ID获取应用详情

**请求方式**: `GET`

**接口地址**: `/api/v1/applications/{id}`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | int | 是 | 应用ID |

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "name": "智能客服",
    "description": "客服机器人应用",
    "app_key": "app_1234567890abcdef",
    "is_enabled": true,
    "created_at": "2025-09-14T10:30:00Z",
    "updated_at": "2025-09-14T10:30:00Z"
  }
}
```

### 3.4 更新应用

**接口描述**: 更新应用信息

**请求方式**: `PUT`

**接口地址**: `/api/v1/applications/{id}`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | int | 是 | 应用ID |

**请求参数**:
```json
{
  "name": "新的应用名称",
  "description": "新的应用描述"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "应用更新成功",
  "data": {
    "id": 1,
    "name": "新的应用名称",
    "description": "新的应用描述",
    "app_key": "app_1234567890abcdef",
    "is_enabled": true,
    "created_at": "2025-09-14T10:30:00Z",
    "updated_at": "2025-09-14T11:00:00Z"
  }
}
```

### 3.5 删除应用

**接口描述**: 删除应用

**请求方式**: `DELETE`

**接口地址**: `/api/v1/applications/{id}`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | int | 是 | 应用ID |

**响应示例**:
```json
{
  "code": 200,
  "message": "应用删除成功",
  "data": null
}
```

### 3.6 更新应用状态

**接口描述**: 启用或禁用应用

**请求方式**: `PUT`

**接口地址**: `/api/v1/applications/{id}/status`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | int | 是 | 应用ID |

**请求参数**:
```json
{
  "is_enabled": true
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "应用状态更新成功",
  "data": {
    "id": 1,
    "is_enabled": true
  }
}
```

### 3.7 为应用添加模型

**接口描述**: 为应用关联模型

**请求方式**: `POST`

**接口地址**: `/api/v1/applications/{id}/models`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | int | 是 | 应用ID |

**请求参数**:
```json
{
  "model_ids": [1, 2, 3],
  "default_model_id": 1
}
```

**参数说明**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| model_ids | array | 是 | 模型ID数组 |
| default_model_id | int | 否 | 默认模型ID |

**响应示例**:
```json
{
  "code": 200,
  "message": "模型关联成功",
  "data": {
    "application_id": 1,
    "added_models": 3,
    "default_model_id": 1
  }
}
```

### 3.8 获取应用的模型列表

**接口描述**: 获取应用关联的模型列表

**请求方式**: `GET`

**接口地址**: `/api/v1/applications/{id}/models`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | int | 是 | 应用ID |

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 3,
    "items": [
      {
        "id": 1,
        "application_id": 1,
        "model_id": 1,
        "is_default": true,
        "created_at": "2025-09-14T10:30:00Z",
        "model": {
          "id": 1,
          "vendor": "硅基流动",
          "model_name": "Qwen/Qwen3-8B",
          "nickname": "通义千问"
        }
      }
    ]
  }
}
```

### 3.9 设置应用默认模型

**接口描述**: 设置应用的默认模型

**请求方式**: `PUT`

**接口地址**: `/api/v1/applications/{id}/models/{modelId}/default`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | int | 是 | 应用ID |
| modelId | int | 是 | 模型ID |

**响应示例**:
```json
{
  "code": 200,
  "message": "默认模型设置成功",
  "data": {
    "application_id": 1,
    "default_model_id": 1
  }
}
```

### 3.10 从应用中移除模型

**接口描述**: 移除应用关联的模型

**请求方式**: `DELETE`

**接口地址**: `/api/v1/applications/{id}/models/{modelId}`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | int | 是 | 应用ID |
| modelId | int | 是 | 模型ID |

**响应示例**:
```json
{
  "code": 200,
  "message": "模型移除成功",
  "data": null
}
```

### 3.11 获取应用配置

**接口描述**: 获取应用的配置信息

**请求方式**: `GET`

**接口地址**: `/api/v1/applications/{id}/config`

**认证要求**: 需要认证

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | int | 是 | 应用ID |

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "application": {
      "id": 1,
      "name": "智能客服",
      "app_key": "app_1234567890abcdef"
    },
    "models": [
      {
        "id": 1,
        "vendor": "硅基流动",
        "model_name": "Qwen/Qwen3-8B",
        "is_default": true
      }
    ],
    "default_model": {
      "id": 1,
      "vendor": "硅基流动",
      "model_name": "Qwen/Qwen3-8B"
    }
  }
}
```

---

## 4. OpenAI兼容聊天接口

### 4.1 聊天完成

**接口描述**: OpenAI兼容的聊天完成接口

**请求方式**: `POST`

**接口地址**: `/v1/chat/completions`

**认证要求**: 需要认证（使用AppKey）

**请求头**:
```
Authorization: Bearer {app_key}
Content-Type: application/json
```

**请求参数**:
```json
{
  "model": "Qwen/Qwen3-8B",
  "messages": [
    {
      "role": "system",
      "content": "你是一个有用的助手"
    },
    {
      "role": "user",
      "content": "你好，请介绍一下自己"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 1000,
  "stream": false
}
```

**参数说明**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| model | string | 是 | 模型名称 |
| messages | array | 是 | 消息数组 |
| temperature | float | 否 | 温度参数，0-2 |
| max_tokens | int | 否 | 最大令牌数 |
| stream | boolean | 否 | 是否流式输出 |

**响应示例**:
```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "Qwen/Qwen3-8B",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "你好！我是一个AI助手，很高兴为你服务。我可以帮助你回答问题、提供信息、进行对话等。有什么我可以帮助你的吗？"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 20,
    "completion_tokens": 35,
    "total_tokens": 55
  }
}
```

---

## 5. 错误码说明

### 5.1 通用错误码

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 认证失败 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

### 5.2 业务错误码

| 错误码 | 说明 |
|--------|------|
| 1001 | 模型厂商、基础路径和模型名称不能为空 |
| 1002 | 模型不存在 |
| 1003 | 应用名称不能为空 |
| 1004 | 应用不存在 |
| 1005 | 默认模型必须在模型列表中 |
| 1006 | 应用密钥无效 |
| 1007 | 模型不可用 |
| 1008 | 文件格式错误 |
| 1009 | Excel文件处理失败 |

---

## 6. 示例代码

### 6.1 cURL示例

#### 创建模型
```bash
curl -X POST http://localhost:8080/api/v1/models \
  -H "Authorization: Bearer app_your_app_key" \
  -H "Content-Type: application/json" \
  -d '{
    "vendor": "硅基流动",
    "base_url": "https://api.siliconflow.cn/",
    "is_openai": true,
    "model_type": "chat",
    "nickname": "通义千问",
    "model_name": "Qwen/Qwen3-8B",
    "api_key": "sk-your-api-key"
  }'
```

#### 调用聊天API
```bash
curl -X POST http://localhost:8080/v1/chat/completions \
  -H "Authorization: Bearer app_your_app_key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen3-8B",
    "messages": [
      {
        "role": "user",
        "content": "你好，请介绍一下自己"
      }
    ]
  }'
```

### 6.2 Python示例

```python
import requests
import json

# 设置认证信息
app_key = "app_your_app_key"
base_url = "http://localhost:8080"

# 创建模型
def create_model():
    url = f"{base_url}/api/v1/models"
    headers = {
        "Authorization": f"Bearer {app_key}",
        "Content-Type": "application/json"
    }
    data = {
        "vendor": "硅基流动",
        "base_url": "https://api.siliconflow.cn/",
        "is_openai": True,
        "model_type": "chat",
        "nickname": "通义千问",
        "model_name": "Qwen/Qwen3-8B",
        "api_key": "sk-your-api-key"
    }
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# 调用聊天API
def chat_completion():
    url = f"{base_url}/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {app_key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "Qwen/Qwen3-8B",
        "messages": [
            {
                "role": "user",
                "content": "你好，请介绍一下自己"
            }
        ]
    }
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# 使用示例
if __name__ == "__main__":
    # 创建模型
    model_result = create_model()
    print("创建模型结果:", model_result)

    # 调用聊天API
    chat_result = chat_completion()
    print("聊天结果:", chat_result)
```

### 6.3 JavaScript示例

```javascript
// 设置认证信息
const appKey = "app_your_app_key";
const baseUrl = "http://localhost:8080";

// 创建模型
async function createModel() {
    const url = `${baseUrl}/api/v1/models`;
    const headers = {
        "Authorization": `Bearer ${appKey}`,
        "Content-Type": "application/json"
    };
    const data = {
        vendor: "硅基流动",
        base_url: "https://api.siliconflow.cn/",
        is_openai: true,
        model_type: "chat",
        nickname: "通义千问",
        model_name: "Qwen/Qwen3-8B",
        api_key: "sk-your-api-key"
    };

    const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    });

    return await response.json();
}

// 调用聊天API
async function chatCompletion() {
    const url = `${baseUrl}/v1/chat/completions`;
    const headers = {
        "Authorization": `Bearer ${appKey}`,
        "Content-Type": "application/json"
    };
    const data = {
        model: "Qwen/Qwen3-8B",
        messages: [
            {
                role: "user",
                content: "你好，请介绍一下自己"
            }
        ]
    };

    const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    });

    return await response.json();
}

// 使用示例
(async () => {
    try {
        // 创建模型
        const modelResult = await createModel();
        console.log("创建模型结果:", modelResult);

        // 调用聊天API
        const chatResult = await chatCompletion();
        console.log("聊天结果:", chatResult);
    } catch (error) {
        console.error("请求失败:", error);
    }
})();
```

---

## 7. 注意事项

1. **认证信息保护**: 请妥善保管AppKey，不要在客户端代码中暴露
2. **API限制**: 请合理使用API，避免频繁请求
3. **错误处理**: 建议在实际使用中增加完善的错误处理机制
4. **数据安全**: 敏感数据（如API密钥）在传输过程中请使用HTTPS
5. **并发控制**: 建议对API调用进行适当的并发控制

---

## 8. 更新日志

### v1.0.0 (2025-09-14)
- 初始版本发布
- 支持模型管理功能
- 支持应用管理功能
- 支持OpenAI兼容聊天接口
- 支持批量导入导出功能
- 支持模型可用性检查

---

*本文档最后更新时间: 2025-09-14*