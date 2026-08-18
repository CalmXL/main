<template>
  <div class="icon-body">
    <el-input
      v-model="iconName"
      style="position: relative"
      clearable
      placeholder="请输入图标名称"
      @clear="filterIcons"
      @input="filterIcons"
    >
      <template #suffix><i class="el-icon-search el-input__icon" /></template>
    </el-input>
    <div class="icon-list grid gap-2 grid-cols-4 p-2">
      <div
        v-for="(item, index) in iconList"
        :key="index"
        class="flex flex-col items-center p-3 border-1 border-gray-200 border-solid rounded-[5px] cursor-pointer gap-2"
        @click="selectedIcon(item)"
      >
        <el-icon v-if="item.type === 'element'" size="24">
          <component :is="item.name" />
        </el-icon>
        <svg-icon v-else class="text-5" :icon-class="item.name" />
        <span class="text-3">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as iconsComponents from '@element-plus/icons-vue'

const modules = import.meta.glob('@/assets/icons/svg/nav/*.svg')

type IconItem = {
  type: 'element' | 'custom'
  name: string
}

// 自定义图标
const customIcons: IconItem[] = Object.keys(modules)
  .map(item => item.split('/').pop()?.split('.')?.[0])
  .filter(Boolean)
  .map(item => ({ type: 'custom', name: `nav-${item}` as string }))

const iconsList: IconItem[] = Object.keys(iconsComponents).map(item => ({ type: 'element', name: item }))
const icons: IconItem[] = [...customIcons, ...iconsList]

const iconName = ref('')
const iconList = ref<IconItem[]>(icons)
const emit = defineEmits(['selected'])

function filterIcons() {
  iconList.value = icons
  if (iconName.value) {
    iconList.value = icons.filter(item => item.name.indexOf(iconName.value) !== -1)
  }
}

function selectedIcon(name: any) {
  emit('selected', name)
  document.body.click()
}

function reset() {
  iconName.value = ''
  iconList.value = icons
}

defineExpose({
  reset
})
</script>

<style lang="scss" scoped>
.icon-body {
  width: 100%;
  padding: 10px;
  .icon-list {
    max-height: 300px;
    overflow-y: scroll;
    // div {
    //   height: 30px;
    //   line-height: 30px;
    //   margin-bottom: -5px;
    //   cursor: pointer;
    //   width: 33%;
    //   float: left;
    // }
    // span {
    //   display: inline-block;
    //   vertical-align: -0.15em;
    //   fill: currentColor;
    //   overflow: hidden;
    // }
  }
}
</style>
