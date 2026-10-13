import { computed, ref } from 'vue'
import { getAvatarClassNames, getAvatarText, isImageSource } from '@lh-ui/share/core/avatar'
import { sxToStyle } from '@lh-ui/share/core/shared'
import type { LhEmitFn } from '@/types/emit'
import type { LhAvatarFit, LhAvatarResolvedProps } from './types'

/**
 * CSS object-fit → uni `<image>` 的 mode 映射
 *
 * 【偏离登记】uni 无 scale-down 等价模式（「缩小到刚好放下，不放大」），
 * 取语义最接近的 aspectFit（保持比例完整展示）。fill/contain/cover/none
 * 分别对应 scaleToFill/aspectFit/aspectFill/center，语义一致。
 */
const FIT_TO_MODE: Record<LhAvatarFit, string> = {
  fill: 'scaleToFill',
  contain: 'aspectFit',
  cover: 'aspectFill',
  none: 'center',
  'scale-down': 'aspectFit',
}

/**
 * Avatar 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】图片走 `<image mode>`；加载失败回退图标 → 文字 → 插槽。
 */
export function useLhAvatar(props: LhAvatarResolvedProps, emit: LhEmitFn<'error'>) {
  const loadError = ref(false)

  const avatarClass = computed(() =>
    getAvatarClassNames({
      size: props.size,
      shape: props.shape,
    }),
  )

  const avatarText = computed(() => getAvatarText(props.text ?? ''))

  const avatarStyle = computed(() => sxToStyle(props.sx ?? {}))

  /** 图片有效且未加载失败时走图片分支 */
  const showImage = computed(() => isImageSource(props.src) && !loadError.value)

  const imageMode = computed(() => FIT_TO_MODE[props.fit])

  // 图片分支由 <image> 自身命名；图标/文字分支由 alt 提供无障碍名称
  const avatarRole = computed(() => (showImage.value ? undefined : 'img'))

  function handleError(e: Event) {
    loadError.value = true
    emit('error', e)
  }

  return {
    loadError,
    showImage,
    imageMode,
    avatarClass,
    avatarText,
    avatarStyle,
    avatarRole,
    handleError,
  }
}
