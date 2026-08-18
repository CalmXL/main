# API 接口文档

## 概述

本文档描述了大模型管理服务的所有API接口。服务提供两套API：
1. **管理API**: 用于管理模型和应用的CRUD操作
2. **OpenAI兼容API**: 提供与OpenAI API兼容的聊天接口

## 认证

### 管理API
管理API暂不需要认证（建议在生产环境中添加认证）。

### OpenAI兼容API
需要在请求头中包含应用密钥：
```
Authorization: Bearer <app_key>
```

## 响应格式

### 成功响应
```json
{
  "code": 200,
  "message": "成功",
  "data": {...}
}
```

### 分页响应
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "list": [...],
    "total": 100,
    "page": 1,
    "page_size": 10
  }
}
```

### 错误响应
```json
{
  "code": 400,
  "message": "错误信息"
}
```

## 管理API

### 模型管理

#### 创建模型
```http
POST /api/v1/models
Content-Type: application/json

{
  "vendor": "硅基流动",
  "base_url": "https://api.siliconflow.cn/",
  "is_openai": true,
  "model_type": "chat",
  "nickname": "通义千问",
  "model_name": "Qwen/Qwen2-7B-Instruct",
  "api_key": "sk-your-api-key",
  "context_size": 128000
}
```

#### 获取模型列表
```http
GET /api/v1/models?page=1&size=10&vendor=硅基流动&is_enabled=true
```

#### 获取单个模型
```http
GET /api/v1/models/1
```

#### 更新模型
```http
PUT /api/v1/models/1
Content-Type: application/json

{
  "nickname": "新的昵称",
  "context_size": 256000,
  "is_enabled": true
}
```

#### 删除模型
```http
DELETE /api/v1/models/1
```

#### 更新模型状态
```http
PATCH /api/v1/models/1/status
Content-Type: application/json

{
  "is_enabled": false
}
```

#### 检查模型可用性
```http
POST /api/v1/models/1/check
```

#### 检查所有模型
```http
POST /api/v1/models/check-all
```

#### 获取检查历史
```http
GET /api/v1/models/1/check-history
```

#### 批量导入模型
```http
POST /api/v1/models/import
Content-Type: multipart/form-data

file: models.xlsx
```

#### 批量导出模型
```http
GET /api/v1/models/export?format=xlsx&vendor=硅基流动
```

#### 下载导入模板
```http
GET /api/v1/models/template
```

### 应用管理

#### 创建应用
```http
POST /api/v1/applications
Content-Type: application/json

{
  "name": "智能客服",
  "description": "客服机器人应用"
}
```

#### 获取应用列表
```http
GET /api/v1/applications?page=1&size=10&is_enabled=true
```

#### 获取单个应用
```http
GET /api/v1/applications/1
```

#### 更新应用
```http
PUT /api/v1/applications/1
Content-Type: application/json

{
  "name": "新的应用名称",
  "description": "新的描述"
}
```

#### 删除应用
```http
DELETE /api/v1/applications/1
```

#### 更新应用状态
```http
PATCH /api/v1/applications/1/status
Content-Type: application/json

{
  "is_enabled": false
}
```

#### 获取应用配置
```http
GET /api/v1/applications/1/config
```

#### 为应用添加模型
```http
POST /api/v1/applications/1/models
Content-Type: application/json

{
  "model_ids": [1, 2, 3],
  "default_model_id": 1
}
```

#### 获取应用模型列表
```http
GET /api/v1/applications/1/models
```

#### 设置默认模型
```http
PUT /api/v1/applications/1/default-model
Content-Type: application/json

{
  "model_id": 1
}
```

#### 移除应用模型关联
```http
DELETE /api/v1/applications/1/models/2
```

## OpenAI兼容API

### 聊天完成

#### 基本请求
```http
POST /v1/chat/completions
Authorization: Bearer app_your-app-key
Content-Type: application/json

{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "user",
      "content": "你好，世界！"
    }
  ],
  "stream": false,
  "temperature": 0.7,
  "max_tokens": 1000
}
```

#### 响应
```json
{
  "id": "chatcmpl-1234567890",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-3.5-turbo",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "你好！有什么我可以帮助你的吗？"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 15,
    "total_tokens": 25
  }
}
```

#### 多轮对话
```http
POST /v1/chat/completions
Authorization: Bearer app_your-app-key
Content-Type: application/json

{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "user",
      "content": "你好"
    },
    {
      "role": "assistant",
      "content": "你好！有什么我可以帮助你的吗？"
    },
    {
      "role": "user",
      "content": "今天天气怎么样？"
    }
  ]
}
```

### 获取模型列表
```http
GET /v1/models
Authorization: Bearer app_your-app-key
```

#### 响应
```json
{
  "object": "list",
  "data": [
    {
      "id": "gpt-3.5-turbo",
      "object": "model",
      "created": 1677610602,
      "owned_by": "openai"
    },
    {
      "id": "Qwen/Qwen2-7B-Instruct",
      "object": "model",
      "created": 1677610602,
      "owned_by": "siliconflow"
    }
  ]
}
```

## 健康检查

### 简单健康检查
```http
GET /health
```

#### 响应
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "status": "ok",
    "database": "connected",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### 详细状态检查
```http
GET /status
```

#### 响应
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "system": {
      "version": "1.0.0",
      "go_version": "go1.19",
      "uptime": "1h30m"
    },
    "database": {
      "status": "connected",
      "stats": {
        "max_open_connections": 100,
        "open_connections": 5,
        "in_use": 2,
        "idle": 3
      }
    },
    "models": {
      "total": 10,
      "available": 8,
      "enabled": 9
    }
  }
}
```

## 错误码

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 限制说明

1. **请求频率**: 目前没有限制，建议生产环境添加限流
2. **文件大小**: 导入文件最大10MB
3. **批量操作**: 单次最多处理1000条记录
4. **并发连接**: 数据库连接池最大100个连接

## 示例代码

### Python
```python
import requests

# 管理API示例
def create_model():
    url = "http://localhost:8080/api/v1/models"
    data = {
        "vendor": "硅基流动",
        "base_url": "https://api.siliconflow.cn/",
        "is_openai": True,
        "model_type": "chat",
        "model_name": "Qwen/Qwen2-7B-Instruct",
        "api_key": "sk-your-api-key",
        "context_size": 128000
    }
    response = requests.post(url, json=data)
    return response.json()

# OpenAI兼容API示例
def chat_completion():
    url = "http://localhost:8080/v1/chat/completions"
    headers = {
        "Authorization": "Bearer app_your-app-key",
        "Content-Type": "application/json"
    }
    data = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "user", "content": "Hello, world!"}
        ]
    }
    response = requests.post(url, headers=headers, json=data)
    return response.json()
```

### curl
```bash
# 创建模型
curl -X POST http://localhost:8080/api/v1/models \
  -H "Content-Type: application/json" \
  -d '{
    "vendor": "硅基流动",
    "base_url": "https://api.siliconflow.cn/",
    "is_openai": true,
    "model_type": "chat",
    "model_name": "Qwen/Qwen2-7B-Instruct",
    "api_key": "sk-your-api-key",
    "context_size": 128000
  }'

# 聊天完成
curl -X POST http://localhost:8080/v1/chat/completions \
  -H "Authorization: Bearer app_your-app-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {"role": "user", "content": "Hello, world!"}
    ]
  }'
```