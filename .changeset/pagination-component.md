---
'@lh-ui/uniapp': minor
---

# 新增 Pagination 分页（M4 批次）

- 新增 `lh-pagination` 组件（easycom 自动引入）：`v-model:current` 受控当前页、
  `total` / `page-size` / `page-sizes`、`show-total` / `show-size-changer` / `show-jumper`、
  `simple` 紧凑模式、`disabled` 整体禁用，与 plus 仓 API 完全一致
  （total / pageSize / current / pageSizes / showTotal / showSizeChanger / showJumper /
  simple / disabled / sx）。
- 页码区间（首末页常驻 + 当前页两侧吸附 + 省略号）、页码钳制与总页数全部由
  `@lh-ui/share` core 纯函数（`getPaginationRange` / `clampPage` / `getPageCount` /
  `getPaginationItemAria`）产出；文案走 share locales 的 `pagination.*` 键
  （九语言齐备，仓内不持有文案），仓内只写响应式胶水。
- 平台差异（已登记进组件文档「平台差异」）：标签换 `view` / `<text>`（WXSS 禁标签选择器），
  触摸交互全端可用；条数切换的 `<select>` 换 uni 内置 `<picker mode="selector">` 承载，
  change 取值走 event.detail.value（选项下标）；跳页输入提交统一在 confirm / 失焦
  （uni input 无原生 change，输入事件取值走 event.detail.value，同 lh-input-number 先例），
  原生 min / max 不透传、页码一律由 core 的 clampPage 钳制，空串 / 非法数字不跳页
  （plus 对清空后失焦会钳回第 1 页，此处收紧为不发事件）；share 样式源的禁用样式写在
  `&:disabled` 伪类上（只匹配 button），view 无此伪类，按同一令牌
  （`--lh-disabled-text-color`）在 SFC 内联补 `lh-pagination__btn--disabled` 类规则
  （同 lh-segmented / lh-input-number 内联兜底先例，不进净化产物）。
- 配套：`src/pages/pagination` demo 页（基础 / 总数与条数切换 / 跳页 / 简洁模式 / 受控 /
  条数与禁用）+ pages.json 路由 + 首页列表（demo-pages 守卫三向对齐）、
  `tests/components/pagination.spec.ts`（页码区间与省略号 / v-model / 前后翻页越界禁用 /
  simple / showTotal / 跳页提交与钳制 / picker 条数切换与当前页钳制 / disabled / aria /
  sx 等 15 用例）、registry 有序数组登记、文档 9 语种（zh-CN 真源 + 8 译本，含
  「平台差异」小节）+ `componentItems` 九语言 labels。
- 组件 `style.css` 为构建产物（`pnpm build:styles` 生成，未手写）。
