export enum AppDataType {
  all,
  dialog,
  bi,
  aiWork,
  chatting,
  flow
}

export interface OperatingTime {
  pid: string | number
  createdBy?: string
  updatedBy?: string
  createDate?: string
  updatedDate?: string
}

export interface ChatHistory extends OperatingTime {
  id: string | number
  type: AppDataType
  name: string
  tag?: string
  appId: string | number
  oData: any
  status?: number
  renwu_url?: string
  xuqiu_url?: string
  isHideRename?: boolean
  // app: AppType
}
