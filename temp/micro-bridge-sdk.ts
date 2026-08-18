/* eslint-disable */
/**
 * 微前端桥接 SDK
 * 供子应用使用，与主应用进行通讯
 *
 * @version 1.0.0
 * @description 基于 Wujie 微前端框架的事件通讯桥接工具
 */

// ============================================================================
// 无界微前端类型定义
// ============================================================================

type Callback = (...args: Array<any>) => any

interface EventBus {
  $on: (event: string, fn: Callback) => EventBus
  $onAll: (fn: (event: string, ...args: Array<any>) => any) => EventBus
  $once: (event: string, fn: Callback) => void
  $off: (event: string, fn: Callback) => EventBus
  $offAll: (fn: Callback) => EventBus
  $emit: (event: string, ...args: Array<any>) => EventBus
  $clear: () => EventBus
}

// ============================================================================
// 事件名称常量
// ============================================================================

export const EventNames = {
  /** 登出 - 触发主应用执行登出操作 */
  LOGOUT: 'logout',
  /** 刷新 - 刷新当前页面 */
  RELOAD: 'reload',
  /** 打开窗口 - 在新窗口打开指定 URL */
  OPEN_WINDOW: 'open-window',
  /** 路由变化 - 通知主应用路由已变化 */
  ROUTER_CHANGE: 'router-change',
  /** 设置导航加载状态 - 控制导航栏的加载状态 */
  SET_NAV_LOADING: 'set-nav-loading',
  /** 微前端路由变化 - 主应用通知子应用切换路由 */
  CHANGE_MICRO_ROUTER: 'change-micro-router',
  /** 折叠状态变化 - 导航栏折叠/展开状态变化 */
  COLLAPSE_CHANGE: 'collapse-change',
  /** 切换折叠 - 触发导航栏折叠/展开切换 */
  CHANGE_COLLAPSE: 'change-collapse',
  /** 新建聊天 - 触发新建聊天会话 */
  ON_NEW_CHAT: 'on-new-chat',
  /** 设置激活的代理 ID - 设置当前激活的 AI 代理 */
  SET_AGENT_ACTIVE_ID: 'set-agent-active-id',
  /** 设置代理历史记录 - 设置 AI 代理的历史记录列表 */
  SET_AGENT_HISTORY: 'set-agent-history',
  /** 设置激活的代理历史记录 - 选中并激活指定的历史记录 */
  SET_AGENT_ACTIVE_HISTORY: 'set-agent-active-history',
  /** 修改代理历史记录 - 修改历史记录的名称或内容 */
  MODIFY_AGENT_HISTORY: 'modify-agent-history',
  /** 删除代理历史记录 - 删除指定的历史记录 */
  DELETE_AGENT_HISTORY: 'delete-agent-history'
} as const

export type EventName = (typeof EventNames)[keyof typeof EventNames]

// ============================================================================
// 类型定义
// ============================================================================

/** 环境类型 */
export type EnvironmentType = 'wujie' | 'iframe' | 'standalone'

/** 路由变化选项 */
export interface RouterChangeOptions {
  /** 是否使用 replace 模式 */
  replace?: boolean
}

/** 微前端路由变化事件参数 */
export interface MicroRouteChangePayload {
  /** 目标路径 */
  path: string
  /** 微应用名称 */
  microName?: string
}

// ============================================================================
// SDK 类
// ============================================================================

export class MicroBridgeSDK {
  private eventHandlers: Map<string, Callback[]> = new Map()

  private readonly env: EnvironmentType

  private readonly isWujie: boolean

  constructor() {
    this.isWujie = this.checkWujieEnv()
    this.env = this.getEnv()
  }

  /** 获取当前环境类型 */
  getEnvType(): EnvironmentType {
    return this.env
  }

  /** 检查是否在微前端环境中 */
  getIsMicroApp(): boolean {
    return this.env !== 'standalone'
  }

