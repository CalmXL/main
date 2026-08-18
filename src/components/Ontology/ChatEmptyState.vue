<script setup lang="ts">
/**
 * 聊天空状态组件
 * 当聊天记录为空时展示的功能介绍和快捷操作界面
 */

// 功能卡片数据接口
interface FeatureCard {
  id: string
  title: string
  description: string
  icon: string
  iconColor: string
  bgColor: string
  borderColor: string
  hoverBorderColor: string
}

// 快捷标签数据接口
interface QuickTag {
  id: string
  label: string
  message: string
}

const emit = defineEmits<{
  /** 点击功能卡片时触发，传递示例消息 */
  selectExample: [message: string]
}>()

// 功能卡片数据
const featureCards = ref<FeatureCard[]>([
  {
    id: 'daily-report',
    title: '业务数据查询',
    description: '帮我查询AI事业部26年新增项目',
    icon: 'i-ep-document',
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-gray-100 dark:border-gray-700',
    hoverBorderColor: 'hover:border-primary-200 dark:hover:border-primary-800',
  },
  {
    id: 'rule-check',
    title: '经营情况分析',
    description: '公司25年Q3季度经营情况',
    icon: 'i-ep-warning',
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-gray-100 dark:border-gray-700',
    hoverBorderColor: 'hover:border-warning-200 dark:hover:border-warning-800',
  },
  {
    id: 'stakeholder-flow',
    title: '数据写入与落表',
    description: 'CRM二期项目经理变更为李四，进入验收阶段',
    icon: 'i-ep-refresh',
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-gray-100 dark:border-gray-700',
    hoverBorderColor: 'hover:border-primary-200 dark:hover:border-primary-800',
  },
])

// 快捷标签数据
const quickTags = ref<QuickTag[]>([
  { id: 'travel', label: '查询3月份云智部门合同额', message: '查询3月份云智部门合同额' },
  { id: 'contract', label: '查询26年3月份外包付款', message: '查询26年3月份外包付款' },
  { id: 'summary', label: '帮我查询电信项目的外包成本', message: '帮我查询电信项目的外包成本' },
])

// 处理卡片点击
function handleCardClick(card: FeatureCard) {
  if (card.description) emit('selectExample', card.description)
}

// 处理快捷标签点击
function handleQuickTagClick(message: string) {
  emit('selectExample', message)
}
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center pb-8 overflow-auto pr-4">
    <!-- 标题和描述 -->
    <div class="text-center mb-8">
      <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
        欢迎使用 AI 运营助手
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
        我是您的企业级本体助手，支持自然语言解析并自动同步业务数据。
      </p>
    </div>

    <!-- 功能卡片 -->
    <div class="w-full max-w-xs space-y-3 mb-8">
      <div
        v-for="card in featureCards"
        :key="card.id"
        class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border transition-all duration-200 group"
        :class="[card.borderColor, card.hoverBorderColor, card.description ? 'cursor-pointer hover:shadow-md' : '']"
        @click="handleCardClick(card)"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            :class="card.bgColor"
          >
            <div class="text-lg" :class="[card.icon, card.iconColor]" />
          </div>
          <div>
            <div class="text-sm font-medium text-gray-800 dark:text-gray-100">
              {{ card.title }}
            </div>
            <div
              class="text-xs text-gray-400 dark:text-gray-500"
              :class="card.description ? '' : ''"
            >
              {{ card.description }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部提示和快捷按钮 -->
    <div class="text-center">
      <p class="text-xs text-gray-400 dark:text-gray-500 mb-3">
        您可以这样问：
      </p>
      <div class="flex flex-wrap justify-center gap-2">
        <el-tag
          v-for="tag in quickTags"
          :key="tag.id"
          size="small"
          class="cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-500 transition-colors"
          @click="handleQuickTagClick(tag.message)"
        >
          {{ tag.label }}
        </el-tag>
      </div>
    </div>
  </div>
</template>
