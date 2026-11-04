import { computed, ref } from 'vue'
import {
  clampValue,
  decrementValue,
  getInputNumberAria,
  incrementValue,
  shouldDisableDecrement,
  shouldDisableIncrement,
} from '@lh-ui/share/core/input-number'
import type { LhInputNumberState } from '@lh-ui/share/core/input-number'
import { LH_KEYS, safePrecision, sxToStyle } from '@lh-ui/share/core/shared'
import type { LhEmitFn } from '@/types/emit'
import type { LhInputNumberResolvedProps } from './types'

/**
 * uni 事件载荷形态：input / blur / confirm 的值在 event.detail.value
 * （与浏览器事件不重叠，需要先转 unknown 再断言；keydown 无该字段，走 target 回退）
 */
type LhUniInputEvent = { detail?: { value?: string } }

/**
 * InputNumber 计数器胶水（逻辑对齐 plus 仓）
 *
 * 计算规则与 plus 一致：stepStrictly 时 min 收敛到 step 网格（clamp 到 [0, step*1000]）、
 * max 不小于 min、step 取绝对值；步进与输入提交统一走 core 纯函数
 * （incrementValue / decrementValue / clampValue / safePrecision）做精度与范围钳制。
 *
 * 【uni-app 差异】
 * - 提交时机：uni 的 input 组件没有原生 change 事件（小程序端只有 input / blur /
 *   confirm），改为「编辑草稿 + 失焦 / 确认时一次性提交」，等价 plus 原生 change
 *   只在提交时机触发的语义（react 仓同款方案）；同值不重复发事件——MP 端 confirm
 *   之后还会再触发一次 blur，去重避免同值双发
 * - 加减按钮由 view 自绘点击实现（MP 的 button 无法 reset 默认样式），禁用由
 *   点击守卫 + --disabled 修饰类表达（view 无 :disabled 伪类，share 的禁用外观
 *   由 SFC 内联兜底规则提供）
 * - 无障碍属性包由 share 的 getInputNumberAria 产出契约（role=spinbutton +
 *   值域语义，plus 暂未接），因 MP 模板编译器不支持 v-bind 对象，这里摊成
 *   具体值供模板逐项显式绑定
 * - 键盘上下键步进仅 H5（SFC 侧条件编译守卫，MP 端无键盘事件）
 */
