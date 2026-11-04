import { computed } from 'vue'
import { getColStyle, getGridColClassNames, resolveResponsiveSize } from '@lh-ui/share/core/grid'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { useLhBreakpoint } from '@/composables'
import type { LhColProps } from './types'

/**
 * Col 栅格列胶水（逻辑对齐 plus 仓）
 *
 * 尺寸归一 / span 钳制 / grid-column 定位 / 向下回退全部走 share core 纯函数，
 * 本仓只做 computed 包裹 + 断点上下文接入 + customClass 拼接 + sx 求值。
 * 【uni-app 差异】断点来源不同：plus 走 window.matchMedia（见 composables），
 * 本仓 useLhBreakpoint 用条件编译把监听只留在 H5 段，小程序无 matchMedia，
 * 固定降级为 xs（规则与回退算法仍由 share core 的 resolveResponsiveSize 决定）。
 */
export function useLhCol(props: LhColProps) {
  const { breakpoint } = useLhBreakpoint()

  /** 当前断点下生效的尺寸：无任何响应式声明时回退到 span/offset/push/pull */
  const size = computed(() => {
    const responsive = resolveResponsiveSize(
      {
        xs: props.xs,
        sm: props.sm,
        md: props.md,
        lg: props.lg,
        xl: props.xl,
        ...props.sizes,
      },
      breakpoint.value,
    )
    if (responsive != null) return responsive
    return {
      span: typeof props.span === 'number' ? props.span : undefined,
      offset: props.offset,
      push: props.push,
      pull: props.pull,
    }
  })

  const colClasses = computed(() => [...getGridColClassNames(size.value), props.customClass])

  const colStyle = computed(() => ({ ...getColStyle(size.value), ...sxToStyle(props.sx ?? {}) }))

  return {
    colClasses,
    colStyle,
  }
}
