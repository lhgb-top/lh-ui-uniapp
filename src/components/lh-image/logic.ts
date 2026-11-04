import { computed, ref } from 'vue'
import { getImageClassNames, normalizePreviewList } from '@lh-ui/share/core/image'
import { sxToStyle } from '@lh-ui/share/core/shared'
import type { LhImageFit } from '@lh-ui/share/core/image'
import { lhlocale } from '@/adapter/locale'
import { previewLhImages } from '@/adapter/preview-image'
import type { LhEmitFn } from '@/types/emit'
import type { LhImageResolvedProps } from './types'

/**
 * CSS object-fit → uni `<image>` 的 mode 映射
 *
 * 与 lh-avatar 同款映射（偏离登记）：uni 无 scale-down 等价模式（「缩小到刚好放下，
 * 不放大」），取语义最接近的 aspectFit（保持比例完整展示）。fill/contain/cover/none
 * 分别对应 scaleToFill/aspectFit/aspectFill/center，语义一致。
 */
const FIT_TO_MODE: Record<LhImageFit, string> = {
  fill: 'scaleToFill',
  contain: 'aspectFit',
  cover: 'aspectFill',
  none: 'center',
  'scale-down': 'aspectFit',
}

/**
 * Image 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 裁切走 `<image mode>`（见 FIT_TO_MODE）：object-fit 的 CSS 实现只对 H5 的真实
 *   img 生效，uni `<image>` 跨端统一由 mode 控制
 * - 预览用 uni.previewImage 原生 API（经 adapter/preview-image 适配层）：
 *   plus 的自绘 Viewer（缩放 / 旋转 / 多图切换 / 焦点圈）依赖 teleport + document，
 *   小程序不可用；初始下标固定 0，与 plus 的 initialIndex=0 同口径
 * - 懒加载是 `<image>` 自带的 lazy-load 属性（plus 是 img 的 loading="lazy"）
 * - 失败占位文案走 share locales 的 image.error（九语言齐备，仓内不持有文案）
 */
export function useLhImage(props: LhImageResolvedProps, emit: LhEmitFn<'load' | 'error'>) {
  const error = ref(false)

  const imageMode = computed(() => FIT_TO_MODE[props.fit])

  /** 内层图修饰类：lh-image__inner--{fit}（object-fit 语义由 mode 承担，仅作钩子保留） */
  const innerClass = computed(() => `lh-image__inner--${props.fit}`)

  /** 根修饰类（lh-image 基类已在模板写死，这里滤掉只留修饰类） */
  const imageModifiers = computed(() =>
    getImageClassNames({
      fit: props.fit,
      error: error.value,
      loaded: !error.value,
      preview: !!props.preview,
    }).filter((name) => name !== 'lh-image'),
  )

  const imageStyle = computed(() => sxToStyle(props.sx ?? {}))

  /** 预览列表：未传 previewSrcList 时退化为 [src]（share core 纯函数） */
  const previewList = computed(() => normalizePreviewList(props.src, props.previewSrcList))

  /** 失败占位文案（随语言切换重算） */
  const errorText = computed(() => lhlocale.t('image.error', '加载失败'))

  function handleLoad(event: Event): void {
    error.value = false
    emit('load', event)
  }

  function handleError(event: Event): void {
    error.value = true
    emit('error', event)
  }

  /** 点击预览：仅 preview 开启时拉起原生预览（与 plus 的 openViewer 同口径，初始下标 0） */
  function openPreview(): void {
    if (!props.preview) return
    previewLhImages({ urls: previewList.value })
  }

  return {
    error,
    imageMode,
    innerClass,
    imageModifiers,
    imageStyle,
    previewList,
    errorText,
    handleLoad,
    handleError,
    openPreview,
  }
}
