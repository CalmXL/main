/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA DOC2TS                        ##
 * ##                                                           ##
 * ## AUTHOR: space-77                                          ##
 * ## SOURCE: https://github.com/space-77/doc2ts                ##
 * ---------------------------------------------------------------
 */

import type { DocReqConfig } from 'doc2ts'
import ApiClient from './client'
import type { ProxyForwarding as types, __common__ } from './types'
/**
 * @name ProxyForwarding
 * @description 端口加密、认证代理转发和公共代理转发功能
 */
export default class ProxyForwarding extends ApiClient {
  /**
   * @param { String } port
   * @summary 端口加密
   * @description 将需要代理的内部服务端口号进行加密，生成对应的端口密文
   */
  postApiProxyEncrypt(port: string) {
    const body = { port }
    const url = '/api/proxy/encrypt'
    const config: DocReqConfig = { url, body, method: 'post' }
    return this.request<types.RPostApiProxyEncrypt>(config)
  }

  /**
   * @summary 公共代理转发（免认证）
   * @description 对加密端口对应的本地服务进行免认证的公共代理转发。此功能需要开启配置 proxy.public_enabled。如果启用签名功能，会附加 X-Proxy-Signature 请求头供下游验证请求来源。
   */
  getPpByPortCipherByPath({ path, portCipher }: types.GetPpByPortCipherByPathParams) {
    const url = `/pp/${portCipher}/${path}`
    const config: DocReqConfig = { url, method: 'get' }
    return this.request<__common__.RGetPpByPortCipherByPath>(config)
  }

  /**
   * @summary 认证代理转发
   * @description 对加密端口对应的本地服务进行代理转发。该接口受若依认证保护。转发时会自动附加当前登录用户的用户信息到请求头（如 indicatorUserId, indicatorUserName, indicatorUserNameEncode, indicatorUserEmail, indicatorDeptId, isAdmin）。如果启用签名功能，还会附加 X-Proxy-Signature 请求头供下游验证。如果请求头中 addTeableToekn=1，还会自动获取并附加 Teable 会话 Cookie。
   */
  getProxyByPortCipherByPath(params: types.GetProxyByPortCipherByPathParams) {
    const { path, portCipher, ...headers } = params
    const url = `/proxy/${portCipher}/${path}`
    const config: DocReqConfig = { url, headers, method: 'get' }
    return this.request<__common__.RGetProxyByPortCipherByPath>(config)
  }
}
export const proxyForwarding = new ProxyForwarding()
