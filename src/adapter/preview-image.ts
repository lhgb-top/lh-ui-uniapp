/**
 * 图片预览适配 —— 封装 uni.previewImage（组件层不直接调 uni API，红线 4）
 *
 * plus 的 LhImage 预览是自绘 Viewer 弹层（teleport 到 body + 缩放 / 旋转 / 多图切换 /
 * 焦点圈），小程序没有 document 与 teleport 的等价物，自绘全屏弹层要自己解决层级、
 * 锁滚动与手势。uni 的 previewImage 全端可用：H5 由 uni 运行时实现浮层，
 * 微信端走原生预览页面，交互能力由平台提供，本仓不再自绘弹层（偏离登记见
 * docs/components/image.md 的「平台差异」）。
 */

export interface LhPreviewImageOptions {
  /** 预览图地址列表 */
  urls: string[]
  /** 初始预览的图片下标（uni 端默认 0） */
  current?: number
}

/**
 * 拉起原生图片预览。
 *
 * 【空列表守卫】urls 为空时直接跳过（不调 API、不报错）：preview 开启但
 * previewSrcList 与 src 均为空属于使用方数据问题，静默跳过比抛错更适合 UI 层。
 */
export function previewLhImages(options: LhPreviewImageOptions): void {
  const { urls, current = 0 } = options
  if (urls.length === 0) return
  uni.previewImage({ urls, current })
}
