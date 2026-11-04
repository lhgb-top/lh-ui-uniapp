import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import {
  buildMarksList,
  clampValue,
  getSliderClassNames,
  getSliderThumbAria,
  getPositionFromValue,
  getValueFromPosition,
} from '@lh-ui/share/core/slider'
import { getNextRangeValue, sxToStyle } from '@lh-ui/share/core/shared'
import { getSingleLhRect } from '@/adapter/getRect'
import type { LhDOMRectLike } from '@/adapter/getRect'
import { lhlocale } from '@/adapter/locale'
import type { LhEmitFn } from '@/types/emit'
import type { LhSliderResolvedProps } from './types'

/**
 * uni 事件载荷形态：touch 事件的触点坐标在 event.touches[0].clientX
 * （与浏览器 MouseEvent 不重叠，需要先转 unknown 再断言）
 */
type LhUniTouchEvent = { touches?: Array<{ clientX?: number }> }

/**
 * Slider 滑块胶水（逻辑对齐 plus 仓）
 *
 * 取值/吸附/归一化/类名/aria 契约全部直接消费 share core 纯函数
 * （clampValue / getValueFromPosition / getPositionFromValue /
 * buildMarksList / getSliderClassNames / getSliderThumbAria / getNextRangeValue），零拷贝。
 *
 * 【uni-app 差异】
 * - 拖动载体：plus 在 thumb 上挂 mousedown / touchstart 后把 move / up 监听接到
 *   document；MP 没有 document，touch 事件改为直接挂在 thumb wrapper 上
 *   （MP 的 touchmove / touchend 沿 touchstart 的目标节点派发，不依赖全局监听），
 *   H5 保留 document 级鼠标监听（startMouseDrag 内条件编译，MP 包无死代码）
 * - 轨道位移计算：plus 用同步 getBoundingClientRect；MP 只有异步 SelectorQuery，
 *   改走 adapter 的 getSingleLhRect —— 度量结果是 Promise，位移更新天然带一拍异步
 *   （拖拽会话开始即预热度量，后续移动直接命中缓存，绝大多数移动事件是同步落值）
 * - 提交时机：与 plus 一致，拖动中只改 localValue，松手（touchend / mouseup）
 *   才一次性发出 update:modelValue / change
 * - 无障碍属性包由 share 的 getSliderThumbAria 决定契约，因 MP 模板编译器不支持
 *   v-bind 对象，这里摊成具体值供模板逐项显式绑定
 * - 键盘步进（方向键 / Home / End / PageUp / PageDown）仅 H5（SFC 侧条件编译守卫）
 */
