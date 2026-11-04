---
'@lh-ui/uniapp': minor
---

# 新增 Calendar 日历组件

- 新增 `lh-calendar` 组件：月度网格日历，`selection` 三种选择模式
  （single 单选默认 / range 一段时间起止 / multiple 多选），
  `range` 可选日期范围约束（区间外日期禁用，反序区间自动归一）、
  `mode` 展示形态（panel 常驻面板默认 / input 点击触发框展开的折叠面板）、
  `panels` 多面板、`placeholder` / `closeOnSelect`，事件 update:modelValue / change / select，
  header / cell 具名插槽（分别接收 { year, month } 与 { date }）。
- 日期网格算法完全消费 `@lh-ui/share` core 纯函数
  （generateCalendarDays / normalizeCalendarSpan / toggleCalendarDate /
  isCalendarDateDisabled / clampDateToRange / shiftCalendarMonth 等），零拷贝；
  同日判定直接复用 share 的 isSameDay（plus 的 isSameDate 本地实现不再重写）。
  星期表头 / 月份名 / 面板标题 / 翻月 aria-label 全部走 share locales 的
  `datepicker.*` 键，九语言齐备，无需本仓补键。
- 【uni-app 差异】日历是 `view` 自绘 7 列网格（`grid-template-columns: repeat(7, 1fr)`），
  不使用任何原生日期控件、不依赖 DOM 度量，移动端天然友好、H5 与微信小程序渲染完全一致。
  plus 的 `<div>` / `<button>` / `<input>` 全部换成 `<view>`；input 模式触发框由 `<view>`
  自绘渲染占位与回显（MP 不支持 `::placeholder`）；禁用单元格由 `--disabled` 类名承载外观
  （view 无 `:disabled` 伪类，SFC 内联按同令牌兜底，同 lh-segmented 先例）；
  键盘网格导航（方向键 / Home / End / PageUp / PageDown + roving tabindex）与
  「点击外部收起」（input 模式文档级 mousedown）仅 H5，由条件编译守卫不调用，MP 包无死代码。
- 配套：`src/pages/calendar` demo 页（基础 / 一段时间 / 范围约束 / 多选 /
  input 模式 / 多面板与自定义文案）+ pages.json 路由 + 首页列表（demo-pages 守卫三向对齐）、
  `tests/components/calendar.spec.ts`（17 例：渲染与 grid 语义、三种选择模式、
  范围禁用、翻月、多面板、input 模式开合与回显、插槽、aria 契约、键盘导航）、
  文档 9 语种（zh-CN 真源 + 8 译本）+ `componentItems` 九语言 labels。
