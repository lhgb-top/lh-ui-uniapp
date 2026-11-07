import { computed, getCurrentInstance, nextTick, ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import {
  filterMentionOptions,
  getMentionContext,
  getMentionOptionId,
  getMentionsTriggerAria,
  insertMention,
} from '@lh-ui/share/core/mentions'
import type { LhMentionContext, LhMentionOption } from '@lh-ui/share/core/mentions'
import { isEscapeKey, LH_KEYS, sxToStyle } from '@lh-ui/share/core/shared'
import { useLhComponent, useLhPopperIds } from '@/composables'
import { useLhPopper } from '@/adapter/popper'
import { LH_IS_H5 } from '@/adapter/platform'
import { lhlocale } from '@/adapter/locale'
import type { LhEmitFn } from '@/types/emit'
import type { LhMentionsResolvedProps } from './types'

/** uni input/textarea 事件载荷形态：@input 的值在 event.detail.value */
type LhUniInputEvent = { detail: { value: string } }

/**
 * Mentions 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 弹层定位用 useLhPopper（两帧度量 → computePosition → 显示），挂载走
 *   lh-root-portal（plus 手搓 Teleport + fixed）。
 * - 光标上下文：H5 读原生控件 selectionStart；MP 端拿不到光标，以文本末尾
 *   近似（LH_IS_H5 编译期守卫，MP 包无死代码）——在已输入文本中间触发提及
 *   的场景 MP 端失效，降级为末尾插入（平台矩阵已登记）。
 * - 键盘导航 / Esc：@keydown 绑定留双端，MP 端无键盘事件永不触发。
 * - 外部关闭：弹层透明遮罩点按关闭（同 lh-select 的 MP 范式）。
 * - 选中后的光标落位（setSelectionRange）仅 H5 有效，MP 端跳过。
 */
export function useLhMentions(
  props: LhMentionsResolvedProps,
  emit: LhEmitFn<'update:modelValue' | 'change' | 'select'>,
) {
  const { componentStyle } = useLhComponent('mentions', props)

  const instance = getCurrentInstance()
  const scope = (instance?.proxy as ComponentPublicInstance) ?? null

  /** 弹层 trigger / listbox 的唯一 id（triggerId 兼作 popper 度量选择器） */
  const { triggerId, popperId } = useLhPopperIds('mentions')

  const visible = ref(false)
  const highlightedIndex = ref(-1)
  const context = ref<LhMentionContext>({ active: false, prefixIndex: -1, searchText: '', end: -1 })

  // 内部值 + watch 回写：受控与非受控双模式（同 autocomplete，防未回写时重渲染刷回旧值）
  const innerText = ref(props.modelValue ?? '')
  watch(
    () => props.modelValue,
    (value) => {
      if ((value ?? '') !== innerText.value) innerText.value = value ?? ''
    },
  )

  const filteredOptions = computed(() =>
    context.value.active ? filterMentionOptions(props.options, context.value.searchText) : [],
  )

  const highlightedId = computed(() =>
    getMentionOptionId(popperId, highlightedIndex.value),
  )

  /** 选项元素 id：`{listboxId}-option-{index}`，供输入框 aria-activedescendant 引用 */
  function getOptionId(index: number) {
    return getMentionOptionId(popperId, index)
  }

  /** 输入框 aria 属性包（摊开绑模板，见 SFC） */
  const triggerAria = computed(() =>
    getMentionsTriggerAria({
      visible: visible.value,
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

  /** 修饰类（open / disabled），根节点 lh-mentions 已在模板写死，不重复输出 */
  const mentionsClass = computed(() => ({
    'lh-mentions--open': visible.value,
    'lh-mentions--disabled': props.disabled,
  }))

  const ariaLabelText = computed(() => {
    void lhlocale.version.value
    return props.ariaLabel ?? lhlocale.t('mentions.label', '@提及')
  })

  const placeholderText = computed(() => {
    void lhlocale.version.value
    return props.placeholder ?? lhlocale.t('mentions.placeholder', '请输入内容，@ 提及成员')
  })

  const emptyText = computed(() => {
    void lhlocale.version.value
    return lhlocale.t('mentions.noMatch', '无匹配成员')
  })

  // 弹层定位（两帧度量：气泡先隐藏渲染 → 量尺寸 → 定位 → 显示）
  const { popperStyle, update: updatePopper } = useLhPopper(`#${triggerId}`, `#${popperId}`, scope, {
    placement: 'bottom',
    // 下拉框宽度跟随触发器（同 autocomplete / select 的下拉框语义）
    matchTriggerWidth: true,
  })

  /**
   * 依据光标位置刷新提及上下文与面板状态。
   * caret 由调用方决定：H5 读原生 selectionStart，MP 端以文本末尾近似。
   */
  function updateContext(caret: number) {
    const next = getMentionContext(innerText.value, caret, props.prefix)
    const changed =
      next.active !== context.value.active || next.searchText !== context.value.searchText
    context.value = next
    if (next.active && changed) {
      visible.value = true
      highlightedIndex.value = -1
      nextTick(() => {
        updatePopper()
      })
    } else if (!next.active && visible.value) {
      visible.value = false
      highlightedIndex.value = -1
    }
  }

  function close() {
    visible.value = false
    highlightedIndex.value = -1
  }

  function selectOption(option: LhMentionOption) {
    if (option.disabled) return
    const { text } = insertMention(innerText.value, context.value, option, props.prefix)
    innerText.value = text
    emit('update:modelValue', text)
    emit('change', text)
    emit('select', option)
    close()
    // 光标落到提及之后：plus 用 setSelectionRange 精确落位；MP 端不可靠，
    // 受控 value 回填后由输入框自然处理（光标在末尾，与近似路径一致）
  }

  function nextHighlight(direction: 1 | -1) {
    const list = filteredOptions.value
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
    innerText.value = (e as unknown as LhUniInputEvent).detail.value
    emit('update:modelValue', innerText.value)
    emit('change', innerText.value)
    // 光标位置：H5 从原生控件读（uni-h5 的 input 事件 target 就是原生控件）；
    // MP 端拿不到 selectionStart，以文本末尾近似（在中间触发提及的场景失效，
    // 已在平台矩阵登记为已知限制）
    const caret = LH_IS_H5 ? readCaret(innerText.value) : innerText.value.length
    updateContext(caret)
  }

  /**
   * H5 端读原生控件光标（uni-h5 运行时事件 target 为原生 input/textarea）。
   * 防护：合成 input 事件（vitest 的 trigger({ detail })）不会同步原生控件值，
   * 原生 selectionStart 会落后于受控文本——原生值长度不落后时才信原生光标，
   * 否则以文本末尾近似（真实运行时两值一致，此分支不触发）。
   */
  function readCaret(value: string): number {
    type LhControlLike = HTMLElement & { selectionStart?: number | null; value?: string }
    const raw = controlRef.value
    // controlRef 为 ref<unknown>：不能用 in 做 false 分支收窄（$el 为可选键），
    // 显式判键 + cast，语义与原实现一致
    const el: LhControlLike | undefined =
      raw && typeof raw === 'object' && '$el' in raw
        ? (raw as { $el?: LhControlLike }).$el
        : (raw as LhControlLike | undefined)
    if (!el || typeof el.selectionStart !== 'number') return value.length
    return (el.value?.length ?? 0) >= value.length ? el.selectionStart : value.length
  }

  /** 输入控件 ref（H5 读光标用；MP 端不读） */
  const controlRef = ref<unknown>(null)

  /** 点击 / keyup 时刷新上下文（H5；MP 端点击无光标语义，安全无副作用） */
  function handleSyncContext() {
    if (!LH_IS_H5) return
    updateContext(readCaret(innerText.value))
  }

  /** 键盘导航 / Esc / Enter 选中（MP 端无键盘事件，永不触发） */
  function handleKeydown(event: KeyboardEvent) {
    if (props.disabled) return
    if (event.key === LH_KEYS.ArrowDown || event.key === LH_KEYS.ArrowUp) {
      if (!visible.value) return
      event.preventDefault()
      nextHighlight(event.key === LH_KEYS.ArrowDown ? 1 : -1)
      return
    }
    if (event.key === LH_KEYS.Enter && visible.value && highlightedIndex.value >= 0) {
      event.preventDefault()
      const option = filteredOptions.value[highlightedIndex.value]
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
    controlRef,
    triggerId,
    popperId,
    visible,
    innerText,
    context,
    filteredOptions,
    highlightedIndex,
    highlightedId,
    getOptionId,
    ariaExpanded,
    ariaHaspopup,
    ariaLabelText,
    placeholderText,
    emptyText,
    sxStyle,
    componentStyle,
    mentionsClass,
    popperStyle,
    close,
    selectOption,
    handleInput,
    handleSyncContext,
    handleKeydown,
    handleMaskClick,
    updateContext,
  }
}
