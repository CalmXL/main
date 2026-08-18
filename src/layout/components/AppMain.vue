<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="(tagsViewStore.cachedViews as any)">
          <component :is="Component" v-if="!route.meta.link" />
        </keep-alive>
      </transition>
    </router-view>
    <iframe-toggle />
  </section>
</template>

<script setup lang="ts">
import { RouteRecordRaw } from 'vue-router'
import iframeToggle from './IframeToggle/index.vue'
import useTagsViewStore from '@/store/modules/tagsView'
import usePermissionStore from '@/store/modules/permission'

const route = useRoute()
const tagsViewStore = useTagsViewStore()
const permissionStore = usePermissionStore()

function getRoute(allRoutes: RouteRecordRaw[], path: string) {
  for (let i = 0; i < allRoutes.length; i++) {
    const { path: p } = allRoutes[i]
    if (p === path) return allRoutes[i]
  }
  return null
}

// const showGroup = computed(() => {
//   try {
//     const routeInfo = (getRoute(permissionStore.allRoutes, route.path) ?? {}) as any
//     console.log(JSON.parse(routeInfo.query || '{}').group || routeInfo.path || route.path)
//     return JSON.parse(routeInfo.query || '{}').group || routeInfo.path || route.path
//   } catch (error) {
//     console.error(error)
//     return null
//   }
// })
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  // height: calc(100vh - 50px);
  height: 100%;
  width: 100%;
  // position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 17px;
  }
}
</style>
