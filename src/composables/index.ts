/**
 * 跨组件共享的组合式逻辑
 *
 * useLhZIndex / useLhOverlayStack 照搬 plus 仓（模块级计数器 + symbol 栈）；
 * useLhComponentTheme 按 uniapp 简化版 ConfigProvider 上下文实现
 * （本仓 ConfigProvider 无 patternComponents 白名单字段，故无白名单分支）；
 * useLhBreakpoint 按 uni-app 条件编译把 matchMedia 监听只留在 H5 段。
 */
import { computed, getCurrentInstance, onBeforeUnmount, ref } from 'vue'
import type { Ref } from 'vue'
import { toCssVarName } from '@lh-ui/share/utils/css-var'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { LH_GRID_BREAKPOINTS, resolveBreakpoint } from '@lh-ui/share/core/grid'
import type { LhGridBreakpoint } from '@lh-ui/share/core/grid'
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
 * useLhBreakpoint - 全局共享的响应式断点（对齐 plus 仓）
 *
 * 模块级单例：所有消费方（LhCol）订阅同一份断点状态与同一组监听，
 * 视口跨档时全部 Col 联动。阈值取 share core/grid 的 LH_GRID_BREAKPOINTS
 *（Tailwind 风格：xs < 640 ≤ sm < 768 ≤ md < 1024 ≤ lg < 1280 ≤ xl）。
 *
 * 【uni-app 差异】小程序无 matchMedia，也无可靠的视口宽度变更通知：
 * 监听代码用条件编译只保留在 H5 段（MP 包内无死代码），MP 端断点固定为 xs。
 * 未声明任何响应式尺寸时 Col 回退到基础 span / offset，与断点无关，
 * 因此 MP 端只影响「按档分栏」这一种用法（详见 grid 文档「平台差异」）。
 * SSR / 无 matchMedia 的 H5 环境同样安全降级为 xs。
 */
let _breakpointRef: Ref<LhGridBreakpoint> | null = null

function initBreakpoint(): Ref<LhGridBreakpoint> {
  const bp = ref<LhGridBreakpoint>('xs')

  // #ifdef H5
  {
    // jsdom 等无 matchMedia 的环境安全降级（与 plus 仓同款守卫）
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const recompute = () => {
        bp.value = resolveBreakpoint(window.innerWidth)
      }
      recompute()

      // 每个断点阈值各挂一个 matchMedia（跨档与直接缩放都可靠），回调里统一重算。
      // 单例与页面同生命周期，监听器无需逐个摘除
      for (const key of Object.keys(LH_GRID_BREAKPOINTS) as LhGridBreakpoint[]) {
        const threshold = LH_GRID_BREAKPOINTS[key]
        if (threshold <= 0) continue
        const mql = window.matchMedia(`(min-width: ${threshold}px)`)
        const handler = () => recompute()
        if (typeof mql.addEventListener === 'function') mql.addEventListener('change', handler)
        else mql.addListener(handler)
      }
    }
  }
  // #endif

  return bp
}

export function useLhBreakpoint() {
  if (!_breakpointRef) _breakpointRef = initBreakpoint()
  return { breakpoint: _breakpointRef }
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
