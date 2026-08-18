<template>
  <el-watermark :font="font" :content="content" :z-index="99999" :gap="[80, 80]" class="watermark">
    <el-config-provider :locale="locale" :size="size">
      <router-view />
    </el-config-provider>
  </el-watermark>
</template>

<script setup lang="ts">
import Cookies from 'js-cookie'
import locale from 'element-plus/es/locale/lang/zh-cn'
import dayjs from 'dayjs'
import useUserStore from '@/store/modules/user'
import useSettingsStore from '@/store/modules/settings'
import { handleThemeStyle } from '@/utils/theme'
import { isProd, WatermarkText } from './config'

const size = (Cookies.get('size') || 'default') as 'default' | 'small' | 'large'

const font = reactive({
  color: 'rgba(0, 0, 0, 0.06)'
})

const userStore = useUserStore()
const watermarkTime = ref(dayjs(new Date()).format('YY-MM-DD HH:mm:ss'))
// eslint-disable-next-line max-len
const content = computed(() => (isProd ? [userStore.nickName, userStore.phone, watermarkTime.value, WatermarkText].filter(Boolean) : ''))
// const content = computed(() => (true ? [userStore.nickName, userStore.phone, watermarkTime.value].filter(Boolean) : ''))
const timer = ref<NodeJS.Timeout>()

onMounted(async () => {
  // 初始化主题样式
  await nextTick()
  handleThemeStyle(useSettingsStore().theme)

  // 两分钟更新一次水印时间
  timer.value = setInterval(() => {
    watermarkTime.value = dayjs(new Date()).format('YY-MM-DD HH:mm:ss')
  }, 1000 * 60 * 2)
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
})
</script>

<style lang="scss">
.watermark {
  width: 100%;
  height: 100%;
}
</style>
