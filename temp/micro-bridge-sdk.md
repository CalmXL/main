# 微前端桥接 SDK 使用文档

## 简介

`micro-bridge-sdk` 是一个供子应用使用的工具包，用于与主应用进行事件通讯。基于 Wujie 微前端框架的事件总线实现。

## 安装

将 `micro-bridge-sdk.ts` 文件复制到子应用项目的 `src/utils/` 目录下。

## 引入

```typescript
// 使用默认导出
import microBridgeSDK from '@/utils/micro-bridge-sdk'

// 或使用命名导出
import { microBridgeSDK, EventNames } from '@/utils/micro-bridge-sdk'

// 或单独引入类创建新实例
import { MicroBridgeSDK } from '@/utils/micro-bridge-sdk'
const sdk = new MicroBridgeSDK()
```

## 事件列表

| 事件名 | 常量 | 方向 | 说明 |
|--------|------|------|------|
| `logout` | `EventNames.LOGOUT` | 子→主 | 触发登出操作 |
| `reload` | `EventNames.RELOAD` | 子→主 | 刷新当前页面 |
| `open-window` | `EventNames.OPEN_WINDOW` | 子→主 | 打开新窗口 |
| `router-change` | `EventNames.ROUTER_CHANGE` | 子→主 | 通知主应用路由变化 |
| `set-nav-loading` | `EventNames.SET_NAV_LOADING` | 子→主 | 设置导航加载状态 |
| `change-collapse` | `EventNames.CHANGE_COLLAPSE` | 子→主 | 切换导航栏折叠状态 |
| `on-new-chat` | `EventNames.ON_NEW_CHAT` | 子→主 | 新建聊天会话 |
| `set-agent-active-id` | `EventNames.SET_AGENT_ACTIVE_ID` | 子→主 | 设置激活的代理 ID |
| `set-agent-history` | `EventNames.SET_AGENT_HISTORY` | 子→主 | 设置代理历史记录 |
| `set-agent-active-history` | `EventNames.SET_AGENT_ACTIVE_HISTORY` | 子→主 | 设置激活的代理历史记录 |
| `modify-agent-history` | `EventNames.MODIFY_AGENT_HISTORY` | 子→主 | 修改代理历史记录 |
| `delete-agent-history` | `EventNames.DELETE_AGENT_HISTORY` | 子→主 | 删除代理历史记录 |
| `change-micro-router` | `EventNames.CHANGE_MICRO_ROUTER` | 主→子 | 微前端路由切换 |
| `collapse-change` | `EventNames.COLLAPSE_CHANGE` | 主→子 | 导航栏折叠状态变化 |

## API 文档

### 环境检测

```typescript
// 获取当前环境类型
const env = microBridgeSDK.getEnvType()
// 'wujie' | 'iframe' | 'standalone'

// 检查是否在微前端环境中
const isMicroApp = microBridgeSDK.getIsMicroApp()
// true | false
```

### 子应用调用（通知主应用）

#### 登出

```typescript
// 触发主应用执行登出操作
microBridgeSDK.logout()
```

#### 刷新页面

```typescript
// 刷新当前页面
microBridgeSDK.reload()
```

#### 打开新窗口

```typescript
// 打开新窗口
microBridgeSDK.openWindow('https://example.com')
```

#### 路由变化

```typescript
// 通知主应用路由变化
microBridgeSDK.routerChange('/some-path')

// 使用 replace 模式
microBridgeSDK.routerChange('/some-path', { replace: true })
```

#### 设置导航加载状态

```typescript
// 显示加载状态
microBridgeSDK.setNavLoading(true)

// 隐藏加载状态
microBridgeSDK.setNavLoading(false)
```

#### 切换导航栏折叠状态

```typescript
// 触发导航栏折叠/展开切换
microBridgeSDK.toggleCollapse()
```

### AI 代理相关

#### 设置激活的代理 ID

```typescript
// 设置当前激活的 AI 代理 ID
microBridgeSDK.setAgentActiveId('agent-123')
```

#### 设置代理历史记录

```typescript
// 设置 AI 代理的历史记录列表
microBridgeSDK.setAgentHistory([
  { id: '1', name: '对话 1', time: '2024-01-01' },
  { id: '2', name: '对话 2', time: '2024-01-02' }
])
```

### 子应用监听（接收主应用通知）

#### 监听路由变化

```typescript
// 定义处理函数
const handleRouteChange = ({ path, microName }) => {
  console.log('路由变化:', path, microName)
  // 更新子应用路由
}

// 注册监听
microBridgeSDK.onRouteChange(handleRouteChange)

// 取消监听
microBridgeSDK.offRouteChange(handleRouteChange)
```

#### 监听导航栏折叠状态

```typescript
// 定义处理函数
const handleCollapseChange = (collapsed) => {
  console.log('折叠状态:', collapsed)
  // 根据折叠状态调整布局
}

// 注册监听
microBridgeSDK.onCollapseChange(handleCollapseChange)

// 取消监听
microBridgeSDK.offCollapseChange(handleCollapseChange)
```

#### 监听切换折叠事件

```typescript
// 定义处理函数
const handleChangeCollapse = () => {
  console.log('触发折叠切换')
  // 响应折叠切换操作
}

// 注册监听
microBridgeSDK.onChangeCollapse(handleChangeCollapse)

// 取消监听
microBridgeSDK.offChangeCollapse(handleChangeCollapse)
```

#### 监听新建聊天事件

