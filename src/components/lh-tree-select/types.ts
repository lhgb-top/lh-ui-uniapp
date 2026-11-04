import type { LhSxProps } from '@lh-ui/share/core/shared'
import type { LhTreeNode } from '@lh-ui/share/core/tree'

/**
 * TreeSelect 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - share core 无 tree-select 模块：本端是「select 触发器 + tree 面板」的胶水组合，
 *   树形渲染 / 勾选级联全部由内嵌的 lh-tree 消费 core/tree 纯函数，不拷贝实现
 * - 弹层一律走 lh-root-portal（plus 的 teleported 挂 body 语义在小程序不存在，未移植）
 * - 键盘导航 / focus-trap 不启用（MP 无键盘事件），点击遮罩关闭
 */
export interface LhTreeSelectProps {
  /** 树数据 */
  data: LhTreeNode[]
  /** 当前值（单选 string / 多选 string[]，受控 v-model） */
  modelValue?: string | string[]
  /** 多选（显示勾选框，值为勾选键数组，父子级联） */
  multiple?: boolean
  /** 禁用 */
  disabled?: boolean
  /** 占位文本 */
  placeholder?: string
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** 组件级主题变量，覆盖 ConfigProvider 配置 */
  themeVars?: Record<string, string>
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export type { LhTreeNode } from '@lh-ui/share/core/tree'
