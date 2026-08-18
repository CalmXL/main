<template>
  <div v-if="nav.meta?.icon && nav.meta.icon !== '#'">
    <svg-icon
      v-if="/^nav-/.test(nav.meta.icon)"
      :icon-class="nav.meta.icon"
      :style="{ fontSize: `${size}px` }"
      :class="[size ? '' : /ai$/i.test(nav.meta.icon) ? 'text-4' : 'text-5']"
    />
    <el-icon v-else :size="size">
      <component :is="nav.meta.icon" />
    </el-icon>
  </div>
</template>
<script setup lang="ts">
import { RouteRecordRaw } from 'vue-router'

interface Props {
  nav: RouteRecordRaw
}
const props = defineProps<Props>()

const size = computed(() => {
  const { query } = (props.nav.meta ?? {}) as Record<string, any>
  const { iconSize } = query ?? {}

  return iconSize
})
</script>

<style lang="scss" scoped></style>
