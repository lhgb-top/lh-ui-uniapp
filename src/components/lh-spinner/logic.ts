import { computed } from 'vue'
import { getSpinnerClassNames, LH_SPINNER_SIZE_PX } from '@lh-ui/share/core/spinner'
import { sxToStyle } from '@lh-ui/share/core/shared'
import type { LhSpinnerResolvedProps } from './types'

/**
 * Spinner 组件胶水（逻辑对齐 plus 仓）
 *
 * 类名与尺寸映射完全由 share core 纯函数产出，仓内只写响应式胶水。
 *
 * 【uni-app 差异】渲染载体分端：H5 走与 plus 逐像素同构的 svg 描边环
 * （stroke-dasharray 双动画）；小程序不支持 svg 模板标签，改用
 * view + border 圆环（旋转动画同为 CSS animation，全端可用，见 SFC 注释）。
 */
export function useLhSpinner(props: LhSpinnerResolvedProps) {
  const spinnerClasses = computed(() => getSpinnerClassNames({ size: props.size }))

  const diameter = computed(() => LH_SPINNER_SIZE_PX[props.size])

  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const spinnerStyle = computed(() => ({
    width: `${diameter.value}px`,
    height: `${diameter.value}px`,
    color: props.color,
    ...sxStyle.value,
  }))

  /**
   * 小程序端圆环描边宽度：与 svg 版的视觉比例对齐
   * （plus 的 stroke-width 5 / viewBox 50 ≈ 直径的 10%，最小 1px 保证小尺寸可见）。
   * 颜色不经此处，走根节点 color 内联样式 + currentColor 继承，与 plus 一致。
   */
  const ringStyle = computed(() => ({
    borderWidth: `${Math.max(1, diameter.value / 10)}px`,
  }))

  return {
    spinnerClasses,
    spinnerStyle,
    ringStyle,
  }
}
