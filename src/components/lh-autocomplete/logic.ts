import { computed, getCurrentInstance, nextTick, ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import {
  filterSuggestions,
  getAutocompleteOptionId,
  getAutocompleteOptionValue,
  getAutocompleteTriggerAria,
} from '@lh-ui/share/core/autocomplete'
import { isEscapeKey, LH_KEYS, sxToStyle } from '@lh-ui/share/core/shared'
import { useLhComponent, useLhPopperIds } from '@/composables'
import { useLhPopper } from '@/adapter/popper'
import { lhlocale } from '@/adapter/locale'
import type { LhEmitFn } from '@/types/emit'
import type { LhAutocompleteOption, LhAutocompleteResolvedProps } from './types'

/** uni input 事件载荷形态：@input 的值在 event.detail.value */
type LhUniInputEvent = { detail: { value: string } }

/**
 * Autocomplete 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 弹层定位用 useLhPopper（两帧度量 → computePosition → 显示），挂载走
 *   lh-root-portal（plus 手搓 Teleport + fixed）。
 * - 键盘导航 / Esc：@keydown 绑定留双端，MP 端无键盘事件永不触发；
 *   hover 高亮 MP 端无语义，高亮由点击 / 触摸承载。
 * - 外部关闭：弹层透明遮罩点按关闭（同 lh-select 的 MP 范式；
 *   plus 的 document 级 click 监听在 MP 不可用）。
 */
export function useLhAutocomplete(
  props: LhAutocompleteResolvedProps,
  emit: LhEmitFn<'update:modelValue' | 'change' | 'select'>,
) {
  const { componentStyle } = useLhComponent('autocomplete', props)

  const instance = getCurrentInstance()
  const scope = (instance?.proxy as ComponentPublicInstance) ?? null

  /** 弹层 trigger / listbox 的唯一 id（triggerId 兼作 popper 度量选择器） */
  const { triggerId, popperId } = useLhPopperIds('autocomplete')

  const isOpen = ref(false)
  const highlightedIndex = ref(-1)

  // 内部值 + watch 回写：受控与非受控双模式。直接 :value 绑 modelValue 时，
  // 父级未回写（非受控用法）会在重渲染时把输入框刷回旧值；内部 ref 保持
  // DOM 稳定，modelValue 变化时再同步回来（与 plus 同构）
  const innerValue = ref(props.modelValue ?? '')
  watch(
    () => props.modelValue,
    (value) => {
      if ((value ?? '') !== innerValue.value) innerValue.value = value ?? ''
    },
  )

  const suggestions = computed(() =>
    filterSuggestions(props.options, innerValue.value, {
      caseSensitive: props.caseSensitive,
      trim: props.trim,
    }),
  )

  const highlightedId = computed(() =>
    getAutocompleteOptionId(popperId, highlightedIndex.value),
  )

  /** 选项元素 id：`{listboxId}-option-{index}`，供触发器 aria-activedescendant 引用 */
  function getOptionId(index: number) {
    return getAutocompleteOptionId(popperId, index)
  }

  /** 触发器 aria 属性包（摊开绑模板，见 SFC） */
  const triggerAria = computed(() =>
    getAutocompleteTriggerAria({
      visible: isOpen.value,
      listboxId: popperId,
      highlightedIndex: highlightedIndex.value,
    }),
  )

  const ariaExpanded = computed(() => Boolean(triggerAria.value['aria-expanded']))
  // 字面量联合收窄：模板的 aria-haspopup 绑定要求 ARIA token 联合，不能用 String 打宽
  const ariaHaspopup = computed(() =>
    triggerAria.value['aria-haspopup'] !== undefined
      ? (String(triggerAria.value['aria-haspopup']) as 'listbox')
      : undefined,
  )

  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  /** 修饰类（open / disabled），根节点 lh-autocomplete 已在模板写死，不重复输出 */
  const autocompleteClass = computed(() => ({
    'lh-autocomplete--open': isOpen.value,
    'lh-autocomplete--disabled': props.disabled,
  }))

  const ariaLabelText = computed(() => {
    void lhlocale.version.value
    return props.ariaLabel ?? lhlocale.t('autocomplete.label', '自动补全')
  })

  const emptyText = computed(() => {
    void lhlocale.version.value
    return lhlocale.t('autocomplete.noMatch', '无匹配数据')
  })

  const placeholderText = computed(() => {
    void lhlocale.version.value
    return props.placeholder ?? lhlocale.t('autocomplete.placeholder', '请输入')
  })

  // 弹层定位（两帧度量：气泡先隐藏渲染 → 量尺寸 → 定位 → 显示）
  const { popperStyle, update: updatePopper } = useLhPopper(`#${triggerId}`, `#${popperId}`, scope, {
    placement: 'bottom',
    // 下拉框宽度跟随触发器：root-portal teleport 后 left/right 拉伸失效，
    // 必须显式同步宽度，否则塌缩到内容宽（同 lh-select）
    matchTriggerWidth: true,
  })

  function open() {
    if (props.disabled || isOpen.value) return
    isOpen.value = true
    highlightedIndex.value = -1
    nextTick(() => {
      updatePopper()
    })
  }

  function close() {
    isOpen.value = false
    highlightedIndex.value = -1
  }

  function selectOption(option: LhAutocompleteOption) {
    if (option.disabled) return
    const value = getAutocompleteOptionValue(option)
    // share 契约：label 是展示与输入回填文案，value 是提交值。
    // 输入框回填 label（与 plus 一致），modelValue / change 提交 value
    innerValue.value = option.label
    emit('update:modelValue', String(value))
    emit('change', String(value))
    emit('select', value, option)
    close()
  }

  function nextHighlight(direction: 1 | -1) {
    const list = suggestions.value
    if (list.length === 0) return
    let index = highlightedIndex.value
    for (let step = 0; step < list.length; step += 1) {
      index = (index + direction + list.length) % list.length
      if (!list[index].disabled) {
        highlightedIndex.value = index
        return
      }
    }
  }

  function handleInput(e: Event) {
    innerValue.value = (e as unknown as LhUniInputEvent).detail.value
    emit('update:modelValue', innerValue.value)
    emit('change', innerValue.value)
    open()
  }

  function handleFocus() {
    if (props.openOnFocus) open()
  }

  /** 键盘导航 / Esc / Enter 选中（MP 端无键盘事件，永不触发） */
  function handleKeydown(event: KeyboardEvent) {
    if (props.disabled) return
    if (event.key === LH_KEYS.ArrowDown || event.key === LH_KEYS.ArrowUp) {
      event.preventDefault()
      if (!isOpen.value) open()
      else nextHighlight(event.key === LH_KEYS.ArrowDown ? 1 : -1)
      return
    }
    if (event.key === LH_KEYS.Enter && isOpen.value && highlightedIndex.value >= 0) {
      event.preventDefault()
      const option = suggestions.value[highlightedIndex.value]
      if (option) selectOption(option)
      return
    }
    if (isEscapeKey(event)) close()
  }

  /** 点击遮罩关闭（MP 端的外部关闭路径） */
  function handleMaskClick() {
    close()
  }

  return {
    triggerId,
    popperId,
    popperStyle,
    isOpen,
    innerValue,
    suggestions,
    highlightedIndex,
    highlightedId,
    getOptionId,
    ariaExpanded,
    ariaHaspopup,
    ariaLabelText,
    emptyText,
    placeholderText,
    sxStyle,
    componentStyle,
    autocompleteClass,
    open,
    close,
    selectOption,
    handleInput,
    handleFocus,
    handleKeydown,
    handleMaskClick,
  }
}
