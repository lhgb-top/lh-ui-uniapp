import { computed, ref } from 'vue'
import {
  getEllipsisStyle,
  getTextAria,
  getTextClassNames,
} from '@lh-ui/share/core/text'
import { sxToStyle } from '@lh-ui/share/core/shared'
import { generateId } from '@lh-ui/share/utils'
import { LH_IS_H5 } from '@/adapter/platform'
import { copyLhText } from '@/adapter/clipboard'
import { lhlocale } from '@/adapter/locale'
import type { LhEmitFn } from '@/types/emit'
import type { LhTextResolvedProps } from './types'

/**
 * Text 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 渲染载体：MP 模板不支持动态组件（component :is），SFC 统一渲染 view，
 *   排版规格全部由 lh-text--<level> 修饰类承载（与 h1~h6 / p / caption 的
 *   标签排版等价，H5 与 MP 同构）；getTextTag 的映射在本仓不落图。
 * - 复制：MP 端读不到插槽文本，copyText prop 为唯一文本来源；
 *   H5 端不传 copyText 时读插槽 DOM 文本（LH_IS_H5 守卫，MP 包无死代码）。
 * - 语言包 text.copy / text.copied 九语言齐备，按响应式版本号取值。
 */
export function useLhText(props: LhTextResolvedProps, emit: LhEmitFn<'copy'>) {
  const copied = ref(false)
  let copyTimer: ReturnType<typeof setTimeout> | undefined

  const copyButtonId = generateId('lh-text-copy')

  /** 修饰类挂在根元素上，lh-text 本身已在模板写死，这里滤掉避免重复 */
  const textClass = computed(() =>
    getTextClassNames({
      level: props.level,
      type: props.type,
      strong: props.strong,
      italic: props.italic,
      underline: props.underline,
      mark: props.mark,
      code: props.code,
      ellipsis: props.ellipsis,
      disabled: props.disabled,
    }).filter((name) => name !== 'lh-text'),
  )

  const ellipsisStyle = computed(() => getEllipsisStyle(props.ellipsis))

  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const textAria = computed(() =>
    getTextAria({ copyButtonId: props.copyable ? copyButtonId : undefined }),
  )

  /** aria-labelledby 摊开（MP 模板不支持 v-bind="attrs"，本仓坑 16） */
  const ariaLabelledby = computed(() =>
    textAria.value['aria-labelledby'] ? copyButtonId : undefined,
  )

  const copyButtonLabel = computed(() => {
    void lhlocale.version.value
    return (
      props.copyLabel ??
      (copied.value ? lhlocale.t('text.copied', '已复制') : lhlocale.t('text.copy', '复制'))
    )
  })

  /**
   * 插槽内容节点：H5 真测试里 text 是自定义元素，ref 拿到 DOM；
   * uni-h5 运行时可能拿到组件代理，取 $el 兜底。MP 端不读此 ref。
   */
  const contentRef = ref<HTMLElement | { $el?: HTMLElement } | null>(null)

  /**
   * 读插槽文本：仅 H5 有 DOM 文本语义（uni-h5 的原生节点可读 textContent）。
   * MP 端此函数返回空串，复制文本来自 copyText prop。
   */
  function readSlotText(): string {
    if (!LH_IS_H5) return ''
    // '$el' in node 的假分支收窄不掉可选属性（TS 对 in 的假分支只摘除必填键），
    // 直接用 instanceof 分流：真 DOM 走自身，组件代理走 $el
    const node = contentRef.value
    const el = node instanceof HTMLElement ? node : node?.$el
    return props.copyText ?? el?.textContent ?? ''
  }

  async function handleCopy() {
    if (props.disabled) return
    const text = props.copyText ?? readSlotText()
    if (!text) return
    await copyLhText(text)
    copied.value = true
    emit('copy', text)
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = false
    }, 2000)
  }

  return {
    contentRef,
    copyButtonId,
    textClass,
    ellipsisStyle,
    sxStyle,
    ariaLabelledby,
    copyButtonLabel,
    copied,
    handleCopy,
  }
}
