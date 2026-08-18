import { RouteRecordRaw } from 'vue-router'

export type NavWidthInfo = { textWidth: number; openWidth: number; closeWidth: number }

export type RouterItem = RouteRecordRaw & NavWidthInfo
