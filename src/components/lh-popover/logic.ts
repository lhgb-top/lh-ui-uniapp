import {
  computed,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useSlots,
  watch,
} from 'vue'
import type { ComponentPublicInstance } from 'vue'
import {
  LH_POPOVER_PLACEMENT_DEFAULT,
  getDefaultDelay,
  getPopoverClass,
  getPopoverPopperAria,
  getPopoverTriggerAria,
  getPopoverWidthStyle,
} from '@lh-ui/share/core/popover'
import { isEscapeKey, sxToStyle } from '@lh-ui/share/core/shared'
import { useLhComponentTheme, useLhOverlayStack, useLhPopperIds, useLhZIndex } from '@/composables'
import { useLhConfigContext } from '@/config-provider'
import { useLhPopper } from '@/adapter/popper'
import type { LhEmitFn } from '@/types/emit'
import type { LhPopoverProps } from './types'

/**
 * Popover 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 弹层定位用 useLhPopper（getLhRect 异步度量 → computePosition → 显示，两帧防闪烁）
 * - MP 端无 hover / focus 语义：两种触发在非 H5 端降级为点击切换；显隐延迟仅 H5 的
 *   hover / focus 模式生效（click / manual 立即响应，与 plus 的 useLhTrigger 语义一致）
 * - 无焦点圈：plus 点击触发会把焦点圈进弹出层（focus-trap），MP 无键盘焦点语义，
 *   与本仓 Dialog 同款整体不移植
 * - 触发器滚出视口不自动收起（uni-app 无统一的滚动监听通道，plus 的 onScrollOut 未移植）
 * - 点击外部关闭由页内透明遮罩承载（等价 plus 的 useLhClickOutside）
 * - 箭头指向：uniapp 的 useLhPopper 不写 --lh-arrow-offset，由本胶水从定位结果补写
 */
