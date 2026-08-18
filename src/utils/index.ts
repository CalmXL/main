/* eslint-disable implicit-arrow-linebreak */
import { RouteRecordRaw } from 'vue-router'
import { isProd, microPaths, PrePath } from '@/config'
import { isHttp } from './validate'

// 首字母大小
export function titleCase(str: string) {
  return str.replace(/( |^)[a-z]/g, L => L.toUpperCase())
}

// 下划转驼峰
export function camelCase(str: string) {
  return str.replace(/_[a-z]/g, str1 => str1.substr(-1).toUpperCase())
}

export function isNumberStr(str: string) {
  return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str)
}

/**
 * @param base64Data 图片信息
 * @description base64 装 Blob
 */
export function base64ToBlob(base64Data: string, name: string) {
  const [type, data] = base64Data.split(',') // 根据,来分隔
  const imageType = type.match(/:(.*?);/)?.[1] // 获取文件类型。使用正则捕获 image/jpeg
  const textData = window.atob(data) // 使用atob() 将base64 转为文本文件
  const arrayBuffer = new ArrayBuffer(textData.length) // 创建一个二进制数据缓冲区，可以理解为一个数组
  const uint8Array = new Uint8Array(arrayBuffer) // 创建一个类型化数组对象，可以理解为上面的数组的成员，给这个对象赋值就会放到上面的数组中。
  for (let i = 0; i < textData.length; i++) {
    uint8Array[i] = textData.charCodeAt(i) // 将文本文件转为UTF-16的ASCII, 放到类型化数组对象中
  }
  return new File([new Blob([arrayBuffer], { type: imageType })], name, { type: imageType })
  // return new Blob([arrayBuffer], { type: imageType })
}

export function getFirstRoutePath(route?: RouteRecordRaw): string {
  if (!route) return ''
  let { path } = route
  const { children } = route
  if (!/^\//.test(path)) path = `/${path}`

  if (Array.isArray(children) && children.length > 0) {
    const [first] = children
    path = `${path}${getFirstRoutePath(first)}`
  }

  return path
}

export function formatMicroPath(path: string) {
  if (!/^\//.test(path)) path = `/${path}`
  if (!isProd) {
    const microDevInfo = microPaths.find(i => path.startsWith(i.path))
    if (!microDevInfo) throw new Error(`没找到 ${path} 对应的微应用开发环境配置信息， 请在 microPaths 添加相关信息`)
    path = path.replace(new RegExp(`^${microDevInfo.path}`), '')
    return `${microDevInfo.devServer}${path}`
  }
  if (!isHttp(path)) {
    return `${window.location.origin}${PrePath}${path}`
  }
  return path
}

export function getMicroTokenKey(name: string) {
  if (!/^\//.test(name)) name = `/${name}`
  if (/^\/dify\//.test(name)) name = '/flow'

  const microDevInfo = microPaths.find(i => name === i.name)

  return microDevInfo?.tokenKey ?? 'access_token'
}

export function deppEachFormatMicro(routes: any[]) {
  routes.forEach(item => {
    const { meta, component, children } = item

    if (meta && meta.isMicro === '0') meta.microPath = formatMicroPath(component)
    if (Array.isArray(children) && children.length > 0) deppEachFormatMicro(children)
  })
}

/**
 * 路径拼接
 * @param paths 路径
 * @returns 拼接后的路径
 */
export const pathJoin = (...paths: (string | undefined)[]) =>
  paths
    .filter(path => typeof path === 'string' && path.length > 0)
    .join('/')
    .replace(/\/+/g, '/')

/**
 * 递归查找路由
 * @param routes 路由列表
 * @param targetPath 目标路径
 * @returns 目标路由
 */
export const findRoute = (routes: RouteRecordRaw[], targetPath: string, prePath?: string): RouteRecordRaw | undefined => {
  for (let i = 0; i < routes.length; i++) {
    const { children, path: p } = routes[i]
    const path = pathJoin(prePath, p)

    if (path === targetPath) return routes[i]
    if (Array.isArray(children)) {
      const r = findRoute(children, pathJoin(prePath, targetPath, path))
      if (r) return r
    }
  }
}

/**
 * 获取路由路径
 * @param route 路由
 * @returns 路由路径
 */
export const getRoutePath = (route?: RouteRecordRaw): string => {
  if (!route) return ''
  const { path, children } = route
  if (Array.isArray(children) && children.length > 0) {
    const [first] = children
    return `${path}/${getRoutePath(first)}`
  }
  return path
}
