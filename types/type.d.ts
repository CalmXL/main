import { px2def, px2rem, rem2px } from '@/utils/rem'

export {} /// 这句不能删

declare module 'vue' {
  interface ComponentCustomProperties {
    px2def: typeof px2def
    px2rem: typeof px2rem
    rem2px: typeof rem2px
    useDict: (...args: string[]) => any
    download: (url: string, params: any, filename: string) => void
    parseTime: (time: any, pattern?: string) => string
    resetForm: (refName: string) => void
    handleTree: (data: any[], id?: string, parentId?: string, children?: string) => any[]
    addDateRange: (params: any, dateRange: any[], propName?: string) => any
    addDateRangeTwo: (params: any, dateRange: any[], startPropName?: string, endPropName?: string) => any
    selectDictLabel: (datas: any[], value: any) => string
    selectDictLabels: (datas: any[], value: any, separator?: string) => string
    $tab: any
    $auth: any
    $cache: any
    $modal: {
      msg: (content: string) => void
      msgError: (content: string) => void
      msgSuccess: (content: string) => void
      msgWarning: (content: string) => void
      alert: (content: string) => Promise<any>
      alertError: (content: string) => Promise<any>
      alertSuccess: (content: string) => Promise<any>
      alertWarning: (content: string) => Promise<any>
      confirm: (content: string) => Promise<any>
      prompt: (content: string, value?: string) => Promise<any>
    }
    $download: any
  }
}
