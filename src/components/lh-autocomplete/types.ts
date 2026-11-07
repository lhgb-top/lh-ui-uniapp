import type { LhAutocompleteOption } from '@lh-ui/share/core/autocomplete'
import type { LhSxProps } from '@lh-ui/share/core/shared'

/** 选项：label 为展示文案，value 为提交值（默认与 label 相同），disabled 置灰不可选 */
export type { LhAutocompleteOption }

/**
 * Autocomplete 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - 输入框用 uni 内置 `<input>`（事件载荷在 event.detail.value）；
 *   弹层套 lh-select 的 root-portal + 两帧度量范式（plus 是手搓 Teleport + fixed）。
 * - 键盘导航 / Esc 由 @keydown 承载，绑定留双端、MP 端无键盘事件永不触发
 *   （本仓既有约定，同 cascader / date-picker）；hover 高亮 MP 端丢弃，
 *   点击 / 触摸高亮承载。
 * - aria 属性包按本仓坑 16 摊开绑定（MP 模板不支持 v-bind="attrs"）。
 */
export interface LhAutocompleteProps {
  /** 输入值（受控 v-model） */
  modelValue?: string
  /** 建议选项 */
  options?: LhAutocompleteOption[]
  /** 大小写敏感匹配 */
  caseSensitive?: boolean
  /** 去除查询串首尾空白后再匹配（默认 true） */
  trim?: boolean
  /** 占位提示 */
  placeholder?: string
  /** 占位样式（MP 端替代 ::placeholder） */
  placeholderStyle?: string
  /** 禁用 */
  disabled?: boolean
  /** 聚焦时是否直接展开建议面板（默认 true） */
  openOnFocus?: boolean
  /** 无障碍名称（未传时取语言包 autocomplete.label） */
  ariaLabel?: string
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的 props 类型（SFC 里这些字段有默认值） */
export type LhAutocompleteResolvedProps = LhAutocompleteProps & {
  modelValue: string
  options: LhAutocompleteOption[]
  caseSensitive: boolean
  trim: boolean
  placeholder: string
  disabled: boolean
  openOnFocus: boolean
}
