import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { getBadgeClassNames } from '@lh-ui/share/core/badge'
import { sxToStyle } from '@lh-ui/share/core/shared'
import type { LhBadgeResolvedProps } from './types'

/** scss 里 lh-badge-zoom 动画时长（进出动画用 setTimeout 对齐，见下） */
const ZOOM_DURATION = 150

/**
 * Badge 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】进出动画改 class 切换 + setTimeout：小程序的过渡/动画结束事件
 * 不可靠（本仓 message / loading 同款方案），不能照搬 plus 的 <transition>。
 */
export function useLhBadge(props: LhBadgeResolvedProps) {
  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const shouldShow = computed(() => {
    if (props.hidden) return false
    if (props.isDot) return true
    const val = props.value
    if (val === undefined || val === '') return false
    if (val === 0) return props.showZero
    return true
  })

  const displayValue = computed(() => {
    if (props.content) return props.content
    const val = props.value
    if (val === undefined || val === '') return ''
    const num = Number(val)
    if (Number.isNaN(num)) return String(val)
    return num > props.max ? `${props.max}+` : String(num)
  })

  /**
   * 修饰类挂在根元素上，样式通过 `.lh-badge--x .lh-badge__content` 生效，
   * 因此数量元素固定使用 lh-badge__content，不能复用这些修饰类。
   */
  const badgeClass = computed(() =>
    getBadgeClassNames({
      type: props.type,
      size: props.size,
      isHidden: !shouldShow.value,
      isDot: props.isDot,
      isZero: props.value === 0,
    }).filter((name) => name !== 'lh-badge'),
  )

  const badgeStyle = computed(() => {
    if (!props.offset) return {}
    return {
      marginLeft: `${-props.offset[0]}px`,
      marginTop: `${-props.offset[1]}px`,
    }
  })

  // ── 进出动画（class 切换，替代 plus 的 <transition>）──────────────────────
  // contentVisible 控制节点存留，zoomClass 挂 lh-badge-zoom 的 enter/leave 类
  const contentVisible = ref(shouldShow.value)
  const zoomClass = ref('')
  let zoomTimer: ReturnType<typeof setTimeout> | undefined

  function endZoom() {
    zoomClass.value = ''
    // 离开动画播完才真正摘节点；进入动画结束时节点本就要留
    if (!shouldShow.value) contentVisible.value = false
  }

  watch(
    () => shouldShow.value,
    (show) => {
      if (show) {
        contentVisible.value = true
        zoomClass.value = 'lh-badge-zoom-enter-active'
      } else if (contentVisible.value) {
        zoomClass.value = 'lh-badge-zoom-leave-active'
      }
      if (zoomClass.value) {
        clearTimeout(zoomTimer)
        zoomTimer = setTimeout(endZoom, ZOOM_DURATION)
      }
    },
  )

  onBeforeUnmount(() => clearTimeout(zoomTimer))

  return {
    shouldShow,
    displayValue,
    badgeClass,
    badgeStyle,
    contentVisible,
    zoomClass,
    sxStyle,
  }
}
