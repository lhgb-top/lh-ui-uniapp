import { computed } from 'vue'
import { formatStatisticValue, getStatisticClassNames } from '@lh-ui/share/core/statistic'
import { sxToStyle } from '@lh-ui/share/core/shared'
import type { LhStatisticResolvedProps } from './types'

/**
 * Statistic 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】纯展示组件，全端可用：格式化逻辑完全复用 share core 纯函数，
 * 不触及任何平台 API。若后续引入数字滚动动画（count-up）：MP 下 setInterval /
 * requestAnimationFrame 均可用，但 transitionend 不可靠，动画收尾须用 setTimeout
 * 对齐时长（与 message/loading 的进出动画同款处理）。
 */
export function useLhStatistic(props: LhStatisticResolvedProps) {
  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const displayValue = computed(() =>
    formatStatisticValue(props.value, {
      precision: props.precision,
      separator: props.separator,
    }),
  )

  const classNames = computed(() => getStatisticClassNames())

  return {
    sxStyle,
    displayValue,
    classNames,
  }
}
