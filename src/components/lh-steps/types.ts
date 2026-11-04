import type { InjectionKey, Ref } from 'vue'
import type { LhSxProps } from '@lh-ui/share/core/shared'
import type { LhIconName } from '@lh-ui/share/core/icon'
import type { LhStepStatus, LhStepsDirection } from '@lh-ui/share/core/steps'

/**
 * Steps 组件 Props（与 plus 仓同构）
 *
 * 【uni-app 差异】
 * - `<ol>/<li>` 换成 `<view>`（WXSS 禁标签选择器，靠类名生效）
 * - 无 plus 的 `themeVars` / ConfigProvider componentTheme 通道（本仓 ConfigProvider 的
 *   `LhThemeableComponent` 名单未含 steps），组件级主题变量由后续按需登记
 * - 状态派生与类名计算与 plus 完全一致（复用 share core 纯函数）
 */
export interface LhStepsProps {
  /** 当前步骤索引（v-model:current，0 起） */
  current?: number
  /** 方向 */
  direction?: LhStepsDirection
  /** 步骤是否可点击导航 */
  clickable?: boolean
  /** 整体覆盖所有步骤的状态（用于自定义展示） */
  status?: LhStepStatus
  /** 自定义类名（透传到根节点） */
  customClass?: string
  /** sx 快速布局属性 */
  sx?: LhSxProps
}

export interface LhStepProps {
  /** 步骤标题（也可用 title 插槽） */
  title?: string
  /** 步骤描述（也可用 description 插槽） */
  description?: string
  /** 自定义图标名称（未传时 finish/error 用勾叉，其余显示序号） */
  icon?: LhIconName
  /** 自定义类名（透传到项根节点） */
  customClass?: string
}

/** Steps 父子组件上下文（与 plus 的 LhStepsContext 同构） */
export interface LhStepsContext {
  /** 已注册步骤的 token 列表（setup 顺序即渲染顺序） */
  itemTokens: Ref<symbol[]>
  /** 当前步骤索引 */
  current: Ref<number>
  /** 是否可点击导航 */
  clickable: Ref<boolean>
  /** 整体覆盖状态 */
  forcedStatus: Ref<LhStepStatus | undefined>
  /**
   * 不画连接线的步骤项索引：
   * - 横向：折行测量结果（行末项，含全局末项——共享 share 的 getStepsLineLastIndices）
   * - 纵向：恒为 [全局末项]（WXSS 不支持 :not(:last-child)，构建期已剥离，
   *   末项连接线的隐藏由本仓 --line-last 类接管，见组件文档「平台差异」）
   */
  lineLastIndices: Ref<number[]>
  /** 点击导航到指定步骤 */
  select: (index: number) => void
}

export const LH_STEPS_KEY: InjectionKey<LhStepsContext> = Symbol('LhSteps')

/** withDefaults 之后的 props 类型（这些字段在 SFC 里有默认值，运行时保证非空） */
export type LhStepsResolvedProps = LhStepsProps & {
  current: number
  direction: LhStepsDirection
  clickable: boolean
}
