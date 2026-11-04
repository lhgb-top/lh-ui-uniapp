import type { LhSxProps, LhComponentSize } from '@lh-ui/share/core/shared'
import type { LhCascaderNode, LhCascaderItemConfig } from '@lh-ui/share/core/cascader'

/**
 * Cascader 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - 弹层走 lh-root-portal + useLhPopper（两帧异步度量），面板为 scroll-view 多列
 * - 键盘导航（↑↓←→/Enter/Escape）仅 H5 生效；小程序无键盘事件
 * - filterable 的过滤输入框在弹层内（与 select 同款），MP 无 input 聚焦语义
 * - cascading 悬停展开仅 H5 有效，MP 端点击展开
 */
export interface LhCascaderProps {
  /** 绑定值（emitPath=true 时为完整路径，false 时仅末级值） */
  modelValue?: (string | number)[]
  /** 选项列表（树形结构） */
  options?: LhCascaderNode[]
  /** 尺寸 */
  size?: LhCascaderSize
  /** 是否禁用整个选择器 */
  disabled?: boolean
  /** 是否可清除 */
  clearable?: boolean
  /** 占位符（未传时取语言包 cascader.placeholder，中文「请选择」） */
  placeholder?: string
  /** 是否只读 */
  readonly?: boolean
  /** 是否在触发器显示完整路径 */
  showAllLevels?: boolean
  /** 任意层级节点可选（点击任意层级直接选中） */
  checkStrictly?: boolean
  /** 返回值是否包含完整路径 */
  emitPath?: boolean
  /** 是否多选 */
  multiple?: boolean
  /** 是否级联关联（悬停展开子级，仅 H5 悬停语义生效） */
  cascading?: boolean
  /** 路径分隔符 */
  separator?: string
  /** 多选模式下是否折叠标签 */
  collapseTags?: boolean
  /** 是否可搜索（MP 端过滤输入框在弹层内） */
  filterable?: boolean
  /** 节点字段别名 */
  itemConfig?: LhCascaderItemConfig
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** 组件级主题变量，覆盖 ConfigProvider 配置 */
  themeVars?: Record<string, string>
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export type LhCascaderSize = LhComponentSize

// share 类型同名再导出：供 src/index.ts 类型导出块与使用方引用（真源仍在 share core）
export type { LhCascaderNode, LhCascaderItemConfig }
