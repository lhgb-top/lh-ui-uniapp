---
'@lh-ui/uniapp': minor
---

# 新增 Layout 布局容器（5 件套）

- 新增 `lh-layout` + `lh-header` / `lh-aside` / `lh-main` / `lh-footer` 五件套
  （easycom 自动引入；按需引入组件名 `LhLayout` / `LhHeader` / `LhAside` / `LhMain` / `LhFooter`）：
  `direction` 排列方向、含 `lh-aside` 时自动切换垂直布局、Aside `width`（number 按 px / string 带单位）。
- 逻辑对齐 plus 真源：share core 无 layout 模块（纯 CSS 布局组件），仓内只写
  provide/inject 上下文胶水（Aside 挂载登记 / 卸载注销）+ sx 求值，不持有 core / 样式 / 文案副本。
- 语义标签统一换成 `view`（WXSS 禁标签选择器），landmark 语义由 `role` 属性补回
  （header `banner`、aside `complementary`、main `main`、footer `contentinfo`），
  多个 aside 可用 `ariaLabel` 区分；子组件无独立 logic，样式复用 `lh-layout/style.css` 净化产物。
- `scripts/build-styles.mjs` 新增 block 轴逻辑属性降级映射（`border-block-start/end` →
  `border-top/bottom`，与 inline 轴同款物理兜底 + 条件编译逻辑覆盖双发）：
  share 的 layout scss 用到 `border-block-*`，此前未登记会在 `pnpm build:styles` 抛错。
- 配套：`src/pages/layout` demo 页 + pages.json 路由 + 首页列表、
  `tests/components/layout.spec.ts` 8 用例、registry 有序数组登记、
  文档 9 语种（zh-CN 真源 + 8 译本，含「平台差异」：小程序页面级 vs 元素级滚动容器语义）+
  `componentItems` 九语言 labels。
