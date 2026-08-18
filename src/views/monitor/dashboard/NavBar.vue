<template>
  <div class="tab-container">
    <div class="tab-nav">
      <div
        v-for="item in timeTypes"
        :key="item.value"
        :class="['tab-item', activeType === item.value ? 'active' : '']"
        @click="handleTabChange(item.value)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  activeType: {
    type: String,
    default: 'day'
  }
})

const emit = defineEmits(['update:activeType'])

const timeTypes = [
  {
    name: '日',
    value: 'day'
  },
  {
    name: '周',
    value: 'week'
  },
  {
    name: '月',
    value: 'month'
  }
]

const handleTabChange = (value: string) => {
  emit('update:activeType', value)
}
</script>

<style lang="scss" scoped>
.tab-container {
  margin: 0px 0 10px 0;
}

.tab-nav {
  display: flex;
  border-radius: 4px;
  overflow: hidden;
  display: inline-flex;
}

.tab-item {
  width: 46px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  border-radius: 20px;
  margin-right: 20px;
  background-color: #F6F8FD;

  &:hover {
    color: #1890ff;
  }

  &.active {
    background-color: #1890ff;
    color: white;

    &:hover {
      color: white;
    }
  }
}
</style>
