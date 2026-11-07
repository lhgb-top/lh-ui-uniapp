/**
 * 剪贴板适配 —— text 组件的复制能力收口
 *
 * H5 走 navigator.clipboard（https / localhost 才可用，不可用时静默降级）；
 * 小程序端没有 navigator，走 uni.setClipboardData（微信 / 支付宝 / 抖音均支持，
 * 各端都会弹系统级「已复制」提示）。
 *
 * 【为什么收在 adapter】组件层不直接调 uni API（红线 4）；且 navigator.clipboard
 * 在 vitest 的 jsdom 环境不存在，直接调会挂测试（与 getRect 同款理由）。
 */

/**
 * 写入剪贴板。始终 resolve（失败不抛），调用方按 copy 事件自行兜底——
 * 与 plus 的静默降级口径一致：剪贴板不可用时仍切「已复制」并抛事件。
 */
export function copyLhText(text: string): Promise<void> {
  // #ifdef H5
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    return Promise.resolve(navigator.clipboard.writeText(text))
  }
  return Promise.resolve()
  // #endif

  // #ifndef H5
  return new Promise((resolve) => {
    uni.setClipboardData({
      data: text,
      success: () => resolve(),
      fail: () => resolve(),
    })
  })
  // #endif
}
