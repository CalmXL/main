<template>
  <div
    class="stats-card"
    :class="`stats-card--${variant}`"
    @click="handleClick"
  >
    <div class="stats-card__decoration" />
    <div class="stats-card__content">
      <div class="stats-card__header">
        <div class="stats-card__title-wrapper">
          <span class="stats-card__title">{{ title }}</span>
          <span v-if="trend" class="stats-card__trend" :class="trend > 0 ? 'stats-card__trend--up' : 'stats-card__trend--down'">
            {{ trend > 0 ? '↑' : '↓' }} {{ Math.abs(trend) }}%
          </span>
        </div>
        <div class="stats-card__icon-wrapper" :class="`stats-card__icon-wrapper--${variant}`">
          <el-icon :size="24" class="stats-card__icon">
            <component :is="icon" />
          </el-icon>
        </div>
      </div>
      <div class="stats-card__body">
        <div class="stats-card__value-container">
          <span class="stats-card__value">{{ animatedValue }}</span>
          <span v-if="suffix" class="stats-card__suffix">{{ suffix }}</span>
        </div>
      </div>
      <div v-if="expanded" class="stats-card__expanded">
        <slot name="expanded">
          <div class="stats-card__details">
            <div class="stats-card__detail-item">
              <span class="stats-card__detail-label">详情信息</span>
              <span class="stats-card__detail-value">点击查看更多</span>
            </div>
          </div>
        </slot>
      </div>
    </div>
    <transition name="expand">
      <div v-if="expanded" class="stats-card__expanded-content">
        <slot name="detail" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface Props {
  title: string
  value: number | string
  icon: any
  trend?: number
  suffix?: string
  variant?: 'primary' | 'warning' | 'info' | 'success'
  expandable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  trend: undefined,
  suffix: '',
  variant: 'primary',
  expandable: false
})

const emit = defineEmits<{(e: 'click'): void
}>()

const expanded = ref(false)
const animatedValue = ref('0')
const animationDuration = 800

const animateNumber = (targetValue: number) => {
  if (typeof props.value === 'string') {
    animatedValue.value = props.value
    return
  }

  const startTime = Date.now()
  const startValue = parseFloat(animatedValue.value.replace(/[KM,]/g, '')) || 0
  const endValue = targetValue

  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / animationDuration, 1)

    const easeOutQuart = 1 - (1 - progress) ** 4
    const currentValue = startValue + (endValue - startValue) * easeOutQuart

    if (typeof props.value === 'number' && props.value >= 1000000) {
      animatedValue.value = `${(currentValue / 1000000).toFixed(1)}M`
    } else if (typeof props.value === 'number' && props.value >= 1000) {
      animatedValue.value = `${(currentValue / 1000).toFixed(1)}K`
    } else {
      animatedValue.value = Math.floor(currentValue).toLocaleString()
    }

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}

watch(() => props.value, newVal => {
  if (typeof newVal === 'number') {
    animateNumber(newVal)
  } else {
    animatedValue.value = newVal
  }
}, { immediate: true })

const handleClick = () => {
  if (props.expandable) {
    expanded.value = !expanded.value
  }
  emit('click')
}
</script>

<style lang="scss" scoped>
.stats-card {
  position: relative;
  min-height: 140px;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.04),
    0 1px 2px rgba(0, 0, 0, 0.02);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--card-color, #409EFF) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 8px 16px rgba(0, 0, 0, 0.08),
      0 2px 4px rgba(0, 0, 0, 0.04);
    border-color: rgba(0, 0, 0, 0.08);

    &::before {
      opacity: 1;
    }

    .stats-card__icon-wrapper {
      transform: scale(1.05);
    }

    .stats-card__value {
      transform: scale(1.02);
    }
  }

  &--primary {
    --card-color: #409EFF;
  }

  &--warning {
    --card-color: #E6A23C;
  }

  &--info {
    --card-color: #909399;
  }

  &--success {
    --card-color: #67C23A;
  }

  &__decoration {
    position: absolute;
    top: -50%;
    right: -20%;
    width: 200px;
    height: 200px;
    background: radial-gradient(
      circle,
      var(--card-color, #409EFF) 0%,
      transparent 70%
    );
    opacity: 0.04;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  &:hover &__decoration {
    opacity: 0.08;
  }

  &__content {
    position: relative;
    z-index: 1;
    padding: 24px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  &__title-wrapper {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__title {
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.45);
    letter-spacing: 0.3px;
  }

  &__trend {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 500;

    &--up {
      color: #52c41a;
      background: rgba(82, 196, 26, 0.1);
    }

    &--down {
      color: #ff4d4f;
      background: rgba(255, 77, 79, 0.1);
    }
  }

  &__icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);

    &--primary {
      background: linear-gradient(135deg, rgba(64, 158, 255, 0.15) 0%, rgba(64, 158, 255, 0.05) 100%);
      color: #409EFF;
    }

    &--warning {
      background: linear-gradient(135deg, rgba(230, 162, 60, 0.15) 0%, rgba(230, 162, 60, 0.05) 100%);
      color: #E6A23C;
    }

    &--info {
      background: linear-gradient(135deg, rgba(144, 147, 153, 0.15) 0%, rgba(144, 147, 153, 0.05) 100%);
      color: #909399;
    }

    &--success {
      background: linear-gradient(135deg, rgba(103, 194, 58, 0.15) 0%, rgba(103, 194, 58, 0.05) 100%);
      color: #67C23A;
    }
  }

  &__body {
    flex: 1;
    display: flex;
    align-items: flex-end;
  }

  &__value-container {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  &__value {
    font-size: 36px;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.85);
    letter-spacing: -1px;
    line-height: 1;
    transition: transform 0.3s ease;
  }

  &__suffix {
    font-size: 18px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.45);
    letter-spacing: 0.5px;
  }

  &__expanded-content {
    padding: 0 24px 24px;
    animation: slideDown 0.3s ease;
  }
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .stats-card {
    min-height: 120px;

    &__content {
      padding: 20px;
    }

    &__icon-wrapper {
      width: 40px;
      height: 40px;
    }

    &__value {
      font-size: 32px;
    }
  }
}
</style>
