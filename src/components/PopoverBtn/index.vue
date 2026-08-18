<template>
  <div class="popover-btn" />
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
  .popover-btn {
    margin: auto;
    position: relative;
    cursor: pointer;
    color: #1890ff;
    background: #ffffff;
    opacity: 1;
    box-sizing: 'border-box';
    width: 42px;
    height: 26px;
    border-radius: 18px;
    border: 1px solid #e8ecf4;
    // box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
    &::before {
      content: '';
      position: absolute;
      left: 13px;
      top: 10px;
      width: 6px;
      height: 6px;
      border-radius: 100%;
      opacity: 1;
      background: #99a2bb;
    }
    &::after {
      content: '';
      position: absolute;
      left: 23px;
      top: 10px;
      width: 6px;
      height: 6px;
      border-radius: 100%;
      opacity: 1;
      background: #99a2bb;
    }
  }
</style>
