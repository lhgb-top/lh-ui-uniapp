import { computed, ref } from 'vue'
import {
  getInputTagClassNames,
  insertInputTag,
  isInputTagTriggerKey,
  removeInputTag,
} from '@lh-ui/share/core/input-tag'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { lhlocale } from '@/adapter/locale'
import type { LhEmitFn } from '@/types/emit'
import type { LhInputTagResolvedProps } from './types'

/** uni input 事件载荷形态：@input/@blur 的值在 event.detail.value */
type LhUniInputEvent = { detail: { value: string } }

/**
 * InputTag 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 提交路径：H5 走 @keydown 的触发键（enter / space / comma）+ 失焦提交；
 *   MP 端无键盘事件，提交走 @confirm（完成键），trigger 的 space / comma
 *   语义仅 H5。
 * - Backspace 删尾仅 H5（MP 无 keydown）；MP 端删除主路径是标签的 × 按钮。
 * - 聚焦由 :focus prop 驱动，点容器置位（uni input 无 ref.focus 全端契约）。
 */
export function useLhInputTag(
  props: LhInputTagResolvedProps,
  emit: LhEmitFn<'update:modelValue' | 'change' | 'add' | 'remove'>,
) {
  const inputValue = ref('')
  const focused = ref(false)

  const tags = computed(() => props.modelValue ?? [])

  /** 修饰类挂在根元素上，lh-input-tag 本身已在模板写死，这里滤掉避免重复 */
  const inputTagClass = computed(() =>
    getInputTagClassNames({
      max: props.max,
      allowDuplicate: props.allowDuplicate,
      readonly: props.readonly,
      disabled: props.disabled,
    }).filter((name) => name !== 'lh-input-tag'),
  )

  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const ariaLabelText = computed(() => {
    void lhlocale.version.value
    return props.ariaLabel ?? lhlocale.t('inputTag.label', '标签输入')
  })

  /** 单标签删除按钮的无障碍名称（removeTag 键 share 未收，走兜底文案） */
  const removeTagLabel = computed(() => {
    void lhlocale.version.value
    return lhlocale.t('ariaLabels.removeTag', '移除标签')
  })

  /** 占位提示仅在没有标签时显示（与 plus 同构） */
  const placeholderText = computed(() =>
    tags.value.length === 0 ? props.placeholder : '',
  )

  function resolveUniValue(e: Event): string {
    return (e as unknown as LhUniInputEvent).detail.value
  }

  function onInput(e: Event) {
    // uni 的 input 组件不支持 readonly（同 lh-input 的口径），只读语义在组件层拦截：
    // 不接受输入，受控的 :value 回弹，瞬态字符不残留
    if (props.readonly) return
    inputValue.value = resolveUniValue(e)
  }

  function onBlur() {
    focused.value = false
    if (props.disabled || props.readonly) return
    // 失焦时提交未完成的输入（Enter 提交的标准兜底）
    if (inputValue.value !== '') commit()
  }

  function onFocus() {
    focused.value = true
  }

  /** 完成键提交（MP 端主路径；H5 端 uni-input 也会派发 confirm） */
  function onConfirm() {
    if (props.disabled || props.readonly) return
    commit()
  }

  /** H5 键盘事件：触发键提交 + Backspace 删尾（MP 端永不触发） */
  function onKeydown(e: KeyboardEvent) {
    if (props.disabled || props.readonly) return
    if (e.key === 'Backspace' && inputValue.value === '' && tags.value.length > 0) {
      e.preventDefault()
      removeTag(tags.value.length - 1)
      return
    }
    if (isInputTagTriggerKey(e.key, props.trigger)) {
      // comma / space 作为内容字符时用提交语义：comma 直接提交，
      // 空白不应进入输入框
      if (props.trigger === 'comma' || props.trigger === 'space') e.preventDefault()
      commit()
    }
  }

  function commit() {
    const result = insertInputTag(tags.value, inputValue.value, {
      max: props.max,
      allowDuplicate: props.allowDuplicate,
    })
    if (!result.inserted) {
      // 空串静默忽略；重复 / 超上限清掉输入交由业务感知（change 不触发）
      if (result.reason !== 'empty') inputValue.value = ''
      return
    }
    emit('update:modelValue', result.tags)
    emit('change', result.tags)
    emit('add', result.tags[result.tags.length - 1])
    inputValue.value = ''
  }

  function removeTag(index: number) {
    const removed = tags.value[index]
    if (removed === undefined) return
    const next = removeInputTag(tags.value, index)
    emit('update:modelValue', next)
    emit('change', next)
    emit('remove', removed)
  }

  /** 点容器聚焦（:focus prop 驱动 uni input） */
  function focusInput() {
    if (!props.disabled && !props.readonly) focused.value = true
  }

  return {
    inputValue,
    focused,
    tags,
    inputTagClass,
    sxStyle,
    ariaLabelText,
    removeTagLabel,
    placeholderText,
    onInput,
    onBlur,
    onFocus,
    onConfirm,
    onKeydown,
    commit,
    removeTag,
    focusInput,
  }
}
