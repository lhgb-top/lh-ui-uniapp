import type { LhCollapseItemProps } from '../lh-collapse/types'

export type { LhCollapseItemProps }

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhCollapseItemResolvedProps = LhCollapseItemProps & {
  disabled: boolean
}
