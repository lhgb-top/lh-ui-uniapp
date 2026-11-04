import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import {
  LH_DROPDOWN_PLACEMENT_DEFAULT,
  getDropdownClass,
  getDropdownMenuAria,
  getDropdownMenuStyle,
  getDropdownTriggerAria,
} from '@lh-ui/share/core/dropdown'
import {
  LH_KEYS,
  focusFirst,
  isEscapeKey,
  sxToStyle,
} from '@lh-ui/share/core/shared'
import { useLhComponentTheme, useLhOverlayStack, useLhPopperIds } from '@/composables'
import { useLhConfigContext } from '@/config-provider'
import { useLhPopper } from '@/adapter/popper'
import type { LhEmitFn } from '@/types/emit'
import type { LhDropdownItemRecord, LhDropdownProps } from './types'

/** hover 触发的显隐延迟（与 plus 仓 useLhTrigger 传参一致；仅 H5 的 hover 模式生效） */
const HOVER_SHOW_DELAY = 200
const HOVER_HIDE_DELAY = 100

/**
 * Dropdown 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 弹层定位用 useLhPopper（getLhRect 异步度量 → computePosition → 显示，两帧防闪烁）
 * - MP 端无 hover：trigger='hover' 在非 H5 端降级为点击切换；无键盘事件，
 *   菜单键盘导航与 Esc 监听整段由条件编译裁剪（MP 包内无死代码）
 * - 无右键语义：trigger='contextmenu' 由长按（longpress）承载，双端一致
 * - 触发器滚出视口不自动收起（uni-app 无统一的滚动监听通道，plus 的 onScrollOut 未移植）
 * - 点击外部关闭由页内透明遮罩承载（等价 plus 的 useLhClickOutside）
 */
