<template>
  <div class="page-content">
    <div v-if="$slots.top" class="top-info">
      <slot name="top" />
    </div>
    <div class="content-box">
      <slot />
    </div>
    <div v-if="$slots.floor" class="page-floor">
      <slot name="floor" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.page-content {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 16px 20px 16px 16px;
  border-radius: 10px 10px 0 0;
  flex-direction: column;
  background-color: white;

  .content-box {
    flex: 1;
    overflow: hidden;
  }
}
</style>
