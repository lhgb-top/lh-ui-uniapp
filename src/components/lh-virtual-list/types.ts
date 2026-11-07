import type { LhSxProps } from '@lh-ui/share/core/shared'

export interface LhVirtualListProps {
  /** 数据源（项渲染由 default 插槽负责） */
  data: any[]
  /** 容器高度（数字为 px） */
  height: number | string
  /** 定高模式的项高（与 itemSize 二选一；提供了 itemSize 时走动态高度） */
  itemHeight?: number
  /**
   * 动态高度模式：由调用方返回每项高度（声明式，两端同效——
   * 与 plus 一致的纯函数契约，不依赖 MP 没有的 ResizeObserver 实测）
   */
  itemSize?: (index: number) => number
  /** 过扫描项数 */
  overscan?: number
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的运行时默认值契约 */
export type LhVirtualListResolvedProps = LhVirtualListProps & {
  overscan: number
}
