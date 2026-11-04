---
'@lh-ui/uniapp': minor
---

# 新增 Segmented 分段器（M4.6 高可行批次）

- 新增 `lh-segmented` 组件（easycom 自动引入）：`v-model` 受控选中值、`options`
  数据驱动（字符串快捷写法或 `{ label, value, disabled }` 对象）、单项 / 整组禁用、
  `block` 撑满容器平分宽度，与 plus 仓 API 完全一致（modelValue / options /
  disabled / block / sx）。
- 选项规范化、类名与无障碍属性全部由 `@lh-ui/share` core 纯函数
  （`normalizeSegmentedOptions` / `getSegmentedClassNames` / `getSegmentedAria` /
  `getSegmentedItemAria`）产出；方向键导航复用 core/shared 的
  `getNextListIndex` / `getRovingTabIndex`（首尾循环 + 跳过禁用项），仓内只写响应式胶水。
- 平台差异（已登记进组件文档「平台差异」）：标签换 `view`（WXSS 禁标签选择器），
  触摸交互全端可用；选中滑块为纯 CSS 过渡、不依赖 transitionend（MP 端该事件不可靠，
  本仓动效组件一律用 setTimeout 对齐，分段器则无需任何 JS 编排）；方向键导航仅 H5
  （SFC 的 @keydown 由条件编译守卫，MP 包内不调用）；share 样式源的禁用样式写在
  `&:disabled` 伪类上（只匹配 button），view 无此伪类，按同一令牌
  （`--lh-disabled-text-color`）在 SFC 内联补 `lh-segmented__option--disabled`
  类规则（同 lh-spinner / lh-empty 内联兜底先例，不进净化产物）。
- 配套：`src/pages/segmented` demo 页（基础 / 对象选项 / 禁用项 / 整组禁用 / 块级宽度）
  + pages.json 路由 + 首页列表（demo-pages 守卫三向对齐）、
  `tests/components/segmented.spec.ts`（选中切换 / v-model / disabled 项 / roving
  tabindex / 方向键 / block / 空组等 12 用例）、registry 有序数组登记、
  文档 9 语种（zh-CN 真源 + 8 译本，含「平台差异」小节）+ `componentItems` 九语言 labels。
- 组件 `style.css` 为构建产物（`pnpm build:styles` 生成，未手写）。
