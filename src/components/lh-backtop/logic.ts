import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  getBackTopClassNames,
  isBackTopVisible,
  LH_BACKTOP_SCROLLEND_DELAY,
} from '@lh-ui/share/core/backtop'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { LH_IS_H5 } from '@/adapter/platform'
import { scrollToLhTop, subscribeLhScroll } from '@/adapter/scroll'
import { lhlocale } from '@/adapter/locale'
import type { LhEmitFn } from '@/types/emit'
import type { LhBacktopResolvedProps } from './types'

/** 显隐过渡时长（对齐 share 令牌 --lh-transition-duration-fast 默认 0.25s） */
const LH_BACKTOP_TRANSITION_MS = 250

/**
 * BackTop 返回顶部胶水（逻辑对齐 plus 仓，MP 端改 scroll-view 变体）
 *
 * 可见性判定走 share core 纯函数（isBackTopVisible），滚动命令走
 * adapter/scroll（H5 复用 share 的 backToTop；MP 用 uni.pageScrollTo）。
 *
 * 【uni-app 差异】
 * - 滚动来源：H5 自行订阅 scroll 事件；MP 经 scrollTop prop 注入。
 * - 显隐过渡：plus 用 Vue <transition>，MP 模板不支持该元素，改用与
 *   message 一致的「阶段类 + setTimeout 对齐时长」方案（transitionend
 *   在 MP 不可靠）：enter 阶段挂 enter-from 类，下帧切 visible；leave
 *   阶段挂 leave-to 类，计时后摘除节点。
 * - scrollend：两端统一用 scroll 停止后 150ms 防抖抛出（share 的
 *   LH_BACKTOP_SCROLLEND_DELAY，即 plus 在不支持原生 scrollend 时的兜底）。
 * - 回顶命令：H5 直接滚 target；MP 先抛 update:scrollTop(0) 事件契约
 *   （使用者绑到 scroll-view 的 scroll-top 属性），未传 target 时
 *   说明是页面级滚动，再走 uni.pageScrollTo。
 * - 按钮载体：MP 的 button 无法 reset 默认样式，改 view 自绘 + role=button
 *   （同 lh-pagination 先例）；默认图标用 lh-icon 的 arrow-up。
 */