  /** 检查是否在 Wujie 环境中 */
  private checkWujieEnv(): boolean {
    return typeof window !== 'undefined' && !!window.$wujie?.bus
  }

  /** 获取环境类型 */
  private getEnv(): EnvironmentType {
    if (this.checkWujieEnv()) return 'wujie'
    if (typeof window !== 'undefined' && window.self !== window.top) return 'iframe'
    return 'standalone'
  }

  /** 获取事件总线 */
  private getBus(): EventBus | null {
    if (this.isWujie && window.$wujie?.bus) {
      return window.$wujie.bus
    }
    return null
  }

  /** 跟踪事件处理器（用于清理） */
  private trackHandler(eventName: string, handler: Callback): void {
    if (!this.eventHandlers.has(eventName)) {
      this.eventHandlers.set(eventName, [])
    }
    const handlers = this.eventHandlers.get(eventName)!
    if (!handlers.includes(handler)) {
      handlers.push(handler)
    }
  }

  /** 取消事件监听（内部方法） */
  private internalOff(eventName: string, handler: Callback): boolean {
    const bus = this.getBus()
    if (bus) {
      bus.$off(eventName, handler)
      const handlers = this.eventHandlers.get(eventName)
      if (handlers) {
        const index = handlers.indexOf(handler)
        if (index > -1) {
          handlers.splice(index, 1)
        }
        if (handlers.length === 0) {
          this.eventHandlers.delete(eventName)
        }
      }
      return true
    }
    return false
  }

  // ============================================================================
  // 登出相关
  // ============================================================================

  /**
   * 触发登出操作
   * 主应用会执行完整的登出流程（清除 token、跳转登录页等）
   */
  logout(): boolean {
    const bus = this.getBus()
    if (bus) {
      bus.$emit(EventNames.LOGOUT)
      return true
    }
    console.warn('[MicroBridgeSDK] 不在微前端环境中，无法触发登出')
    return false
  }

  // ============================================================================
  // 页面操作
  // ============================================================================

  /**
   * 刷新当前页面
   */
  reload(): boolean {
    const bus = this.getBus()
    if (bus) {
      bus.$emit(EventNames.RELOAD)
      return true
    }
    // 降级处理：直接刷新页面
    window.location.reload()
    return false
  }

  /**
   * 打开新窗口
   * @param url - 要打开的 URL
   */
  openWindow(url: string): boolean {
    if (typeof url !== 'string' || !url) {
      console.error('[MicroBridgeSDK] openWindow: url 参数必须是非空字符串')
      return false
    }

    const bus = this.getBus()
    if (bus) {
      bus.$emit(EventNames.OPEN_WINDOW, url)
      return true
    }
    // 降级处理：直接使用 window.open
    window.open(url, '_blank')
    return false
  }

  // ============================================================================
  // 路由相关
  // ============================================================================

  /**
   * 通知主应用路由变化
   * @param route - 路由路径或路由对象
   * @param options - 选项
   */
  routerChange(route: string | Record<string, any>, options: RouterChangeOptions = {}): boolean {
    const bus = this.getBus()
    if (bus) {
      bus.$emit(EventNames.ROUTER_CHANGE, route, options)
      return true
    }
    console.warn('[MicroBridgeSDK] 不在微前端环境中，无法通知路由变化')
    return false
  }

  /**
   * 设置导航栏加载状态
   * @param loading - 是否显示加载状态
   */
  setNavLoading(loading: boolean): boolean {
    const bus = this.getBus()
    if (bus) {
      bus.$emit(EventNames.SET_NAV_LOADING, loading)
      return true
    }
    return false
  }

  /**
   * 切换导航栏折叠状态
   * 触发导航栏进行折叠/展开切换
   */
  toggleCollapse(): boolean {
    const bus = this.getBus()
    if (bus) {
      bus.$emit(EventNames.CHANGE_COLLAPSE)
      return true
    }
    return false
  }

  // ============================================================================
  // AI 代理相关
  // ============================================================================

