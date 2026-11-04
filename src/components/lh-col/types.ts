import type { LhSxProps } from '@lh-ui/share/core/shared'
import type { LhBreakpointSizes, LhColSize } from '@lh-ui/share/core/grid'

/**
 * Col 栅格列 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - `<div>` 换成 `<view>`（WXSS 标签选择器禁用，样式靠 `lh-col*` 类名生效）
 * - 增加 `customClass`：uni-app 端自定义类名无法穿透 styleIsolation，统一走 prop 透传
 * - 响应式断点由本仓 useLhBreakpoint 提供：H5 走 matchMedia，小程序无 matchMedia，
 *   固定降级为 xs（详见 lh-col/logic.ts 与文档「平台差异」）
 * - 尺寸归一 / span 钳制 / grid-column 定位全部复用 share core 纯函数，不拷贝
 */
export interface LhColProps {
  /** 占据列数（24 栅格制） */
  span?: number
  /** 左侧偏移列数 */
  offset?: number
  /** 向右平移列数 */
  push?: number
  /** 向左平移列数 */
  pull?: number
  /** <640px 生效（未声明时向下回退到更小档） */
  xs?: LhColSize
  /** ≥640px 生效 */
  sm?: LhColSize
  /** ≥768px 生效 */
  md?: LhColSize
  /** ≥1024px 生效 */
  lg?: LhColSize
  /** ≥1280px 生效 */
  xl?: LhColSize
  /** 按断点批量声明的响应式尺寸（与 xs~xl 等价，任选其一） */
  sizes?: LhBreakpointSizes
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}
