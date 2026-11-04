---
'@lh-ui/uniapp': minor
---

# 新增 Tabs 标签页（父子组件）

- 新增 `lh-tabs` + `lh-tab-pane` 父子组件（easycom 自动引入）：`v-model` 受控激活、
  `type`（line 线条 / card 卡片）、`tabPosition`（top / bottom）、`closable` 可关闭、
  `addable` 新增按钮、页签 `disabled` 禁用（modelValue 指向禁用项时回退首个可用页签）。
- 选中态、禁用态、移除后联动激活等纯逻辑全部由 `@lh-ui/share` core 纯函数
  （`getTabsClassNames` / `resolveActiveName` / `getNextActiveName` / `getNameAfterRemove`）产出，
  仓内只写响应式胶水；页签记录沿用 plus 的「插槽 vnode 同步收集」方案（下钻 v-for / template）。
- 【平台差异】页签头由 `scroll-view` 承载（MP 端 `enable-flex` 保证不收缩不换行的横向滚动）；
  roving tabindex 键盘导航（方向键 / Home / End / Delete）仅 H5，由 `LH_IS_H5` 编译期守卫；
  选中下划线为纯 CSS 过渡、不依赖 `transitionend`；`tab-remove` / `tab-add` 只抛事件，
  页签节点增删由业务层维护（与 plus 一致）。
- 【移植决策】plus 真源与 share core 尚未提供 `lazy`、`before-leave`、`editable`、
  `border-card`，本次严格对齐真源、未引入未定义 API，差异已登记在文档「平台差异」。
- 子面板样式复用容器 style.css（照 lh-breadcrumb-item 先例，无独立样式产物）。
- 配套：`src/pages/tabs` demo 页 + pages.json 路由 + 首页列表、
  `tests/components/tabs.spec.ts` 11 用例、registry 有序数组登记、
  文档 9 语种（zh-CN 真源 + 8 译本）+ `componentItems` 九语言 labels。
- **待手动验证**：`pnpm build:styles` 生成 `src/components/lh-tabs/style.css`
  （构建产物，未手写）后，跑 `pnpm vitest run tests/components/tabs.spec.ts`、
  `pnpm verify:wxss`、`pnpm typecheck`。