  /**
   * 设置激活的代理 ID
   * @param id - 代理 ID
   */
  setAgentActiveId(id: string | number): boolean {
    const bus = this.getBus()
    if (bus) {
      bus.$emit(EventNames.SET_AGENT_ACTIVE_ID, id)
      return true
    }
    return false
  }

  /**
   * 设置代理历史记录列表
   * @param historyList - 历史记录列表
   */
  setAgentHistory<T = any>(historyList: T[]): boolean {
    const bus = this.getBus()
    if (bus) {
      bus.$emit(EventNames.SET_AGENT_HISTORY, historyList)
      return true
    }
    return false
  }

  // ============================================================================
  // 事件监听
  // ============================================================================

  /**
   * 监听微前端路由变化（由主应用触发）
   * @param handler - 回调函数，接收 { path, microName } 参数
   */
  onRouteChange(handler: (payload: MicroRouteChangePayload) => void): boolean {
    if (typeof handler !== 'function') {
      console.error('[MicroBridgeSDK] onRouteChange: handler 必须是函数')
      return false
    }

    const bus = this.getBus()
    if (bus) {
      this.internalOff(EventNames.CHANGE_MICRO_ROUTER, handler)
      bus.$on(EventNames.CHANGE_MICRO_ROUTER, handler)
      this.trackHandler(EventNames.CHANGE_MICRO_ROUTER, handler)
      return true
    }
    return false
  }

  /** 取消监听路由变化 */
  offRouteChange(handler: (payload: MicroRouteChangePayload) => void): boolean {
    return this.internalOff(EventNames.CHANGE_MICRO_ROUTER, handler)
  }

  /**
   * 监听导航栏折叠状态变化
   * @param handler - 回调函数，接收 boolean 参数（true 表示已折叠）
   */
  onCollapseChange(handler: (collapsed: boolean) => void): boolean {
    if (typeof handler !== 'function') {
      console.error('[MicroBridgeSDK] onCollapseChange: handler 必须是函数')
      return false
    }

    const bus = this.getBus()
    if (bus) {
      this.internalOff(EventNames.COLLAPSE_CHANGE, handler)
      bus.$on(EventNames.COLLAPSE_CHANGE, handler)
      this.trackHandler(EventNames.COLLAPSE_CHANGE, handler)
      return true
    }
    return false
  }

  /** 取消监听折叠状态变化 */
  offCollapseChange(handler: (collapsed: boolean) => void): boolean {
    return this.internalOff(EventNames.COLLAPSE_CHANGE, handler)
  }

  /**
   * 监听新建聊天事件（由主应用触发）
   * @param handler - 回调函数
   */
  onNewChat(handler: () => void): boolean {
    if (typeof handler !== 'function') {
      console.error('[MicroBridgeSDK] onNewChat: handler 必须是函数')
      return false
    }

    const bus = this.getBus()
    if (bus) {
      this.internalOff(EventNames.ON_NEW_CHAT, handler)
      bus.$on(EventNames.ON_NEW_CHAT, handler)
      this.trackHandler(EventNames.ON_NEW_CHAT, handler)
      return true
    }
    return false
  }

  /** 取消监听新建聊天事件 */
  offNewChat(handler: () => void): boolean {
    return this.internalOff(EventNames.ON_NEW_CHAT, handler)
  }

  /**
   * 监听设置激活代理 ID 事件（由主应用触发）
   * @param handler - 回调函数，接收 id 参数
   */
  onSetAgentActiveId(handler: (id: string | number) => void): boolean {
    if (typeof handler !== 'function') {
      console.error('[MicroBridgeSDK] onSetAgentActiveId: handler 必须是函数')
      return false
    }

    const bus = this.getBus()
    if (bus) {
      this.internalOff(EventNames.SET_AGENT_ACTIVE_ID, handler)
      bus.$on(EventNames.SET_AGENT_ACTIVE_ID, handler)
      this.trackHandler(EventNames.SET_AGENT_ACTIVE_ID, handler)
      return true
    }
    return false
  }

