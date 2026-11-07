import { computed } from 'vue'
import { getLinkAria, getLinkClassNames } from '@lh-ui/share/core/link'
import { sxToStyle } from '@lh-ui/share/core/shared'
import type { LhEmitFn } from '@/types/emit'
import type { LhLinkResolvedProps } from './types'

/**
 * Link 组件胶水（逻辑对齐 plus 仓）
 *
 * 【uni-app 差异】
 * - 渲染载体：H5 保留 a 标签（含 disabled 的 span 降级），MP 统一 view + click。
 * - aria 包摊开：getLinkAria 的返回值按字段逐个绑模板（MP 模板不支持
 *   v-bind="attrs"，本仓坑 16），契约仍由 share 决定。
 */
export function useLhLink(props: LhLinkResolvedProps, emit: LhEmitFn<'click'>) {
  /** 修饰类挂在根元素上，lh-link 本身已在模板写死，这里滤掉避免重复 */
  const linkClass = computed(() =>
    getLinkClassNames({
      type: props.type,
      underline: props.underline,
      disabled: props.disabled,
    }).filter((name) => name !== 'lh-link'),
  )

  const sxStyle = computed(() => sxToStyle(props.sx ?? {}))

  const linkAria = computed(() =>
    getLinkAria({ disabled: props.disabled, current: props.current }),
  )

  /** aria-disabled（布尔收窄，vue-tsc 的 Booleanish 约束） */
  const ariaDisabled = computed(() => Boolean(linkAria.value['aria-disabled']))
  // 字面量联合收窄：模板的 aria-current 绑定要求 ARIA token 联合，不能用 String 打宽
  const ariaCurrent = computed(() =>
    linkAria.value['aria-current'] !== undefined
      ? (String(linkAria.value['aria-current']) as
          | 'page'
          | 'location'
          | 'step'
          | 'date'
          | 'time'
          | 'true')
      : undefined,
  )

  function handleClick(event: Event) {
    emit('click', event)
  }

  return { linkClass, sxStyle, ariaDisabled, ariaCurrent, handleClick }
}
