---
'@lh-ui/uniapp': minor
---

# 新增 TimePicker 时间选择器组件

- 新增 `lh-time-picker` 组件：时/分/秒三列面板式选择，`modelValue` 绑定 `Date`，
  点击列项即时落位（面板不关），底部「此刻 / 确定」提交；
  `format`（含 `ss` 才显示秒列，占位符也按 format 生成）、`disabled`、`clearable`、
  `placeholder`、`start` / `end`（小时列范围约束，超范围的已有选中值与「此刻」
  均收敛回区间）、`step-hour` / `step-minute` / `step-second`、`readonly`、
  `arrowControl`、`size`、`customClass` / `themeVars` / `sx`；
  事件 update:modelValue / change。
- 【uni-app 差异】MP 端滚轮改为 scroll-view 列面板：每列（时/分/秒）是一个独立的
  `scroll-view`（`scroll-y`）纵向滚动（MP 的 view 无可靠溢出滚动），选中项由
  `scroll-into-view` 自动滚入视口（MP 无 scrollIntoView API）；未使用任何原生
  `<picker mode="time">`——原生控件无法做范围约束 / 步进 / 自定义列与底部操作条，
  与 share core 的列生成（generateTimeColumn / filterTimeColumnByRange 等）
  也无法对齐。plus 的滚轮步进（`@wheel.prevent` 拦截）未移植，列内滚动交给
  scroll-view 原生滚动；键盘导航（触发器 Enter/Space/方向键开面板、面板内
  ↑↓ 按 step 步进 / ←→ 跨列 / Enter 确认 / Escape 关闭）仅 H5，函数体由条件编译
  裁剪、函数本身双端存在（与 popover / dropdown / cascader 同款）；arrowControl
  箭头按钮仅 H5 渲染（编译期 `LH_IS_H5` 守卫）；点击外部关闭由页内透明遮罩承载。
  触发器图标改用语义更贴切的 `clock`（plus 用 `date`）。
- 纯逻辑完全消费 `@lh-ui/share` core time-picker 纯函数
  （generateTimeColumn / formatTime / extractTime / createDateTime / isValidTime /
  getHourRange / filterTimeColumnByRange / wrapTimeValueInRange / clampTimeValue /
  getTimePickerTriggerAria），零拷贝；文案全部走 share locales 的 `timepicker.*`
  键（九语言齐备，本仓无需补键）。
- 配套：`src/pages/time-picker` demo 页（基础含秒 / 时分格式 / 时间范围 /
  禁用 / 步进 / 占位与清除）+ pages.json 路由 + 首页列表（三处对齐）、
  `tests/components/time-picker.spec.ts`（15 例：占位符生成与回显、面板开合与
  aria 契约、format 控制列数、范围与步进过滤、选中激活态与确定事件、此刻与
  范围收敛、清除、禁用、遮罩关闭、Escape 关闭、重复点击开合）、
  文档 9 语种（zh-CN 真源 + 8 译本）+ `componentItems` 九语言 labels。
