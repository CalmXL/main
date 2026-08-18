<script setup lang="ts">
import Vditor from 'vditor'
import { CDN_URL, isProd } from '@/config'
import 'vditor/dist/index.css'

const props = defineProps<{
  modelValue: string
}>()

const previewRef = ref<HTMLDivElement | null>(null)

function renderMarkdown() {
  if (!previewRef.value) return
  Vditor.preview(previewRef.value, props.modelValue, { mode: 'light', cdn: !isProd ? '/vditor' : `${CDN_URL}/vditor@3.11.2` })
}

onMounted(() => {
  renderMarkdown()
})

watch(() => props.modelValue, () => {
  renderMarkdown()
})
</script>

<template>
  <div ref="previewRef" />
</template>

<style lang="scss" scoped>

</style>
