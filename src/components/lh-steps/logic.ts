import { computed, getCurrentInstance, nextTick, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import { getStepsClassNames, getStepsLineLastIndices } from '@lh-ui/share/core/steps'
import { generateId } from '@lh-ui/share/utils'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { getLhRect } from '@/adapter/getRect'
import { LH_STEPS_KEY } from './types'
import type { LhEmitFn } from '@/types/emit'
import type { LhStepsResolvedProps } from './types'

/**
 * Steps 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 与 plus 相同的 provide/inject + token 注册机制在 uni-app（Vue 3 内核）下可用
 * - 横向折行度量改走适配层 getLhRect：H5 走 document 查询 + getBoundingClientRect，
 *   MP 走 createSelectorQuery（异步，必须在 onMounted 之后）。选择器用「根节点 id +
 *   后代类名」限定到本实例范围（getLhRect 的 H5 分支是全局 document 查询，不传唯一
 *   id 会量到页面上别的 steps 实例）
 * - 【连接线隐藏机制差异】share 源的横向 / 纵向连接线用结构性 `:not(:last-child)`
 *   控制只画非末项；WXSS 不支持 `:not()`，build-styles 已把它剥离（连接线改为
 *   所有项都画），末项 / 行末项的隐藏全部交给 `--line-last` 类：
 *   - 横向：折行度量产出行末项索引（含全局末项，与 plus 同源）
 *   - 纵向：无折行，直接标记全局末项（由 SFC 适配样式接管 ::before 的隐藏）
 */
export function useLhSteps(
  props: LhStepsResolvedProps,
  emit: LhEmitFn<'update:current' | 'change'>,
) {
  const instance = getCurrentInstance()
  const uid = generateId('lh-steps')

  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))
  const rootClasses = computed(() => [...getStepsClassNames(props.direction), props.customClass])

  // 子项在各自 setup 阶段注册 token，顺序即渲染顺序；
  // 序号/总数在注册完成的同一微任务批次内收敛，不会产生可见闪烁
  const itemTokens = ref<symbol[]>([])

  function select(index: number) {
    if (!props.clickable || index === props.current) return
    emit('update:current', index)
    emit('change', index)
  }

  // 横向折行度量结果（纵向不度量，见 lineLastIndices）
  const measuredLineLast = ref<number[]>([])

  const lineLastIndices = computed(() => {
    if (props.direction === 'vertical') {
      // 纵向无折行：只有全局末项需要隐藏连接线（WXSS 无 :not(:last-child)，见文件头注释）
      const total = itemTokens.value.length
      return total > 0 ? [total - 1] : []
    }
    return measuredLineLast.value
  })

  /**
   * 度量横向折行行末项：相邻项纵向偏移量不同即发生折行，
   * 行末项（含全局末项）的连接线会指向行尾空白，由 --line-last 类隐藏。
   */
  async function measureLineLast() {
    if (props.direction !== 'horizontal') {
      measuredLineLast.value = []
      return
    }
    try {
      const rects = await getLhRect(`#${uid} .lh-steps__item`, {
        all: true,
        scope: instance?.proxy ?? null,
      })
      const offsetTops = (Array.isArray(rects) ? rects : [rects]).map((rect) => rect.top)
      measuredLineLast.value = getStepsLineLastIndices(offsetTops)
    } catch {
      // 度量失败（节点尚未就绪等）保守清空，留给下一次 watch / 容器变化重算
      measuredLineLast.value = []
    }
  }

  const rootRef = ref<HTMLElement | null>(null)
  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    void measureLineLast()
    // 容器宽度变化会改变折行位置（ResizeObserver 仅浏览器存在；MP 无此 API，
    // 小程序尺寸场景少且步骤增删 / 方向切换已由下方 watch 覆盖）
    if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
      resizeObserver = new ResizeObserver(() => void measureLineLast())
      resizeObserver.observe(rootRef.value)
    }
  })

  onUnmounted(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
  })

  // 步骤增删、方向切换后 DOM 已更新再重算折行位置
  // （deep: 让 itemTokens 的 push / splice 也触发——ref.value 只在整体重赋值时触发 dep）
  watch(
    () => [props.direction, itemTokens.value] as const,
    () => {
      void nextTick().then(() => void measureLineLast())
    },
    { deep: true },
  )

  provide(LH_STEPS_KEY, {
    itemTokens,
    current: computed(() => props.current),
    clickable: computed(() => props.clickable),
    forcedStatus: computed(() => props.status),
    lineLastIndices,
    select,
  })

  return {
    uid,
    rootRef,
    rootClasses,
    sxStyle,
    itemTokens,
    lineLastIndices,
    select,
    measureLineLast,
  }
}
