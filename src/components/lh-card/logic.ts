import { computed } from 'vue'
import {
  getCardClassNames,
  getCardInteractivity,
  isCardInteractive,
} from '@lh-ui/share/core/card'
import { isActivationKey } from '@lh-ui/share/core/shared'
import { useLhComponent } from '@/composables'
import type { LhEmitFn } from '@/types/emit'
import type { LhCardResolvedProps } from './types'

/**
 * Card 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 主题走 useLhComponent（componentTheme['card'] 链路与 button 同款）
 * - 键盘激活仅 H5：小程序无键盘事件，SFC 的 @keydown 处理函数由条件编译守卫
 */
export function useLhCard(props: LhCardResolvedProps, emit: LhEmitFn<'click'>) {
  const { componentStyle } = useLhComponent('card', props)

  const cardState = computed(() => ({
    shadow: props.shadow,
    clickable: props.clickable,
    loading: props.loading,
  }))

  const cardClass = computed(() => getCardClassNames(cardState.value))

  /** 可交互卡的键盘语义（对齐 APG button pattern） */
  const interactivity = computed(() => getCardInteractivity(cardState.value))

  /** 整卡键盘激活（Enter / Space），仅 H5 调用 */
  function onCardKeydown(e: Event) {
    if (!isCardInteractive(cardState.value)) return
    if (isActivationKey(e as KeyboardEvent)) {
      e.preventDefault()
      emit('click', e)
    }
  }

  return { cardClass, cardStyle: componentStyle, interactivity, onCardKeydown }
}
