import { computed, provide, ref } from 'vue'
import { getTimelineClassNames } from '@lh-ui/share/core/timeline'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { LH_TIMELINE_KEY } from './types'
import type { LhTimelineResolvedProps } from './types'

/**
 * Timeline 组件胶水（逻辑对齐 plus 仓）
 *
 * 容器只负责布局模式下发与条目 token 收集；类名 / 侧别 / 末项判定全部由
 * share core 纯函数产出（getTimelineClassNames / getTimelineSide）。
 *
 * 【uni-app 差异】与 plus 相同的 provide/inject 机制在 uni-app（Vue 3 内核）下可用；
 * 条目在各自 setup 阶段注册 token，顺序即渲染顺序。
 */
export function useLhTimeline(props: LhTimelineResolvedProps) {
  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const itemTokens = ref<symbol[]>([])

  const rootClasses = computed(() => [
    ...getTimelineClassNames(props.mode),
    props.customClass,
  ])

  provide(LH_TIMELINE_KEY, {
    mode: computed(() => props.mode),
    itemTokens,
  })

  return {
    sxStyle,
    rootClasses,
    itemTokens,
  }
}
