import { computed } from 'vue'
import { getSpaceClassNames, resolveSpaceGaps } from '@lh-ui/share/core/space'
import { sxToStyle } from '@lh-ui/share/core/shared'
import type { LhSpaceResolvedProps } from './types'

/**
 * Space 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】无。间距走原生 CSS gap，无 JS 度量；
 * 预设档位引用 spacing token，数字与数组归一化为 px。
 */
export function useLhSpace(props: LhSpaceResolvedProps) {
  const spaceClass = computed(() =>
    getSpaceClassNames({
      direction: props.direction,
      wrap: props.direction === 'horizontal' && props.wrap,
      // 预设档位才有对应类名（--small/--medium/--large），数字与数组走内联 gap
      size: typeof props.size === 'string' ? props.size : 'custom',
    }),
  )

  // sx 展开在最后，消费者可覆盖对齐与间距
  const spaceStyle = computed(() => {
    const { columnGap, rowGap } = resolveSpaceGaps(props.size)
    return {
      columnGap,
      rowGap,
      alignItems: props.alignment,
      ...sxToStyle(props.sx ?? {}),
    }
  })

  return { spaceClass, spaceStyle }
}