export function useLhDropdown(
  props: LhDropdownProps,
  emit: LhEmitFn<'update:visible' | 'command' | 'visible-change'>,
) {
  const configContext = useLhConfigContext()
  // 主题变量作用在菜单上（sx 作用在触发器上，与 plus 仓一致）
  const { componentStyle } = useLhComponentTheme('dropdown', props, configContext)

  const instance = getCurrentInstance()
  const scope = (instance?.proxy as ComponentPublicInstance) ?? null

  // trigger / popper 的 id 必须按实例唯一：一页常有多个下拉菜单，
  // id 重复会让 getLhRect 的全局查询命中第一个触发器，定位算到别的组件上
  const { triggerId, popperId } = useLhPopperIds('dropdown')

  const isVisible = ref(props.visible ?? false)

  const items = ref<LhDropdownItemRecord[]>([])
  const activeIndex = ref(-1)

  // 传入 visible 即视为受控：触发器与遮罩点击不再自行切换显隐。
  // Boolean 类型的 prop 未传递时会被 Vue 解析为 false 而非 undefined，
  // 不能用 props.visible !== undefined 判定，必须看父级是否真的写了这个 prop
  const isControlled = computed(() => !!instance?.vnode.props && 'visible' in instance.vnode.props)

  // 弹层打开顺序栈：多弹层叠加时 Esc 只关栈顶（与 Dialog / Tooltip 共用）
  const overlay = useLhOverlayStack()

  // 弹层定位（两帧度量：菜单先隐藏渲染 → 量尺寸 → 定位 → 显示）
  const { popperStyle, position, update: updatePopper } = useLhPopper(
    `#${triggerId}`,
    `#${popperId}`,
    scope,
    {
      placement: props.placement ?? LH_DROPDOWN_PLACEMENT_DEFAULT,
    },
  )

  // computePosition 实际落位可能与期望方位不同（主轴溢出翻转），
  // 菜单修饰类跟随实际方位（与 plus 的 actualPlacement 同语义）
  const actualPlacement = computed(
    () => position.value?.placement ?? props.placement ?? LH_DROPDOWN_PLACEMENT_DEFAULT,
  )

  // —— hover 显隐延迟双 timer（仅 H5 的 hover 模式走延迟，click / longpress 立即响应）——
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

  /** 显隐落定：统一在这里发事件与重置键盘高亮（对齐 plus 的 setVisible） */
  function setVisible(value: boolean) {
    if (isVisible.value === value) return
    isVisible.value = value
    if (value) {
      emit('visible-change', true)
      emit('update:visible', true)
    } else {
      emit('visible-change', false)
      emit('update:visible', false)
      activeIndex.value = -1
    }
  }

  function show() {
    if (props.disabled) return
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = undefined
    }
    // #ifdef H5
    if (props.trigger === 'hover') {
      showTimer = setTimeout(() => {
        showTimer = undefined
        setVisible(true)
      }, HOVER_SHOW_DELAY)
      return
    }
    // #endif
    setVisible(true)
  }

  function hide() {
    if (showTimer) {
      clearTimeout(showTimer)
      showTimer = undefined
    }
    // #ifdef H5
    if (props.trigger === 'hover') {
      hideTimer = setTimeout(() => {
        hideTimer = undefined
        setVisible(false)
      }, HOVER_HIDE_DELAY)
      return
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
    // MP 端无 hover 语义：hover 触发降级为点击 / 触摸切换（H5 端 hover 走 mouseenter）
    if (props.trigger === 'hover') toggle()
    // #endif
  }

  /**
   * 长按触发（contextmenu 模式）：小程序无右键语义，
   * H5 端同样由 longpress 承载，不阻止浏览器默认右键菜单（plus 会 preventDefault）
   */
  function onTriggerLongpress() {
    if (props.trigger !== 'contextmenu') return
    show()
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

  /** 悬停在菜单上时保持打开（hover 模式，与触发器 mouseleave 的延迟隐藏互补） */
  function onMenuMouseenter() {
    // #ifdef H5
    if (props.trigger === 'hover') show()
    // #endif
  }

  function onMenuMouseleave() {
    // #ifdef H5
    if (props.trigger === 'hover') hide()
    // #endif
  }

  /** 遮罩点击（等价 plus 的点击触发器与菜单外部关闭；受控模式不自行关闭） */
  function onMaskClick() {
    if (!isVisible.value || isControlled.value) return
    hide()
  }

  function handleItemClick(command: string | number | undefined) {
    emit('command', command)
    if (props.hideOnClick !== false) hide()
  }

  /** 聚焦菜单项并同步高亮下标（聚焦仅 H5 有意义，MP 端条件编译裁剪） */
  function focusItem(item: LhDropdownItemRecord) {
    // #ifdef H5
    item.el?.focus()
    // #endif
    activeIndex.value = items.value.indexOf(item)
  }

  /**
   * 菜单键盘导航（对齐 plus 仓，WAI-ARIA APG menu pattern）：
   * 方向键在可用项间循环、Home/End 跳首尾、Enter/Space 触发、Esc 关闭并归还焦点。
   * MP 端无键盘事件，整段体由条件编译裁剪为空函数（函数体必须双端存在，
   * 否则模板事件绑定在 MP 构建时引用不到会直接崩）。
   */
  function onMenuKeydown(event: KeyboardEvent) {
    // #ifdef H5
    const enabled = items.value.filter((item) => !item.disabled)
    if (enabled.length === 0) return

    const current = enabled.findIndex((item) => item.el === document.activeElement)

    switch (event.key) {
      case LH_KEYS.ArrowDown: {
        event.preventDefault()
        const next = current === -1 ? 0 : (current + 1) % enabled.length
        focusItem(enabled[next])
        break
      }
      case LH_KEYS.ArrowUp: {
        event.preventDefault()
        const prev =
          current === -1 ? enabled.length - 1 : (current - 1 + enabled.length) % enabled.length
        focusItem(enabled[prev])
        break
      }
      case LH_KEYS.Home: {
        event.preventDefault()
        focusItem(enabled[0])
        break
      }
      case LH_KEYS.End: {
        event.preventDefault()
        focusItem(enabled[enabled.length - 1])
        break
      }
      case LH_KEYS.Enter:
      case LH_KEYS.Space: {
        if (current === -1) return
        event.preventDefault()
        handleItemClick(enabled[current].command)
        break
      }
      case LH_KEYS.Escape: {
        event.preventDefault()
        hide()
        returnFocus()
        break
      }
    }
    // #endif
  }

  /** 归还焦点到触发器根元素（仅 H5 有 DOM 焦点语义） */
  function returnFocus() {
    // #ifdef H5
    const trigger = scope?.$el as HTMLElement | null | undefined
    if (!trigger) return
    // 触发器根元素通常不是可聚焦区域，优先聚焦其内部的真实交互元素
    if (!focusFirst(trigger)) trigger.focus?.()
    // #endif
  }

  // #ifdef H5
  /**
   * Esc 关闭（焦点在触发器上时菜单自身的 keydown 收不到，补一层文档监听）。
   * 整段只在 H5 保留：小程序无 document，也无键盘事件。
   */
  function onDocumentKeydown(event: KeyboardEvent) {
    if (!isEscapeKey(event) || !isVisible.value || isControlled.value) return
    // 多弹层叠加时只有栈顶响应（与 Dialog / Tooltip 共用顺序栈）
    if (!overlay.isTopmost()) return
    hide()
    returnFocus()
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

  // 弹层打开时注册顺序栈并两帧度量定位；关闭时出栈
  watch(isVisible, (visible) => {
    if (visible) {
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

  onBeforeUnmount(clearTimers)

  const context = {
    items,
    activeIndex,
    registerItem(item: LhDropdownItemRecord) {
      items.value.push(item)
    },
    unregisterItem(item: LhDropdownItemRecord) {
      const index = items.value.indexOf(item)
      if (index > -1) items.value.splice(index, 1)
      if (activeIndex.value >= items.value.length) activeIndex.value = -1
    },
    onItemClick: handleItemClick,
  }

  const menuClass = computed(() =>
    getDropdownClass({
      placement: actualPlacement.value,
      popperClass: props.popperClass,
    }),
  )

  const menuStyle = computed(() => ({
    ...popperStyle.value,
    ...componentStyle.value,
    ...getDropdownMenuStyle(props.maxHeight),
  }))

  const triggerStyle = computed(() => sxToStyle(props.sx ?? {}))

  // 无障碍属性包由 share 纯函数产出；小程序模板不支持 v-bind 对象，逐键摊开绑定
  const triggerAria = computed(() => getDropdownTriggerAria(isVisible.value, popperId))
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
  // 菜单容器 role（id 由 :id="popperId" 承担，与触发器的 aria-controls 对应）
  const menuRole = computed(() => String(getDropdownMenuAria(popperId).role ?? ''))

  return {
    triggerId,
    popperId,
    isVisible,
    context,
    menuClass,
    menuStyle,
    triggerStyle,
    ariaExpanded,
    ariaHaspopup,
    ariaControls,
    menuRole,
    show,
    hide,
    toggle,
    onTriggerClick,
    onTriggerLongpress,
    onTriggerMouseenter,
    onTriggerMouseleave,
    onMenuMouseenter,
    onMenuMouseleave,
    onMenuKeydown,
    onMaskClick,
  }
}
