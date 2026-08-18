<template>
  <div class="header-nav-wrapper" :class="[isMobile ? '!justify-center' : '']">
    <div>
      <div class="header-nav">
        <div class="bar" :style="{ transform, width: navWidth, transition: !initAnimation ? 'unset' : undefined }" />
        <div
          v-for="(nav, index) in routers"
          :key="nav.path"
          :ref="el => (navRefs[`nav_${index}`] = el)"
          class="nav-item"
          :class="{ active: navIndex === index }"
          @click="handleNav(nav, index)"
        >
          <NavIcon :nav="nav" />
          <div
            :ref="el => (navTitleRefs[`title_${index}`] = el)"
            class="nav-title w-0 transition-width duration-450 box-border overflow-hidden"
            :style="{ width: navIndex === index ? `${nav.textWidth}px` : '' }"
          >
            <span class="title-text pl-2 w-full block overflow-hidden whitespace-nowrap">{{ nav.meta?.title }}</span>
          </div>
        </div>
      </div>
    </div>
    <el-dropdown v-if="!isMobile" placement="bottom" trigger="hover">
      <div class="avatar">
        <svg-icon class="avatar-icon" icon-class="avatar" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>{{ userStore.nickName }}</el-dropdown-item>
        </el-dropdown-menu>
        <el-dropdown-menu v-if="!is804Env">
          <el-dropdown-item @click="handleEditUserInfo">修改信息</el-dropdown-item>
        </el-dropdown-menu>
        <el-dropdown-menu>
          <el-dropdown-item @click="handleFeedback">意见反馈</el-dropdown-item>
        </el-dropdown-menu>
        <el-dropdown-menu v-if="!isDxEnv">
          <el-dropdown-item @click="updatePassword">修改密码</el-dropdown-item>
        </el-dropdown-menu>
        <el-dropdown-menu v-if="!is804Env" v-hasPermi="['join:ip:whitelist']">
          <el-dropdown-item :loading="ipWhitelistLoading" @click="handleAddIpWhitelist">加入安全组</el-dropdown-item>
        </el-dropdown-menu>
        <el-dropdown-menu>
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <ResetPassword v-model="show" @submit="handleReset" />

    <Feedback v-model="showFeedback" />

    <UserInfoDialog v-model="showUserInfo" />
  </div>
</template>
<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import qs from 'qs'
import usePermissionStore from '@/store/modules/permission'
import useUserStore from '@/store/modules/user'
import 'virtual:svg-icons-register'
import { is804Env, isDxEnv, isMobile, LoginUrl } from '@/config'
import { findRoute, getRoutePath, pathJoin } from '@/utils'
import { resetUserPwd } from '@/api/system/user'
import { throttle } from 'lodash-es'
import { RouterItem } from './type'
import { getToken } from '@/utils/auth'
import bus from '@/utils/bus'
import { huaweiCloudIPWhitelist } from '@/services'
import UserInfoDialog from './UserInfoDialog.vue'

type NavRefs = Record<string, Element | null | ComponentPublicInstance>

const show = ref(false)
const showFeedback = ref(false)
const showUserInfo = ref(false)
const ipWhitelistLoading = ref(false)

const initAnimation = ref(false)
const navRefs = reactive<NavRefs>({})
const navTitleRefs = reactive<NavRefs>({})
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const permissionStore = usePermissionStore()
const navList = computed(() => permissionStore.navList)
const allRoutes = computed(() => permissionStore.allRoutes)
const navIndex = computed(() => permissionStore.navIndex)
const startX = computed(() => (navRefs.nav_0 as HTMLDivElement)?.offsetLeft || 0)

const routers = ref<RouterItem[]>([])
watch(
  navList,
  () => {
    routers.value = navList.value.map(i => ({ ...i, openWidth: 0, closeWidth: 0, textWidth: 0 }))
  },
  { immediate: true }
)

const transform = ref('')
const getTransform = async () => {
  await nextTick()
  const index = navIndex.value

  const preNavs = routers.value.slice(0, index)
  const width = preNavs.reduce((pre, cur) => pre + cur.closeWidth, 0)

  const margin = index > 0 ? index * 12 : 0
  transform.value = `translateX(${width + startX.value + margin}px)`
}

watch(navIndex, getTransform)

const navWidth = computed(() => {
  const el = routers.value[navIndex.value]

  if (!el) return ''
  const width = el.openWidth

  return `${width}px`
})

// 获取按钮的默认宽度
const getNavTitleWidth = () => {
  const els = Object.values(navTitleRefs)
  const navEls = Object.values(navRefs)
  routers.value.forEach((i, index) => {
    const el = els[index] as HTMLDivElement
    const navEl = navEls[index] as HTMLDivElement
    if (!el || !navEl) return
    const defaultWidth = el.style.width
    el.style.transition = 'unset !important'
    el.style.width = 'auto'

    void el.offsetHeight
    void navEl.offsetHeight

    const width = navEl.offsetWidth
    const textWidth = el.offsetWidth

    el.style.width = defaultWidth
    el.style.transition = ''

    const closeWidth = width - textWidth

    i.openWidth = width
    i.textWidth = textWidth
    i.closeWidth = closeWidth
  })
}

