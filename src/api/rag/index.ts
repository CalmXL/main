import { RagBastUrl, AiWorkUrl, AiBidsUrl } from '@/config'
import { getToken } from '@/utils/auth'

// 停止aiwork上次任务
export async function stopAiWorkTask() {
  const token = getToken()

  const f = await fetch(`${AiWorkUrl}/app/release`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  return f.json()
}

// 停止rag上次任务
export async function stopRagTask() {
  const token = getToken()

  const f = await fetch(`${RagBastUrl}/conversation/release`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  })
  return f.json()
}

// 查询标书共享
export async function getUsersByBsId(bsId: string) { 
  const token = getToken()

  const f = await fetch(`${AiBidsUrl}/exports/share_users/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      bs_id: bsId
    })
  })

  return f.json()
}

// 更新标书共享权限
export async function updateShareUsers(bsId: string, userIds: string[]) { 
  const token = getToken()

  const f = await fetch(`${AiBidsUrl}/exports/share_users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      bs_id: bsId,
      user_ids: userIds
    })
  })

  return f.json()
}