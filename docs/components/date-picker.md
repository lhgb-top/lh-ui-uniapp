# DatePicker 日期选择器

日期选择器：点击触发框弹出日历面板，支持日期 / 月份 / 年份三种选择模式、自定义显示格式与区间值回显。日历网格算法、日期格式化与禁用判定全部消费 `@lh-ui/share` core 纯函数，面板为 `view` 自绘网格，H5 与微信小程序渲染一致。

## 值类型契约

组件的绑定值**始终是 `Date` 对象**（区间为 `[Date, Date]` 二元组），不接受也不产出 ISO 日期字符串：

```vue
<template>
  <lh-date-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
// ✅ 正确：Date 对象
const value = ref<Date | null>(new Date(2026, 10, 3))
// ❌ 错误：'2026-11-03' 字符串不会回显，也不会被解析
</script>
```

`format` prop 只影响**触发器与面板的显示**（定宽 token `yyyy` / `MM` / `dd` / `HH` / `mm` / `ss`），不改变绑定值形态。拿到的是 `Date`，要落库 ISO 字串请自行 `formatDate` 或 `toISOString()`。

## 基础用法

```vue
<template>
  <lh-date-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3))
</script>
```

日期模式下面板内点击日期为**暂存**，点底部「确定」才提交（两步提交，与 Vue3 版一致）；「今天」按钮把面板跳回本月并暂存当天。

## 月份与年份模式

`mode="month"` / `mode="year"` 时打开面板即落在对应网格，点击直接选中并关闭（无底部按钮）。日期模式下点击面板标题可逐级下钻：日期 → 月份 → 年份，年份视图点标题回到月份。

```vue
<template>
  <lh-date-picker v-model="month" mode="month" />
  <lh-date-picker v-model="year" mode="year" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const month = ref<Date | null>(new Date(2026, 5, 1))
const year = ref<Date | null>(new Date(2024, 0, 1))
</script>
```

## 日期格式化

```vue
<template>
  <lh-date-picker v-model="value" format="MM/dd/yyyy" />
  <lh-date-picker v-model="value" format="yyyy年MM月dd日" />
</template>
```

未传 `placeholder` 时占位文本由 `format` 生成（`yyyy` → 语言包「年」、`MM` → 「月」、`dd` → 「日」）。

## 禁用与只读

```vue
<template>
  <lh-date-picker v-model="value" disabled />
  <lh-date-picker :model-value="value" readonly />
</template>
```

`disabled` 禁用整个选择器（点击不弹层）；`readonly` 只读（可程序化赋值，点击不弹层）。

## 尺寸与清除

```vue
<template>
  <lh-date-picker v-model="value" size="small" />
  <lh-date-picker v-model="value" size="medium" />
  <lh-date-picker v-model="value" size="large" />
  <lh-date-picker v-model="value" :clearable="false" />
</template>
```

`size` 未传时取 ConfigProvider 全局尺寸，最终回退 `medium`；`clearable` 默认开，触发器右侧显示清除图标。

## 区间值回显

绑定值为 `[Date, Date]` 时触发器正常回显两端，分隔符由 `range-separator` 控制（默认 `~`）：

```vue
<template>
  <lh-date-picker v-model="span" range-separator=" 至 " />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const span = ref<[Date, Date]>([new Date(2026, 10, 1), new Date(2026, 10, 7)])
</script>
```

::: warning 区间 / 日期时间选择 UI 尚未实现
与 Vue3 版一致，`mode="datetime"` 与区间选择**只有类型预留，没有对应的选择 UI**（时间列与区间面板未实现，见家族台账 P-08）。区间值可以回显，但面板内点「确定」不会用单个 `Date` 覆盖已传入的区间值。
:::

## 单元格与面板定制

```vue
<template>
  <lh-date-picker v-model="value" :cell-class-name="cellClassName" popper-class="my-popper" />
</template>

<script setup lang="ts">
const cellClassName = (date: Date) => (date.getDay() === 0 || date.getDay() === 6 ? 'my-weekend' : '')
</script>
```

`cell-class-name` 按日期给单元格追加自定义类（回调返回空值时跳过）；`popper-class` 透传到弹层根节点，供写面板级定制样式。