export function useLhInputNumber(
  props: LhInputNumberResolvedProps,
  emit: LhEmitFn<'update:modelValue' | 'change'>,
) {
  /** 归一化参数（与 plus 的 computed state 一一对应） */
  const state = computed<LhInputNumberState>(() => ({
    value: props.modelValue,
    min: props.stepStrictly ? clampValue(props.min, 0, props.step * 1000) : props.min,
    max: Math.max(props.min, props.max),
    step: Math.abs(props.step),
    disabled: props.disabled,
    size: props.size,
    controls: props.controls,
    precision: props.precision,
    placeholder: props.placeholder,
  }))

  /** 编辑草稿：输入期间暂存原文，提交后清空（null 表示不在编辑态） */
  const draft = ref<string | null>(null)

  /** 输入框显示值：编辑中显示草稿原文，否则显示已提交值（等价 plus 的 :value 单向绑定） */
  const displayValue = computed(() =>
    draft.value !== null ? draft.value : props.modelValue !== null ? String(props.modelValue) : '',
  )

  /** 根节点修饰类（lh-input-number 基类已在模板写死，这里只产修饰部分） */
  const wrapperModifiers = computed(() => [
    `lh-input-number--${props.size}`,
    ...(props.disabled ? (['lh-input-number--disabled'] as const) : []),
  ])

  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const isDecreaseDisabled = computed(() => shouldDisableDecrement(state.value))
  const isIncreaseDisabled = computed(() => shouldDisableIncrement(state.value))

  /** placeholder 兜底样式（MP 端必需，替代仅 H5 的 ::placeholder 规则） */
  const placeholderStyle = 'color: var(--lh-text-placeholder, #B0B0B0);'

  /**
   * 无障碍属性摊开（MP 模板编译器不支持 v-bind 对象）：契约由 share 的
   * getInputNumberAria 决定，胶水层只把需要的键收窄成模板可直接绑定的具体值
   * （vue-tsc 对 aria-* 有类型约束，需显式收窄）
   */
  const ariaAttrs = computed(() => {
    const attrs = getInputNumberAria({
      value: props.modelValue,
      min: state.value.min,
      max: state.value.max,
      step: state.value.step,
      disabled: props.disabled,
    })
    return {
      valuenow: attrs['aria-valuenow'] as number | undefined,
      disabled: attrs['aria-disabled'] === true ? true : undefined,
    }
  })
  const ariaValuemin = computed(() => state.value.min)
  const ariaValuemax = computed(() => state.value.max)

  /**
   * 步进：±step 后按 precision 与 [min, max] 钳制（core 纯函数），并丢弃未提交草稿
   * （步进始终基于已提交值，与 plus 的 keydown 直接走 modelValue 一致）
   */
  function changeBy(direction: 1 | -1): void {
    const next =
      direction === 1
        ? incrementValue(
            props.modelValue,
            props.step,
            state.value.min,
            state.value.max,
            props.precision,
          )
        : decrementValue(
            props.modelValue,
            props.step,
            state.value.min,
            state.value.max,
            props.precision,
          )
    draft.value = null
    emit('update:modelValue', next)
    emit('change', next)
  }

  function handleIncrement(): void {
    if (isIncreaseDisabled.value) return
    changeBy(1)
  }

  function handleDecrement(): void {
    if (isDecreaseDisabled.value) return
    changeBy(-1)
  }

  /** 事件取值：uni 载荷在 detail.value；keydown 无 detail，回退读原生 target.value */
  function resolveUniValue(event: Event): string {
    const detail = (event as unknown as LhUniInputEvent).detail
    if (detail && typeof detail.value === 'string') return detail.value
    const target = event.target as { value?: unknown } | null
    return typeof target?.value === 'string' ? target.value : ''
  }

  /**
   * 提交草稿（等价 plus 原生 change 的提交时机）：空串清空为 null；非法数字不提交
   * （显示回退已提交值）；合法值依次过 precision → min/max 钳制 → stepStrictly
   * 四舍五入吸附，全部与 plus 一致。同值不重复发事件（MP 端 confirm 后还会再触发
   * 一次 blur，去重避免同值双发）
   */
  function commitDraft(raw: string): void {
    draft.value = null
    const text = raw.trim()
    if (text === '') {
      if (props.modelValue !== null) {
        emit('update:modelValue', null)
        emit('change', null)
      }
      return
    }
    let num = Number(text)
    if (Number.isNaN(num)) return
    if (props.precision !== undefined) {
      num = Number(num.toFixed(safePrecision(props.precision)))
    }
    num = clampValue(num, state.value.min, state.value.max)
    if (props.stepStrictly) {
      const mod = (num - state.value.min) % props.step
      if (mod !== 0) {
        num += mod >= props.step / 2 ? props.step - mod : -mod
        num = clampValue(num, state.value.min, state.value.max)
      }
    }
    if (num === props.modelValue) return
    emit('update:modelValue', num)
    emit('change', num)
  }

  /** 输入中：仅同步草稿不提交（uni input 无原生 change 事件，提交统一在失焦 / 确认） */
  function handleInput(event: Event): void {
    draft.value = resolveUniValue(event)
  }

  /** 失焦提交 */
  function handleBlur(event: Event): void {
    commitDraft(resolveUniValue(event))
  }

  /** MP 键盘「完成」按钮（confirm）与失焦等价，同样走提交 */
  function handleConfirm(event: Event): void {
    commitDraft(resolveUniValue(event))
  }

  /**
   * 键盘：上下键步进（阻止滚动）。仅 H5 调用（SFC 侧条件编译守卫，MP 端无键盘事件）。
   * 回车提交不在这里处理——H5 端原生 keydown 与 uni-input 的 confirm 事件会同时触发，
   * 统一走 @confirm（H5 回车 / MP 键盘「完成」都触发 confirm），避免同键双提交
   */
  function onInputKeydown(event: KeyboardEvent): void {
    if (event.key === LH_KEYS.ArrowUp) {
      event.preventDefault()
      handleIncrement()
      return
    }
    if (event.key === LH_KEYS.ArrowDown) {
      event.preventDefault()
      handleDecrement()
    }
  }

  return {
    state,
    displayValue,
    wrapperModifiers,
    sxStyle,
    placeholderStyle,
    ariaAttrs,
    ariaValuemin,
    ariaValuemax,
    isDecreaseDisabled,
    isIncreaseDisabled,
    handleIncrement,
    handleDecrement,
    handleInput,
    handleBlur,
    handleConfirm,
    onInputKeydown,
  }
}
