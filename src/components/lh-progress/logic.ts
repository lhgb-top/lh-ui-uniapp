import { computed } from 'vue'
import {
  clampPercent,
  resolveStatus,
  getProgressClassNames,
  getProgressColor,
  formatPercentText,
} from '@lh-ui/share/core/progress'
import { sxToStyle } from '@lh-ui/share/core/shared'
import type { LhProgressResolvedProps } from './types'

/** circle 型告警只报一次，避免列表场景刷屏 */
let circleWarned = false

/**
 * Progress 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】首版仅 line 型：小程序对 svg 支持有限，circle 环留二期。
 * 传 type='circle' 时按 line 渲染，开发期告警一次（不静默降级）。
 */
export function useLhProgress(props: LhProgressResolvedProps) {
  const clamped = computed(() => clampPercent(props.percentage))

  const status = computed(() => resolveStatus(clamped.value, props.status))

  const trackColor = computed(() => getProgressColor(status.value, props.color, clamped.value))

  const text = computed(() =>
    props.format ? props.format(clamped.value) : formatPercentText(clamped.value),
  )

  /** 实际渲染型：circle 在本仓降级为 line 并告警 */
  const effectiveType = computed<'line'>(() => {
    if (props.type === 'circle' && import.meta.env.DEV && !circleWarned) {
      circleWarned = true
      console.warn(
        '[lh-ui/uniapp] lh-progress 的 circle 型暂未实现（小程序 svg 支持有限），已按 line 渲染。',
      )
    }
    return 'line'
  })

  const progressClass = computed(() =>
    getProgressClassNames({
      type: effectiveType.value,
      status: status.value,
      showText: props.showText,
      strokeWidth: props.strokeWidth,
      width: props.width,
    }),
  )

  const progressStyle = computed(() => sxToStyle(props.sx ?? {}))

  const barStyle = computed(() => ({
    width: `${clamped.value}%`,
    backgroundColor: trackColor.value,
  }))

  return {
    clamped,
    status,
    progressClass,
    progressStyle,
    barStyle,
    text,
  }
}
