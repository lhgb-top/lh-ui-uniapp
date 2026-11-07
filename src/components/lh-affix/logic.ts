import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getAffixClassNames, getAffixFixedStyle, isAffixFixed } from '@lh-ui/share/core/affix'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { getSingleLhRect } from '@/adapter/getRect'
import { LH_IS_H5, getLhWindowInfo } from '@/adapter/platform'
import { subscribeLhScroll } from '@/adapter/scroll'
import type { LhEmitFn } from '@/types/emit'
import type { LhAffixResolvedProps } from './types'

/**
 * Affix 固定胶水（逻辑对齐 plus 仓，MP 端改 scroll-view 变体）
 *
 * 固定判定 / 固定样式全部走 share core 纯函数（isAffixFixed /
 * getAffixFixedStyle），本仓不复制任何 core 实现。
 *
 * 【uni-app 差异】
 * - 滚动来源：H5 自行订阅 window / target 的 scroll 事件（subscribeLhScroll，
 *   原生 addEventListener 挂在目标 DOM 上）；MP 端 scroll 事件只能绑在
 *   scroll-view 标签上，组件无法自行订阅，滚动位置由使用者把 scroll-view
 *   的 scroll 事件 detail.scrollTop 经 scrollTop prop 注入。
 * - 占位度量：两端统一用 getSingleLhRect 按 id 度量（H5 走 adapter 的
 *   document 查询，MP 走 createSelectorQuery，scope 为本组件实例，
 *   onReady 之后调用）。**不用模板 ref**——uni-h5 的 view 是 Vue 组件，
 *   ref 拿到的是组件实例代理而非 DOM 节点，getBoundingClientRect 不存在。
 *   MP 端 boundingClientRect 相对屏幕，与 H5 的视口相对语义一致，
 *   isAffixFixed 可直接复用。
 * - IntersectionObserver（plus 的优化路径）MP 不支持，两端统一走
 *   scroll 驱动的度量路径（plus 在无 IO 环境也是这个兜底）。
 */
export function useLhAffix(props: LhAffixResolvedProps, emit: LhEmitFn<'change'>) {
  const instance = getCurrentInstance()
  /** 占位节点 id（两端 getSingleLhRect 的选择器） */
  const placeholderId = `lh-affix-placeholder-${instance?.uid ?? Math.random().toString(36).slice(2)}`

  const fixed = ref(false)
  /** 占位节点自然尺寸（固定后用于占位高度与固定宽度，避免内容坍缩） */
  const placeholderWidth = ref(0)
  const placeholderHeight = ref(0)

  /**
   * 度量占位节点（按 id，两端同一路径；getSingleLhRect 在 H5 走
   * document 查询、MP 走 createSelectorQuery）
   */
  async function measurePlaceholder(): Promise<{ top: number; bottom: number; width: number; height: number } | null> {
    // 【生命周期红线】createSelectorQuery 必须在 onReady 之后调用；
    // 本函数只由 scroll 回调 / mounted 之后的 watch 触发，满足约束
    try {
      const rect = await getSingleLhRect(`#${placeholderId}`, instance?.proxy ?? null)
      placeholderWidth.value = rect.width
      placeholderHeight.value = rect.height
      return { top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height }
    } catch {
      return null
    }
  }

  /** 固定态判定：占位节点相对视口越界即固定，viewportHeight 走 adapter 两端各取 */
  async function updateFixed(): Promise<void> {
    const rect = await measurePlaceholder()
    if (!rect) return
    const next = isAffixFixed(
      { top: rect.top, bottom: rect.bottom },
      props.offsetTop,
      props.offsetBottom,
      getLhWindowInfo().height,
    )
    if (next !== fixed.value) {
      fixed.value = next
      emit('change', next)
    }
  }

  /** H5 端滚动订阅（target 变化时重订阅） */
  let unsubscribe = () => {}
  function resubscribe(): void {
    if (!LH_IS_H5) return
    unsubscribe()
    unsubscribe = subscribeLhScroll(props.target, () => void updateFixed())
  }

  watch(
    () => props.target,
    () => resubscribe(),
  )

  onMounted(() => {
    resubscribe()
    // 首测：挂载后若已注入 scrollTop，先按当前位置判一次
    if (props.scrollTop != null) void updateFixed()
  })

  onBeforeUnmount(() => {
    unsubscribe()
  })

  /**
   * 滚动位置注入驱动（两端通用）：
   * MP 端是唯一来源（scroll-view 的 detail.scrollTop）；
   * H5 端在「组件置于 scroll-view 内」的场景同样需要——uni-h5 的 scroll-view
   * 原生 scroll 事件触发在内层容器、不冒泡，组件挂在外层的订阅收不到，
   * 经 prop 注入是 scroll-view 场景下两端一致的驱动方式（非 scroll-view
   * 容器仍走上面的 target 订阅）。
   */
  watch(
    () => props.scrollTop,
    () => {
      void updateFixed()
    },
  )

  const affixClasses = computed(() => getAffixClassNames({ fixed: fixed.value }))

  const affixStyle = computed(() => {
    if (!fixed.value) return sxToStyle(props.sx ?? {})
    return {
      ...getAffixFixedStyle(props.offsetTop, props.offsetBottom),
      zIndex: 'var(--lh-affix-z-index, 900)',
      width: placeholderWidth.value > 0 ? `${placeholderWidth.value}px` : 'auto',
      ...sxToStyle(props.sx ?? {}),
    }
  })

  /** 固定后用占位高度撑住原位置，防止后文内容上移跳变 */
  const placeholderStyle = computed(() =>
    fixed.value ? { height: `${placeholderHeight.value}px` } : undefined,
  )

  return {
    placeholderId,
    fixed,
    affixClasses,
    affixStyle,
    placeholderStyle,
    updateFixed,
  }
}