export function useLhBacktop(
  props: LhBacktopResolvedProps,
  emit: LhEmitFn<'click' | 'scrollend' | 'update:scrollTop'>,
) {
  /** 期望显隐（判定结果） */
  const shouldShow = ref(false)
  /**
   * 渲染阶段：
   * - hidden：不渲染节点
   * - enter：挂 enter-from 类（起始态），下帧切 visible 触发过渡
   * - visible：稳定态
   * - leave：挂 leave-to 类，计时后回 hidden 摘除节点
   */
  const phase = ref<'hidden' | 'enter' | 'visible' | 'leave'>('hidden')

  let leaveTimer: ReturnType<typeof setTimeout> | undefined
  let scrollEndTimer: ReturnType<typeof setTimeout> | undefined
  /** 回顶兜底计时器（独立于 scrollEnd 防抖，避免被滚动事件清掉） */
  let hideFallbackTimer: ReturnType<typeof setTimeout> | undefined

  /** 滚动停止后抛出 scrollend（携带当前滚动距离） */
  function scheduleScrollEnd(scrollTop: number): void {
    clearTimeout(scrollEndTimer)
    scrollEndTimer = setTimeout(() => emit('scrollend', scrollTop), LH_BACKTOP_SCROLLEND_DELAY)
  }

  /** 更新可见性（scrollTop 来自 H5 scroll 订阅或 MP prop 注入） */
  function applyScrollTop(scrollTop: number): void {
    const next = isBackTopVisible(scrollTop, props.visibilityHeight)
    shouldShow.value = next
    scheduleScrollEnd(scrollTop)
  }

  /** H5 端滚动订阅（target 变化时重订阅） */
  let unsubscribe = () => {}
  function resubscribe(): void {
    if (!LH_IS_H5) return
    unsubscribe()
    unsubscribe = subscribeLhScroll(props.target, applyScrollTop)
  }

  watch(
    () => props.target,
    () => resubscribe(),
  )

  onMounted(() => {
    resubscribe()
    // 首测：挂载后若已注入 scrollTop，先判一次可见性
    if (props.scrollTop != null) applyScrollTop(props.scrollTop)
  })

  onBeforeUnmount(() => {
    unsubscribe()
    clearTimeout(leaveTimer)
    clearTimeout(scrollEndTimer)
    clearTimeout(hideFallbackTimer)
  })

  /**
   * 滚动位置注入驱动（两端通用）：MP 端是唯一来源（scroll-view 的
   * detail.scrollTop）；H5 端的 scroll-view 场景同样需要——uni-h5 的 scroll-view
   * 原生 scroll 事件触发在内层容器、不冒泡，组件挂在外层的订阅收不到，
   * 经 prop 注入是 scroll-view 场景下两端一致的驱动方式。
   */
  watch(
    () => props.scrollTop,
    (value) => {
      if (value != null) applyScrollTop(value)
    },
  )

  /** 阶段机：显隐目标变化驱动进 / 出过渡 */
  watch(shouldShow, (next) => {
    if (next) {
      phase.value = 'enter'
      // enter-from 类需先渲染一帧再摘除，过渡才走得起来（nextTick 两端可用）
      void nextTick(() => {
        if (phase.value === 'enter') phase.value = 'visible'
      })
    } else if (phase.value !== 'hidden') {
      phase.value = 'leave'
      clearTimeout(leaveTimer)
      leaveTimer = setTimeout(() => {
        phase.value = 'hidden'
      }, LH_BACKTOP_TRANSITION_MS)
    }
  })

  const transitionClasses = computed(() => {
    if (phase.value === 'enter') return ['lh-backtop-fade-enter-active', 'lh-backtop-fade-enter-from']
    if (phase.value === 'leave') return ['lh-backtop-fade-leave-active', 'lh-backtop-fade-leave-to']
    return []
  })

  const buttonClasses = computed(() => [
    ...getBackTopClassNames({ visible: phase.value === 'visible' }),
    ...transitionClasses.value,
  ])

  function handleClick(event: Event): void {
    emit('click', event)
    if (LH_IS_H5) {
      scrollToLhTop({ target: props.target, smooth: props.smooth })
      // 平滑滚动的收尾 scroll 事件在个别 webview 会丢失（按钮残留显隐不同步），
      // 动画时长后按目标真实位置兜底校正一次；用户中途再滚会被后续 scroll 事件覆盖。
      // 注意用独立计时器：scroll 事件的防抖会用 scrollEndTimer，共享句柄会被清掉
      if (props.smooth) {
        clearTimeout(hideFallbackTimer)
        hideFallbackTimer = setTimeout(() => {
          const el = props.target ? document.querySelector<HTMLElement>(props.target) : null
          const finalTop = el instanceof HTMLElement ? el.scrollTop : window.scrollY
          applyScrollTop(finalTop)
        }, 350)
      }
      return
    }
    // MP：scroll-view 内回顶走事件契约（使用者绑 :scroll-top）；
    // 未传 target 时是页面级滚动，直接 pageScrollTo
    emit('update:scrollTop', 0)
    if (!props.target) scrollToLhTop({ smooth: props.smooth })
  }

  const backTopStyle = computed(() => ({
    right: `${props.right}px`,
    bottom: `${props.bottom}px`,
    ...sxToStyle(props.sx ?? {}),
  }))

  const label = computed(() => {
    void lhlocale.version.value
    return lhlocale.t('backtop.label', '返回顶部')
  })

  return {
    phase,
    buttonClasses,
    backTopStyle,
    label,
    handleClick,
  }
}
