import { computed } from 'vue'
import {
  getSegmentedAria,
  getSegmentedClassNames,
  getSegmentedItemAria,
  normalizeSegmentedOptions,
} from '@lh-ui/share/core/segmented'
import { getNextListIndex, getRovingTabIndex, LH_KEYS, sxToStyle } from '@lh-ui/share/core/shared'
import type { LhSegmentedNormalized } from '@lh-ui/share/core/segmented'
import type { LhEmitFn } from '@/types/emit'
import type { LhSegmentedResolvedProps } from './types'

/**
 * Segmented 分段器胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 无障碍属性包由 share 的 getSegmentedAria / getSegmentedItemAria 决定契约，
 *   因 MP 模板编译器不支持 v-bind 对象，这里摊成具体值供模板逐项显式绑定
 * - 键盘方向键导航仅 H5（SFC 侧条件编译守卫）；底层移动算法复用
 *   core/shared 的 getNextListIndex（首尾循环 + 跳过禁用项）
 */
export function useLhSegmented(
  props: LhSegmentedResolvedProps,
  emit: LhEmitFn<'update:modelValue' | 'change'>,
) {
  /** 规范化选项（字符串快捷写法 → { label, value, disabled }） */
  const normalized = computed(() => normalizeSegmentedOptions(props.options))

  /** 当前选中下标（-1 表示未选中任何项） */
  const checkedIndex = computed(() =>
    normalized.value.findIndex((option) => option.value === props.modelValue),
  )

  /** 首个启用项下标（未选中时的键盘导航起点） */
  const firstEnabledIndex = computed(() =>
    normalized.value.findIndex((option) => !option.disabled),
  )

  /** 修饰类挂在根元素上，lh-segmented 本身已在模板写死，这里滤掉避免重复 */
  const segmentedModifiers = computed(() =>
    getSegmentedClassNames({ disabled: props.disabled, block: props.block }).filter(
      (name) => name !== 'lh-segmented',
    ),
  )

  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  /**
   * roving tabindex：选中项（无选中时首个启用项）持有焦点位 0，其余 -1。
   * 焦点下标由 core/shared 的 getRovingTabIndex 产出（空组返回 -1，
   * 此时模板按 -1 落 tabindex，组内无 Tab 锚点）
   */
  const focusIndex = computed(() => getRovingTabIndex(normalized.value, checkedIndex.value))

  const tabStops = computed(() =>
    normalized.value.map((_, index) => (index === focusIndex.value ? 0 : -1)),
  )

  /**
   * 无障碍属性摊开（MP 模板编译器不支持 v-bind 对象）
   *
   * 根节点与每个选项的属性包都由 share 的 getSegmentedAria /
   * getSegmentedItemAria 产出契约，胶水层只把需要的键收窄成布尔值
   */
  const rootAriaDisabled = computed(() =>
    Boolean(getSegmentedAria({ disabled: props.disabled })['aria-disabled']),
  )

  const itemAriaList = computed(() =>
    normalized.value.map((option) => {
      const aria = getSegmentedItemAria({
        selected: option.value === props.modelValue,
        disabled: option.disabled,
      })
      return {
        checked: Boolean(aria['aria-checked']),
        disabled: Boolean(aria['aria-disabled']),
      }
    }),
  )

  /**
   * 选项禁用态（整组禁用时全部禁用），模板据此落 lh-segmented__option--disabled；
   * 该修饰类的外观由 SFC 内联兜底规则提供（view 无 :disabled 伪类，见 SFC 注释）
   */
  const itemDisabled = computed(() =>
    normalized.value.map((option) => props.disabled || option.disabled),
  )

  function select(option: LhSegmentedNormalized): void {
    if (props.disabled || option.disabled) return
    emit('update:modelValue', option.value)
    emit('change', option.value)
  }

  /** 方向键移动（仅 H5 调用，MP 端无键盘事件）：首尾循环、跳过禁用项 */
  function onSegmentedKeydown(event: KeyboardEvent): void {
    if (props.disabled) return
    const directions: Record<string, 1 | -1> = {
      [LH_KEYS.ArrowRight]: 1,
      [LH_KEYS.ArrowDown]: 1,
      [LH_KEYS.ArrowLeft]: -1,
      [LH_KEYS.ArrowUp]: -1,
    }
    const direction = directions[event.key]
    if (!direction) return
    event.preventDefault()
    const current = checkedIndex.value === -1 ? firstEnabledIndex.value : checkedIndex.value
    const next = getNextListIndex(normalized.value, current, direction)
    const option = normalized.value[next]
    if (option && !option.disabled) select(option)
  }

  return {
    normalized,
    checkedIndex,
    segmentedModifiers,
    sxStyle,
    tabStops,
    rootAriaDisabled,
    itemAriaList,
    itemDisabled,
    select,
    onSegmentedKeydown,
  }
}
