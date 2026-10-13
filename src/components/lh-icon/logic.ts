import { computed } from 'vue'
import { getIconSize, getIconSvg } from '@lh-ui/share/core/icon'
import { useLhComponent } from '@/composables'
import type { LhIconProps } from './types'

/**
 * Icon 组件胶水（逻辑对齐 plus 仓 useLhIcon）
 *
 * 【uni-app 差异】渲染载体从 <svg><path/></svg> 换成 iconfont 字体类
 * （scripts/build-iconfont.mjs 产物），所以这里输出的是「类名 + fontSize/color 样式」
 * 而非 path 数据。
 */
export function useLhIcon(props: LhIconProps) {
  const { componentStyle } = useLhComponent('icon', props)

  /** 图标是否存在（不存在时走插槽兜底，与 plus 一致） */
  const hasIcon = computed(() => getIconSvg(props.name) !== null)

  /**
   * 外层容器类名：lh-icon 基础样式 + 名称变体 + 自定义类。
   * 对齐 share 的 `.lh-icon` / `.lh-icon--loading` 选择器（容器层）。
   * loading 的 spin 由 `lh-icon--loading` 名称变体天然承载
   * （净化后的样式 `.lh-icon--loading .lh-iconfont` 作用于内层字体节点）。
   */
  const iconClass = computed(() => {
    const list = ['lh-icon']
    if (props.name) list.push(`lh-icon--${props.name}`)
    if (props.customClass) list.push(props.customClass)
    return list
  })

  /**
   * 内层字体节点类名：lh-iconfont + 名称变体。
   * 对齐 share 的 `.lh-icon svg` 后代选择器——经 build-styles 净化后变成
   * `.lh-icon .lh-iconfont`，所以字体类必须落在 lh-icon 的**内层节点**上，
   * 否则 `.lh-icon--loading .lh-iconfont` 的 spin 动画永远不匹配。
   */
  const iconfontClass = computed(() => {
    const list = ['lh-iconfont']
    if (props.name) list.push(`lh-iconfont--${props.name}`)
    return list
  })

  /**
   * 图标内联样式：fontSize 承载尺寸（iconfont 字体方案），color 承载颜色。
   * 尺寸映射沿用 share 的 getIconSize（mini12/small14/medium16/large20/x-large24）。
   */
  const iconStyle = computed(() => {
    const style: Record<string, string> = {}
    if (props.size !== undefined) {
      const size = typeof props.size === 'number' ? `${props.size}px` : props.size
      style.fontSize = size
    } else {
      style.fontSize = `${getIconSize(props.size)}px`
    }
    if (props.color) style.color = props.color
    return style
  })

  return {
    hasIcon,
    iconClass,
    iconfontClass,
    iconStyle,
    componentStyle,
  }
}
