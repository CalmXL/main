<template>
  <Wrapper>
    <AppMain />
  </Wrapper>
</template>
<script setup lang="ts">
import Wrapper from '@/layout/Wrapper.vue'
import { AppMain } from './components'
</script>

<style lang="scss" scoped>
.app-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .header {
    width: 100%;
    height: 72px;
    display: flex;
    padding: 0 40px;
    align-items: center;
    border-bottom: 1px solid rgba($color: #ced7d6, $alpha: 0.8);

    .left {
      height: 100%;
      display: flex;
      line-height: 1;
      align-items: center;

      .logo {
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