```typescript
// 定义处理函数
const handleNewChat = () => {
  console.log('新建聊天')
  // 清空当前对话，开始新对话
}

// 注册监听
microBridgeSDK.onNewChat(handleNewChat)

// 取消监听
microBridgeSDK.offNewChat(handleNewChat)
```

#### 监听设置激活代理 ID

```typescript
// 定义处理函数
const handleSetAgentActiveId = (id) => {
  console.log('激活代理 ID:', id)
  // 切换到指定的代理
}

// 注册监听
microBridgeSDK.onSetAgentActiveId(handleSetAgentActiveId)

// 取消监听
microBridgeSDK.offSetAgentActiveId(handleSetAgentActiveId)
```

#### 监听设置代理历史记录

```typescript
// 定义处理函数
const handleSetAgentHistory = (historyList) => {
  console.log('代理历史记录:', historyList)
  // 更新历史记录列表
}

// 注册监听
microBridgeSDK.onSetAgentHistory(handleSetAgentHistory)

// 取消监听
microBridgeSDK.offSetAgentHistory(handleSetAgentHistory)
```

#### 监听设置激活的代理历史记录

```typescript
// 定义处理函数
const handleSetAgentActiveHistory = (historyItem) => {
  console.log('激活历史记录:', historyItem)
  // 加载指定的历史记录
}

// 注册监听
microBridgeSDK.onSetAgentActiveHistory(handleSetAgentActiveHistory)

// 取消监听
microBridgeSDK.offSetAgentActiveHistory(handleSetAgentActiveHistory)
```

#### 监听修改代理历史记录

```typescript
// 定义处理函数
const handleModifyAgentHistory = (historyItem) => {
  console.log('修改历史记录:', historyItem)
  // 更新历史记录名称或内容
}

// 注册监听
microBridgeSDK.onModifyAgentHistory(handleModifyAgentHistory)

// 取消监听
microBridgeSDK.offModifyAgentHistory(handleModifyAgentHistory)
```

#### 监听删除代理历史记录

```typescript
// 定义处理函数
const handleDeleteAgentHistory = (historyItem) => {
  console.log('删除历史记录:', historyItem)
  // 从列表中移除该历史记录
}

// 注册监听
microBridgeSDK.onDeleteAgentHistory(handleDeleteAgentHistory)

// 取消监听
microBridgeSDK.offDeleteAgentHistory(handleDeleteAgentHistory)
```

### 通用事件 API

#### 监听自定义事件

```typescript
// 监听自定义事件
microBridgeSDK.on('custom-event', (data) => {
  console.log('收到自定义事件:', data)
})

// 取消监听
microBridgeSDK.off('custom-event', handler)
```

#### 触发自定义事件

```typescript
// 触发自定义事件
microBridgeSDK.emit('custom-event', { key: 'value' })
```

#### 监听所有事件

```typescript
// 监听所有事件（用于调试）
microBridgeSDK.onAll((eventName, args) => {
  console.log('事件:', eventName, '参数:', args)
})

// 取消监听
microBridgeSDK.offAll(handler)
```

### 清理

```typescript
// 清除所有事件监听器
microBridgeSDK.clearAllListeners()

// 销毁 SDK 实例
microBridgeSDK.destroy()
```

## 完整示例

### Vue 3 组件示例

```vue
<template>
  <div>
    <button @click="handleLogout">登出</button>
    <button @click="handleOpenWindow">打开窗口</button>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import microBridgeSDK, { EventNames } from '@/utils/micro-bridge-sdk'

// 登出
const handleLogout = () => {
  microBridgeSDK.logout()
}

// 打开窗口
const handleOpenWindow = () => {
  microBridgeSDK.openWindow('https://example.com')
}

// 监听路由变化
const handleRouteChange = ({ path, microName }) => {
  console.log('路由变化:', path, microName)
}
microBridgeSDK.onRouteChange(handleRouteChange)

// 监听折叠状态变化
const handleCollapseChange = (collapsed) => {
  console.log('折叠状态:', collapsed)
}
microBridgeSDK.onCollapseChange(handleCollapseChange)

// 设置导航加载状态
const setLoading = (loading: boolean) => {
  microBridgeSDK.setNavLoading(loading)
}

// 组件卸载时清理
onBeforeUnmount(() => {
  microBridgeSDK.offRouteChange(handleRouteChange)
  microBridgeSDK.offCollapseChange(handleCollapseChange)
})
</script>
```

### React 组件示例

```tsx
import { useEffect } from 'react'
import microBridgeSDK, { EventNames, MicroRouteChangePayload } from '@/utils/micro-bridge-sdk'

function MyComponent() {
  // 登出
  const handleLogout = () => {
    microBridgeSDK.logout()
  }

  // 监听路由变化
  useEffect(() => {
    const handleRouteChange = ({ path, microName }: MicroRouteChangePayload) => {
      console.log('路由变化:', path, microName)
    }

    microBridgeSDK.onRouteChange(handleRouteChange)

    return () => {
      microBridgeSDK.offRouteChange(handleRouteChange)
    }
  }, [])

  return <button onClick={handleLogout}>登出</button>
}
```

## 注意事项

1. **环境检测**：SDK 会自动检测是否在 Wujie 微前端环境中，不在环境中会降级处理或给出警告。

2. **事件清理**：组件卸载时记得取消事件监听，避免内存泄漏。

3. **类型安全**：TypeScript 项目可以获得完整的类型提示。

4. **错误处理**：SDK 会在控制台输出错误和警告信息，便于调试。
