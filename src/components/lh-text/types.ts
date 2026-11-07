import type { LhTextLevel, LhTextType } from '@lh-ui/share/core/text'
import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Text 组件 Props（与 plus 仓同构，新增 copyText 见差异说明）
 *
 * 【uni-app 差异】
 * - 动态标签（component :is）在 MP 模板编译器不支持：SFC 统一渲染 view，
 *   排版规格全部由 lh-text--<level> 修饰类承载（H5 与 MP 同构），
 *   getTextTag 的标签映射在本仓不落图（caption 亦为块级）。
 * - 复制文本：MP 端组件读不到插槽文本（无 textContent），须由 copyText
 *   显式指定；H5 端不传 copyText 时回退读插槽 DOM 文本。
 * - aria 属性包按本仓坑 16 摊开绑定（不使用 v-bind="attrs"）。
 */
export interface LhTextProps {
  /** 标题级别与段落形态：h1~h6 标题、p 正文（默认）、caption 行内小字 */
  level?: LhTextLevel
  /** 语义色：default 常规、secondary 次要、其余为状态色 */
  type?: LhTextType
  /** 加粗 */
  strong?: boolean
  /** 斜体 */
  italic?: boolean
  /** 下划线 */
  underline?: boolean
  /** 标记高亮 */
  mark?: boolean
  /** 代码风格 */
  code?: boolean
  /** 省略：true 单行省略，数字按行数截断（上限 10） */
  ellipsis?: boolean | number
  /** 追加复制按钮，点击写入剪贴板并短暂切换为「已复制」 */
  copyable?: boolean
  /** 复制按钮的无障碍名称（未传时取语言包 text.copy / text.copied） */
  copyLabel?: string
  /** 要复制的文本（MP 端读不到插槽文本，必须显式指定；H5 端不传时取插槽文本） */
  copyText?: string
  /** 禁用：文本灰化、不复制 */
  disabled?: boolean
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的 props 类型（SFC 里这些字段有默认值） */
export type LhTextResolvedProps = LhTextProps & {
  level: LhTextLevel | undefined
  type: LhTextType | undefined
  strong: boolean
  italic: boolean
  underline: boolean
  mark: boolean
  code: boolean
  ellipsis: boolean | number
  copyable: boolean
  copyLabel: string | undefined
  copyText: string | undefined
  disabled: boolean
}
