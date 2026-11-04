import type { LhSxProps } from '@lh-ui/share/core/shared'
import type { LhTransferItem } from '@lh-ui/share/core/transfer'

/**
 * Transfer 组件 Props（与 plus 仓同构，不私自新增 plus 没有的能力）
 *
 * 【uni-app 差异】
 * - 容器 / 面板 / 列表项由 `<div>` / `<ul>` / `<li>` 换成 `<view>`
 *   （WXSS 禁标签选择器，靠类名生效）
 * - 双列列表由 scroll-view 承载：MP 端 `<view>` 的 overflow 溢出滚动不可靠，
 *   换成 uni 内置 `<scroll-view scroll-y>` 后 H5 / MP 行为一致
 * - 全选框与列表项勾选框不用原生 `<input type="checkbox">`（MP 样式不可控），
 *   改用本仓 `lh-checkbox`（view 自绘 + lh-icon，受控写入）
 * - 搜索框是 uni 内置 `<input>`（类名直接消费 share 的 `.lh-transfer-panel__search`）
 * - 键盘导航（roving tabindex + 方向键跨面板跳焦 + Enter/Space 勾选）仅 H5：
 *   处理函数体由条件编译裁剪，函数本身双端存在（模板 @keydown 绑定留在两端，
 *   MP 端无键盘事件不会触发）
 */
export interface LhTransferProps {
  /** 全量数据 */
  data: LhTransferItem[]
  /** 左侧（源）键列表（受控 v-model） */
  modelValue?: Array<string | number>
  /** 禁用 */
  disabled?: boolean
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhTransferResolvedProps = LhTransferProps & {
  modelValue: Array<string | number>
  disabled: boolean
}

// share 类型同名再导出：供 src/index.ts 类型导出块与使用方引用（真源仍在 share core）
export type { LhTransferItem, LhTransferSide } from '@lh-ui/share/core/transfer'
