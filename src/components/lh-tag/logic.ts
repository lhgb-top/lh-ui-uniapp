import { computed } from 'vue'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { getTagClassNames } from '@lh-ui/share/core/tag'
import { lhlocale } from '@/adapter/locale'
import { useLhComponent, useLhHasClickListener } from '@/composables'
import type { LhEmitFn } from '@/types/emit'
import type { LhTagResolvedProps } from './types'

/**
 * Tag 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 键盘激活（@keydown）在小程序无键盘事件，去掉；可点击语义仅靠 click
 * - 关闭按钮内的 svg 换成 lh-icon
 */
export function useLhTag(
  props: LhTagResolvedProps,
  emit: LhEmitFn<'click' | 'close'>,
) {
  const { componentStyle } = useLhComponent('tag', props)

  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const tagClass = computed(() =>
    getTagClassNames({
      type: props.type,
      size: props.size,
      closable: props.closable,
      disabled: props.disabled,
      round: props.round,
      hit: props.hit,
    }),
  )

  const tagStyle = computed(() => ({
    ...componentStyle.value,
    ...sxStyle.value,
  }))

  /** 父级是否绑定了 click 监听（渲染期读 vnode.props，照 plus 仓做法）；禁用态不响应 */
  const hasClickListener = useLhHasClickListener()
  const clickable = computed(() => hasClickListener.value && !props.disabled)

  const closeLabel = computed(() => lhlocale.t('tag.close', '关闭'))

  function handleClose(e: Event) {
    if (props.disabled) return
    emit('close', e)
  }

  return {
    tagClass,
    tagStyle,
    clickable,
    closeLabel,
    handleClose,
  }
}
