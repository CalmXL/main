<script setup lang="ts">
const visible = defineModel<boolean>()
</script>

<template>
  <el-dialog
    v-model="visible"
    v-bind="$attrs"
    class="!rounded-2.5 !pt-0 [&_.el-dialog\_\_title]:text-[#333] [&_.el-dialog\_\_title]:font-bold ![&_.el-dialog\_\_headerbtn]:top-2 ![&_.el-dialog\_\_header]:pt-5"
  >
    <template #header>
      <slot name="header" />
    </template>
    <template #default>
      <slot />
    </template>
    <template #footer>
      <slot name="footer" />
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.el-dialog) {
  @apply rounded-2.5;

  .el-dialog__title {
    @apply text-[#333] font-bold;
  }

  .el-dialog__headerbtn {
    @apply top-2;
  }

  .el-dialog__header {
    @apply pt-5;
  }
}
</style>
