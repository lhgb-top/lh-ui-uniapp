import type { LhSxProps } from '@lh-ui/share/core/shared'
import type { LhTreeNode } from '@lh-ui/share/core/tree'

/**
 * Tree 组件 Props（与 plus 仓同构，不私自新增 plus 没有的能力）
 *
 * 【uni-app 差异】
 * - 节点容器由 `<div>` / `<span>` 换成 `<view>` / `<text>`（WXSS 标签选择器禁用，靠类名生效）
 * - 键盘导航（↑↓←→ / Home / End / Enter / Space）仅 H5：处理函数体由条件编译裁剪，
 *   函数本身双端存在（模板 @keydown 绑定留在两端，MP 端无键盘事件不会触发）
 * - 大数据量场景额外提供 `virtual` / `virtualHeight`（uni-app 独有）：
 *   节点列表改由 `scroll-view` 承载并按固定行高开窗渲染，详见 logic 注释
 */
export interface LhTreeProps {
  /** 树数据 */
  data: LhTreeNode[]
  /** 显示勾选框 */
  showCheckbox?: boolean
  /** 多选（点击节点切换选中而非替换） */
  multiple?: boolean
  /** 点击非叶子节点时展开/收起 */
  expandOnClickNode?: boolean
  /** 默认展开的键（非受控） */
  defaultExpandedKeys?: string[]
  /** 受控展开的键 */
  expandedKeys?: string[]
  /** 默认选中的键（非受控） */
  defaultSelectedKeys?: string[]
  /** 受控选中的键 */
  selectedKeys?: string[]
  /** 默认勾选的键（非受控） */
  defaultCheckedKeys?: string[]
  /** 受控勾选的键 */
  checkedKeys?: string[]
  /** 父子勾选不联动（勾选只作用于节点自身，无级联与半选） */
  checkStrictly?: boolean
  /** 懒加载模式：展开未加载的非叶子节点时调用 load */
  lazy?: boolean
  /** 懒加载回调：resolve 提交子节点并展开，reject（或抛错）取消 */
  load?: (
    node: LhTreeNode,
    resolve: (children: LhTreeNode[]) => void,
    reject: (reason?: unknown) => void,
  ) => void
  /** 整体禁用 */
  disabled?: boolean
  /**
   * 大数据量虚拟化（uni-app 独有，plus 无此能力）
   *
   * 开启后节点列表由 scroll-view 承载并按固定行高开窗渲染，
   * 适合成百上千节点的场景；行高以 --lh-tree-node-height 的默认值 34px 为准
   */
  virtual?: boolean
  /** 虚拟化模式 scroll-view 的高度（数字按 px，字符串原样写入；默认 300px） */
  virtualHeight?: number | string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhTreeResolvedProps = LhTreeProps & {
  showCheckbox: boolean
  multiple: boolean
  expandOnClickNode: boolean
  defaultExpandedKeys: string[]
  defaultSelectedKeys: string[]
  defaultCheckedKeys: string[]
  checkStrictly: boolean
  lazy: boolean
  disabled: boolean
  virtual: boolean
}

// share 类型同名再导出：供 src/index.ts 类型导出块与使用方引用（真源仍在 share core）
export type { LhTreeNode, LhTreeCheckState, LhFlatTreeNode } from '@lh-ui/share/core/tree'
