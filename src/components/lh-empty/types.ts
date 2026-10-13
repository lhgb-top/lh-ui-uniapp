import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Empty 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】默认水墨插画条件编译：
 * H5 保留内联 `<svg>`（主题着色类名在 share scss 里，完整保真）；
 * 小程序不支持 svg，改用 CSS 绘制简化版（样式落在 SFC 内联 `<style>`，
 * 与 lh-select 的内联适配样式同款，不进 build-styles 产物）。
 * 自定义图片分支的 `<img>` 换成 `<image class="lh-img">`
 * （吃 build-styles 的 img → .lh-img 改写）。
 */
export interface LhEmptyProps {
  /** 空状态描述文案（未传时取语言包 empty.description） */
  description?: string
  /** 自定义图片 URL（替代默认插画） */
  image?: string
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的 props 类型（SFC 里这些字段有默认值） */
export type LhEmptyResolvedProps = LhEmptyProps & {
  description: string | undefined
  image: string | undefined
}
