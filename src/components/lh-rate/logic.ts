import { computed } from 'vue'
import {
  clampRate,
  getRateAriaText,
  getRateClassNames,
  getStarFill,
  stepRate,
} from '@lh-ui/share/core/rate'
import { LH_KEYS, sxToStyle } from '@lh-ui/share/core/shared'
import { lhlocale } from '@/adapter/locale'
import type { LhEmitFn } from '@/types/emit'
import type { LhRateResolvedProps } from './types'

/**
 * Rate 评分胶水（逻辑对齐 plus 仓）
 *
 * 填充档位 / 钳制 / 步进 / 类名全部走 share core 纯函数，本仓只做 computed 包裹。
 * 【uni-app 差异】
 * - `<button>` 星星换 `<view role="radio">`（MP 的 button 无法 reset 默认样式），
 *   禁用由点击守卫 + --disabled 修饰类 + aria-disabled 表达
 * - 半星命中依赖 offsetX：H5 点击事件携带该字段可判左半区；MP 无 offsetX，
 *   点击退化整星（文档「平台差异」已登记）
 * - 键盘方向键步进仅 H5（MP 无键盘事件）；步进算法复用 core 的 stepRate
 * - 文案走 share locales 的 rate.stars（九语言齐备，仓内不持有文案）
 */
export function useLhRate(props: LhRateResolvedProps, emit: LhEmitFn<'update:modelValue' | 'change'>) {
  /** 钳制后的当前评分 */
  const value = computed(() => clampRate(props.modelValue, props.max))

  /** 文案随语言切换重算（lhlocale.t 内部订阅版本号） */
  const ariaText = computed(() => getRateAriaText(value.value, lhlocale.t('rate.stars', '{n} 星')))

  /** 每颗星的 aria 文案（第 i 颗 = i 星） */
  const starAriaList = computed(() =>
    Array.from({ length: props.max }, (_, i) => getRateAriaText(i + 1, lhlocale.t('rate.stars', '{n} 星'))),
  )

  /** 分数文本（scoreTemplate 优先，{n} 占位） */
  const scoreText = computed(() =>
    getRateAriaText(value.value, props.scoreTemplate ?? lhlocale.t('rate.stars', '{n} 星')),
  )

  /** 每颗星的填充档位（full / half / empty，索引 0 对应第 1 颗） */
  const fills = computed(() =>
    Array.from({ length: props.max }, (_, i) => getStarFill(value.value, i + 1, props.allowHalf)),
  )

  /** 根类名（lh-rate 已在模板写死，这里滤掉只留修饰类） */
  const rateModifiers = computed(() =>
    getRateClassNames({
      max: props.max,
      value: value.value,
      allowHalf: props.allowHalf,
      readonly: props.readonly,
      disabled: props.disabled,
    }).filter((name) => name !== 'lh-rate'),
  )

  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  /** roving tabindex：当前星（向上取整）持焦点位，无值时首星兜底（与 plus 一致） */
  const tabStops = computed(() =>
    Array.from({ length: props.max }, (_, i) => {
      const focusStar = value.value === 0 ? 1 : Math.ceil(value.value)
      return i + 1 === focusStar ? 0 : -1
    }),
  )

  /** 每颗星的选中态（MP 模板编译器不支持 v-bind 对象，摊成数组逐项绑定） */
  const ariaCheckedList = computed(() =>
    Array.from({ length: props.max }, (_, i) => value.value === i + 1),
  )

  function commit(next: number): void {
    const clamped = clampRate(next, props.max)
    if (clamped === value.value) return
    emit('update:modelValue', clamped)
    emit('change', clamped)
  }

  /** 点击第 i 颗星：半星模式下命中左半区取 i - 0.5（offsetX 仅 H5 可用） */
  function select(i: number, event?: MouseEvent): void {
    if (props.disabled) return
    if (props.allowHalf && event) {
      const target = event.currentTarget as HTMLElement | null
      if (target && typeof event.offsetX === 'number' && event.offsetX < target.clientWidth / 2) {
        commit(i - 0.5)
        return
      }
    }
    commit(i)
  }

  /** 方向键步进（仅 H5 触发，MP 端无键盘事件）：上下右增、左右减、Home 清零、End 打满 */
  function onKeydown(event: KeyboardEvent): void {
    if (props.disabled) return
    const actions: Record<string, () => void> = {
      [LH_KEYS.ArrowRight]: () => commit(stepRate(value.value, 1, props.allowHalf, props.max)),
      [LH_KEYS.ArrowUp]: () => commit(stepRate(value.value, 1, props.allowHalf, props.max)),
      [LH_KEYS.ArrowLeft]: () => commit(stepRate(value.value, -1, props.allowHalf, props.max)),
      [LH_KEYS.ArrowDown]: () => commit(stepRate(value.value, -1, props.allowHalf, props.max)),
      [LH_KEYS.Home]: () => commit(0),
      [LH_KEYS.End]: () => commit(props.max),
    }
    const action = actions[event.key]
    if (action) {
      event.preventDefault()
      action()
    }
  }

  return {
    value,
    ariaText,
    starAriaList,
    scoreText,
    fills,
    rateModifiers,
    sxStyle,
    tabStops,
    ariaCheckedList,
    select,
    onKeydown,
  }
}
