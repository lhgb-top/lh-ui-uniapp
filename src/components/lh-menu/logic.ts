import { computed, getCurrentInstance, provide, ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { getMenuClassNames, isMenuOpen, moveMenuFocus, toggleMenuOpen } from '@lh-ui/share/core/menu'
import { LH_KEYS, sxToStyle } from '@lh-ui/share/core/shared'
import { LH_MENU_KEY } from './types'
import type { LhEmitFn } from '@/types/emit'
import type { LhMenuResolvedProps } from './types'

/**
 * Menu 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - provide/inject 机制在 uni-app（Vue 3 内核）下与 plus 相同
 * - 激活 / 展开态的受控取值改为 computed 订阅 props（父组件异步更新 v-model 时
 *   立即同步，不做 setup 期快照）
 * - 垂直内联模式的 ↑/↓ / Home / End 键盘遍历仅 H5 生效（事件委托到根节点、
 *   事件函数双端存在，MP 端由条件编译裁剪为空体）
 */
export function useLhMenu(
  props: LhMenuResolvedProps,
  emit: LhEmitFn<'update:modelValue' | 'update:openeds' | 'select' | 'open' | 'close'>,
) {
  const instance = getCurrentInstance()
  const scope = (instance?.proxy as ComponentPublicInstance | null) ?? null

  // 激活态：受控（传了 modelValue）走 props；未传时内部维护
  const innerActiveKey = ref('')
  const activeKey = computed(() => props.modelValue ?? innerActiveKey.value)

  // 展开态：受控（传了 openeds）走 props；未传时内部维护（初值取 defaultOpeneds）
  const innerOpeneds = ref<string[]>([...(props.defaultOpeneds ?? [])])
  const openeds = computed(() => props.openeds ?? innerOpeneds.value)

  const isPopperMode = () => props.mode === 'horizontal' || !!props.collapse

  function handleSelect(key: string, indexPath: string[]): void {
    innerActiveKey.value = key
    emit('update:modelValue', key)
    emit('select', key, indexPath)
  }

  function handleToggleOpen(key: string): void {
    const next = toggleMenuOpen(openeds.value, key, props.uniqueOpened)
    innerOpeneds.value = next
    emit('update:openeds', next)
    const path = [key]
    if (next.includes(key)) emit('open', key, path)
    else emit('close', key, path)
  }

  function isOpen(key: string): boolean {
    return isMenuOpen(openeds.value, key)
  }

  function isActive(key: string): boolean {
    return activeKey.value === key
  }

  const depth = () => 0

  provide(LH_MENU_KEY, {
    mode: computed(() => props.mode),
    collapse: computed(() => props.collapse),
    activeKey,
    openeds,
    isPopperMode,
    handleSelect,
    handleToggleOpen,
    isOpen,
    isActive,
    depth,
  })

  const menuClasses = computed(() =>
    getMenuClassNames({ mode: props.mode, collapse: !!props.collapse }),
  )

  const menuStyle = computed(() => sxToStyle(props.sx ?? {}))

  const menuRole = computed(() => (props.mode === 'horizontal' ? 'menubar' : 'menu'))

  /**
   * 垂直内联模式的 ↑/↓ 跨边界遍历（对齐 plus 仓）
   *
   * 事件委托到根节点：可见项 = 叶子项 + 子菜单标题（DOM 序即视觉序），
   * 遍历越过子菜单标题 ↔ 面板内项 ↔ 兄弟节点边界。跳过禁用项（tabindex -1）
   * 与收起面板内的项（aria-hidden）。水平模式不走此逻辑（标题自身的 ←/→ 语义保留）。
   * MP 端无键盘事件，整段体由条件编译裁剪（函数体必须双端存在，
   * 否则模板事件绑定在 MP 构建时引用不到会直接崩）。
   */
  function onKeydown(event: KeyboardEvent): void {
    // #ifdef H5
    if (props.mode !== 'vertical') return
    const root = scope?.$el as HTMLElement | null
    if (!root) return

    const key = event.key
    let direction: 1 | -1 | null = null
    if (key === LH_KEYS.ArrowDown) direction = 1
    else if (key === LH_KEYS.ArrowUp) direction = -1

    if (direction != null) {
      const items = collectFocusable(root)
      const target = event.target as HTMLElement | null
      const next = moveMenuFocus(items, target, direction)
      if (next) {
        event.preventDefault()
        next.focus()
      }
      return
    }

    if (key === LH_KEYS.Home || key === LH_KEYS.End) {
      const items = collectFocusable(root)
      if (items.length === 0) return
      event.preventDefault()
      const target = key === LH_KEYS.Home ? items[0] : items[items.length - 1]
      target.focus()
    }
    // #endif
  }

  /** 收集可见可聚焦项（仅 H5 有 DOM 查询语义） */
  function collectFocusable(root: HTMLElement): HTMLElement[] {
    // #ifdef H5
    return Array.from(root.querySelectorAll<HTMLElement>('[role="menuitem"]')).filter((el) => {
      if (el.tabIndex === -1) return false
      return el.closest('[aria-hidden="true"]') == null
    })
    // #endif
    // #ifndef H5
    return []
    // #endif
  }

  return {
    menuClasses,
    menuStyle,
    menuRole,
    onKeydown,
  }
}
