import { computed, useSlots } from 'vue'
import {
  getDividerClassNames,
  getDividerRole,
  needsAriaOrientation,
} from '@lh-ui/share/core/divider'
import { sxToStyle } from '@lh-ui/share/core/shared'
import type { LhDividerResolvedProps } from './types'

/**
 * Divider 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】无。伪元素分割线两端均支持，文案由 `<text>` 承载；
 * 竖向文案的纵向布局由 share 的 scss 承载，胶水层只判定有无子节点。
 */
export function useLhDivider(props: LhDividerResolvedProps) {
  const slots = useSlots()

  const hasContent = computed(() => !!slots.default)

  const dividerClass = computed(() =>
    getDividerClassNames({
      direction: props.direction,
      dashed: props.dashed,
      borderStyle: props.borderStyle,
      hasContent: hasContent.value,
      labelPosition: props.labelPosition,
    }),
  )

  const role = computed(() => getDividerRole(hasContent.value))

  const ariaOrientation = computed(() =>
    needsAriaOrientation(props.direction, hasContent.value) ? 'vertical' : undefined,
  )

  const dividerStyle = computed(() => sxToStyle(props.sx ?? {}))

  return { hasContent, dividerClass, role, ariaOrientation, dividerStyle }
}
