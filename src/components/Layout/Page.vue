<template>
  <div class="page" :class="{ micro: isMicroPath, isFullContent: !hasChildren }">
    <div class="page-bg">
      <div class="page-box">
        <div v-if="hasChildren && !isMicroPath" class="page-nav">
          <NavList :nav-list="menuInfo.children?.filter(i => !i.hidden) ?? []" :prepath="menuInfo.path" />
        </div>
        <div class="page-content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import usePermissionStore from '@/store/modules/permission'

const route = useRoute()
const menuInfo = computed(() => permissionStore.activeMenuInfo)
const permissionStore = usePermissionStore()

const hasChildren = computed(() => Array.isArray(menuInfo.value.children) && menuInfo.value.children.length > 0)
const isMicroPath = computed(() => {
  const { useMicro } = (route.meta?.query || {}) as Record<string, boolean>

  const isMicro = route.meta?.isMicro === '0' || useMicro
  return isMicro
})
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  background-color: #ebeef6;
  // background-image: linear-gradient(-90deg, #fdffff 0%, #fff 80%);

  &.micro {
    background: unset;

    .page-bg {
      background: unset;
      .page-box {
        padding: unset;
      }
      .page-content {
        margin-left: unset;
      }
    }

    .page-bg {
      .page-content {
        box-shadow: unset;
        background: unset;
        border-radius: unset;
      }
    }
  }

  .page-bg {
    width: 100%;
    height: 100%;
    background-size: 100% auto;
    background-image: url(/img/page_bg.webp);
    background-repeat: no-repeat;
    background-position: 0 0;

    .page-box {
      width: 100%;
      height: 100%;
      display: flex;
      padding: 20px;
      overflow: hidden;
    }

    .page-nav {
      height: 100%;
    }

    .page-content {
      flex: 1;
      height: 100%;
      overflow: hidden;
      margin-left: 20px;
      border-radius: 16px;
      background-color: white;
      box-shadow: 0px 0px 28px 0px rgba(0, 14, 67, 0.1);
    }
  }
}
</style>