const handleNav = (nav: RouteRecordRaw, index: number) => {
  const { path, meta, query } = nav as any

  const { link, isMicro: micro } = meta

  if (link) {
    let q = ''
    try {
      const qMap = JSON.parse(query || '{}')
      Object.entries(qMap).forEach(([k, v]) => {
        // eslint-disable-next-line no-template-curly-in-string
        if (v === '${token}') qMap[k] = getToken()
      })

      const { $check } = qMap
      if ($check === 'email' && !userStore.email) {
        ElMessage.error('请先绑定邮箱')
        bus.emit('open-user-info-dialog')
        return
      }

      q = qs.stringify(qMap)
    } catch (error) {
      console.log(error)
    }

    const url = /https?:\/\/./.test(link) ? `${link}?${q}` : `${window.location.origin}${link}?${q}`
    window.open(url, '_blank')
    return
  }

  const children = nav.children ?? []

  if (children.length > 0) {
    const firstRoute = children[0]
    router.replace({ path: pathJoin(path, getRoutePath(firstRoute)) })
  } else {
    router.replace({ path })
  }

  permissionStore.setNavIndex(index)
}

const getIconName = ({ name }: RouteRecordRaw) => {
  if (!name || typeof name !== 'string') return ''
  return name.replace(/^\//, '').split('/')[0].toLocaleLowerCase()
}

function logout() {
  ElMessageBox.confirm('确定退登系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logOut().then(() => {
      window.location.href = LoginUrl
    })
  })
}

function updatePassword() {
  show.value = true
}

const handleReset = async ({ password }: { password: string }) => {
  const userStore = useUserStore()
  const { userId } = userStore
  await resetUserPwd(userId, password)

  // 注销重新登陆
  userStore.logOut().then(() => {
    window.location.href = LoginUrl
  })
}

const getNavIndex = (routes: RouteRecordRaw[], targetPath: string) => {
  const findIndex = (items: RouteRecordRaw[], prePath: string) => {
    for (let j = 0; j < items.length; j++) {
      let { path, children } = items[j]
      path = `${prePath}/${path}`
      if (path === targetPath) return true
      if (Array.isArray(children)) {
        if (findIndex(children, path)) return true
      }
    }
    return false
  }

  for (let i = 0; i < routes.length; i++) {
    const { children, path: prePath } = routes[i]
    if (Array.isArray(children)) {
      if (findIndex(children, prePath)) return i
    }
  }

  return -1
}

const routeChnage = async (r: RouteLocationNormalizedLoaded) => {
  if (!initAnimation.value) {
    setTimeout(() => {
      initAnimation.value = true
    }, 400)
  }

  let axIndex = routers.value.findIndex(i => i.path === r.path)
  if (axIndex === -1) {
    const hRoute = findRoute(allRoutes.value, r.path)

    if (hRoute) {
      const { query } = hRoute as any
      try {
        const { clones } = JSON.parse(query || '{}')
        axIndex = routers.value.findIndex(i => i.path === clones)
      } catch (error) {
        console.error(error)
      }
    }
  }

  if (axIndex > -1) {
    permissionStore.setNavIndex(axIndex)
    return
  }

  const moduleIndex = getNavIndex(routers.value, r.path)

  if (moduleIndex > -1) permissionStore.setNavIndex(moduleIndex)
}

function handleFeedback() {
  showFeedback.value = true
}

function handleEditUserInfo() {
  showUserInfo.value = true
}

async function handleAddIpWhitelist() {
  if (ipWhitelistLoading.value) return
  ipWhitelistLoading.value = true
  try {
    const [err, data] = await huaweiCloudIPWhitelist.postIpWhitelist()
    if (err) return
    ElMessage.success(`成功把当前IP(${data?.ip_address ?? '-'})加入安全组`)
  } catch (error) {
    console.error(error)
  } finally {
    ipWhitelistLoading.value = false
  }
}

watch(route, routeChnage, { immediate: true })

const onResize = throttle(() => {
  getNavTitleWidth()
  getTransform()
}, 100)

onMounted(() => {
  onResize()
  window.addEventListener('resize', onResize)
  bus.on('open-user-info-dialog', () => {
    showUserInfo.value = true
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  bus.off('open-user-info-dialog')
})
</script>

<style lang="scss" scoped>
.header-nav-wrapper {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .header-nav {
    flex: 1;
    height: 100%;
    display: flex;
    position: relative;
    align-items: center;
    justify-content: flex-end;

    .nav-item {
      // width: 146px;
      height: 34px;
      padding: 0 14px;
      margin-right: 12px;
      cursor: pointer;
      display: flex;
      z-index: 2;
      position: relative;
      align-items: center;
      justify-content: center;
      color: #303133;

      &:last-of-type {
        margin-right: unset;
      }

      // margin-right: 34px;
      // &:last-of-type {
      //   margin-right: unset;
      // }

      &.active {
        color: white;
      }

      .el-dropdown {
        width: 100%;
        height: 100%;
      }

      .nav-icon {
        font-size: 27px;
        margin-right: 10px;
      }

      .title-text {
        width: 100%;
        height: 100%;
        display: flex;
        font-size: 16px;
        font-weight: 600;
        align-items: center;
        justify-content: center;
        transition: all 0.4s;
      }
    }

    .bar {
      top: 50%;
      left: 0;
      width: 146px;
      height: 34px;
      z-index: 1;
      position: absolute;
      transform: translateX(0);
      transition: all 0.4s;
      margin-top: calc(-34px / 2);
      border-radius: 6px;
      background-color: var(--el-color-primary);
    }
  }

  .avatar {
    width: 42px;
    height: 42px;
    display: flex;
    overflow: hidden;
    margin-left: 35px;
    align-items: center;
    border-radius: 40px;
    justify-content: center;
    // background-color: var(--el-color-primary);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    span {
      color: white;
      font-size: 18px;
    }

    .avatar-icon {
      color: #aeb7c5;
      font-size: 42px;
    }
  }
}
</style>
