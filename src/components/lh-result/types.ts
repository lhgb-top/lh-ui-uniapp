import type { LhResultStatus } from '@lh-ui/share/core/result'
import type { LhSxProps } from '@lh-ui/share/core/shared'

/**
 * Result 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】状态图标统一走 iconfont（H5 与 MP 同构，无 svg 分支）；
 * title / subTitle / extra 三个插槽语义不变。
 */
export interface LhResultProps {
  /** 结果状态（决定图标与配色） */
  status?: LhResultStatus
  /** 自定义图标名（覆盖状态默认图标，消费 LhIcon 图标集；空串=不要图标） */
  icon?: string
  /** 图标尺寸（传给 lh-icon） */
  iconSize?: string | number
  /** 标题（也可用 title 插槽） */
  title?: string
  /** 副标题（也可用 subTitle 插槽） */
  subTitle?: string
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的 props 类型（SFC 里这些字段有默认值） */
export type LhResultResolvedProps = LhResultProps & {
  status: LhResultStatus
  icon: string | undefined
  iconSize: string | number
  title: string | undefined
  subTitle: string | undefined
}
