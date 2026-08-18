<template>
  <div class="mb-10px">
    <div class="inline-flex rounded-4px overflow-hidden">
      <div
        v-for="item in timeTypes"
        :key="item.value"
        :class="[
          'w-46px h-40px flex justify-center items-center cursor-pointer transition-all duration-300 text-14px rounded-20px mr-20px',
          activeType === item.value
            ? 'bg-[#1890ff] text-white hover:text-white'
            : 'bg-[#F6F8FD] hover:text-[#1890ff]'
        ]"
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
