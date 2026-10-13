---
'@lh-ui/uniapp': patch
---

# 修复 loading 图标旋转动画不生效（并清理图标类名重复）

## 问题

Icon 与 Button 的 loading 图标在 H5 / 小程序端均**不旋转**：`animation` 计算值为 `none`。

根因是 DOM 结构与样式选择器失配：

- share 的样式源是 `.lh-icon svg { display: block }` / `.lh-icon--loading svg { animation: lh-icon-spin … }`（后代选择器，svg 是 `.lh-icon` 的内层节点）；
- 经 `scripts/build-styles.mjs` 净化后变成 `.lh-icon .lh-iconfont` / `.lh-icon--loading .lh-iconfont`（仍然是后代选择器）；
- 但本仓的 lh-icon 渲染成**单元素** `<text class="lh-icon lh-iconfont …">`，所有类名同处一个元素，后代选择器永不匹配，spin 动画也就从未生效过。

Button 无独立 spinner 元素，loading 图标直接复用 lh-icon，所以按钮加载态也跟着不转。

## 修复

lh-icon 改为**双层 `<text>`**，对齐 share 的原始设计契约（plus 仓的 `<span class="lh-icon"><svg>` 同构）：

- 外层 `.lh-icon` + `.lh-icon--<name>` + `customClass` + 组件主题样式（`componentStyle`）；
- 内层 `.lh-iconfont` + `.lh-iconfont--<name>` + `fontSize` / `color`（`iconStyle`），仅当图标存在时渲染；
- 无图标时插槽兜底渲染在外层内。

这样净化后的后代选择器全部正确匹配，且不产生特异性副作用。顺带清除了根节点类名重复（模板静态类与动态类数组合并导致的 `lh-icon lh-icon` / `lh-iconfont lh-iconfont` / `lh-icon--loading lh-icon--loading`），类名改由 `logic.ts` 单一输出。

## 验证

- `pnpm vitest run`：15 文件 95 用例全过（icon / button 单测同步改为查内层 `.lh-iconfont`）
- `pnpm lint`：无报错
- 浏览器回归（H5 dev）：Icon 页 52 个图标全部双层渲染、零重复类名，3 个 loading 图标 `animation: lh-icon-spin 1s infinite`；Button 页「加载中」按钮图标同样转起，图标 16×16、与文字间距 4px 不变
- `pnpm build:mp-weixin`：构建通过（双层 `<text>` 在小程序端可编译）
