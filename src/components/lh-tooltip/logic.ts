import { computed, getCurrentInstance, nextTick, onBeforeUnmount, ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { getDefaultDelay, getPopperClassNames } from '@lh-ui/share/core/tooltip'
import { useLhComponent, useLhPopperIds } from '@/composables'
import { useLhPopper } from '@/adapter/popper'
import type { LhEmitFn } from '@/types/emit'
import type { LhTooltipProps } from './types'

/**
 * Tooltip 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - MP 端无 hover：trigger='hover' 在非 H5 端自动降级为 click 行为
 * - show/hide delay 仅在 H5 的 hover 模式下生效（MP 立即响应）
 * - 弹层定位用 useLhPopper（getLhRect 异步度量 → computePosition → 显示）
 */
export function useLhTooltip(
  props: LhTooltipProps,
  emit: LhEmitFn<'visible-change'>,
) {
  const { componentStyle } = useLhComponent('tooltip', props)

  const instance = getCurrentInstance()
  const scope = (instance?.proxy as ComponentPublicInstance) ?? null

  // trigger / popper 的 id 必须按实例唯一：一页常有多个 tooltip，
  // id 重复会让 getLhRect 的全局查询命中第一个触发器，定位算到别的组件上
  const { triggerId, popperId } = useLhPopperIds('tooltip')

  const visible = ref(false)
  let showTimer: ReturnType<typeof setTimeout> | undefined
  let hideTimer: ReturnType<typeof setTimeout> | undefined

  const delays = computed(() =>
    getDefaultDelay(props.showDelay, props.hideDelay),
  )

  const tooltipClass = computed(() => [
    ...getPopperClassNames({
      effect: 'dark',
      placement: props.placement ?? 'top',
    }),
  ])

  const tooltipStyle = computed(() => {
    const style: Record<string, string> = { ...componentStyle.value }
    if (props.maxWidth !== undefined) {
      style.maxWidth = typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth
    }
    return style
  })

  const { popperStyle, update: updatePopper } = useLhPopper(
    `#${triggerId}`,
    `#${popperId}`,
    scope,
    { placement: props.placement ?? 'top' },
  )

  function clearTimers() {
    if (showTimer) {
      clearTimeout(showTimer)
      showTimer = undefined
    }
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = undefined
    }
  }

  function show() {
    if (props.disabled || visible.value) return
    clearTimers()
    // #ifdef H5
    if (props.trigger === 'hover') {
      showTimer = setTimeout(() => {
        visible.value = true
        emit('visible-change', true)
        nextTick(() => updatePopper())
      }, delays.value.show)
      return
    }
    // #endif
    visible.value = true
    emit('visible-change', true)
    nextTick(() => updatePopper())
  }

  function hide() {
    if (!visible.value) return
    clearTimers()
    // #ifdef H5
    if (props.trigger === 'hover') {
      hideTimer = setTimeout(() => {
        visible.value = false
        emit('visible-change', false)
      }, delays.value.hide)
      return
    }
    // #endif
    visible.value = false
    emit('visible-change', false)
  }

  /** click 模式切换（全端通用） */
  function toggle() {
    if (visible.value) hide()
    else show()
  }

  // H5 hover 的事件入口：SFC 只绑了 click/touchstart，hover 模式下
  // show/hide 无人调用，trigger='hover' 会完全无反应
  function onTriggerMouseenter() {
    // #ifdef H5
    if (props.trigger === 'hover') show()
    // #endif
  }

  function onTriggerMouseleave() {
    // #ifdef H5
    if (props.trigger === 'hover') hide()
    // #endif
  }

  onBeforeUnmount(clearTimers)

  return {
    visible,
    tooltipClass,
    tooltipStyle,
    popperStyle,
    triggerId,
    popperId,
    show,
    hide,
    toggle,
    onTriggerMouseenter,
    onTriggerMouseleave,
  }
}
