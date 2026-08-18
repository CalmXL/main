<template>
  <div class="card">
    <div class="header">
      <div class="title">{{ title }}</div>
      <div v-if="date" class="date">{{ date }}</div>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: String,
  date: String
})
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  height: 100%;
  padding: 20px;
  background-color: #F6F8FD;
  border-radius: 16px;

  &::after {
    content: '';
    position: absolute;
    left: 0px;
    top: 25px;
    width: 5px;
    height: 15px;
    background-color: #0B75FF;
    border-radius: 0px 2px 2px 0px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 18px;

    .title {
      font-size: 18px;
      font-weight: bold;
      color: #1F1F1F
    }

    .date {
      font-size: 14px;
    }
  }
}
</style>
