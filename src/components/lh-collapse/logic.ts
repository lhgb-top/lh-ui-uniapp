import { computed, provide, ref } from 'vue'
import { normalizeActiveKeys, toggleCollapseKey } from '@lh-ui/share/core/collapse'
import type { LhCollapseKey } from '@lh-ui/share/core/collapse'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { LH_COLLAPSE_CONTEXT_KEY } from './types'
import type { LhEmitFn } from '@/types/emit'
import type { LhCollapseResolvedProps } from './types'

/**
 * Collapse 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 与 plus 相同的 provide/inject 机制在 uni-app（Vue 3 内核）下可用
 * - 受控态取值改为 computed 订阅 props.modelValue（plus 用 setup 期快照的内部 ref，
 *   父组件异步更新 v-model 时面板会追不上；此处仅修胶水，core 纯函数与 props 契约不变）
 * - 展开收起动画为纯 CSS（grid-template-rows 0fr/1fr 过渡），不监听 transitionend
 *   （MP 不可靠）；类名切换即落位，即使 MP 端过渡不支持，最终态仍然正确
 */
export function useLhCollapse(
  props: LhCollapseResolvedProps,
  emit: LhEmitFn<'update:modelValue' | 'change'>,
) {
  // 非受控模式的内部状态；受控时只作初始化兜底
  const innerActiveKeys = ref<LhCollapseKey[]>(normalizeActiveKeys(props.modelValue))

  // 受控时以 props 为准（父组件更新 v-model 立即同步），非受控用内部状态
  const activeKeys = computed<LhCollapseKey[]>(() =>
    props.modelValue !== undefined ? normalizeActiveKeys(props.modelValue) : innerActiveKeys.value,
  )

  function toggle(key: LhCollapseKey): void {
    const next = toggleCollapseKey(activeKeys.value, key, props.accordion)
    if (props.modelValue !== undefined) {
      // 受控：仅抛出，内部不落值
      emit('update:modelValue', next)
      return
    }
    innerActiveKeys.value = next
    // 手风琴下单值（允许 undefined 表示全收起），常规模式抛数组快照
    emit('change', props.accordion ? (next[0] ?? undefined) : [...next])
  }

  provide(LH_COLLAPSE_CONTEXT_KEY, {
    activeKeys,
    accordion: computed(() => props.accordion),
    toggle,
  })

  const collapseClasses = computed(() => {
    const classes = ['lh-collapse']
    if (props.accordion) classes.push('lh-collapse--accordion')
    if (props.customClass) classes.push(props.customClass)
    return classes
  })

  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  return {
    activeKeys,
    collapseClasses,
    sxStyle,
    toggle,
  }
}
