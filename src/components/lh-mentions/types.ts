import type { LhMentionOption } from '@lh-ui/share/core/mentions'
import type { LhSxProps } from '@lh-ui/share/core/shared'

/** 选项：label 为展示与写回文本的提及文案，value 为提交值（默认与 label 相同） */
export type { LhMentionOption }

/**
 * Mentions 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - 输入控件用 uni 内置 `<input>` / `<textarea>`（事件载荷在 event.detail.value）；
 *   弹层套 lh-select 的 root-portal + 两帧度量范式（plus 是手搓 Teleport + fixed）。
 * - 光标上下文：H5 端从原生控件读 `selectionStart`（uni-h5 与 vitest 均成立）；
 *   **MP 端拿不到可靠的光标位置**，用 input 事件 detail 近似（以文本末尾为光标），
 *   在已输入文本中间触发提及的场景会失效——脆弱路径降级为「在末尾插入」，
 *   平台矩阵已登记。
 * - 键盘导航 / Esc 由 @keydown 承载，绑定留双端、MP 端永不触发（本仓既有约定）。
 * - aria 属性包按本仓坑 16 摊开绑定（MP 模板不支持 v-bind="attrs"）。
 */
export interface LhMentionsProps {
  /** 文本内容（受控 v-model） */
  modelValue?: string
  /** 建议成员 */
  options?: LhMentionOption[]
  /** 触发字符（默认 '@'） */
  prefix?: string
  /** 占位提示（未传时取语言包 mentions.placeholder） */
  placeholder?: string
  /** 占位样式（MP 端替代 ::placeholder） */
  placeholderStyle?: string
  /** 禁用 */
  disabled?: boolean
  /** 多行 textarea（默认单行 input） */
  multiline?: boolean
  /** 无障碍名称（未传时取语言包 mentions.label） */
  ariaLabel?: string
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的 props 类型（SFC 里这些字段有默认值） */
export type LhMentionsResolvedProps = LhMentionsProps & {
  modelValue: string
  options: LhMentionOption[]
  prefix: string
  placeholder: string | undefined
  disabled: boolean
  multiline: boolean
}
