/**
 * DropdownItem 组件 Props（与 plus 仓同构）
 */
export interface LhDropdownItemProps {
  /** 命令标识，点击时随 command 事件抛出 */
  command?: string | number
  /** 是否禁用（保留 aria-disabled 语义，方向键与点击均不触发） */
  disabled?: boolean
  /** 是否在上方显示分割线 */
  divided?: boolean
}
