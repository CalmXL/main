import { remFontSize, useRem } from '@/config'

let rootFont = 14
function setRem() {
  if (!useRem) return
  const scale = 1 // window.innerWidth / 1920
  rootFont = remFontSize * Math.min(scale, 2)
  document.documentElement.style.fontSize = `${rootFont}px`
}

setRem()
window.addEventListener('resize', () => {
  setRem()
})

export function px2rem1920(px: number) {
  return px / remFontSize
}

export function px2rem(px: number) {
  return `${px / rootFont}rem`
}

export function rem2px(rem: number) {
  return rem * rootFont
}

/**
 * @description 根据设计稿转换当前屏幕单位
 */
export function px2def(px: number) {
  return rem2px(px2rem1920(px))
}