  /** 取消监听设置激活代理 ID 事件 */
  offSetAgentActiveId(handler: (id: string | number) => void): boolean {
    return this.internalOff(EventNames.SET_AGENT_ACTIVE_ID, handler)
  }

  /**
   * 监听设置代理历史记录事件（由主应用触发）
   * @param handler - 回调函数，接收历史记录列表参数
   */
  onSetAgentHistory<T = any>(handler: (historyList: T[]) => void): boolean {
    if (typeof handler !== 'function') {
      console.error('[MicroBridgeSDK] onSetAgentHistory: handler 必须是函数')
      return false
    }

    const bus = this.getBus()
    if (bus) {
      this.internalOff(EventNames.SET_AGENT_HISTORY, handler)
      bus.$on(EventNames.SET_AGENT_HISTORY, handler)
      this.trackHandler(EventNames.SET_AGENT_HISTORY, handler)
      return true
    }
    return false
  }

  /** 取消监听设置代理历史记录事件 */
  offSetAgentHistory<T = any>(handler: (historyList: T[]) => void): boolean {
    return this.internalOff(EventNames.SET_AGENT_HISTORY, handler)
  }

  /**
   * 监听设置激活的代理历史记录事件（由主应用触发）
   * @param handler - 回调函数，接收历史记录项参数
   */
  onSetAgentActiveHistory<T = any>(handler: (historyItem: T) => void): boolean {
    if (typeof handler !== 'function') {
      console.error('[MicroBridgeSDK] onSetAgentActiveHistory: handler 必须是函数')
      return false
    }

    const bus = this.getBus()
    if (bus) {
      this.internalOff(EventNames.SET_AGENT_ACTIVE_HISTORY, handler)
      bus.$on(EventNames.SET_AGENT_ACTIVE_HISTORY, handler)
      this.trackHandler(EventNames.SET_AGENT_ACTIVE_HISTORY, handler)
      return true
    }
    return false
  }

  /** 取消监听设置激活的代理历史记录事件 */
  offSetAgentActiveHistory<T = any>(handler: (historyItem: T) => void): boolean {
    return this.internalOff(EventNames.SET_AGENT_ACTIVE_HISTORY, handler)
  }

  /**
   * 监听修改代理历史记录事件（由主应用触发）
   * @param handler - 回调函数，接收修改后的历史记录项参数
   */
  onModifyAgentHistory<T = any>(handler: (historyItem: T) => void): boolean {
    if (typeof handler !== 'function') {
      console.error('[MicroBridgeSDK] onModifyAgentHistory: handler 必须是函数')
      return false
    }

    const bus = this.getBus()
    if (bus) {
      this.internalOff(EventNames.MODIFY_AGENT_HISTORY, handler)
      bus.$on(EventNames.MODIFY_AGENT_HISTORY, handler)
      this.trackHandler(EventNames.MODIFY_AGENT_HISTORY, handler)
      return true
    }
    return false
  }

  /** 取消监听修改代理历史记录事件 */
  offModifyAgentHistory<T = any>(handler: (historyItem: T) => void): boolean {
    return this.internalOff(EventNames.MODIFY_AGENT_HISTORY, handler)
  }

  /**
   * 监听删除代理历史记录事件（由主应用触发）
   * @param handler - 回调函数，接收要删除的历史记录项参数
   */
  onDeleteAgentHistory<T = any>(handler: (historyItem: T) => void): boolean {
    if (typeof handler !== 'function') {
      console.error('[MicroBridgeSDK] onDeleteAgentHistory: handler 必须是函数')
      return false
    }

    const bus = this.getBus()
    if (bus) {
      this.internalOff(EventNames.DELETE_AGENT_HISTORY, handler)
      bus.$on(EventNames.DELETE_AGENT_HISTORY, handler)
      this.trackHandler(EventNames.DELETE_AGENT_HISTORY, handler)
      return true
    }
    return false
  }

