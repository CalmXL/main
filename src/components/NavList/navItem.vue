<template>
  <el-menu class="nav-item-wrapper">
    <el-menu-item v-for="(nav, index) in navList" :key="nav.path" :index="nav.path" class="nav-item">
      <template v-if="Array.isArray(nav.children) && nav.children.length > 0">
        <el-sub-menu :index="nav.path">
          <template #title>
            <div class="nav-box">
              <span :style="{ paddingLeft: `${level * 16}px` }">
                {{ nav.meta?.title }}
              </span>
            </div>
          </template>
          <NavItem :nav-list="nav.children" :prepath="`${props.prepath}/${nav.path}`" :level="level + 1" />
        </el-sub-menu>
      </template>
      <template v-else>
        <div class="nav-box" :class="{ active: active === index }" @click="handleNav(nav, index)">
          <span :style="{ paddingLeft: `${level * 16}px` }">
            {{ nav.meta?.title }}
          </span>
        </div>
      </template>
    </el-menu-item>
  </el-menu>
</template>
<script lang="ts" setup>
import { PropType } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const route = useRoute()
const router = useRouter()
const props = defineProps({
  level: { type: Number, default: 0 },
  prepath: { type: String, default: '' },
  navList: { type: Array as PropType<RouteRecordRaw[]>, default: () => [] }
})
const findIndex = () => props.navList.findIndex(i => `${props.prepath}/${i.path}` === route.path)

const active = ref(findIndex())

const handleNav = (nav: RouteRecordRaw, index: number) => {
  active.value = index
  const path = `${props.prepath}/${nav.path}`

  router.replace({ path })
}
</script>

<style lang="scss" scoped>
.nav-item-wrapper {
  border-right: unset;
}

.nav-item {
  width: 100%;
  color: #333;
  height: 46px;
  cursor: pointer;
  padding: unset !important;
  position: relative;
  font-size: 14px;
  margin-top: 4px;

  .nav-box {
    width: 100%;
    height: 100%;
    padding: 0 10px;
    display: flex;
    z-index: 2;
    position: relative;
    align-items: center;
    justify-content: flex-start;

    &::before {
      content: '';
      top: 0px;
      left: 0px;
      width: 0;
      height: 100%;
      opacity: 0;
      position: absolute;
      transition: all 0.4s;
      border-radius: 8px;
      background-image: linear-gradient(270deg, rgba(61, 119, 255, 0.3) 0%, rgba(255, 255, 255, 0.3) 86%);
    }

    &:hover {
      &::before {
        width: 100%;
        opacity: 1;
      }
    }

    &.active {
      color: var(--el-color-primary);
      &::before {
        opacity: 1;
        width: 100% !important;
      }
    }
  }

  &:hover {
    background-color: unset;
  }

  &:first-of-type {
    margin: unset;
  }

  ::v-deep(.el-sub-menu) {
    width: 100%;
    height: 100%;

    & > .el-sub-menu__title {
      width: 100%;
      height: 100%;
      padding: unset !important;

      &:hover {
        background-color: unset;
      }

      .el-sub-menu__icon-arrow {
        width: unset;
      }
    }
  }
}
</style>
