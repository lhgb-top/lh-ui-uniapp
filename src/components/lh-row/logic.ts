import { computed } from 'vue'
import { getGridRowClassNames } from '@lh-ui/share/core/grid'
import { sxToStyle } from '@lh-ui/share/core/shared'
import type { LhRowResolvedProps } from './types'

/**
 * Row 栅格容器胶水（逻辑对齐 plus 仓）
 *
 * 类名映射全部走 share core 的 getGridRowClassNames（justify / align 各自映射到
 * 独立修饰类，未知值不产脏类），本仓只做 computed 包裹 + customClass 拼接 + sx 求值。
 * 【uni-app 差异】无： Row 是纯布局容器，无度量、无弹层、无 document 依赖。
 */
export function useLhRow(props: LhRowResolvedProps) {
  const rowClasses = computed(() => [
    ...getGridRowClassNames({
      justify: props.justify,
      align: props.align,
      wrap: props.wrap,
    }),
    props.customClass,
  ])

  const rowStyle = computed(() => {
    const style: Record<string, string> = { ...sxToStyle(props.sx ?? {}) }
    // gutter 用负外边距抵消子列内边距（横向）/ 行间距（纵向）
    if (props.gutter) {
      const gutter = typeof props.gutter === 'number' ? props.gutter : props.gutter[0]
      style.marginInline = `-${gutter / 2}px`
    }
    return style
  })

  return {
    rowClasses,
    rowStyle,
  }
}
