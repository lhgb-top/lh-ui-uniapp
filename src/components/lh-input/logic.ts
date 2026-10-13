import { computed } from 'vue'
import {
  getWordCount,
  shouldShowWordLimit,
  clampString,
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
    if (props.readonly) return
    const value = resolveUniValue(e)
    emit('update:modelValue', value)
    emit('blur', value)
  }

  function handleFocus(e: Event) {
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
    handleInput,
    handleBlur,
    handleFocus,
    handleClear,
  }
}
