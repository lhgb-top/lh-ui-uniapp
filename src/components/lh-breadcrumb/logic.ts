import { computed, provide, ref } from 'vue'
import { getCollapsedHiddenIndexes, getEllipsisBeforeIndex } from '@lh-ui/share/core/breadcrumb'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { LH_BREADCRUMB_KEY } from './types'
import type { LhBreadcrumbResolvedProps } from './types'

/**
 * Breadcrumb 组件胶水（逻辑对齐 plus 仓）
 *
 * 子项在各自 setup 阶段注册 token，顺序即渲染顺序；
 * 序号/总数在注册完成的同一微任务批次内收敛，不会产生可见闪烁。
 * 【uni-app 差异】与 plus 相同的 provide/inject 机制在 uni-app （Vue 3 内核）下可用。
 */
export function useLhBreadcrumb(props: LhBreadcrumbResolvedProps) {
  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const itemTokens = ref<symbol[]>([])
  const expanded = ref(false)

  const effectiveMax = computed(() => (expanded.value ? 0 : props.maxItems ?? 0))
  const hiddenIndexes = computed(() =>
    getCollapsedHiddenIndexes({ total: itemTokens.value.length, maxItems: effectiveMax.value }),
  )
  const ellipsisBeforeIndex = computed(() =>
    getEllipsisBeforeIndex({ total: itemTokens.value.length, maxItems: effectiveMax.value }),
  )

  provide(LH_BREADCRUMB_KEY, {
    itemTokens,
    hiddenIndexes,
    ellipsisBeforeIndex,
    expand: () => {
      expanded.value = true
    },
    separator: computed(() => props.separator ?? '/'),
  })

  return {
    sxStyle,
    itemTokens,
    hiddenIndexes,
    ellipsisBeforeIndex,
  }
}
