import { computed } from 'vue'
import { buildDescriptionRows, getDescriptionsClassNames } from '@lh-ui/share/core/descriptions'
import { sxToStyle } from '@lh-ui/share/core/shared'
import type { LhDescriptionsResolvedProps } from './types'

/**
 * Descriptions 组件胶水（逻辑对齐 plus 仓）
 *
 * 行结构由 share core 纯函数 buildDescriptionRows 产出（span 归一化、钳制、换行、补位），
 * 本仓只做响应式包装 + 单元格宽度计算。
 * 【uni-app 差异】与 plus 相同的 computed 机制在 uni-app（Vue 3 内核）下可用。
 */
export function useLhDescriptions(props: LhDescriptionsResolvedProps) {
  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const rows = computed(() => buildDescriptionRows(props.items, props.column))

  const descriptionsClasses = computed(() => [
    ...getDescriptionsClassNames({ column: props.column, border: props.border }),
    props.customClass,
  ])

  // label 与 content 各占单元格宽度的一半（与 plus 同一套计算）
  function labelBasis(): number {
    return 100 / (props.column * 2)
  }

  function contentBasis(span: number): number {
    return (span * 100) / props.column - labelBasis()
  }

  return {
    sxStyle,
    rows,
    descriptionsClasses,
    labelBasis,
    contentBasis,
  }
}
