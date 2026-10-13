/**
 * 平台适配 —— 编译期条件编译（组件层只调本模块，不直接调 uni API）
 *
 * uni 的条件编译在构建期做代码裁剪：H5 段只在 H5 产物里保留，
 * 微信小程序段只在微信小程序产物里保留。用编译期常量而非运行时判断，
 * 是因为小程序包体积敏感，且部分 API 只在对应端存在（运行时判断会引入死代码 + 类型缺失）。
 *
 * 注意：本文件里的条件编译指令必须独占一行；注释正文中不要出现指令字面量，
 * 否则 uni 预处理器会把它当成指令，报「缺少配对的 endif」。
 *
 * 各端的 `isXxx` 都是编译期常量，可直接用于组件层的守卫（如 Dialog 的焦点圈只在 H5 启用） */

// 各端值由条件编译裁剪决定；包成 IIFE 是为了让 vue-tsc（不认条件编译注释）看到的是
// 单一声明，否则 if/else 两个分支的 const 会报「重复声明」
export const LH_IS_H5: boolean = (() => {
  // #ifdef H5
  return true
  // #endif
  // #ifndef H5
  return false
  // #endif
})()

export const LH_IS_MP_WEIXIN: boolean = (() => {
  // #ifdef MP-WEIXIN
  return true
  // #endif
  // #ifndef MP-WEIXIN
  return false
  // #endif
})()

/** 视口信息（与 LhDOMRectLike 的 viewport 入参同构，喂 computePosition 用） */
export interface LhViewport {
  top: number
  left: number
  width: number
  height: number
  right: number
  bottom: number
}

/**
 * 取视口尺寸，避开 uni.getSystemInfoSync 弃用链。
 * H5 直接读 window；小程序用 getWindowInfo（返回的 windowWidth/Height 单位是 px）。
 */
export function getLhWindowInfo(): LhViewport {
  // #ifdef H5
  {
    const width = window.innerWidth
    const height = window.innerHeight
    return { top: 0, left: 0, width, height, right: width, bottom: height }
  }
  // #endif

  // #ifndef H5
  {
    const info = uni.getWindowInfo()
    const width = info.windowWidth
    const height = info.windowHeight
    return { top: 0, left: 0, width, height, right: width, bottom: height }
  }
  // #endif
}

/**
 * 微信基础库版本号（root-portal 降级判断用）。
 * 微信 root-portal 需基础库 >= 2.25.2，低版本降级为页内 fixed。
 * 非微信端返回 null。
 */
export function getLhLibVersion(): string | null {
  // #ifdef MP-WEIXIN
  return uni.getAppBaseInfo().SDKVersion ?? null
  // #endif

  // #ifndef MP-WEIXIN
  return null
  // #endif
}

/** 版本号比较（语义化数字段），供 getLhLibVersion 判断阈值 */
export function compareLhVersion(a: string, b: string): number {
  const pa = a.split('.').map((n) => Number.parseInt(n, 10) || 0)
  const pb = b.split('.').map((n) => Number.parseInt(n, 10) || 0)
  const len = Math.max(pa.length, pb.length)
  for (let i = 0; i < len; i += 1) {
    const va = pa[i] ?? 0
    const vb = pb[i] ?? 0
    if (va > vb) return 1
    if (va < vb) return -1
  }
  return 0
}

/** 微信 root-portal 最低基础库版本 */
export const LH_ROOT_PORTAL_MIN_VERSION = '2.25.2'

/** 当前端是否支持 root-portal（微信基础库达标时才支持） */
export function supportsLhRootPortal(): boolean {
  const version = getLhLibVersion()
  if (!version) return false
  return compareLhVersion(version, LH_ROOT_PORTAL_MIN_VERSION) >= 0
}
