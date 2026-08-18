import { createApp } from 'vue'
import WujieVue from 'wujie-vue3'
import { Toolkit } from 'frontendToolkit'
import { px2def, px2rem, rem2px } from '@/utils/rem'
import '@/assets/styles/index.scss' // global css
import '@/styles/gantt.scss' // gantt custom styles
import 'uno.css'

import App from './App.vue'
import store from './store'
import router from './router'
import directive from './directive' // directive

// 注册指令
import plugins from './plugins' // plugins
import { download } from '@/utils/request'

// svg图标
import 'virtual:svg-icons-register'

import './permission'
import elementIcons from '@/components/SvgIcon/svgicon'

import { useDict } from '@/utils/dict'
import { parseTime, resetForm, addDateRange, addDateRangeTwo, handleTree, selectDictLabel, selectDictLabels } from '@/utils/ruoyi'
import { PrePath } from './config'

const app = createApp(App)

Toolkit.init({ PrePath })
Toolkit.listenerUpdate()

// Toolkit.testUpdata()

Toolkit.getVersion().then(version => {
  console.log(`main: ${version}`)
})

// 全局方法挂载
app.config.globalProperties.useDict = useDict
app.config.globalProperties.download = download
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.addDateRangeTwo = addDateRangeTwo
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels

app.use(router)
app.use(store)
app.use(plugins)
app.use(elementIcons)
app.use(WujieVue)

app.mixin({
  methods: {
    rem2px(rem: number) {
      return rem2px(rem)
    },
    px2rem(px: number) {
      return px2rem(px)
    },
    px2def(px: number) {
      return px2def(px)
    }
  }
})

directive(app)

app.mount('#app')
