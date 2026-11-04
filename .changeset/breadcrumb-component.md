---
'@lh-ui/uniapp': minor
---

# 新增 Breadcrumb 面包屑（P1 首批扩展）

- 新增 `lh-breadcrumb` + `lh-breadcrumb-item` 父子组件（easycom 自动引入）：separator 分隔符、
  maxItems 折叠（省略号点击展开）、`to` 点击跳转 `uni.navigateTo`。
- 折叠逻辑由 `@lh-ui/share` core 纯函数（`getCollapsedHiddenIndexes` /
  `getEllipsisBeforeIndex` / `getBreadcrumbItemClassNames`）产出，仓内只写响应式胶水；
  文案走 share locales 的 `breadcrumb.label` / `breadcrumb.more`（九语言齐备，仓内不持有文案）。
- 子项样式复用容器 style.css（照 lh-skeleton-item 先例，无独立样式产物）。
- 配套：`src/pages/breadcrumb` demo 页 + pages.json 路由 + 首页列表（demo-pages 守卫三向对齐）、
  `tests/components/breadcrumb.spec.ts` 6 用例、registry 有序数组登记、
  文档 9 语种（zh-CN 真源 + 8 译本）+ `componentItems` 九语言 labels。
