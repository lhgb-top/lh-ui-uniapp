---
'@lh-ui/uniapp': minor
---

# 新增 Image 图片

- 新增 `lh-image` 组件：`src` / `alt`（TS 层必填）/ `fit` 裁切模式 / `lazy` 懒加载 /
  `preview` 点击预览 / `preview-src-list` 多图预览列表 / `sx` 快速布局，`load` / `error`
  事件与 `error` 插槽（失败占位自定义）。
- 预览列表归一化（未传 `preview-src-list` 退化为 `[src]`）与状态类名由 `@lh-ui/share`
  core 纯函数（`normalizePreviewList` / `getImageClassNames`）产出，仓内只写 computed 胶水；
  失败占位文案走 share locales 的 `image.error`（九语言齐备）。
- 【uni-app 差异】预览改走 `uni.previewImage` 原生 API（全端可用，经
  `src/adapter/preview-image` 适配层封装，空列表守卫静默跳过），替代 plus 的自绘
  Viewer 弹层（依赖 teleport + document，小程序不可用，无遮罩 / 关闭按钮自定义能力）；
  `fit` 映射 uni `<image>` 的 `mode`（contain/cover/fill → aspectFit/aspectFill/scaleToFill，
  none → center，scale-down 无等价取 aspectFit）；懒加载用 `<image>` 自带 `lazy-load`
  （替代 plus 的 `loading="lazy"`）；增加 `customClass` prop（自定义类名无法穿透
  styleIsolation）。
- 配套：`src/adapter/preview-image.ts` 适配层、`src/pages/image` demo 页（基础 / 填充模式 /
  圆角 / 懒加载 / 加载失败 / 点击预览）+ pages.json 路由 + 首页列表（demo-pages 守卫三向
  对齐）、`tests/components/image.spec.ts` 10 用例（uni.previewImage 空桩 mock）、registry
  有序数组登记、文档 9 语种（zh-CN 真源 + 8 译本）+ `componentItems` 九语言 labels。
