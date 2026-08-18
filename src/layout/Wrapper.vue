<template>
  <el-container v-loading="microStore.showMicroLoading" class="app-wrapper" :class="[isMobile ? 'relative' : '']">
    <el-header
      v-if="isMobile ? navList.length > 1 : true"
      class="header"
      :class="[
        microStore.showIframe ? 'show-iframe' : '',
        isMobile ? '!absolute w-full bottom-0 left-0 overflow-x-auto !px-2.5 bg-white z-999' : ''
      ]"
      :style="{ '--header-z-index': headerZIndex }"
    >
      <div v-if="!isMobile" class="left">
        <img src="/logo.svg" alt="" srcset="" class="logo" />
        <svg-icon icon-class="logo" class="logo-text" />
        <span class="slogan">开启管理新征程，智元与您同行</span>
      </div>
      <HeaderNav />
      <div v-if="microStore.headerMasks.length > 0" class="masks">
        <transition-group name="el-fade-in-linear">
          <div v-for="mask in microStore.headerMasks" :key="mask.id" class="mask" :style="{ '--header-bg-color': mask.bgColor }" />
        </transition-group>
      </div>
    </el-header>
    <el-main class="contentPage" :class="[isMobile ? '!overflow-hidden' : '', isMobile && navList.length > 1 ? 'h-[calc(100vh-62px)] !flex-none' : '']">
      <Page><slot /></Page>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { isMobile } from '@/config'
import useMicroStore from '@/store/modules/micro'
import usePermissionStore from '@/store/modules/permission'

const microStore = useMicroStore()
const permissionStore = usePermissionStore()
const navList = computed(() => permissionStore.navList)

const headerZIndex = computed(() => {
  if (!microStore.showIframe) return undefined
  return microStore.headerZIndex === 'high' ? '100' : '98'
})
</script>

<style lang="scss" scoped>
.app-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .header {
    width: 100%;
    height: 61px;
    display: flex;
    padding: 0 40px;
    position: relative;
    align-items: center;
    border-bottom: 1px solid rgba($color: #ced7d6, $alpha: 0.8);
    background-color: rgb(245, 246, 250);

    &.show-iframe {
      top: 0;
      left: 0;
      z-index: var(--header-z-index);
      position: fixed;
      background-color: white;
    }

    .masks {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 100;
      .mask {
        &:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: calc(100% + 1px);
          z-index: var(--header-z-index);
          background-color: var(--header-bg-color, #10182899);
        }
      }
    }

    .left {
      height: 100%;
      display: flex;
      line-height: 1;
      align-items: center;

      .logo {
        width: 30px;
        height: auto;
        margin-right: 8px;
      }

      .logo-text {
        width: 83px;
        height: 39px;
      }

      .slogan {
        color: var(--el-color-info);
        font-size: 18px;
        margin-left: 20px;
      }
    }
  }

  .contentPage {
    padding: unset;
    overflow: hidden;
  }
}
</style>
