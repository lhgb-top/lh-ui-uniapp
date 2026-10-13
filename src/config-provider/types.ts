import type { InjectionKey, ComputedRef } from 'vue'
import type { LhSizes } from '@lh-ui/share/types'
import type { LhLocaleType as LocaleType } from '@lh-ui/share/types'

/**
 * 可配置主题的组件名称集合（基线与 plus 仓保持一致，新增组件时双写）
 *
 * 名单分两组：上面是本仓已实现并已通过 useLhComponent 消费的键，
 * 下面是 plus 基线的前向声明（本仓尚未实现对应组件，或组件未接入组件级主题 ——
 * 如 form：lh-form 目前只做表单联动，不持有主题变量）。
 * 前向声明保留是为了 componentTheme 的键名在两端一致，使用者按 plus 文档传值不报错。
 *
 * 【uni-app 偏离】plus 的 checkbox / radio 未接入组件级主题（componentTheme 里
 * 没有这两项）；本仓 P0 的 checkbox / radio 走 useLhComponent 统一处理
 * themeVars / sx 透传，故在此补上，componentTheme 支持这两个键。
 */
export type LhThemeableComponent =
  // ── 本仓已消费（useLhComponent('<name>')）──
  | 'button'
  | 'input'
  | 'dialog'
  | 'tooltip'
  | 'icon'
  | 'card'
  | 'tag'
  | 'switch'
  | 'select'
  | 'checkbox'
  | 'radio'
  // ── 前向声明（plus 基线，本仓尚未消费）──
  | 'alert'
  | 'popover'
  | 'popconfirm'
  | 'drawer'
  | 'dropdown'
  | 'message'
  | 'notification'
  | 'loading'
  | 'form'

/**
 * 主题模式
 * - light 明色（默认）
 * - dark 暗色：uni-app 端通过给包裹节点加 `dark` 类实现
 *   （净化后的样式里暗色块选择器是 `page.dark, .dark`，见 scripts/build-styles.mjs）
 */
export type LhThemeMode = 'light' | 'dark'

/**
 * ConfigProvider 配置项（对齐 plus 仓 props，新增 theme 字段）
 */
export interface LhConfigProviderProps {
  /** 全局尺寸 */
  size?: LhSizes
  /** 全局语言 */
  locale?: LocaleType
  /** 主题模式（uni-app 端新增：plus 仓靠 document.documentElement 切 data-theme，小程序无 DOM） */
  theme?: LhThemeMode
  /** 全局主题变量
   * 支持键（会自动添加 --lh- 前缀）：
   * - `primary-color`, `success-color`, `warning-color`, `danger-color`, `info-color`
   * - `gold-color`, `vermilion-color`, `jade-color`
   * - `bg-color`, `text-color`, `border-color`
   * - `bg-pattern` — 花纹背景（如 `var(--lh-pattern-willow)`）
   * - `bg-pattern-opacity` — 花纹透明度
   * - `bg-pattern-color` — 花纹颜色
   * - `decoration-color` — 装饰色 */
  themeVars?: Record<string, string>
  /** 按组件单独配置主题变量（覆盖全局 themeVars）
   * 键为组件名，值为该组件的主题变量对象
   * 优先级: 组件自身 props > componentTheme[组件名] > 全局 themeVars
   */
  componentTheme?: Partial<Record<LhThemeableComponent, Record<string, string>>>
}

/**
 * ConfigProvider 通过 provide/inject 传递的配置上下文
 */
export interface LhConfigContext {
  size: LhSizes | undefined
  locale: LocaleType | undefined
  theme: LhThemeMode | undefined
  themeVars: Record<string, string> | undefined
  componentTheme?: Partial<Record<LhThemeableComponent, Record<string, string>>>
}

/**
 * ConfigProvider 注入 key
 * 注入的是 computed 引用而非快照对象，保证 provider props 变化能传导给 inject 方
 */
export const LH_CONFIG_PROVIDER_KEY: InjectionKey<ComputedRef<LhConfigContext>> =
  Symbol('LhConfigProviderKey')