## DatePicker API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 绑定值（Date / 区间二元组 / null，**不接受 ISO 字符串**） | `Date \| [Date, Date] \| null` | `null` |
| mode | 选择模式 | `'date' \| 'month' \| 'year' \| 'datetime' \| 'range'` | `'date'` |
| size | 尺寸（未传取 ConfigProvider 全局尺寸，回退 medium） | `'small' \| 'medium' \| 'large' \| 'mini' \| 'x-large'` | `'medium'` |
| disabled | 是否禁用整个选择器 | `boolean` | `false` |
| clearable | 是否显示清除按钮 | `boolean` | `true` |
| placeholder | 占位文本（未传时按 format 生成） | `string` | `''` |
| format | 显示格式（定宽 token，只影响显示） | `string` | `'yyyy-MM-dd'` |
| readonly | 只读（不弹层） | `boolean` | `true` |
| rangeSeparator | 区间分隔符（区间值回显拼接） | `string` | `'~'` |
| cellClassName | 日期单元格自定义类回调 | `(date: Date) => string` | — |
| popperClass | 面板自定义类名 | `string` | — |
| customClass | 根节点自定义类名 | `string` | — |
| themeVars | 组件级主题变量，覆盖 ConfigProvider 配置 | `Record<string, string>` | — |
| sx | sx 快速布局属性（作用于根元素，浮层面板不受影响） | `LhSxProps` | — |

::: tip mode 取值
`'datetime'` 与 `'range'` 为**类型预留**：`LhDatePickerMode`（share core）包含这两个值，但面板内的时间列与区间选择 UI 尚未实现（台账 P-08），暂请只使用 `'date'` / `'month'` / `'year'`。
:::

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 值改变时触发（v-model） | `(value: Date \| [Date, Date] \| null)` |
| change | 值确认改变时触发（与 update:modelValue 同载荷） | `(value: Date \| [Date, Date] \| null)` |

### 无障碍

- 触发器为 `role="combobox"`（`aria-expanded` / `aria-haspopup="dialog"` / `aria-controls` 指向面板），属性包由 share 的 `getDatePickerTriggerAria` 产出
- 面板为 `role="dialog"`；日历为 `role="grid"`，日期格 `role="gridcell"`，带 `aria-selected` / `aria-current="date"`（今天）/ `aria-disabled`（禁用）
- 日期格 `aria-label` 为「YYYY年M月D日 星期X」完整文案，供读屏识别
- 翻月按钮为 `role="button"` + `aria-label`（语言包 `datepicker.prevMonth` / `datepicker.nextMonth`）
- 键盘网格导航与触发器键盘行为仅 H5 生效，见下平台差异

::: tip 平台差异（与 Vue3 版的差异）
- **面板化选择**：plus 的日历面板本就是面板式（非滚轮式选择器），本仓沿用同一交互；浮层载体由 `Teleport to="body"` 改为 `lh-root-portal`（低版本页内 fixed 兜底），定位走两帧异步度量（先隐藏渲染量尺寸 → `computePosition` 定位 → 显示，防闪烁），进出过渡未绑定。
- **DOM 元素映射**：plus 的 `<div>` / `<button>` / `<input>` 全部换成 `<view>`；触发器回显与占位由 `<text>` 自绘（MP 不支持 `::placeholder`，占位色由 SFC 内联修饰类按同令牌补色）；翻月 / 今天 / 确定按钮的禁用态由类名承载（view 无 `:disabled` 伪类）。
- **点击外部关闭**：由 plus 的文档级 click 监听改为页内透明遮罩点击关闭（等价语义，MP 无 document），遮罩点击只关闭不发 change。
- **键盘导航仅 H5**：触发器 Enter / Space 开合、网格方向键移动（含翻月）/ Home / End / PageUp / PageDown、roving tabindex、Escape 关栈顶在 MP 端无键盘事件，由条件编译守卫直接不调用，MP 包内无死代码。
- **aria 属性逐项显式绑定**：plus 模板里 share 的 `LhAriaAttrs` 属性包不能 `v-bind` 落图（MP 模板编译器不支持），改由胶水层把 `aria-*` 键摊成具体值逐项绑定，契约仍由 share 纯函数决定。
- **值类型契约**：与 plus 一律一致——绑定值是 `Date` / `[Date, Date]`，绝不接收或产出 ISO 日期字符串；`format` 只作用于显示层。
:::
