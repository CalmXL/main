import request from '@/utils/request'

// 查询 rag 模型
export function getRagModels() {
  return request({ url: '/rag/v1/llm/my_llms', method: 'get' })
}

// 查询 dify 提供商
export function getDifyProviders() {
  return request({
    url: `${window.location.origin}/difyApi/console/api/workspaces/current/models/model-types/text-embedding`,
    method: 'get',
    timeout: 10000
  })
}

// 查询 dify 模型
export function getDifyModels(provider: string) {
  return request({
    url: `${window.location.origin}/difyApi/console/api/workspaces/current/model-providers/${provider}/models`,
    method: 'get',
    timeout: 10000
  })
}

export function getDifyPublishList(timeout = 10000) {
  return request({ url: `${window.location.origin}/difyApi/console/api/apps/publish/list`, method: 'get', timeout })
}

// 查询 sonic 模型
export function getSonicsModels() {
  return request({ url: '/sonic/api/chat/model/getModelList', method: 'get' })
}
