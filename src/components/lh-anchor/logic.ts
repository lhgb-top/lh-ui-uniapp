import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  flattenAnchorItems,
  getAnchorClassNames,
  getAnchorLinkClassNames,
  resolveActiveAnchor,
} from '@lh-ui/share/core/anchor'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { getSingleLhRect } from '@/adapter/getRect'
import { LH_IS_H5 } from '@/adapter/platform'
import { scrollToLhSelector, subscribeLhScroll } from '@/adapter/scroll'
import { lhlocale } from '@/adapter/locale'
import type { LhEmitFn } from '@/types/emit'
import type { LhAnchorResolvedProps } from './types'

/**
 * Anchor 锚点导航胶水（逻辑对齐 plus 仓，MP 端改 scroll-view 变体）
 *
 * 扁平化 / 活动锚点判定 / 类名全部走 share core 纯函数
 * （flattenAnchorItems / resolveActiveAnchor / getAnchor*ClassNames）。
 *
 * 【uni-app 差异】
 * - 滚动来源：H5 自行订阅 scroll 事件；MP 经 scrollTop prop 注入。
 * - 锚点度量：H5 走 document.getElementById + getBoundingClientRect；
 *   MP 没有同步 DOM API，用 getLhRect（createSelectorQuery，页面范围选取，
 *   因锚点节点在使用者页面里而非本组件内，故不传 scope）。
 *   两端 boundingClientRect 都是视口相对，resolveActiveAnchor 直接复用。
 * - 锚点定位：H5 走 scrollIntoView（adapter 封装）；
 *   MP 用 uni.pageScrollTo({ selector })（页面级），
 *   scroll-view 内定位走 update:scrollIntoView 事件契约，
 *   使用者绑到 scroll-view 的 scroll-into-view 属性。
 * - 链接载体：plus 的 <a href="#id"> 在 MP 无锚点语义，
 *   改 view 自绘点击（hash 改动在 MP 也无意义）。
 */
export function useLhAnchor(
  props: LhAnchorResolvedProps,
  emit: LhEmitFn<'change' | 'click' | 'update:scrollIntoView'>,
) {
  const flatItems = computed(() => flattenAnchorItems(props.items))
  const activeId = ref(flatItems.value[0]?.id ?? '')

  /** 各锚点相对视口顶部的偏移（文档顺序，与 ids 同序喂 resolveActiveAnchor） */
  async function measureOffsets(): Promise<{ ids: string[]; offsets: number[] }> {
    const ids: string[] = []
    const offsets: number[] = []
    for (const item of flatItems.value) {
      if (LH_IS_H5) {
        const el = document.getElementById(item.id)
        if (!el) continue
        ids.push(item.id)
        offsets.push(el.getBoundingClientRect().top)
        continue
      }
      // MP：锚点节点在使用者页面里，selectorQuery 走页面范围（不传 scope）
      try {
        const rect = await getSingleLhRect(`#${item.id}`)
        ids.push(item.id)
        offsets.push(rect.top)
      } catch {
        // 锚点未渲染 / 已销毁时跳过（与 H5 的 getElementById 未命中同义）
      }
    }
    return { ids, offsets }
  }

  /** 滚动联动：度量锚点偏移 → 纯函数判定活动锚点 */
  async function updateActive(): Promise<void> {
    const { ids, offsets } = await measureOffsets()
    if (ids.length === 0) return
    const next = resolveActiveAnchor(ids, offsets, props.offset)
    if (next && next !== activeId.value) {
      activeId.value = next
      emit('change', next)
    }
  }

  /** H5 端滚动订阅（target 变化时重订阅） */
  let unsubscribe = () => {}
  function resubscribe(): void {
    if (!LH_IS_H5) return
    unsubscribe()
    unsubscribe = subscribeLhScroll(props.target, () => void updateActive())
  }

  watch(
    () => props.target,
    () => resubscribe(),
  )

  onMounted(() => {
    resubscribe()
    if (props.scrollTop != null) void updateActive()
  })

  onBeforeUnmount(() => {
    unsubscribe()
  })

  /**
   * 滚动位置注入驱动（两端通用）：MP 端是唯一来源（scroll-view 的
   * detail.scrollTop）；H5 端的 scroll-view 场景同样需要——uni-h5 的 scroll-view
   * 原生 scroll 事件触发在内层容器、不冒泡，组件挂在外层的订阅收不到，
   * 经 prop 注入是 scroll-view 场景下两端一致的驱动方式。
   */
  watch(
    () => props.scrollTop,
    () => {
      void updateActive()
    },
  )

  /** 点击锚点项：先对外抛出 click（携带目标 id），再执行既有滚动逻辑 */
  function handleLinkClick(id: string): void {
    emit('click', id)
    activeId.value = id
    emit('change', id)
    if (LH_IS_H5) {
      scrollToLhSelector(`#${id}`, props.smooth)
      return
    }
    // MP：scroll-view 内定位走事件契约（使用者绑 scroll-into-view）；
    // 未传 target 时是页面级滚动，直接 pageScrollTo(selector)
    emit('update:scrollIntoView', id)
    if (!props.target) scrollToLhSelector(`#${id}`, props.smooth)
  }

  function linkClasses(id: string, level: number): string[] {
    return getAnchorLinkClassNames({ active: activeId.value === id, level })
  }

  const anchorClasses = computed(() => getAnchorClassNames({ direction: props.direction }))
  const anchorStyle = computed(() => sxToStyle(props.sx ?? {}))

  const label = computed(() => {
    void lhlocale.version.value
    return lhlocale.t('anchor.label', '锚点导航')
  })

  return {
    flatItems,
    activeId,
    anchorClasses,
    anchorStyle,
    label,
    linkClasses,
    handleLinkClick,
  }
}