  /** 取消监听删除代理历史记录事件 */
  offDeleteAgentHistory<T = any>(handler: (historyItem: T) => void): boolean {
    return this.internalOff(EventNames.DELETE_AGENT_HISTORY, handler)
  }

  /**
   * 监听切换折叠事件（由主应用触发）
   * @param handler - 回调函数
   */
  onChangeCollapse(handler: () => void): boolean {
    if (typeof handler !== 'function') {
      console.error('[MicroBridgeSDK] onChangeCollapse: handler 必须是函数')
      return false
    }

    const bus = this.getBus()
    if (bus) {
      this.internalOff(EventNames.CHANGE_COLLAPSE, handler)
      bus.$on(EventNames.CHANGE_COLLAPSE, handler)
      this.trackHandler(EventNames.CHANGE_COLLAPSE, handler)
      return true
    }
    return false
  }

  /** 取消监听切换折叠事件 */
  offChangeCollapse(handler: () => void): boolean {
    return this.internalOff(EventNames.CHANGE_COLLAPSE, handler)
  }

  // ============================================================================
  // 通用事件 API
  // ============================================================================

  /**
   * 监听自定义事件
   * @param eventName - 事件名称
   * @param handler - 回调函数
   */
  on<T = any>(eventName: string, handler: (data: T) => void): boolean {
    if (typeof eventName !== 'string' || !eventName) {
      console.error('[MicroBridgeSDK] on: eventName 必须是非空字符串')
      return false
    }
    if (typeof handler !== 'function') {
      console.error('[MicroBridgeSDK] on: handler 必须是函数')
      return false
    }

    const bus = this.getBus()
    if (bus) {
      this.internalOff(eventName, handler)
      bus.$on(eventName, handler)
      this.trackHandler(eventName, handler)
      return true
    }
    return false
  }

  /** 取消监听事件 */
  off<T = any>(eventName: string, handler: (data: T) => void): boolean {
    return this.internalOff(eventName, handler)
  }

  /**
   * 触发自定义事件
   * @param eventName - 事件名称
   * @param data - 事件数据
   */
  emit<T = any>(eventName: string, data?: T): boolean {
    if (typeof eventName !== 'string' || !eventName) {
      console.error('[MicroBridgeSDK] emit: eventName 必须是非空字符串')
      return false
    }

    const bus = this.getBus()
    if (bus) {
      bus.$emit(eventName, data)
      return true
    }
    console.warn('[MicroBridgeSDK] 不在微前端环境中，无法触发事件')
    return false
  }

  /**
   * 监听所有事件
   * @param handler - 回调函数，第一个参数为事件名，后续参数为 $emit 的参数
   */
  onAll(handler: (eventName: string, args: Array<any>) => any): boolean {
    if (typeof handler !== 'function') {
      console.error('[MicroBridgeSDK] onAll: handler 必须是函数')
      return false
    }

    const bus = this.getBus()
    if (bus) {
      bus.$onAll(handler)
      return true
    }
    return false
  }

  /** 取消监听所有事件 */
  offAll(handler: (eventName: string, args: Array<any>) => any): boolean {
    const bus = this.getBus()
    if (bus) {
      bus.$offAll(handler)
      return true
    }
    return false
  }

  // ============================================================================
  // 清理
  // ============================================================================

  /** 清除所有事件监听器 */
  clearAllListeners(): boolean {
    const bus = this.getBus()
    if (bus) {
      bus.$clear()
      this.eventHandlers.clear()
      return true
    }
    return false
  }

  /** 销毁 SDK 实例，清理所有资源 */
  destroy(): void {
    this.clearAllListeners()
  }
}

// ============================================================================
// 默认实例
// ============================================================================

/**
 * 微前端桥接 SDK 默认实例
 */
export const microBridgeSDK = new MicroBridgeSDK()

export default microBridgeSDK
