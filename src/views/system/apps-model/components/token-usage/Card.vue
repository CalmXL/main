<template>
  <div class="relative h-full p-20px bg-[#F6F8FD] rounded-16px">
    <div class="absolute left-0 top-25px w-5px h-15px bg-[#0B75FF] rounded-r-2px" />
    <div class="flex justify-between items-center mb-18px">
      <div class="text-18px font-bold text-[#1F1F1F]">
        {{ title }}
      </div>
      <div class="flex items-center gap-10px">
        <slot name="extra" />
        <div v-if="date" class="text-14px">
          {{ date }}
        </div>
      </div>
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