export function useLhPopover(
  props: LhPopoverProps,
  emit: LhEmitFn<'update:visible' | 'show' | 'hide'>,
) {
  const configContext = useLhConfigContext()
  const { componentStyle } = useLhComponentTheme('popover', props, configContext)
  const { nextZIndex } = useLhZIndex()

  const instance = getCurrentInstance()
  const scope = (instance?.proxy as ComponentPublicInstance) ?? null
  const slots = useSlots()

  // trigger / popper 的 id 必须按实例唯一：一页常有多个弹出框，
  // id 重复会让 getLhRect 的全局查询命中第一个触发器，定位算到别的组件上
  const { triggerId, popperId } = useLhPopperIds('popover')
  const titleId = `${popperId}-title`

  const isVisible = ref(props.visible ?? false)
  const zIndex = ref(nextZIndex())

  // 受控模式判定：trigger='manual' 且父级真的传了 visible（对齐 plus 仓）。
  // Boolean 类型的 prop 未传递时会被 Vue 解析为 false 而非 undefined，
  // 不能用 props.visible !== undefined 判定，必须看父级是否真的写了这个 prop
  const isControlled = computed(
    () =>
      props.trigger === 'manual' &&
      !!instance?.vnode.props &&
      'visible' in instance.vnode.props,
  )

  // 弹层打开顺序栈：多弹层叠加时 Esc 只关栈顶（与 Dialog / Dropdown / Tooltip 共用）
  const overlay = useLhOverlayStack()

  // 弹层定位（两帧度量：弹层先隐藏渲染 → 量尺寸 → 定位 → 显示）
  const { popperStyle, position, update: updatePopper } = useLhPopper(
    `#${triggerId}`,
    `#${popperId}`,
    scope,
    {
      placement: props.placement ?? LH_POPOVER_PLACEMENT_DEFAULT,
    },
  )

  // computePosition 实际落位可能与期望方位不同（主轴溢出翻转），
  // 弹层修饰类跟随实际方位，箭头位置随之切换（与 plus 的 actualPlacement 同语义）
  const actualPlacement = computed(
    () => position.value?.placement ?? props.placement ?? LH_POPOVER_PLACEMENT_DEFAULT,
  )

  // —— 显隐延迟双 timer（仅 H5 的 hover / focus 模式走延迟，click / manual 立即响应）——
  let showTimer: ReturnType<typeof setTimeout> | undefined
  let hideTimer: ReturnType<typeof setTimeout> | undefined

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

  /** 显隐落定：统一在这里发事件（对齐 plus 的 useLhTrigger.onShow / onHide） */
  function setVisible(value: boolean) {
    if (isVisible.value === value) return
    isVisible.value = value
    if (value) {
      emit('show')
      emit('update:visible', true)
    } else {
      emit('hide')
      emit('update:visible', false)
    }
  }

  function show() {
    if (props.disabled) return
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = undefined
    }
    // 延迟只用于防误触的 hover / focus；click 与 manual 立即响应（对齐 plus 的 useLhTrigger）
    // #ifdef H5
    if (props.trigger === 'hover' || props.trigger === 'focus') {
      const { show: showDelay } = getDefaultDelay(props.showAfter, props.hideAfter)
      if (showDelay > 0) {
        showTimer = setTimeout(() => {
          showTimer = undefined
          setVisible(true)
        }, showDelay)
        return
      }
    }
    // #endif
    setVisible(true)
  }

  function hide() {
    if (props.disabled) return
    if (showTimer) {
      clearTimeout(showTimer)
      showTimer = undefined
    }
    // #ifdef H5
    if (props.trigger === 'hover' || props.trigger === 'focus') {
      const { hide: hideDelay } = getDefaultDelay(props.showAfter, props.hideAfter)
      if (hideDelay > 0) {
        hideTimer = setTimeout(() => {
          hideTimer = undefined
          setVisible(false)
        }, hideDelay)
        return
      }
    }
    // #endif
    setVisible(false)
  }

  function toggle() {
    if (isVisible.value) hide()
    else show()
  }

  // —— 触发器事件入口 ——

  function onTriggerClick() {
    if (isControlled.value) return
    if (props.trigger === 'click') {
      toggle()
      return
    }
    // #ifndef H5
    // MP 端无 hover / focus 语义：降级为点击 / 触摸切换（H5 端走 mouseenter / focusin）
    if (props.trigger === 'hover' || props.trigger === 'focus') toggle()
    // #endif
  }

  function onTriggerMouseenter() {
    // #ifdef H5
    if (isControlled.value) return
    if (props.trigger === 'hover') show()
    // #endif
  }

  function onTriggerMouseleave() {
    // #ifdef H5
    if (isControlled.value) return
    if (props.trigger === 'hover') hide()
    // #endif
  }

  /** hover 模式下键盘焦点进入同样展示（无障碍）；focus 模式的主入口（仅 H5 有焦点语义） */
  function onTriggerFocusin() {
    // #ifdef H5
    if (isControlled.value) return
    if (props.trigger === 'focus' || props.trigger === 'hover') show()
    // #endif
  }

  function onTriggerFocusout() {
    // #ifdef H5
    if (isControlled.value) return
    if (props.trigger === 'focus' || props.trigger === 'hover') hide()
    // #endif
  }

  /** 悬停在弹出层上时保持打开（hover 模式，与触发器 mouseleave 的延迟隐藏互补） */
  function onPopperMouseenter() {
    // #ifdef H5
    if (props.trigger === 'hover') show()
    // #endif
  }

  function onPopperMouseleave() {
    // #ifdef H5
    if (props.trigger === 'hover') hide()
    // #endif
  }

  /** 遮罩点击（等价 plus 的点击触发器与弹出层外部关闭；受控模式不自行关闭） */
  function onMaskClick() {
    if (!isVisible.value || isControlled.value) return
    hide()
  }

  // #ifdef H5
  /**
   * Esc 关闭（弹出层自身收不到文档级按键，补一层文档监听）。
   * 整段只在 H5 保留：小程序无 document，也无键盘事件。
   */
  function onDocumentKeydown(event: KeyboardEvent) {
    if (!isEscapeKey(event) || !isVisible.value || isControlled.value) return
    // 多弹层叠加时只有栈顶响应（与 Dialog / Dropdown 共用顺序栈）
    if (!overlay.isTopmost()) return
    hide()
  }

  onMounted(() => {
    document.addEventListener('keydown', onDocumentKeydown)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onDocumentKeydown)
  })
  // #endif

  // 同步外部 visible（受控用法；编程式改内部状态走 show / hide）
  watch(
    () => props.visible,
    (val) => {
      if (val !== undefined && val !== isVisible.value) isVisible.value = val
    },
  )

  // 弹层打开时取新 z-index、注册顺序栈并两帧度量定位；关闭时出栈
  watch(isVisible, (visible) => {
    if (visible) {
      zIndex.value = nextZIndex()
      overlay.register()
      nextTick(() => updatePopper())
    } else {
      overlay.unregister()
    }
  })

  // 期望方位变化时重定位（弹层打开状态下）
  watch(
    () => props.placement,
    () => {
      if (isVisible.value) nextTick(() => updatePopper())
    },
  )

  onMounted(() => {
    // 初始 visible=true：watch 不会触发，补上顺序栈注册与两帧度量（对齐 Dialog 的初始值处理）
    if (!isVisible.value) return
    zIndex.value = nextZIndex()
    overlay.register()
    nextTick(() => updatePopper())
  })

  onBeforeUnmount(clearTimers)

  const hasTitle = computed(() => !!props.title || !!slots.title)

  const popperClass = computed(() =>
    getPopoverClass({
      placement: actualPlacement.value,
      arrow: props.arrow,
      popperClass: props.popperClass,
    }),
  )

  // computePosition 的 arrowOffset 写入 CSS 变量，箭头始终指向触发器交叉轴中心；
  // 未定位完成时省略，回退 CSS 默认 50%
  const mergedPopperStyle = computed(() => {
    const style: Record<string, string> = {
      ...popperStyle.value,
      ...componentStyle.value,
      ...getPopoverWidthStyle(props.width),
      zIndex: String(zIndex.value),
    }
    if (position.value) {
      style['--lh-arrow-offset'] = `${position.value.arrowOffset}px`
    }
    return style
  })

  const triggerStyle = computed(() => sxToStyle(props.sx ?? {}))

  // 无障碍属性包由 share 纯函数产出；小程序模板不支持 v-bind 对象，逐键摊开绑定
  const triggerAria = computed(() => getPopoverTriggerAria(isVisible.value, popperId))
  const ariaExpanded = computed(() => {
    const value = triggerAria.value['aria-expanded']
    return value === true || value === 'true'
  })
  const ariaHaspopup = computed(() => {
    const value = triggerAria.value['aria-haspopup']
    // Vue 的 aria-haspopup 类型是字面量联合，share 包的宽值域在此收窄
    return typeof value === 'string'
      ? (value as 'dialog' | 'menu' | 'tree' | 'listbox' | 'grid' | 'true' | 'false')
      : undefined
  })
  const ariaControls = computed(() => {
    const value = triggerAria.value['aria-controls']
    return typeof value === 'string' ? value : undefined
  })
  // 弹层容器 role / 标题关联（id 由 :id="popperId" 承担，与触发器的 aria-controls 对应）
  const popperAria = computed(() =>
    getPopoverPopperAria(popperId, hasTitle.value ? titleId : undefined),
  )
  const popperRole = computed(() => String(popperAria.value.role ?? ''))
  const ariaLabelledby = computed(() => {
    const value = popperAria.value['aria-labelledby']
    return typeof value === 'string' ? value : undefined
  })

  return {
    triggerId,
    popperId,
    titleId,
    isVisible,
    hasTitle,
    popperClass,
    mergedPopperStyle,
    triggerStyle,
    ariaExpanded,
    ariaHaspopup,
    ariaControls,
    popperRole,
    ariaLabelledby,
    show,
    hide,
    toggle,
    onTriggerClick,
    onTriggerMouseenter,
    onTriggerMouseleave,
    onTriggerFocusin,
    onTriggerFocusout,
    onPopperMouseenter,
    onPopperMouseleave,
    onMaskClick,
  }
}
