import { computed, useSlots } from 'vue'
import { getResultClassNames, getResultIconName, isValidResultStatus } from '@lh-ui/share/core/result'
import { sxToStyle } from '@lh-ui/share/core/shared'
import type { LhResultResolvedProps } from './types'

/**
 * Result 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】零平台依赖组件：core 纯函数全复用，图标走 lh-icon
 * （H5 与 MP 均 iconfont 渲染）。状态非法时兜底 info，与 plus 同构。
 */
export function useLhResult(props: LhResultResolvedProps) {
  const slots = useSlots()

  const normalizedStatus = computed(() =>
    isValidResultStatus(props.status) ? props.status : 'info',
  )

  /** 图标名：显式 icon（含空串=不要图标）优先，未传时回退状态默认图标 */
  const iconName = computed(() =>
    getResultIconName(normalizedStatus.value, props.icon),
  )

  /** 修饰类挂在根元素上，lh-result 本身已在模板写死，这里滤掉避免重复 */
  const resultClass = computed(() =>
    getResultClassNames({ status: normalizedStatus.value }).filter(
      (name) => name !== 'lh-result',
    ),
  )

  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const hasSubTitleSlot = computed(() => !!slots.subTitle)

  return { iconName, resultClass, sxStyle, hasSubTitleSlot }
}
