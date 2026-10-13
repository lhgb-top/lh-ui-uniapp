/**
 * 跨组件共享的组合式逻辑
 *
 * useLhZIndex / useLhOverlayStack 照搬 plus 仓（模块级计数器 + symbol 栈）；
 * useLhComponentTheme 按 uniapp 简化版 ConfigProvider 上下文实现
 * （本仓 ConfigProvider 无 patternComponents 白名单字段，故无白名单分支）。
 */
import { computed, getCurrentInstance, onBeforeUnmount } from 'vue'
import { toCssVarName } from '@lh-ui/share/utils/css-var'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { useLhConfigContext } from '@/config-provider'
import type { LhConfigContextRef } from '@/config-provider'
import type { LhThemeableComponent } from '@/config-provider/types'

/**
 * useLhZIndex - 递增的 z-index 管理
 *
 * 模块级计数器，每次 nextZIndex 全局自增，保证后打开的弹层在视觉上层。
 * 基数 2000 与 share 的 createDefaultConfig().zIndex 对齐。
 */
let _zIndexCounter = 2000

export function useLhZIndex() {
  function nextZIndex() {
    return ++_zIndexCounter
  }

  return { nextZIndex }
}

/**
 * useLhOverlayStack - 弹层打开顺序栈
 *
 * 模块级栈记录当前打开的弹层（dialog 等）：多弹层叠加时 Esc 只关栈顶。
 * 每个实例 open 时 register、关闭时 unregister，组件卸载时自动出栈兜底。
 *
 * 【MP 注意】小程序无键盘事件，Esc 语义只在 H5 生效；本栈仍维护，
 * 供 isTopmost() 用于「点击遮罩只关栈顶」等多弹层场景。
 */
const _overlayStack: symbol[] = []

export function useLhOverlayStack() {
  const id = Symbol('lh-overlay')

  function register() {
    _overlayStack.push(id)
  }

  function unregister() {
    const index = _overlayStack.lastIndexOf(id)
    if (index >= 0) _overlayStack.splice(index, 1)
  }

  /** 本实例是否处于栈顶（只有栈顶响应 Esc / 遮罩点击） */
  function isTopmost() {
    return _overlayStack[_overlayStack.length - 1] === id
  }

  onBeforeUnmount(unregister)

  return { register, unregister, isTopmost }
}

/**
 * useLhComponentTheme - 组件主题层级覆盖
 *
 * 优先级：组件自身 themeVars > ConfigProvider componentTheme[组件名] > ConfigProvider 全局 themeVars
 * （与 plus 仓同构；本仓无 patternComponents 白名单，花纹背景由各组件 bgPattern prop 自行控制）
 */
export function useLhComponentTheme(
  componentName: LhThemeableComponent,
  props: { themeVars?: Record<string, string>; bgPattern?: string },
  configContext: LhConfigContextRef = null,
) {
  /** 把一组主题变量按 --lh- 前缀合并进目标对象（后者覆盖前者） */
  const mergeVars = (target: Record<string, string>, source?: Record<string, string>) => {
    if (!source) return
    for (const [key, value] of Object.entries(source)) {
      target[toCssVarName(key)] = value
    }
  }

  const componentStyle = computed(() => {
    const result: Record<string, string> = {}
    // ConfigProvider 注入的是 computed 引用，读取 .value 建立响应式依赖
    const ctx = configContext?.value

    // 优先级：全局 themeVars < componentTheme[组件名] < 组件自身 themeVars < bgPattern
    mergeVars(result, ctx?.themeVars)
    mergeVars(result, ctx?.componentTheme?.[componentName])
    mergeVars(result, props.themeVars)

    if (props.bgPattern) {
      result['--lh-bg-pattern'] = props.bgPattern
    }

    return result
  })

  return { componentStyle }
}

/**
 * useLhComponent - 组件胶水公共基底
 *
 * 组合 ConfigProvider 注入 + 主题层级 + sx 样式，P0 组件统一调它，
 * 保证「组件 props > componentTheme[名] > 全局 themeVars > sx」优先级在所有组件一致。
 */
export function useLhComponent(
  componentName: LhThemeableComponent,
  props: { themeVars?: Record<string, string>; bgPattern?: string; sx?: Record<string, unknown> },
) {
  const configContext = useLhConfigContext()

  const { componentStyle } = useLhComponentTheme(componentName, props, configContext)

  const mergedStyle = computed(() => ({
    ...componentStyle.value,
    ...sxToStyle(props.sx ?? {}),
  }))

  return {
    configContext,
    componentStyle: mergedStyle,
  }
}

/**
 * useLhPopperIds - 弹层组件的 trigger / popper 唯一 id
 *
 * 一页常放置多个同类弹层组件，id 必须各不相同：getLhRect 的 H5 分支用
 * document.querySelectorAll 全局查询，若 id 硬编码则永远只命中第一个，
 * 弹层会全部定位到第一个组件上（实测偏差可达近百 px）。
 */
export function useLhPopperIds(name: string) {
  const instance = getCurrentInstance()
  const uid = instance?.uid ?? Math.random().toString(36).slice(2)
  return {
    triggerId: `lh-${name}-trigger-${uid}`,
    popperId: `lh-${name}-popper-${uid}`,
  }
}

/**
 * useLhHasClickListener - 父级是否绑定了 click 监听
 *
 * 已声明的 emit 会从 attrs 剔除，且 computed 对动态 vnode.props 键不敏感，
 * 故渲染期直接读当前 vnode 的 props 求值（照 plus 仓同款做法）。
 * 供模板决定是否给辅助技术暴露可点击语义（button / tag 等）。
 */
export function useLhHasClickListener() {
  const instance = getCurrentInstance()
  return computed(() =>
    Boolean((instance?.vnode.props as Record<string, unknown> | undefined)?.onClick),
  )
}