export function useLhSlider(
  props: LhSliderResolvedProps,
  emit: LhEmitFn<'update:modelValue' | 'change'>,
) {
  const instance = getCurrentInstance()
  const scope = (instance?.proxy as ComponentPublicInstance | null) ?? null

  /**
   * 内部恒为二元组：标量 modelValue 归一化为 [v, v]。
   * 单滑块模式下只读写 [0]，与 plus 的 localValue 结构一致
   * （barStyle / thumb 定位都按两端算，单滑块时第二端存同值不渲染）
   */
  const localValue = ref<[number, number]>(
    props.modelValue !== null && props.modelValue !== undefined
      ? Array.isArray(props.modelValue)
        ? [props.modelValue[0], props.modelValue[1]]
        : [props.modelValue, props.modelValue]
      : props.range
        ? [props.min, (props.min + props.max) / 2]
        : [props.min, props.min],
  )

  const dragging = ref(false)
  const dragIndex = ref(0)

  // 受控回显：外部更新 modelValue（表单 reset / 程序赋值）后滑块必须跟随；
  // 拖拽中跳过，避免父级回流的值打断正在进行的拖拽
  watch(
    () => props.modelValue,
    (val) => {
      if (val === null || val === undefined || dragging.value) return
      localValue.value = Array.isArray(val) ? [val[0], val[1]] : [val, val]
    },
  )

  // modelValue 为空时按 plus 同款默认值初始化（range 取 [min, 中点]）
  onMounted(() => {
    if (props.modelValue === null || props.modelValue === undefined) {
      localValue.value = props.range
        ? [props.min, (props.min + props.max) / 2]
        : [props.min, props.min]
    }
  })

  /** 提交值：单滑块返回标量，范围模式返回二元组（与 plus 同载荷） */
  function getCurrentValue(): number | [number, number] {
    return props.range ? [localValue.value[0], localValue.value[1]] : localValue.value[0]
  }

  function emitValue(): void {
    const val = getCurrentValue()
    emit('update:modelValue', val)
    emit('change', val)
  }

  /** 根节点修饰类（lh-slider 基类已在模板写死，这里滤掉避免重复） */
  const wrapperModifiers = computed(() =>
    getSliderClassNames({
      value: localValue.value,
      min: props.min,
      max: props.max,
      step: props.step,
      disabled: props.disabled,
      range: props.range,
      showInput: props.showInput,
      size: props.size,
      marks: props.marks,
    }).filter((name) => name !== 'lh-slider'),
  )

  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const marksList = computed(() => buildMarksList(props.marks))

  function getMarkPosition(value: number): number {
    return getPositionFromValue(value, props.min, props.max) * 100
  }

  const barStyle = computed(() => {
    const [v1, v2] = localValue.value
    if (!props.range) {
      // 单滑块：从轨道起点填到 thumb 位置（按 range 两端语义算会得到 width: 0%）
      const pct = getPositionFromValue(v1, props.min, props.max) * 100
      return { left: '0%', width: `${pct}%` }
    }
    const left = getPositionFromValue(Math.min(v1, v2), props.min, props.max) * 100
    const right = 100 - getPositionFromValue(Math.max(v1, v2), props.min, props.max) * 100
    return { left: `${left}%`, width: `${100 - left - right}%` }
  })

  const button1Style = computed(() => ({
    left: `${getPositionFromValue(localValue.value[0], props.min, props.max) * 100}%`,
  }))

  const button2Style = computed(() => ({
    left: `${getPositionFromValue(localValue.value[1], props.min, props.max) * 100}%`,
  }))

  const displayValue = computed(() => {
    const [v0, v1] = localValue.value
    return props.range ? `[${v0}, ${v1}]` : String(v0)
  })

  /** 依赖响应式版本号：切换语言时触发重渲染 */
  function t(path: 'slider.thumb' | 'slider.thumbStart' | 'slider.thumbEnd', fallback: string) {
    void lhlocale.version.value
    return lhlocale.t(path, fallback)
  }

  /** thumb 的可达名称：range 模式区分起始 / 结束两端 */
  function thumbAriaLabel(index: number): string {
    if (props.range) {
      return index === 0 ? t('slider.thumbStart', '起始滑块') : t('slider.thumbEnd', '结束滑块')
    }
    return t('slider.thumb', '滑块')
  }

  /**
   * 无障碍属性摊开（MP 模板编译器不支持 v-bind 对象）：契约由 share 的
   * getSliderThumbAria 决定（role=slider + 值域语义），胶水层只把需要的键
   * 收窄成模板可直接绑定的具体值
   */
  const thumbAriaList = computed(() =>
    [0, 1].map((index) => {
      const value = localValue.value[index]
      const attrs = getSliderThumbAria({
        value,
        min: props.min,
        max: props.max,
        disabled: props.disabled,
        ariaValueText: String(value),
      })
      return {
        label: thumbAriaLabel(index),
        valuemin: attrs['aria-valuemin'] as number,
        valuemax: attrs['aria-valuemax'] as number,
        valuenow: attrs['aria-valuenow'] as number,
        valuetext: String(value),
        disabled: props.disabled,
      }
    }),
  )

  /** thumb 焦点位：禁用时移出 Tab 序列（与 plus 一致） */
  const thumbTabindex = computed(() => (props.disabled ? -1 : 0))

  // ── 拖拽：轨道位移 ──────────────────────────────────────────

  /** 本次拖拽会话缓存的轨道矩形（每次 touchstart / mousedown 重置重度量） */
  let trackRect: LhDOMRectLike | null = null

  /**
   * 度量轨道矩形（异步）：
   * H5 走同步 getBoundingClientRect（adapter 内包成已完成的 Promise）；
   * MP 走 uni.createSelectorQuery（组件 scope 内选取，需在 mounted 之后——
   * 拖拽由用户手势触发，天然满足）。
   * 度量结果按拖拽会话缓存，移动事件直接命中，避免每帧都查一次节点。
   */
  function ensureTrackRect(): Promise<LhDOMRectLike> {
    if (trackRect) return Promise.resolve(trackRect)
    return getSingleLhRect('.lh-slider__track', scope).then((rect) => {
      trackRect = rect
      return rect
    })
  }

  /** 事件取 X 坐标：touch 事件读 touches[0]，鼠标事件读 clientX */
  function resolveClientX(event: Event): number | null {
    const touches = (event as unknown as LhUniTouchEvent).touches
    const touchX = touches?.[0]?.clientX
    if (typeof touchX === 'number') return touchX
    const mouseX = (event as unknown as { clientX?: number }).clientX
    return typeof mouseX === 'number' ? mouseX : null
  }

  /**
   * 把指针坐标换成吸附后的值并写入 localValue（拖动中不提交）
   *
   * 【异步语义】ensureTrackRect 的 Promise 解开要一拍，值更新会比触碰晚一帧；
   * 拖拽会话开始时已预热，正常拖动几乎无感。宽度为 0（尚未布局 / 测试环境）
   * 时跳过，避免 0 除产生 NaN 污染值
   */
  async function applyPointerValue(event: Event): Promise<void> {
    const x = resolveClientX(event)
    if (x === null) return
    // 度量失败（节点尚未创建等极端情况）不拖垮拖动，静默跳过本次更新
    const rect = await ensureTrackRect().catch(() => null)
    if (!rect || rect.width <= 0) return
    const ratio = clampValue((x - rect.left) / rect.width, 0, 1)
    const snapped = getValueFromPosition(ratio, props.min, props.max, props.step)
    const pair = localValue.value
    if (dragIndex.value === 0) {
      // 范围模式交叉：拖动端越过另一端时交换两端，并把拖动下标交给新端，
      // 保证「手指下面的那个滑块」始终是被拖动的（连续拖动不会抖动）
      if (props.range && snapped > pair[1]) {
        localValue.value = [pair[1], snapped]
        dragIndex.value = 1
      } else {
        localValue.value = [snapped, pair[1]]
      }
    } else {
      if (props.range && snapped < pair[0]) {
        localValue.value = [snapped, pair[0]]
        dragIndex.value = 0
      } else {
        localValue.value = [pair[0], snapped]
      }
    }
  }

  /** touchstart（H5 与 MP 同路径；已在拖拽中时忽略，防 H5 触屏设备 touch + mouse 双触发） */
  function onDragStart(index: number): void {
    if (props.disabled || dragging.value) return
    dragging.value = true
    dragIndex.value = index
    trackRect = null
    // 预热度量：拖拽会话开始即查询轨道矩形，后续移动直接命中缓存
    void ensureTrackRect()
  }

  /** touchmove（直接挂在 thumb wrapper 上，MP 沿 touchstart 目标派发） */
  function onTouchMove(event: Event): void {
    if (!dragging.value) return
    void applyPointerValue(event)
  }

  /** touchend：提交本次拖拽结果 */
  function onTouchEnd(): void {
    if (!dragging.value) return
    dragging.value = false
    trackRect = null
    emitValue()
  }

  // 拖拽监听句柄：成对记录，组件在拖拽中被卸载时由 onBeforeUnmount 兜底移除
  let dragMoveHandler: ((ev: MouseEvent) => void) | null = null
  let dragUpHandler: (() => void) | null = null

  function detachDragListeners(): void {
    // #ifdef H5
    if (dragMoveHandler) {
      document.removeEventListener('mousemove', dragMoveHandler)
      dragMoveHandler = null
    }
    if (dragUpHandler) {
      document.removeEventListener('mouseup', dragUpHandler)
      dragUpHandler = null
    }
    // #endif
  }

  /**
   * H5 鼠标拖动：mousedown 落 thumb 后把 move / up 接到 document，
   * 鼠标移出组件也能继续拖。MP 无 document，本函数整体由条件编译守卫，MP 包无死代码
   */
  function startMouseDrag(index: number, _event: Event): void {
    // #ifdef H5
    if (props.disabled || dragging.value) return
    onDragStart(index)
    const moveHandler = (ev: MouseEvent) => onTouchMove(ev)
    const upHandler = () => {
      onTouchEnd()
      detachDragListeners()
    }
    dragMoveHandler = moveHandler
    dragUpHandler = upHandler
    document.addEventListener('mousemove', moveHandler)
    document.addEventListener('mouseup', upHandler)
    // #endif
  }

  onBeforeUnmount(() => {
    dragging.value = false
    trackRect = null
    detachDragListeners()
  })

  /**
   * thumb 的键盘导航（WAI-ARIA slider 模式，仅 H5 调用）
   *
   * 方向键按 step 增减、PageUp / Down 大步进、Home / End 直达极值
   * （键 → 值的翻译复用 core/shared 的 getNextRangeValue）。
   * range 模式下键盘**不交换两端**（与拖拽的交换语义不同），而是把本端
   * 钳在其活动范围内，保证「焦点所在的 thumb」与「被修改的值」始终一致。
   */
  function onThumbKeydown(event: KeyboardEvent, index: number): void {
    if (props.disabled) return
    const current = localValue.value[index]
    const next = getNextRangeValue(current, event.key, {
      min: props.min,
      max: props.max,
      step: props.step,
    })
    // 非导航键（Tab 等）原样返回，不拦截默认行为
    if (next === current) return

    event.preventDefault()
    const pair = localValue.value
    if (props.range) {
      // range：钳在本端活动范围内，不越过另一端
      localValue.value =
        index === 0
          ? [clampValue(next, props.min, pair[1]), pair[1]]
          : [pair[0], clampValue(next, pair[0], props.max)]
    } else {
      localValue.value = index === 0 ? [next, pair[1]] : [pair[0], next]
    }
    emitValue()
  }

  return {
    localValue,
    dragging,
    wrapperModifiers,
    sxStyle,
    marksList,
    getMarkPosition,
    barStyle,
    button1Style,
    button2Style,
    displayValue,
    thumbAriaList,
    thumbTabindex,
    onDragStart,
    onTouchMove,
    onTouchEnd,
    startMouseDrag,
    onThumbKeydown,
  }
}
