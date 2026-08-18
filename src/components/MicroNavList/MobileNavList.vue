<template>
  <div />
</template>
<script setup lang="ts">
import { RouteRecordRaw } from 'vue-router'

const props = defineProps({
  routerList: { type: Array as PropType<RouteRecordRaw[]>, default: () => [] },
  activeMenuInfo: { type: Object as PropType<RouteRecordRaw>, default: () => ({}) }
})

</script>

<style lang="scss" scoped>

</style>
