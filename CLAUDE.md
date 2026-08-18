# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
这是一个基于 Vue 3 + TypeScript + Vite 构建的智元主应用前端项目，包含微前端集成、图表展示、权限管理等功能。

## Common Commands

### Development
```bash
npm run dev          # 启动开发服务器
npm run devf         # 强制启动开发服务器
```

### Build
```bash
npm run build:prod   # 生产环境构建
npm run build:stage  # 测试环境构建
npm run preview      # 预览生产构建
```

### Quality
```bash
npm run lint         # 代码检查与修复
```

### Deployment
```bash
npm run zip          # 打包构建结果为 zip
npm run upload       # 上传 zip 到服务器
npm run deploy       # 一键部署：构建 → 打包 → 上传 → 升级
```

### Versioning
```bash
npm run upgradeVersion  # 升级版本号
npm run release         # 发布版本并生成 CHANGELOG
```

### API
```bash
npm run api         # 启动 API 服务
npm run api-git     # 使用 git 启动 API 服务
```

## Architecture

### Tech Stack
- Vue 3 Composition API
- TypeScript 5.x
- Element Plus UI framework
- ECharts for data visualization
- Pinia for state management
- Vue Router 4.x for routing
- UnoCSS for styling
- Vite 5.x for build tooling

### Key Directory Structure
```
src/
├── api/             # API 请求定义
├── components/      # 通用组件
├── config/          # 配置文件
├── directive/       # 自定义指令
├── layout/          # 布局组件
├── router/          # 路由配置
├── services/        # 业务服务
├── store/           # Pinia 状态管理
├── styles/          # 全局样式
├── utils/           # 工具函数
├── views/           # 页面组件
├── App.vue          # 根组件
├── main.ts          # 应用入口
├── permission.ts    # 权限管理
```

### Core Features
- 微前端集成（WujieVue）
- 动态菜单与权限控制
- 多环境构建配置
- 自动部署与升级脚本
- 响应式设计与 REM 适配
- SVG 图标系统

## Configuration

### Environment Variables
- VITE_APP_USE_REM: 是否使用 REM 适配（默认：true）
- 其他环境变量通过 .env 文件定义

### Build Modes
- production: 生产环境
- staging: 测试环境

## Notes
- 使用 `pnpm` 作为包管理器
- 遵循 ESLint + TypeScript 代码规范
- 微前端集成使用 WujieVue，需注意路由参数配置
- 权限管理通过 `permission.ts` 实现

## Recent Changes
- 已将 ECharts 版本升级至 5.5.1
- 在用户选择器中添加了过滤功能
- 简化了 804 环境下导航列表的过滤逻辑
- 添加了文件上传相关资源及代理配置
- 新增意见反馈功能：
  - 添加了可拖拽移动的悬浮反馈按钮（右下角默认位置）
  - 反馈弹窗支持提交标题、内容、多张图片
  - 集成到全局 App.vue，所有页面可用
  - 使用 Element Plus 组件，支持深浅色主题
- 新增反馈管理页面（`src/views/feedback/index.vue`）：
  - 反馈列表展示（序号、反馈人、标题、内容、图片、状态、时间、操作）
  - 支持关键词搜索和状态筛选
  - 点击查看反馈详情弹窗
  - 支持修改反馈状态（未处理、已处理、不处理）
  - 支持删除反馈记录

## Additional Resources
- README.md: 详细的部署与使用说明
- CHANGELOG.md: 版本变更记录
- docs/开发文档.md: 完整的开发文档，包含技术栈详解、开发指南、架构设计等
- scripts/ directory: 包含部署、升级等脚本

## 使用使用 unplugin-auto-import/vite 和 unplugin-vue-components/vite 插件
这两个插件可以自动导入 Vue 3 相关的 API 和组件，避免手动引入。
具体的类型定义可以查看  
[.eslintrc-auto-import.json](types/.eslintrc-auto-import.json)
[auto-imports.d.ts](types/auto-imports.d.ts)
[components.d.ts](types/components.d.ts)

** 优先使用 vue-lsp 和 typescript-lsp 来查找代码的具体定义 ** 
