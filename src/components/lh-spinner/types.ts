import type { LhSxProps } from '@lh-ui/share/core/shared'
import type { LhSpinnerSize } from '@lh-ui/share/core/spinner'

/**
 * Spinner 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】根元素由 `<span>` 换成 `<view>`（WXSS 标签选择器禁用，靠类名生效）；
 * 图形载体分端渲染（H5 svg 描边环 / 小程序 view + border 圆环，见 SFC 注释与
 * 文档「平台差异」）。plus 真源仅提供 size / color / sx，未提供 type 变体与
 * label 插槽，本仓保持同构、不自行扩展 API。
 */
export interface LhSpinnerProps {
  /** 尺寸 */
  size?: LhSpinnerSize
  /** 旋转颜色（CSS color 值，未传时继承 currentColor） */
  color?: string
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhSpinnerResolvedProps = LhSpinnerProps & {
  size: LhSpinnerSize
}
