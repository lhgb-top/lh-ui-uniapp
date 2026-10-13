import { computed } from 'vue'
import { getSkeletonItemClassNames, getSkeletonAria } from '@lh-ui/share/core/skeleton'
import { sxToStyle } from '@lh-ui/share/core/shared'
import type { LhSkeletonItemResolvedProps } from '../lh-skeleton/types'

/**
 * SkeletonItem 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】无。类名走 share 的 getSkeletonItemClassNames（plus 是模板内联拼接，
 * 本仓统一调 core 更贴合「core 不拷贝」红线）；占位块对辅助技术隐藏。
 */
export function useLhSkeletonItem(props: LhSkeletonItemResolvedProps) {
  const itemClass = computed(() =>
    getSkeletonItemClassNames(props.variant, props.animated),
  )

  const itemStyle = computed(() => sxToStyle(props.sx ?? {}))

  /**
   * 占位块的无障碍属性包（share 的 getSkeletonAria 决定契约，本仓不重复定义）。
   * 小程序模板编译器不支持 `v-bind="对象"`，故胶水层把包里的键摊开供模板显式绑定。
   */
  const aria = computed(() => getSkeletonAria())

  const ariaHidden = computed(() => Boolean(aria.value['aria-hidden']))

  return { itemClass, itemStyle, ariaHidden }
}
