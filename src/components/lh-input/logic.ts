import { computed, ref } from 'vue'
import {
  getWordCount,
  shouldShowWordLimit,
  clampString,
  getInputLabelClassNames,
  getInputWrapperModifiers,
} from '@lh-ui/share/core/input'
import { useLhComponent } from '@/composables'
import type { LhEmitFn } from '@/types/emit'
import type { LhInputProps } from './types'

/**
 * uni 事件载荷形态：@input/@blur 的值在 event.detail.value
 * （与浏览器的 InputEvent 不重叠，需要先转 unknown 再断言）
 */
type LhUniInputEvent = { detail: { value: string } }

/**
 * Input 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 事件取值：@input/@blur 的 event.detail.value（非 event.target.value）
 * - placeholder 样式不靠 ::placeholder（MP 不支持），改由 SFC 传 placeholder-style / placeholder-class prop
 */
export function useLhInput(
  props: LhInputProps,
  emit: LhEmitFn<'update:modelValue' | 'input' | 'blur' | 'focus' | 'clear'>,
) {
  const { componentStyle } = useLhComponent('input', props)

  /** 受控值：超长截断（调 share 纯函数） */
  const inputValue = computed(() => clampString(props.modelValue ?? '', props.maxlength))

  const isTextarea = computed(() => props.type === 'textarea')

  /** 字数统计 */
  const wordCount = computed(() =>
    getWordCount({ value: inputValue.value, maxlength: props.maxlength }),
  )
  const showWordLimit = computed(() =>
    shouldShowWordLimit({ maxlength: props.maxlength, minlength: props.minlength }),
  )

  /** 根类名 */
  const inputClass = computed(() => {
    const list = ['lh-input']
    if (props.size) list.push(`lh-input--${props.size}`)
    if (props.disabled) list.push('lh-input--disabled')
    if (props.readonly) list.push('lh-input--readonly')
    if (props.clearable) list.push('lh-input--clearable')
    if (props.state) list.push(`lh-input--${props.state}`)
    if (isTextarea.value) list.push('lh-input--textarea')
    if (props.prefixIcon) list.push('lh-input--with-prefix')
    if (props.suffixIcon) list.push('lh-input--with-suffix')
    if (props.customClass) list.push(props.customClass)
    return list
  })

  const inputStyle = componentStyle

  /** 聚焦态：wrapper --focused 类与 float label 浮起判定共用（plus/react 同名状态） */
  const isFocused = ref(false)

  /** label 类名与浮动判定：core 纯函数产出 */
  const labelClasses = computed(() =>
    getInputLabelClassNames({
      value: inputValue.value,
      isFocused: isFocused.value,
      labelPosition: props.labelPosition ?? 'float',
    }),
  )

  /** wrapper 修饰类：has-label / has-value / label 位置 */
  const wrapperModifiers = computed(() =>
    getInputWrapperModifiers({
      value: inputValue.value,
      label: props.label ?? '',
      labelPosition: props.labelPosition ?? 'float',
    }),
  )

  /**
   * label 定宽（仅 left/right 位置生效）：数字按 px，字符串原样。
   * 静态行内位置 label 上的 max-width 约束同步解除。
   */
  const labelStyle = computed(() => {
    if (!props.labelWidth || (props.labelPosition !== 'left' && props.labelPosition !== 'right')) {
      return undefined
    }
    const width =
      typeof props.labelWidth === 'number' ? `${props.labelWidth}px` : props.labelWidth
    return `width:${width};max-width:none;`
  })

  /**
   * textarea + 浮动 label 的顶部留白：share 样式走 :has 选择器（WXSS 不支持），
   * 小程序端改由内联样式兜底（本仓 placeholder-style 同款 MP 工作法）。
   * H5 端内联与 :has 规则同值叠加，视觉一致。
   */
  const textareaFloatStyle = computed(() =>
    isTextarea.value && props.label && (props.labelPosition ?? 'float') === 'float'
      ? 'padding-top:16px;'
      : undefined,
  )

  /** placeholder 样式（MP 端必需，替代 ::placeholder） */
  const placeholderStyle = computed(() => {
    if (props.placeholderStyle) return props.placeholderStyle
    // 默认占位色，对齐 share 的 --lh-text-placeholder
    return 'color: var(--lh-text-placeholder, #B0B0B0);'
  })

  function resolveUniValue(e: Event): string {
    return (e as unknown as LhUniInputEvent).detail.value
  }

  function handleInput(e: Event) {
    // 【uni-app 差异】uni 的 input / textarea 组件不支持 readonly（H5 端 uni-input
    // 只在 disabled 分支内部绑原生 readonly，微信小程序 input 更是只有 disabled），
    // 所以只读语义只能在组件层补：拦截 input，不更新 modelValue。
    // 原生框内瞬态字符会在下一次渲染时被受控的 value 回弹。
    if (props.readonly) return
    const value = resolveUniValue(e)
    emit('update:modelValue', value)
    emit('input', value)
  }

  function handleBlur(e: Event) {
    isFocused.value = false
    if (props.readonly) return
    const value = resolveUniValue(e)
    emit('update:modelValue', value)
    emit('blur', value)
  }

  function handleFocus(e: Event) {
    isFocused.value = true
    emit('focus', e)
  }

  function handleClear() {
    emit('update:modelValue', '')
    emit('clear')
  }

  return {
    inputValue,
    isTextarea,
    wordCount,
    showWordLimit,
    inputClass,
    inputStyle,
    placeholderStyle,
    isFocused,
    labelClasses,
    wrapperModifiers,
    labelStyle,
    textareaFloatStyle,
    handleInput,
    handleBlur,
    handleFocus,
    handleClear,
  }
}
