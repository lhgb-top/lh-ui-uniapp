import type { LhImageFit } from '@lh-ui/share/core/image'
import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Image 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - `<img>` 换成 uni 的 `<image>`：fit prop 映射 mode（见 logic.ts 的 FIT_TO_MODE，
 *   none / scale-down 无完全等价，偏离已登记）
 * - 原生懒加载：plus 用 img 的 loading="lazy"，uni 端换 `<image>` 自带的 lazy-load
 * - 预览走 uni.previewImage 原生 API（全端可用），替代 plus 的自绘 Viewer 弹层
 *   （LhImageViewer 依赖 teleport + document，小程序不可用，不交付）
 * - 增加 `customClass`：uni-app 端自定义类名无法穿透 styleIsolation，统一走 prop 透传
 * - plus 同样没有 width / height / radius prop：尺寸走 sx，圆角由 share 样式源
 *   内置（--lh-border-radius-small），不私自新增
 */
export interface LhImageProps {
  /** 图片地址 */
  src: string
  /** 替代文本（a11y 强约束，TS 层必填） */
  alt: string
  /** 裁切模式（映射 uni image 的 mode） */
  fit?: LhImageFit
  /** 是否可点击预览 */
  preview?: boolean
  /** 预览图列表（未传时退化为 [src]） */
  previewSrcList?: string[]
  /** 懒加载（uni image 原生 lazy-load） */
  lazy?: boolean
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhImageResolvedProps = LhImageProps & {
  fit: LhImageFit
  preview: boolean
  lazy: boolean
}

// 裁切模式类型真源在 share core，同名透传再导出（名字由 share 决定，跟随发版）
export type { LhImageFit }
