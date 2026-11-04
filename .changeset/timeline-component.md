---
'@lh-ui/uniapp': minor
---

# 新增 Timeline 时间线（父子组件）

- 新增 `lh-timeline` + `lh-timeline-item` 父子组件（easycom 自动引入）：
  `mode`（left 左侧时间线 / alternate 左右交替，序号奇偶决定侧别）、
  条目 `timestamp`（文本或 `#timestamp` 插槽）、`type`（primary / success / warning / danger
  语义着色圆点边框）、`hollow` 空心节点、`#dot` 自定义圆点插槽。
- 容器与条目类名、侧别、末项判定全部由 `@lh-ui/share` core 纯函数
  （`getTimelineClassNames` / `getTimelineItemClassNames` / `getTimelineSide`）产出，
  仓内只写 provide/inject 响应式胶水；条目脱离容器单用时按 left 模式、视为唯一节点渲染。
- 【平台差异】纯展示组件：无事件、无受控状态、无度量与平台 API 调用，H5 / 微信小程序
  两端完全可用且表现一致；`<ol>/<li>` 语义列表改由 `<view>` 承载（WXSS 标签选择器禁用），
  以 `role="list"` / `role="listitem"` 保留列表语义；连接线与中央轴线均为 CSS 伪元素，
  不依赖 JS 度量，`alternate` 交替由序号奇偶 + flex 方向实现。
- 【WXSS 净化】share 样式源的 `.lh-timeline__item:not(.lh-timeline__item--last)` 在
  `build-styles.mjs` 新增「`:not()` 同族修饰类剥离」规则（WXSS 不支持 `:not()`，
  verify-wxss 硬卡）：剥离后遮蔽语义由同块内特异度不低于它的
  `.lh-timeline__item--last::before` 规则接管，两端渲染结果不变；含 `:hover` 的
  `:not()` 规则不受影响（本就整块进 H5），其余 `:not()` 形态（如结构性伪类）不处理、不静默吞掉。
- 【移植决策】plus 真源与 share core 目前尚未提供 `placement`（时间戳位置）、
  `center`（居中布局）等 API，本次严格对齐真源、未引入未定义 API，
  `mode` 仅 `'left'` / `'alternate'` 两种，差异已登记在文档「平台差异」。
- 子项样式复用容器 style.css（照 lh-breadcrumb-item 先例，无独立样式产物）。
- 配套：`src/pages/timeline` demo 页 + pages.json 路由 + 首页列表、
  `tests/components/timeline.spec.ts` 12 用例、registry 有序数组登记、
  文档 9 语种（zh-CN 真源 + 8 译本）+ `componentItems` 九语言 labels。
- **待手动验证**：`pnpm build:styles` 生成 `src/components/lh-timeline/style.css`
  （构建产物，未手写）后，跑 `pnpm vitest run tests/components/timeline.spec.ts`、
  `pnpm verify:wxss`、`pnpm typecheck`。
