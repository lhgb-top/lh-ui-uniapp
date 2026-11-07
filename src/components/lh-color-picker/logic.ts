import { computed, getCurrentInstance, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import {
  clampColorAlpha,
  clampColorHue,
  clampColorRatio,
  formatColor,
  getColorPickerClassNames,
  hsvToRgb,
  isValidColorFormat,
  parseColorString,
  rgbToHsv,
} from '@lh-ui/share/core/color-picker'
import { getSize } from '@lh-ui/share/core/button'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { useLhComponent, useLhPopperIds } from '@/composables'
import { useLhPopper } from '@/adapter/popper'
import { getSingleLhRect } from '@/adapter/getRect'
import type { LhDOMRectLike } from '@/adapter/getRect'
import { lhlocale } from '@/adapter/locale'
import type { LhLocalePath } from '@/adapter/locale'
import type { LhEmitFn } from '@/types/emit'
import type { LhColorPickerResolvedProps } from './types'

/** 拖拽轴：饱和度板 / 色相滑杆 / 透明度滑杆 */
type LhColorDragAxis = 'saturation' | 'hue' | 'alpha'

/**
 * ColorPicker 颜色选择器胶水（契约对齐 plus 仓）
 *
 * 颜色数学全部消费 share core（parseColorString / rgbToHsv / hsvToRgb /
 * formatColor / clampColor* / getColorPickerClassNames），零拷贝；内部交互态
 * 恒为 HSV（饱和度板 / 滑杆的坐标语义），提交态经 hsvToRgb → formatColor 按
 * format 输出。
 *
 * 【uni-app 差异】
 * - 拖拽载体：touch 事件直接挂在饱和度板 / 滑杆元素上（MP 沿 touchstart 目标
 *   派发 move / end，无需 document）；H5 另走 document 级鼠标监听（条件编译，
 *   MP 包无死代码），范式与 lh-slider 一致
 * - 轨道度量：MP 只有异步 SelectorQuery，走 adapter 的 getSingleLhRect；
 *   度量结果按拖拽会话缓存（touchstart 预热，移动事件直接命中）
 * - 面板定位走 useLhPopper（两帧度量 → computePosition → 显示），挂
 *   root-portal 承载，遮罩点击关闭（与 select 同构）
 * - 面板内色值输入用 uni `<input>`：@confirm（键盘完成）/ @blur 提交
 * - 键盘（方向键微调 / Enter / Space / Esc）仅 H5（条件编译守卫）
 */
export function useLhColorPicker(
  props: LhColorPickerResolvedProps,
  emit: LhEmitFn<'update:modelValue' | 'change' | 'clear'>,
) {
  const { componentStyle, configContext } = useLhComponent('color-picker', props)

  const instance = getCurrentInstance()
  const scope = (instance?.proxy as ComponentPublicInstance | null) ?? null

  const { triggerId, popperId } = useLhPopperIds('color-picker')

  const isOpen = ref(false)

  /** 面板内部颜色状态（HSV 驱动；拖拽 / 滑杆 / 预设色板都先落这里再提交） */
  const hsv = ref({ h: 0, s: 1, v: 1, a: 1 })
  const inputValue = ref('')

  const effectiveSize = computed(() => getSize(props.size, configContext?.value.size))
  const format = computed(() => (isValidColorFormat(props.format) ? props.format : 'hex'))

  /** 当前生效颜色（modelValue 解析失败则为空） */
  const currentRgb = computed(() => parseColorString(props.modelValue))

  const displayValue = computed(() =>
    currentRgb.value ? formatColor(currentRgb.value, format.value) : '',
  )

  /** 容器修饰类（基类在模板写死，这里滤掉避免重复；空值态 --empty 由模板拼接） */
  const triggerClasses = computed(() =>
    getColorPickerClassNames({
      size: effectiveSize.value,
      disabled: props.disabled,
      open: isOpen.value,
    }).filter((name) => name !== 'lh-color-picker'),
  )

  const triggerStyle = computed(() => componentStyle.value)
  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  /** 文案国际化（lhlocale.t 内部已订阅版本号，切换语言自动重算） */
  function t(path: LhLocalePath, fallback: string): string {
    void lhlocale.version.value
    return lhlocale.t(path, fallback)
  }

  const placeholderText = computed(
    () => props.placeholder || t('colorPicker.placeholder', '选择颜色'),
  )
  const ariaLabelText = computed(() => props.ariaLabel || t('colorPicker.label', '颜色选择器'))
  const inputLabel = computed(() => t('colorPicker.inputLabel', '颜色值'))

  /** 饱和度板背景：当前色相的纯色（横向白 → 纵向黑混合由样式层渐变叠加） */
  const saturationStyle = computed(() => ({ backgroundColor: `hsl(${hsv.value.h}, 100%, 50%)` }))
  const saturationPointerStyle = computed(() => ({
    left: `${hsv.value.s * 100}%`,
    top: `${(1 - hsv.value.v) * 100}%`,
  }))
  const hueThumbStyle = computed(() => ({ left: `${(hsv.value.h / 360) * 100}%` }))
  const alphaThumbStyle = computed(() => ({ left: `${hsv.value.a * 100}%` }))

  /** 面板定位（两帧度量 → computePosition → 显示，与 select 同构） */
  const { popperStyle, update: updatePopper } = useLhPopper(
    `#${triggerId}`,
    `#${popperId}`,
    scope,
    { placement: 'bottom-start' },
  )

  function syncFromModel(): void {
    const rgb = parseColorString(props.modelValue)
    if (rgb) {
      hsv.value = rgbToHsv(rgb)
      inputValue.value = formatColor(rgb, format.value)
    } else {
      inputValue.value = ''
    }
  }

  // 受控回显：外部更新 modelValue（表单 reset / 程序赋值）后面板状态必须跟随
  watch(() => props.modelValue, () => syncFromModel(), { immediate: true })

  watch(
    () => props.format,
    () => {
      if (currentRgb.value) inputValue.value = formatColor(currentRgb.value, format.value)
    },
  )

  function emitColor(): void {
    const value = formatColor(hsvToRgb(hsv.value), format.value)
    emit('update:modelValue', value)
    emit('change', value)
  }

  function open(): void {
    if (props.disabled || isOpen.value) return
    isOpen.value = true
    syncFromModel()
    nextTick(() => {
      updatePopper()
    })
  }

  function close(): void {
    isOpen.value = false
  }

  function toggle(): void {
    if (isOpen.value) close()
    else open()
  }

  function clear(): void {
    if (props.disabled) return
    emit('update:modelValue', '')
    emit('change', '')
    emit('clear')
    close()
  }

  function selectPredefine(color: string): void {
    if (props.disabled) return
    emit('update:modelValue', color)
    emit('change', color)
  }

  /** 面板内 hex/rgb 输入提交（@confirm / @blur；非法输入回显当前生效值，不清空） */
  function commitInput(value: string): void {
    const rgb = parseColorString(value)
    if (rgb) {
      hsv.value = rgbToHsv(rgb)
      const next = formatColor(rgb, format.value)
      inputValue.value = next
      emit('update:modelValue', next)
      emit('change', next)
    } else {
      inputValue.value = displayValue.value
    }
  }

  // ── 拖拽：饱和度板 / 色相 / 透明度 ────────────────────────────
  const dragging = ref<LhColorDragAxis | null>(null)

  /** 本次拖拽会话缓存的轨道矩形（touchstart / mousedown 时重置并预热） */
  let dragRect: LhDOMRectLike | null = null

  function ensureDragRect(selector: string): Promise<LhDOMRectLike | null> {
    if (dragRect) return Promise.resolve(dragRect)
    return getSingleLhRect(selector, scope).then((rect) => {
      dragRect = rect
      return rect
    }).catch(() => null)
  }

  /** uni 事件载荷形态：touch 触点在 event.touches[0]（与 MouseEvent 不重叠） */
  function resolvePoint(event: Event): { x: number; y: number } | null {
    const touches = (event as unknown as { touches?: Array<{ clientX?: number; clientY?: number }> }).touches
    const touch = touches?.[0]
    if (touch && typeof touch.clientX === 'number') {
      return { x: touch.clientX, y: touch.clientY ?? 0 }
    }
    const mouse = event as unknown as { clientX?: number; clientY?: number }
    if (typeof mouse.clientX === 'number') {
      return { x: mouse.clientX, y: mouse.clientY ?? 0 }
    }
    return null
  }

  /** 把指针坐标落到对应轴（拖拽实时提交，对齐 plus 同构语义） */
  async function applyPointerValue(axis: LhColorDragAxis, event: Event): Promise<void> {
    const point = resolvePoint(event)
    if (!point) return
    const selector =
      axis === 'saturation' ? '.lh-color-picker__saturation' : '.lh-color-picker__slider'
    const rect = await ensureDragRect(selector)
    if (!rect || rect.width <= 0) return
    const x = clampColorRatio((point.x - rect.left) / rect.width)
    if (axis === 'saturation') {
      const height = rect.height > 0 ? rect.height : 1
      const y = clampColorRatio((point.y - rect.top) / height)
      hsv.value = {
        ...hsv.value,
        s: x,
        v: clampColorRatio(1 - y),
      }
    } else if (axis === 'hue') {
      hsv.value = { ...hsv.value, h: clampColorHue(Math.round(x * 360)) }
    } else {
      hsv.value = { ...hsv.value, a: clampColorAlpha(Math.round(x * 100) / 100) }
    }
    emitColor()
  }

  /** touchstart / mousedown：开拖拽会话并预热度量（H5 与 MP 同路径） */
  function onDragStart(axis: LhColorDragAxis): void {
    if (props.disabled) return
    dragging.value = axis
    dragRect = null
    void ensureDragRect(axis === 'saturation' ? '.lh-color-picker__saturation' : '.lh-color-picker__slider')
  }

  function onDragMove(event: Event): void {
    if (!dragging.value) return
    void applyPointerValue(dragging.value, event)
  }

  function onDragEnd(): void {
    dragging.value = null
    dragRect = null
  }

  // H5 鼠标拖动：mousedown 后把 move / up 接到 document，移出组件也能继续拖；
  // MP 无 document，整体条件编译守卫，MP 包无死代码（与 lh-slider 同款）
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

  function startMouseDrag(axis: LhColorDragAxis, event: Event): void {
    // #ifdef H5
    if (props.disabled || dragging.value) return
    onDragStart(axis)
    onDragMove(event)
    dragMoveHandler = (ev: MouseEvent) => onDragMove(ev)
    dragUpHandler = () => {
      onDragEnd()
      detachDragListeners()
    }
    document.addEventListener('mousemove', dragMoveHandler)
    document.addEventListener('mouseup', dragUpHandler)
    // #endif
  }

  // ── 键盘（APG slider pattern，仅 H5 调用）─────────────────────
  function onSliderKeydown(axis: LhColorDragAxis, event: KeyboardEvent): void {
    if (props.disabled) return
    const step = event.shiftKey ? (axis === 'hue' ? 10 : 0.1) : axis === 'hue' ? 1 : 0.01
    const up = event.key === 'ArrowRight' || event.key === 'ArrowUp'
    const down = event.key === 'ArrowLeft' || event.key === 'ArrowDown'
    if (!up && !down) return
    event.preventDefault()
    const delta = up ? step : -step
    if (axis === 'hue') {
      hsv.value = { ...hsv.value, h: clampColorHue(hsv.value.h + delta) }
    } else {
      hsv.value = { ...hsv.value, a: clampColorAlpha(hsv.value.a + delta) }
    }
    emitColor()
  }

  function onTriggerKeydown(event: KeyboardEvent): void {
    if (props.disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggle()
    } else if (event.key === 'Escape') {
      close()
    }
  }

  onBeforeUnmount(() => {
    dragging.value = null
    dragRect = null
    detachDragListeners()
  })

  return {
    isOpen,
    triggerId,
    popperId,
    hsv,
    inputValue,
    triggerClasses,
    triggerStyle,
    sxStyle,
    placeholderText,
    ariaLabelText,
    inputLabel,
    saturationStyle,
    saturationPointerStyle,
    hueThumbStyle,
    alphaThumbStyle,
    popperStyle,
    displayValue,
    open,
    close,
    toggle,
    clear,
    selectPredefine,
    commitInput,
    onDragStart,
    onDragMove,
    onDragEnd,
    startMouseDrag,
    onSliderKeydown,
    onTriggerKeydown,
  }
}
