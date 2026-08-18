<template>
  <div class="nav-wrapper">
    <el-scrollbar class="h-full pr-5">
      <NavItem :nav-list="navList" :prepath="prepath" />
    </el-scrollbar>
  </div>
</template>
<script setup lang="ts">
import { PropType } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const { navList, prepath } = defineProps({
  prepath: { type: String, default: '' },
  navList: { type: Array as PropType<RouteRecordRaw[]>, default: () => [] }
})
</script>

<style lang="scss" scoped>
.nav-wrapper {
  width: 252px;
  height: 100%;
  padding: 20px 0 20px 20px;
  border-radius: 16px;
  background-color: white;
  box-shadow: 0px 0px 28px 0px rgba(0, 14, 67, 0.1);
}
</style>
