import request from '@/utils/request'

// 查询敏感词列表
export function listSensitiveWord(data: any) {
  return request({
    url: '/sensitiveWord/queryByPage',
    method: 'post',
    data
  })
}

// 查询敏感词详细
export function getSensitiveWord(id: any) {
  return request({
    url: `/sensitiveWord/${id}`,
    method: 'get'
  })
}

// 新增敏感词
export function addSensitiveWord(data: any) {
  return request({
    url: '/sensitiveWord/saveOrUpd',
    method: 'post',
    data
  })
}

// 删除敏感词
export function delSensitiveWord(id: string) {
  return request({
    url: `/sensitiveWord/deleteById?id=${id}`,
    method: 'get'
  })
}

// 敏感词状态修改
export function changeSensitiveWordStatus(id: string, status: string) {
  const data = {
    id,
    status
  }
  return request({
    url: '/system/sensitiveWord/changeStatus',
    method: 'put',
    data
  })
}

// 添加敏感词
export function insertSensitiveWord(data: any) {
  return request({
    url: '/sensitiveWord/insert',
    method: 'post',
    data
  })
}

// 修改敏感词
export function updateSensitiveWord(data: any) {
  return request({
    url: '/sensitiveWord/insert',
    method: 'post',
    data
  })
}
