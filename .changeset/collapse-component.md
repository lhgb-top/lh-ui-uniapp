'@lh-ui/uniapp': minor
---

# 新增 Collapse 折叠面板（父子组件）

- 新增 `lh-collapse` + `lh-collapse-item` 父子组件（easycom 自动引入）：
  `v-model` 受控展开面板（单值或数组）、`accordion` 手风琴模式（同时只展开一项、
  允许全收起）、面板 `disabled` 禁用、`title` prop 与 `title` 插槽。
- 展开 / 收起的纯逻辑（`normalizeActiveKeys` / `toggleCollapseKey` /
  `getCollapseItemClassNames`）全部消费 `@lh-ui/share` core 纯函数，
  仓内只写响应式胶水；样式复用 share 的 collapse scss 净化产物，无手写样式副本。
- 【平台差异】展开动画为纯 CSS（`grid-template-rows` 0fr/1fr 过渡 + 箭头旋转），
  **不依赖 `transitionend`**（MP 不可靠，本仓统一不用）：类名切换即落位，
  MP 渲染内核即使不支持 grid 过渡，最终展开态也正确，仅缺过渡过程；
  内容区始终渲染（不做 v-if 直切）；`<h3>/<button>` 换成 `<view>/<text>`
  （WXSS 禁标签选择器）；禁用由点击守卫 + `--disabled` 类名 + `aria-disabled`
  表达（MP 无原生 button disabled 语义可用）；头/内容关联 id 用 `generateId`
  （不用 Vue 3.5 的 `useId`，兼容 uni-app 各端内核）；无障碍语义
  （`role="button"` / `aria-expanded` / `aria-controls` / `role="region"` /
  `aria-labelledby`）两端均输出。差异与移植决策已登记在文档「平台差异」。
- 【移植决策】严格对齐 plus 真源，plus 未提供的嵌套折叠、图标插槽、懒渲染等
  一律不私自新增；本仓胶水仅有一处受控取值修正（登记在文档）：受控时展开态
  改为 computed 订阅 `props.modelValue`，父组件异步更新 v-model 时面板能立即
  跟随（plus 用 setup 期快照的内部 ref，异步回写时面板追不上），
  core 纯函数与 props 契约不变。
- 子项样式复用父容器 style.css（照 lh-breadcrumb-item 先例，无独立样式产物）。
- 配套：`src/pages/collapse` demo 页 + pages.json 路由 + 首页列表、
  `tests/components/collapse.spec.ts` 10 用例（直接挂载 LhCollapse，
  emitted 断言落在被测组件本身）、registry 有序数组登记、
  文档 9 语种（zh-CN 真源 + 8 译本）+ `componentItems` 九语言 labels。
- **待手动验证**：`pnpm build:styles` 生成 `src/components/lh-collapse/style.css`
  （构建产物，未手写，子项复用同款产物）后，跑
  `pnpm vitest run tests/components/collapse.spec.ts`、`pnpm verify:wxss`、
  `pnpm typecheck`。
