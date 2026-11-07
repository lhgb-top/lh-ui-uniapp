import type { LhSxProps } from '@lh-ui/share/core/shared'
import type { LhTableColumn, LhTableRow, LhTableSortOrder } from '@lh-ui/share/core/table'

export interface LhTableProps {
  /** 行数据 */
  data: LhTableRow[]
  /** 列配置 */
  columns: LhTableColumn[]
  /** 表体高度（设置后启用虚拟滚动；数字为 px） */
  height?: number | string
  /** 非虚拟模式下的最大高度 */
  maxHeight?: number | string
  /** 虚拟滚动行高（需与实际行高一致） */
  rowHeight?: number
  /** 斑马纹（MP 端因 WXSS 不支持 :nth 由模板按索引补 --alt 类） */
  stripe?: boolean
  /** 单元格边框 */
  border?: boolean
  /** 尺寸 */
  size?: 'small' | 'default' | 'large'
  /** 行键字段名 */
  rowKey?: string
  /** 默认排序列 */
  defaultSortProp?: string
  /** 默认排序方向 */
  defaultSortOrder?: LhTableSortOrder
  /** 自定义排序函数 */
  sorter?: (a: LhTableRow, b: LhTableRow) => number
  /** 开启列宽拖拽（H5 专属：mousedown 语义在 MP 不存在；仍需列级 resizable 配合且列须为数字 width） */
  resizable?: boolean
  /** 默认筛选状态（非受控，键为列 prop） */
  defaultFilteredValues?: Record<string, (string | number)[]>
  /** 受控筛选状态（键为列 prop） */
  filteredValues?: Record<string, (string | number)[]>
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的运行时默认值契约 */
export type LhTableResolvedProps = LhTableProps & {
  rowHeight: number
  stripe: boolean
  border: boolean
  size: 'small' | 'default' | 'large'
  rowKey: string
  resizable: boolean
}

export type { LhTableColumn, LhTableRow, LhTableSortOrder } from '@lh-ui/share/core/table'
