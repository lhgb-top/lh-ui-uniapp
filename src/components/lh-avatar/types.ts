import type { LhAvatarShape } from '@lh-ui/share/core/avatar'
import type { LhIconName } from '@lh-ui/share/core/icon'
import type { LhComponentSize, LhSxProps } from '@lh-ui/share/core/shared'

/** CSS object-fit 值（与 plus 仓同构） */
export type LhAvatarFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'

/**
 * Avatar 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - `<img>` 换成 `<image>`：fit prop 映射 uni 的 mode（见 resolveAvatarMode），
 *   scale-down 无完全等价，取最接近的 aspectFit（已登记偏离）
 * - `<span>` 换成 `<view>`，文字分支用 `<text>`
 */
export interface LhAvatarProps {
  /** 图片地址；为空时依次回退到图标、文字 */
  src?: string
  /** 图片加载失败的替代文本，同时作为无障碍名称 */
  alt?: string
  /** 图标名（src 为空或加载失败时展示，取内置 LhIcon 图标） */
  icon?: LhIconName
  /** 文字头像内容（src 与 icon 都缺省时取首字展示） */
  text?: string
  /** 头像形状 */
  shape?: LhAvatarShape
  /** 头像大小 */
  size?: LhAvatarSize
  /** 图片裁剪模式（映射 uni image 的 mode） */
  fit?: LhAvatarFit
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export type LhAvatarSize = LhComponentSize

export type { LhAvatarShape }

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhAvatarResolvedProps = LhAvatarProps & {
  shape: LhAvatarShape
  size: LhAvatarSize
  fit: LhAvatarFit
}
