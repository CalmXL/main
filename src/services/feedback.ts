import request from '@/utils/request'
import { FeedbackListParams } from '@/views/feedback/types'

export function getFeedbackList(params: FeedbackListParams) {
  return request({
    url: '/feedback/list',
    method: 'get',
    params
  })
}

export function getFeedbackById(id: number) {
  return request({
    url: `/feedback/${id}`,
    method: 'get'
  })
}

export function deleteFeedbackById(id: number) {
  return request({
    url: `/feedback/${id}`,
    method: 'delete'
  })
}

export function updateFeedbackStatus(id: number, status: string) {
  return request({
    url: `/feedback/${id}/status`,
    method: 'put',
    data: { status }
  })
}
