import type { DocReqConfig } from 'doc2ts'
import type { Chat as types } from './types'
import { getToken } from '@/utils/auth'
import ApiClient from './client'

const CHAT_BASE = '/proxy/BjvKBeQd5KXXFvps_sfw1LeMqoXWbmswydMApAQSpTM'

export default class Chat extends ApiClient {
  async postChatSubmit(body: types.SubmitRequest): Promise<types.RPostChatSubmit> {
    const res = await fetch(`${CHAT_BASE}/api/chat/submit`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    const data = await res.json()
    return data
  }

  async postChatClarify(body: types.ClarifyRequest): Promise<types.RPostChatClarify> {
    const res = await fetch(`${CHAT_BASE}/api/chat/clarify`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    const data = await res.json()
    return data
  }

  async getChatThinking(messageId: string): Promise<types.RGetChatThinking> {
    const res = await fetch(`${CHAT_BASE}/api/chat/thinking?message_id=${encodeURIComponent(messageId)}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
    const data = await res.json()
    return data
  }

  async getChatResult(messageId: string): Promise<types.RGetChatResult> {
    const res = await fetch(`${CHAT_BASE}/api/chat/result?message_id=${encodeURIComponent(messageId)}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
    const data = await res.json()
    return data
  }

  async getHistory(limit = 10): Promise<types.RGetHistory> {
    const res = await fetch(`${CHAT_BASE}/api/history/conversations?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
    const data = await res.json()
    return data
  }

  async getHistoryDetail(conversationId: string): Promise<types.RGetHistoryDetail> {
    const res = await fetch(`${CHAT_BASE}/api/history/detail?conversation_id=${encodeURIComponent(conversationId)}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
    const data = await res.json()
    return data
  }

  async deleteHistory(conversationId: string): Promise<void> {
    await fetch(`${CHAT_BASE}/api/history/conversation/${encodeURIComponent(conversationId)}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
  }

  getHealth() {
    const config: DocReqConfig = { url: `${CHAT_BASE}/api/healthz`, method: 'get', config: { baseURL: CHAT_BASE } }
    return this.request<types.RGetHealth>(config)
  }
}

export const chatService = new Chat()
