import { computed, useSlots } from 'vue'
import { getEmptyClassNames } from '@lh-ui/share/core/empty'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { lhlocale } from '@/adapter/locale'
import type { LhEmptyResolvedProps } from './types'

/**
 * Empty 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 默认插画条件编译：H5 走内联 svg，MP 走 CSS 简化版（见 SFC）
 * - 文案国际化：lhlocale.t 内部已订阅版本号，切换语言自动重算
 *   （plus 在 SFC 里手写 t 包装器，本仓收敛到胶水层）
 */
export function useLhEmpty(props: LhEmptyResolvedProps) {
  const slots = useSlots()

  /** 走自定义图片分支：显式 image 或默认插槽自绘 */
  const hasCustomImage = computed(() => !!props.image || !!slots.default)

  const emptyClass = computed(() =>
    getEmptyClassNames({ hasImage: hasCustomImage.value }),
  )

  const emptyStyle = computed(() => sxToStyle(props.sx ?? {}))

  const descriptionText = computed(() =>
    props.description || lhlocale.t('empty.description', '暂无数据'),
  )

  return { hasCustomImage, emptyClass, emptyStyle, descriptionText }
}
