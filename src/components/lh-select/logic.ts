import { computed, ref, nextTick, getCurrentInstance } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { findSelectOption } from '@lh-ui/share/core/select'
import { getSize } from '@lh-ui/share/core/button'
import { useLhComponent, useLhPopperIds } from '@/composables'
import { useLhPopper } from '@/adapter/popper'
import { lhlocale } from '@/adapter/locale'
import type { LhEmitFn } from '@/types/emit'
import type { LhSelectProps, LhSelectOption } from './types'

/**
 * Select 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 弹层定位用 useLhPopper（getLhRect 异步度量 → computePosition → 显示）
 * - 键盘导航不启用（MP 无键盘事件），选项点击即选中
 * - filterable 的输入框在弹层内，过滤改变 filteredOptions
 */
export function useLhSelect(
  props: LhSelectProps,
  emit: LhEmitFn<'update:modelValue' | 'change' | 'visible-change'>,
) {
  const { componentStyle, configContext } = useLhComponent('select', props)

  const instance = getCurrentInstance()
  const scope = (instance?.proxy as ComponentPublicInstance) ?? null

  const { triggerId, popperId } = useLhPopperIds('select')

  const visible = ref(false)
  const filterText = ref('')

  const effectiveSize = computed(() => getSize(props.size, configContext?.value.size))

  const selectedOption = computed(() =>
    findSelectOption(props.options ?? [], props.modelValue),
  )

  const displayLabel = computed(() => selectedOption.value?.label ?? '')

  const filteredOptions = computed(() => {
    if (!props.filterable || !filterText.value) return props.options ?? []
    const keyword = filterText.value.toLowerCase()
    return (props.options ?? []).filter((option) =>
      option.label.toLowerCase().includes(keyword),
    )
  })

  const selectClass = computed(() => {
    const list = ['lh-select', `lh-select--${effectiveSize.value}`]
    if (visible.value) list.push('lh-select--visible')
    if (props.disabled) list.push('lh-select--disabled')
    if (props.clearable) list.push('lh-select--clearable')
    if (!selectedOption.value) list.push('lh-select--placeholder')
    if (props.customClass) list.push(props.customClass)
    return list
  })

  const selectStyle = computed(() => componentStyle.value)

  /** 文案国际化（lhlocale.t 内部已订阅版本号，切换语言自动重算） */
  const placeholderText = computed(() => props.placeholder ?? lhlocale.t('select.placeholder', '请选择'))
  const filterPlaceholder = computed(() => lhlocale.t('select.filter', '搜索'))
  const emptyText = computed(() => lhlocale.t('select.empty', '无匹配项'))

  // 弹层定位（两帧度量：气泡先隐藏渲染 → 量尺寸 → 定位 → 显示）
  const { popperStyle, update: updatePopper } = useLhPopper(
    `#${triggerId}`,
    `#${popperId}`,
    scope,
    {
      placement: props.placement ?? 'bottom',
      // 下拉框宽度跟随触发器：root-portal teleport 后 left/right 拉伸失效，
      // 必须显式同步宽度，否则塌缩到内容宽
      matchTriggerWidth: true,
    },
  )

  function open() {
    if (props.disabled) return
    visible.value = true
    emit('visible-change', true)
    nextTick(() => {
      updatePopper()
    })
  }

  function close() {
    if (!visible.value) return
    visible.value = false
    filterText.value = ''
    emit('visible-change', false)
  }

  function toggleOpen() {
    if (visible.value) close()
    else open()
  }

  function selectOption(option: LhSelectOption) {
    if (option.disabled) return
    emit('update:modelValue', option.value)
    emit('change', option.value)
    close()
  }

  function handleClear() {
    if (props.disabled) return
    emit('update:modelValue', undefined)
    emit('change', undefined)
  }

  /** 点击遮罩关闭 */
  function handleMaskClick() {
    close()
  }

  return {
    visible,
    popperStyle,
    triggerId,
    popperId,
    filterText,
    displayLabel,
    filteredOptions,
    selectClass,
    selectStyle,
    placeholderText,
    filterPlaceholder,
    emptyText,
    toggleOpen,
    selectOption,
    handleClear,
    handleMaskClick,
  }
}
