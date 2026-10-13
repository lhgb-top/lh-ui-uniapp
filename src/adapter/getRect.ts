/**
 * 异步节点度量（getLhRect）—— 封装 uni.createSelectorQuery
 *
 * 小程序没有同步 getBoundingClientRect，所有度量都是异步的（SelectorQuery 回调）。
 * 本模块把回调包成 Promise，返回值映射为 LhDOMRectLike，
 * 可直接喂给 share 的 computePosition（popper 几何入参本来就是纯数据，零改动复用）。
 *
 * 【生命周期红线】createSelectorQuery 必须在组件 mounted 之后调用
 * （onLoad 阶段节点尚未创建，会量到 null）。调用方在 composable 里取
 * getCurrentInstance().proxy 作 scope，并在 onMounted / onReady 之后触发度量。
 *
 * 【scope 约束】小程序默认在页面范围选取节点，组件内调用必须传 scope
 * （uni 的 selectorQuery.in(component)）；支付宝端不支持 in()，传了也无害。
 */
import type { ComponentPublicInstance } from 'vue'
import type { LhDOMRectLike } from '@lh-ui/share/core/shared/popper'

/**
 * 与 DOMRect 同构的纯数据结构。直接复用 share 的 `LhDOMRectLike`（computePosition 入参），
 * 不再本地重复声明，保证度量结果与定位函数入参类型同源。
 */
export type { LhDOMRectLike }

export interface LhGetRectOptions {
  /** 查询全部匹配节点（默认只取第一个） */
  all?: boolean
  /** 组件实例 proxy，组件内调用必须传（限定选择范围到本组件） */
  scope?: ComponentPublicInstance | null
}

/**
 * 度量节点位置尺寸。
 *
 * @param selector 选择器（如 '#trigger' / '.lh-button'）
 * @returns Promise<LhDOMRectLike 或其数组（all 时）>；无节点时 reject
 *
 * @example
 * const rect = await getLhRect('#trigger', { scope: instance.proxy })
 */
export function getLhRect(
  selector: string,
  options: LhGetRectOptions = {},
): Promise<LhDOMRectLike | LhDOMRectLike[]> {
  const { all = false, scope = null } = options

  // H5 端直接用同步 DOM API 度量。
  // 【必须走分支的原因】uni-h5 的 createSelectorQuery 只在 uni 组件节点树内选取，
  // 而 root-portal 会把弹层 teleport 到 body，脱离组件树后 .in(scope) 与全局查询
  // 一律返回 null（实测：trigger 能量到、popper 量不到），导致 useLhPopper 定位失败、
  // 弹层永久停留在 visibility:hidden。H5 有同步 getBoundingClientRect，无需异步回调。
  // #ifdef H5
  {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector))
    const empty = all ? nodes.length === 0 : nodes.length === 0
    if (empty) {
      return Promise.reject(new Error(`getLhRect: 未找到节点 "${selector}"`))
    }
    const rects = nodes.map((node) => normalizeRect(node.getBoundingClientRect()))
    return Promise.resolve(all ? rects : rects[0])
  }
  // #endif

  // #ifndef H5
  return new Promise((resolve, reject) => {
    const query = uni.createSelectorQuery()
    if (scope) query.in(scope)

    const step = all ? query.selectAll(selector) : query.select(selector)

    step.boundingClientRect((rect) => {
      // 空结果判定（照 wot：all 时需数组非空，非 all 时需有值）
      const empty = all ? !(Array.isArray(rect) && rect.length > 0) : !rect
      if (empty) {
        reject(new Error(`getLhRect: 未找到节点 "${selector}"`))
        return
      }

      if (all) {
        resolve(
          (rect as Array<Record<string, number>>).map((item) => normalizeRect(item)),
        )
        return
      }

      resolve(normalizeRect(rect as Record<string, number>))
    }).exec()
  })
  // #endif
}

/**
 * 入参同时收 H5 的 DOMRect（getBoundingClientRect 直接产物）与 MP 的
 * SelectorQuery 回调 rect（可能缺 right/bottom，补齐为 LhDOMRectLike）
 */
function normalizeRect(rect: DOMRect | Record<string, number> | null): LhDOMRectLike {
  if (!rect) {
    return { top: 0, left: 0, width: 0, height: 0, right: 0, bottom: 0 }
  }
  const { top = 0, left = 0, width = 0, height = 0 } = rect
  return {
    top,
    left,
    width,
    height,
    right: rect.right ?? left + width,
    bottom: rect.bottom ?? top + height,
  }
}

/**
 * 度量单个节点（getLhRect 的便捷封装，非 all 模式）。
 * 类型上明确返回单个 LhDOMRectLike，调用方无需再断言。
 */
export async function getSingleLhRect(
  selector: string,
  scope?: ComponentPublicInstance | null,
): Promise<LhDOMRectLike> {
  const rect = await getLhRect(selector, { scope })
  return Array.isArray(rect) ? rect[0] : rect
}
