import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  buildVirtualItems,
  computeVirtualRange,
  findVirtualRange,
  getVirtualListClassNames,
} from '@lh-ui/share/core/virtual-list'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { getSingleLhRect } from '@/adapter/getRect'
import { LH_IS_H5 } from '@/adapter/platform'
import type { LhVirtualListResolvedProps } from './types'

/**
 * VirtualList 虚拟列表胶水（逻辑对齐 plus 仓，MP 端容器改 scroll-view）
 *
 * 区间算法（定高 computeRange / 动态 buildVirtualItems + findVirtualRange）
 * 全部走 share core 纯函数，本仓不复制任何 core 实现。itemSize 是声明式
 * 函数契约（调用方返回项高），两端同效——plus 依赖 ResizeObserver 的只是
 * **视口高度**测量，不是项高测量。
 *
 * 【uni-app 差异】
 * - 滚动容器：H5 渲染 view（overflow: auto，share CSS 已含）；MP 渲染
 *   scroll-view（scroll-y），滚动事件取 event.detail.scrollTop。
 * - 视口度量：H5 用 clientHeight + ResizeObserver（plus 同款）；
 *   MP 无 ResizeObserver，改 createSelectorQuery 量容器高度（getSingleLhRect，
 *   scope 为本组件实例），并在 height prop 变化后补量一次。
 */
export function useLhVirtualList(props: LhVirtualListResolvedProps) {
  const instance = getCurrentInstance()
  /** 容器 id（两端度量 / H5 DOM 订阅的选择器） */
  const rootId = `lh-virtual-list-${instance?.uid ?? Math.random().toString(36).slice(2)}`

  const scrollTop = ref(0)
  const viewportHeight = ref(0)

  /** 动态高度模式：按 itemSize 预计算偏移（纯函数契约，两端同效） */
  const dynamicItems = computed(() => {
    if (!props.itemSize) return null
    const sizes = props.data.map((_, index) => props.itemSize?.(index) ?? 0)
    return buildVirtualItems(props.data.length, sizes)
  })

  const range = computed(() => {
    if (dynamicItems.value) {
      return findVirtualRange(
        dynamicItems.value.items,
        scrollTop.value,
        viewportHeight.value,
        props.overscan,
      )
    }
    return computeVirtualRange(
      scrollTop.value,
      viewportHeight.value,
      props.itemHeight ?? 40,
      props.data.length,
      props.overscan,
    )
  })

  const totalHeight = computed(() => range.value.totalHeight)
  const offsetY = computed(() => range.value.offsetY)

  const visibleIndexes = computed(() =>
    Array.from(
      { length: Math.max(0, range.value.end - range.value.start) },
      (_, i) => range.value.start + i,
    ),
  )

  function itemStyle(index: number): Record<string, string> {
    if (!dynamicItems.value) {
      return props.itemHeight ? { height: `${props.itemHeight}px` } : {}
    }
    const item = dynamicItems.value.items[index]
    return item ? { height: `${item.size}px` } : {}
  }

  /** uni 滚动事件载荷：H5 走 target.scrollTop，MP 走 detail.scrollTop */
  type LhUniScrollEvent = { detail?: { scrollTop?: unknown } }

  function onScroll(event: Event): void {
    const detail = (event as unknown as LhUniScrollEvent).detail
    if (typeof detail?.scrollTop === 'number') {
      scrollTop.value = detail.scrollTop
      return
    }
    scrollTop.value = (event.target as HTMLElement)?.scrollTop ?? 0
  }

  let resizeObserver: ResizeObserver | null = null

  /**
   * 取容器 DOM（H5）：不能用模板 ref——uni-h5 的 view / scroll-view 是
   * Vue 组件，ref 拿到的是组件代理而非 DOM 节点。id 挂在根节点上，
   * getElementById 拿到的才是真正的滚动容器。
   */
  function rootElement(): HTMLElement | null {
    return document.getElementById(rootId)
  }

  /** 量视口高度：H5 同步 clientHeight；MP 异步 createSelectorQuery */
  async function measure(): Promise<void> {
    if (LH_IS_H5) {
      const el = rootElement()
      if (el) viewportHeight.value = el.clientHeight
      return
    }
    try {
      const rect = await getSingleLhRect(`#${rootId}`, instance?.proxy ?? null)
      viewportHeight.value = rect.height
    } catch {
      // 容器未渲染时忽略，下一次 scroll / prop 变化补量
    }
  }

  onMounted(() => {
    void measure()
    if (LH_IS_H5) {
      const el = rootElement()
      // H5 端原生挂监听：模板 @scroll 在 uni-h5 的 view 上不触发
      // （View 组件不转发原生 scroll 事件），直接 addEventListener
      el?.addEventListener('scroll', onScroll, { passive: true })
      if (typeof ResizeObserver !== 'undefined' && el) {
        resizeObserver = new ResizeObserver(() => measure())
        resizeObserver.observe(el)
      }
      window.addEventListener('resize', measure)
    }
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
    if (LH_IS_H5) {
      rootElement()?.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
    }
  })

  /** 容器高度变化（MP 端主要触发源）后补量 */
  watch(
    () => props.height,
    () => void measure(),
  )

  const listClasses = computed(() => getVirtualListClassNames())

  const listStyle = computed(() => ({
    height: typeof props.height === 'number' ? `${props.height}px` : props.height,
    ...sxToStyle(props.sx ?? {}),
  }))

  const windowStyle = computed(() => ({ transform: `translateY(${offsetY.value}px)` }))

  return {
    rootId,
    totalHeight,
    visibleIndexes,
    listClasses,
    listStyle,
    windowStyle,
    itemStyle,
    onScroll,
  }
}
