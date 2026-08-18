const TokenKey = 'Authorization'

/**
 * @description 获取 token
 */
export function getToken() {
  return localStorage.getItem(TokenKey) ?? undefined
}

/**
 * @description 设置 token
 * @param token token
 */
export function setToken(token: string) {
  localStorage.setItem(TokenKey, token)
}

/**
 * @description 删除 token
 */
export function removeToken() {
  return localStorage.removeItem(TokenKey)
}
