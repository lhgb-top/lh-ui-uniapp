import { computed, getCurrentInstance, inject, nextTick, provide, ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { getSubMenuClassNames } from '@lh-ui/share/core/menu'
import { LH_KEYS, sxToStyle } from '@lh-ui/share/core/shared'
import { useLhPopperIds } from '@/composables'
import { useLhPopper } from '@/adapter/popper'
import { LH_MENU_KEY } from '../lh-menu/types'
import type { LhEmitFn } from '@/types/emit'
import type { LhMenuMode } from '../lh-menu/types'
import type { LhSubMenuResolvedProps } from './types'

/**
 * SubMenu 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 飞出面板（水平 / 折叠模式）由 plus 的 `<teleport to="body">` 换成
 *   `lh-root-portal` 承载（MP 无 DOM teleport；低版本基础库页内 fixed 兜底）
 * - 面板定位走 useLhPopper 两帧异步度量（先隐藏渲染量尺寸 → computePosition → 显示），
 *   trigger / popper 的 id 按实例唯一化（否则一页多个子菜单会全部定位到第一个上）
 * - hover 打开仅 H5 生效（mouseenter / mouseleave 体由条件编译裁剪，
 *   MP 端无 hover 语义，改由标题点击切换，与 Dropdown 的 hover 降级同款）
 * - 点击外部关闭由页内透明遮罩承载（等价 plus 的 mouseleave 收起）；
 *   Esc / 方向键等键盘交互仅 H5
 */
export function useLhSubMenu(props: LhSubMenuResolvedProps, emit: LhEmitFn<'select'>) {
  const context = inject(LH_MENU_KEY, null)
  const instance = getCurrentInstance()
  const scope = (instance?.proxy as ComponentPublicInstance | null) ?? null

  const { triggerId, popperId } = useLhPopperIds('sub-menu')
  // 面板 id 兼作标题 aria-controls 的引用目标
  const panelId = popperId

  const isPopper = computed(() => context?.isPopperMode() ?? false)
  const opened = computed(() => (context ? context.isOpen(props.index) : false))

  // 飞出方位：顶层子菜单从触发器下方展开（bottom-start）；
  // 嵌套层级从右侧展开（right-start）。判父级深度（与 plus 同口径）：
  // 父级非根菜单（depth>0）才右侧展开；childDepth 只用于 provide
  const childDepth = (context?.depth() ?? 0) + 1
  const placement = (context?.depth() ?? 0) > 0 ? 'right-start' : 'bottom-start'

  const { popperStyle, update: updatePopper } = useLhPopper(
    `#${triggerId}`,
    `#${popperId}`,
    scope,
    { placement },
  )

  // 嵌套子菜单向后代提供深度 +1 的上下文（与 plus 同构）：
  // select 冒泡时把本级 index 前进到路径头部
  provide(LH_MENU_KEY, {
    mode: context?.mode ?? ref<LhMenuMode>('vertical'),
    collapse: context?.collapse ?? ref(false),
    activeKey: context?.activeKey ?? ref(''),
    openeds: context?.openeds ?? ref([]),
    isPopperMode: () => context?.isPopperMode() ?? false,
    handleSelect: (key: string, path: string[]) => {
      emit('select', key, [props.index, ...path])
      context?.handleSelect(key, [props.index, ...path])
    },
    handleToggleOpen: (key: string) => context?.handleToggleOpen(key),
    isOpen: (key: string) => (context ? context.isOpen(key) : false),
    isActive: (key: string) => (context ? context.isActive(key) : false),
    depth: () => childDepth,
  })

  /** 标题点击：切换展开（全端行为，MP 端无 hover 时即主要交互通道） */
  function onTitleClick(): void {
    if (props.disabled) return
    context?.handleToggleOpen(props.index)
  }

  function onTitleMouseenter(): void {
    // #ifdef H5
    if (props.disabled || !isPopper.value) return
    context?.handleToggleOpen(props.index)
    // #endif
  }

  function onTitleMouseleave(): void {
    // 飞出模式由面板的 mouseleave 收起；此处不主动收起避免焦点误关（与 plus 一致）
  }

  /** 悬停在面板上时保持打开（仅 H5 的 hover 语义） */
  function onPanelMouseenter(): void {
    // #ifdef H5
    // 保持打开：无操作
    // #endif
  }

  function onPanelMouseleave(): void {
    // #ifdef H5
    if (props.disabled || !isPopper.value) return
    if (opened.value) context?.handleToggleOpen(props.index)
    // #endif
  }

  /** 遮罩点击：收起面板（等价 plus 飞出模式的 mouseleave 收起，MP 端的主要关闭通道） */
  function onMaskClick(): void {
    if (!opened.value) return
    context?.handleToggleOpen(props.index)
  }

  /**
   * 标题键盘交互（对齐 plus 仓）：Enter / Space / ArrowRight 展开并把焦点移入面板，
   * ArrowLeft / Escape 收起。MP 端无键盘事件，体由条件编译裁剪（函数体必须双端存在）。
   */
  function onTitleKeydown(event: KeyboardEvent): void {
    // #ifdef H5
    if (props.disabled) return
    switch (event.key) {
      case LH_KEYS.Enter:
      case LH_KEYS.Space:
      case LH_KEYS.ArrowRight: {
        event.preventDefault()
        if (!opened.value) context?.handleToggleOpen(props.index)
        focusFirstPanelItem()
        break
      }
      case LH_KEYS.ArrowLeft: {
        if (opened.value) {
          event.preventDefault()
          context?.handleToggleOpen(props.index)
        }
        break
      }
      case LH_KEYS.Escape: {
        if (opened.value) {
          event.preventDefault()
          context?.handleToggleOpen(props.index)
        }
        break
      }
    }
    // #endif
  }

  /**
   * 把焦点移入面板第一个可用项（仅 H5 有 DOM 焦点语义）。
   * 飞出模式按 id 取 root-portal 内的面板；内联模式取本级根元素下的面板。
   */
  function focusFirstPanelItem(): void {
    // #ifdef H5
    // 面板由 v-if 控制，首次打开时 DOM 尚未渲染，须等下一帧才能查询聚焦目标
    nextTick(() => {
      const panel = isPopper.value
        ? (document.getElementById(popperId) as HTMLElement | null)
        : (scope?.$el as HTMLElement | null)
      if (!panel) return
      const items = panel.querySelectorAll<HTMLElement>('[role="menuitem"]')
      const first = Array.from(items).find((el) => el.tabIndex !== -1)
      first?.focus()
    })
    // #endif
  }

  // 弹层打开时两帧度量定位（与 Dropdown / Popover 同款时序）
  watch(opened, (value) => {
    if (value && isPopper.value) nextTick(() => updatePopper())
  })

  const panelStyle = computed(() => ({ ...popperStyle.value }))

  const subMenuClasses = computed(() =>
    getSubMenuClassNames({
      active: context ? context.isActive(props.index) : false,
      disabled: props.disabled,
      opened: opened.value,
    }),
  )

  const subMenuStyle = computed(() => sxToStyle(props.sx ?? {}))

  return {
    triggerId,
    panelId,
    isPopper,
    opened,
    panelStyle,
    subMenuClasses,
    subMenuStyle,
    onTitleClick,
    onTitleMouseenter,
    onTitleMouseleave,
    onPanelMouseenter,
    onPanelMouseleave,
    onMaskClick,
    onTitleKeydown,
  }
}
