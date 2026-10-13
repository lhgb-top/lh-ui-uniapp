import { computed } from 'vue'
import { getSkeletonClassNames, getSkeletonRowWidths } from '@lh-ui/share/core/skeleton'
import { sxToStyle } from '@lh-ui/share/core/shared'
import type { LhSkeletonResolvedProps } from './types'

/**
 * Skeleton 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】无。根节点用 aria-busy 标记加载区域，
 * 占位项自身对辅助技术隐藏（见 skeleton-item 的 getSkeletonAria）。
 */
export function useLhSkeleton(props: LhSkeletonResolvedProps) {
  const skeletonClass = computed(() =>
    getSkeletonClassNames({
      animated: props.animated,
      avatar: props.avatar,
    }),
  )

  const rowWidths = computed(() => getSkeletonRowWidths(props.rows))

  const skeletonStyle = computed(() => sxToStyle(props.sx ?? {}))

  return { skeletonClass, rowWidths, skeletonStyle }
}
