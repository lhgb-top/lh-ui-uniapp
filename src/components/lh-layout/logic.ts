import { computed, provide, ref } from 'vue'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { LH_LAYOUT_KEY } from './types'
import type { LhLayoutResolvedProps } from './types'

/**
 * Layout 组件胶水（逻辑对齐 plus 仓）
 *
 * 布局组件没有 share core 模块（纯 CSS 布局），逻辑层只做两件事：
 * 1. provide/inject 上下文——Aside 登记后父级自动切换为垂直方向
 * 2. 方向 class 与 sx 内联样式的 computed
 * 【uni-app 差异】与 plus 相同的 provide/inject 机制在 uni-app（Vue 3 内核）下可用。
 */
export function useLhLayout(props: LhLayoutResolvedProps) {
  const hasAside = ref(false)

  provide(LH_LAYOUT_KEY, {
    registerAside: () => {
      hasAside.value = true
    },
    unregisterAside: () => {
      hasAside.value = false
    },
  })

  const layoutClasses = computed(() => {
    const vertical = props.direction === 'vertical' || hasAside.value
    return [
      'lh-layout',
      vertical ? 'lh-layout--vertical' : 'lh-layout--horizontal',
      props.customClass,
    ]
  })

  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  return {
    layoutClasses,
    sxStyle,
  }
}
