import { computed, inject } from 'vue'
import { getCollapseItemClassNames } from '@lh-ui/share/core/collapse'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { generateId } from '@lh-ui/share/utils'
import { LH_COLLAPSE_CONTEXT_KEY } from '../lh-collapse/types'
import type { LhCollapseItemResolvedProps } from './types'

/**
 * CollapseItem 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - plus 用 Vue 3.5 的 `useId()` 生成头/内容关联 id；本仓要兼容 uni-app 的
 *   Vue 内核版本，改用 share 的 `generateId`（实例内唯一、跨页不冲突）
 * - plus 的禁用靠原生 `<button disabled>`；MP 端 header 是 `view + role="button"`，
 *   禁用改由点击守卫 + `--disabled` 类名 + `aria-disabled` 表达
 */
export function useLhCollapseItem(props: LhCollapseItemResolvedProps) {
  const context = inject(LH_COLLAPSE_CONTEXT_KEY, null)

  // 脱离 LhCollapse 单用兜底：视为始终收起（与 plus 一致）
  const expanded = computed(() => context?.activeKeys.value.includes(props.name) ?? false)

  const headerId = generateId('lh-collapse-header')
  const contentId = generateId('lh-collapse-content')

  function handleToggle(): void {
    if (props.disabled) return
    context?.toggle(props.name)
  }

  const itemClasses = computed(() => [
    ...getCollapseItemClassNames({ active: expanded.value, disabled: !!props.disabled }),
    props.customClass,
  ])

  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  return {
    expanded,
    headerId,
    contentId,
    itemClasses,
    sxStyle,
    handleToggle,
  }
}
