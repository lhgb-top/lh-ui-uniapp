import { computed } from 'vue'
import { isClickable, getSize, getClassNames } from '@lh-ui/share/core/button'
import type { LhComponentSize } from '@lh-ui/share/core/shared'
import { useLhComponent } from '@/composables'
import type { LhEmitFn } from '@/types/emit'
import type { LhButtonResolvedProps } from './types'

/**
 * Button 组件胶水（逻辑对齐 plus 仓 useLhButton）
 *
 * 【uni-app 差异】
 * - 点击事件类型是 uni 的通用 Event（非 MouseEvent），由 uni 编译链转译
 * - loading 态渲染 lh-icon（iconfont），不再内联 svg
 */
export function useLhButton(props: LhButtonResolvedProps, emit: LhEmitFn<'click'>) {
  const { componentStyle, configContext } = useLhComponent('button', props)

  /** 有效尺寸：props > ConfigProvider > 默认值 medium */
  const effectiveSize = computed(() => getSize(props.size, configContext?.value.size))

  /** BEM 类名（调 share 纯函数，与各端一致） */
  const buttonClass = computed(() =>
    getClassNames({
      type: props.type,
      size: effectiveSize.value as LhComponentSize,
      loading: props.loading,
      disabled: props.disabled,
      plain: props.plain,
      block: props.block,
      round: props.round,
      circle: props.circle,
    }),
  )

  const buttonStyle = componentStyle

  /** 点击事件处理（loading/disabled 时不触发） */
  function handleClick(e: Event) {
    if (isClickable({ loading: props.loading, disabled: props.disabled })) {
      emit('click', e)
    }
  }

  return {
    effectiveSize,
    buttonClass,
    buttonStyle,
    handleClick,
    configContext,
  }
}
