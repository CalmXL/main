import qs from 'qs'
import type { IApiClient, DocReqConfig } from 'doc2ts'
import { cloneDeep, isObject } from 'lodash'
import { saveAs } from 'file-saver'
import request from '@/utils/modelsRequest'
import feedbackRequest from '@/utils/feedbackRequest'
import Feedback from './feedback/feedback'

export default class ApiClient implements IApiClient {
  static FETCH_MAP = new Map() // 防重复容器

  /**
   * @description 公共请求方法
   */
  async request<T = any>(reqConfig: DocReqConfig): Promise<T> {
    const { config = {}, url: path, method, body, formData, headers } = reqConfig
    const { noRepeat = true, responseType, ...restConfig } = (config || {}) as any
    const requestKey = this.joinParams(path, body, method)

    const requestFn = this instanceof Feedback ? feedbackRequest : request

    try {
      if (noRepeat) {
        //  防止重复请求逻辑
        const requestInfo = ApiClient.FETCH_MAP.get(requestKey)
        if (requestInfo) {
          console.warn(`接口重复，已取消接口 ${path} 的重复请求， 已返回相同请求数据`)
          // 接口请求中，直接返回在请求的 Promise【解决被取消接口没数据返回问题】
          requestInfo.wait = true
          const res = await requestInfo.request
          return this.clone(res)
        }

        const op = { url: path, method, headers, data: body || formData, timeout: (config as any).timeout, responseType, ...restConfig }
        const axiosRequest = requestFn(op)

        ApiClient.FETCH_MAP.set(requestKey, { request: axiosRequest, wait: false })

        const res = await axiosRequest
        const { wait } = ApiClient.FETCH_MAP.get(requestKey)
        ApiClient.FETCH_MAP.delete(requestKey)

        // 如果该接口有其它重复请求等待则，复制一个新数据返回，否则可能导致后面拿到的数据被前面的操作修改
        return wait ? this.clone(res) : (res as any)
      }
      return requestFn({ url: path, method, headers, data: body || formData, timeout: (config as any).timeout, responseType })
    } catch (error) {
      ApiClient.FETCH_MAP.delete(requestKey)
      return Promise.reject(error)
    }
  }

  private clone(data: any) {
    if (!isObject(data) || data instanceof Blob || data instanceof ArrayBuffer) return data
    return cloneDeep(data)
  }

  /** 连接参数作为防重复的Key */
  private joinParams(url: any, data: any, method = '') {
    // eslint-disable-next-line no-param-reassign
    method = method.toLocaleLowerCase()
    const dataStr = typeof data === 'string' ? data : JSON.stringify(data)
    return `${url}-${method}-${dataStr}`
  }

  /**
   * @description 文件下载方法
   */
  protected async download<T = Blob>(reqConfig: DocReqConfig, fileName?: string): Promise<T> {
    const { config = {}, url: path, method, body, formData, headers } = reqConfig
    const { responseType = 'blob' } = (config || {}) as any

    const requestFn = this instanceof Feedback ? feedbackRequest : request

    try {
      const res = await requestFn({ url: path, method, headers, data: body || formData, timeout: (config as any).timeout, responseType })
      console.log(res)
      const data = res.data as Blob

      console.log(data.type)
      if (data.type === 'application/json') {
        // 如果是 JSON数据， 证明这里下载失败了并不是返回文件流， 需要处理 Blob 成 JSON，提示用户下载失败
        return new Promise((_, reject) => {
          const reader = new FileReader()
          reader.onload = e => {
            try {
              const { code, message } = JSON.parse(e.target?.result as string)
              if (code !== 200) {
                ElMessage.error(message || '文件下载失败，请稍后重试')
                reject(new Error(message || '文件下载失败，请稍后重试'))
              }
            } catch {
              reject(new Error('文件下载失败，无法解析错误信息'))
            }
          }
          reader.onerror = () => {
            reject(new Error('文件下载失败，读取错误数据失败'))
          }
          reader.readAsText(data)
        })
      }

      console.log(res)

      const fm = res.headers['content-disposition']?.split('=')?.[1] || fileName || 'download.zip'
      try {
        fileName = decodeURIComponent(fm)
      } catch {}

      saveAs(data, fileName)
      return res as any
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * @description 拼接参数
   */
  protected serialize(query: Record<string, any>) {
    return qs.stringify(query, { skipNulls: true })
  }

  /**
   * @description 创建 formdata
   */
  protected formData(formData: Record<string, any>, type: string) {
    if (!(formData instanceof Object) || Array.isArray(formData)) return
    const dataList = Object.entries(formData)

    if (type.startsWith('multipart/form-data')) {
      const fd = new FormData()
      dataList.forEach(([k, v]) => {
        fd.append(k, v)
      })
      return fd
    }
    if (type.startsWith('application/x-www-form-urlencoded')) {
      const fd = new URLSearchParams()
      dataList.forEach(([k, v]) => {
        fd.set(k, v)
      })
      return fd
    }
  }
}
