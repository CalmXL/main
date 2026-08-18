<template>
  <div class="w-full h-full relative flex">
    <MicroNavList :nav-width="navWidth" />
    <div class="h-full flex-shrink-0" :style="{ marginLeft: `${navWidth}px` }" />
    <router-view />
  </div>
</template>
<script setup lang="ts">

const navWidth = ref(272)
</script>

<style lang="scss" scoped></style>
