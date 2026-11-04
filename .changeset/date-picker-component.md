---
'@lh-ui/uniapp': minor
---

# 新增 DatePicker 日期选择器

- 新增 `lh-date-picker` 组件：点击触发框弹出日历面板，支持三种选择模式
  （`mode`：date 日期默认 / month 月份 / year 年份）、`format` 自定义显示格式
  （定宽 token yyyy / MM / dd / HH / mm / ss）、`size` 尺寸、`disabled` / `readonly`、
  `clearable`、`placeholder`（未传时按 format 生成）、`rangeSeparator` 区间分隔符、
  `cellClassName` 单元格自定义类、`popperClass` 面板类名、`customClass` / `themeVars` /
  `sx`，事件 update:modelValue / change。
- 日期模式下面板内两步提交（点日期暂存、底部「今天 / 确定」提交），与 plus 同构；
  月份 / 年份模式打开即落在对应网格，点击直接选中并关闭；日期模式点面板标题逐级下钻
  （日期 → 月份 → 年份）。翻月 / 今天 / 确定与网格交互全端可用。
- 日历网格、月份 / 年份网格、日期格式化、同日判定全部消费 `@lh-ui/share` core 纯函数
  （generateCalendarDays / generateMonths / generateYears / formatDate / isDateDisabled /
  isSameDay / getNextGridCell 等），零拷贝；触发器 aria 属性包由 share 的
  `getDatePickerTriggerAria` 产出，本仓逐键摊开绑定。文案全部走 share locales 的
  `datepicker.*` 键（九语言齐备），无需本仓补键。
- 【平台差异 / 移植决策】plus 的日历面板本就是**面板式**（非滚轮式选择器），本仓沿用同一交互，
  仅改造浮层载体：`Teleport to="body"` → `lh-root-portal`（低版本页内 fixed 兜底），
  定位由 getBoundingClientRect 改为 useLhPopper 两帧异步度量（先隐藏渲染量尺寸 →
  computePosition 定位 → 显示，防闪烁），进出过渡未绑定；点击外部关闭由文档级 click 监听
  改为页内透明遮罩（等价语义，遮罩点击只关闭不发 change）；plus 的 `<div>` / `<button>` /
  `<input>` 全部换成 `<view>` / `<text>`，触发器回显与占位由 text 节点自绘
  （MP 不支持 `::placeholder`，占位色由 SFC 内联修饰类按同令牌补色）。
- 【MP 端能力裁剪】键盘导航（触发器 Enter / Space 开合、网格方向键移动含翻月 /
  Home / End / PageUp / PageDown、roving tabindex、Escape 关栈顶）仅 H5：处理函数体由
  条件编译裁剪，函数本身双端存在，MP 包无死代码。
- 【未实现项对齐 plus】`mode="datetime"` / 区间选择与 plus 一致仅类型预留
  （家族台账 P-08）：区间值 `[Date, Date]` 触发器正常回显，但面板内确认不会用
  单个 Date 覆盖区间值；plus 未提供的特性（disabled-date / shortcuts / value-format 等）
  不私自新增。
- 【值类型契约】绑定值始终是 `Date` / `[Date, Date]`，不接受也不产出 ISO 日期字符串；
  `format` 只影响显示层（文档「平台差异」与「值类型契约」小节登记）。
- 配套：`src/pages/date-picker` demo 页（基础 / 月份年份模式 / 格式化 / 尺寸 /
  禁用只读 / 占位清除 / 区间值回显 / 单元格自定义类 / sx 与 popperClass）+
  pages.json 路由 + 首页列表、`tests/components/date-picker.spec.ts`（19 例：渲染与
  grid 语义、占位与回显、两步提交、今天按钮、翻月、视图下钻、月年模式直选、
  禁用 / 只读、清除、遮罩关闭、Escape、键盘导航、roving tabindex、cellClassName、
  区间值保护）、文档 9 语种（zh-CN 真源 + 8 译本）+ `componentItems` 九语言 labels、
  ConfigProvider 可主题组件名单登记 `date-picker`。
- `src/components/lh-date-picker/style.css` 为构建产物（share `styles/date-picker/`
  净化而来），需跑 `pnpm build:assets`（iconfont + styles）生成，禁止手改。
