import type { LhLoadingHandle } from '@lh-ui/share/core/loading'

/**
 * Loading 服务选项（与 plus 仓同构，target 改为可选且 MP 端仅支持全屏）
 *
 * 【uni-app 差异】plus 的 target 是 DOM 选择器或元素；MP 无法选择任意节点挂遮罩，
 * 首版只支持全屏遮罩（target 字段保留但 MP 端忽略，文档声明）。
 */
export interface LhLoadingOptions {
  /** 目标节点（仅 H5 端生效；MP 端恒为全屏） */
  target?: string
  /** 加载文案 */
  text?: string
  /** 遮罩背景色 */
  background?: string
  /** 锁定滚动（仅 H5 端生效） */
  lock?: boolean
  /** 层级；不传时由 useLhZIndex 自增分配 */
  zIndex?: number
}

export type { LhLoadingHandle }
