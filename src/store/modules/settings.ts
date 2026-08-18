import { defineStore } from 'pinia'
import defaultSettings from '@/settings'
import { useDynamicTitle } from '@/utils/dynamicTitle'
import variables from '@/assets/styles/variables.module.scss'
import { dataTrack, DataTrackParams } from '@/api/system/user'

const { sideTheme, showSettings, topNav, tagsView, fixedHeader, sidebarLogo, dynamicTitle } = defaultSettings

const storageSetting = JSON.parse(localStorage.getItem('layout-setting') ?? '{}') || ''

const useSettingsStore = defineStore('settings', {
  state: () => ({
    title: '',
    theme: storageSetting.theme || variables.primaryColor,
    sideTheme: storageSetting.sideTheme || sideTheme,
    showSettings,
    topNav: storageSetting.topNav === undefined ? topNav : storageSetting.topNav,
    tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView,
    fixedHeader: storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader,
    sidebarLogo: storageSetting.sidebarLogo === undefined ? sidebarLogo : storageSetting.sidebarLogo,
    dynamicTitle: storageSetting.dynamicTitle === undefined ? dynamicTitle : storageSetting.dynamicTitle
  }),
  actions: {
    // 修改布局设置
    changeSetting(data: any) {
      const { key, value } = data
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        Reflect.set(this, key, value)
      }
    },
    // 设置网页标题
    setTitle(title: string) {
      this.title = title
      useDynamicTitle()
    },
    // 数据埋点
    dataTrack(data: DataTrackParams) {
      // console.log('数据埋点')
      dataTrack(data)
    }
  }
})

export default useSettingsStore
