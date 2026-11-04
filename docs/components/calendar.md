# Calendar 日历

日历组件：以月度网格展示日期，支持单选 / 一段时间（起止）/ 多选三种选择模式，可用 `range` 约束可选范围。网格、星期表头与月份标题的文案全部走语言包（`datepicker.weeks.*` / `datepicker.month1~12` / `datepicker.panelTitle`）。日历是 `view` 自绘网格，不依赖任何原生日期控件，移动端天然友好、全端可用。

## 基础用法

```vue
<template>
  <lh-calendar v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date>()
</script>
```

未传 `modelValue` 时组件内部维护选中态；传入即受控（与全部表单类组件一致）。

## 一段时间选择

`selection="range"` 时，第一次点击确定起点（此时值为 `[起点, 起点]`），第二次点击确定终点并自动归一（反序点击也能得到 `[早, 晚]`）：

```vue
<template>
  <lh-calendar v-model="span" selection="range" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const span = ref<Date[]>([])
</script>
```

起止两端落 `--selected`，中间日期落 `--in-range` 区间底色（不含两端）。

## 可选范围约束

`range` 传入 `[开始, 结束]` 二元组，区间外日期禁用（禁用判定由 share 纯函数负责，反序区间自动归一）：

```vue
<template>
  <lh-calendar v-model="value" :range="[start, end]" />
</template>

<script setup lang="ts">
const start = new Date(2026, 10, 1)
const end = new Date(2026, 10, 30)
</script>
```

## 多选模式

`selection="multiple"` 时再次点击已选日期即取消，结果按时间排序：

```vue
<template>
  <lh-calendar v-model="dates" selection="multiple" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const dates = ref<Date[]>([])
</script>
```

## input 触发模式

`mode="input"` 时只渲染一个触发框，点击展开 / 收起面板，选中后自动收起（`close-on-select` 默认开；一段时间模式需点完两个日期）：

```vue
<template>
  <lh-calendar v-model="value" mode="input" placeholder="请选择日期" />

  <!-- 一段时间 + 不自动收起 -->
  <lh-calendar v-model="span" mode="input" selection="range" :close-on-select="false" />
</template>
```

触发框文案默认为 `YYYY-MM-DD`（一段时间为 `早 ~ 晚`），占位文案取语言包 `select.placeholder`。

## 多面板与自定义文案

`panels` 控制同时展示的月面板数（flex 换行排列）；`header` / `cell` 具名插槽分别自定义面板标题与日期单元格：

```vue
<template>
  <lh-calendar v-model="value" :panels="2">
    <template #header="{ year, month }">
      <view class="my-title">{{ year }} / {{ month + 1 }}</view>
    </template>
    <template #cell="{ date }">
      <view class="my-cell">{{ date.getDate() }}</view>
    </template>
  </lh-calendar>
</template>
```

::: tip 移动端友好
日历面板是纯 `view` 网格（7 列等宽布局），不依赖 picker 原生组件、不依赖 DOM 度量，
H5 与微信小程序渲染完全一致；小屏上面板随容器宽度自适应。
:::

## Calendar API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前选中（受控 v-model；未传时内部维护） | `Date \| Date[]` | — |
| selection | 选择模式：单选 / 一段时间 / 多选 | `'single' \| 'range' \| 'multiple'` | `'single'` |
| range | 可选日期范围约束（区间外禁用，反序自动归一） | `[Date, Date]` | — |
| mode | 展示形态：panel 常驻面板 / input 点击触发框展开 | `'panel' \| 'input'` | `'panel'` |
| panels | 同时展示的月面板数 | `number` | `1` |
| placeholder | input 模式占位文本（默认取语言包 select.placeholder） | `string` | — |
| closeOnSelect | input 模式选中后是否自动收起面板 | `boolean` | `true` |
| customClass | 自定义类名（透传到根节点） | `string` | — |
| sx | sx 快速布局属性（作用于根节点） | `LhSxProps` | — |

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 选中值变化（v-model） | `(value: Date \| Date[])` |
| change | 选中值变化（与 update:modelValue 同载荷） | `(value: Date \| Date[])` |
| select | 点击某个日期时触发（含禁用判定前的原始点击不会触发） | `(date: Date)` |

### Slots

| 插槽 | 说明 | 作用域参数 |
| --- | --- | --- |
| header | 自定义面板标题 | `{ year: number, month: number }`（month 为 0 起） |
| cell | 自定义日期单元格 | `{ date: Date }` |

### 无障碍

- 网格为 `role="grid"`，每行 `role="row"`，日期单元格 `role="gridcell"`，表头 `role="columnheader"`，并带 `aria-selected` / `aria-current="date"`（今天）/ `aria-disabled`（禁用）
- 单元格 `aria-label` 为 `YYYY-MM-DD` 格式，供读屏识别
- 翻月按钮为 `role="button"` + `aria-label`（语言包 `datepicker.prevMonth` / `datepicker.nextMonth`）
- 键盘网格导航（方向键翻日、Home / End 行首行尾、PageUp / PageDown 翻月）仅 H5 生效，见下平台差异

::: tip 平台差异（与 Vue3 版的差异）
- **网格载体**：日历是 `view` 自绘 7 列网格（WXSS `grid-template-columns: repeat(7, 1fr)`），不使用任何原生日期控件，H5 / 微信小程序渲染与交互完全一致，移动端天然友好。
- **DOM 元素映射**：plus 的 `<div>` / `<button>` / `<input>` 全部换成 `<view>`；input 模式的触发框由 `<view>` 自绘渲染占位与回显文案（MP 不支持 `::placeholder`，走原生 `<input>` 还需额外配 `placeholder-style`）。禁用单元格由 `--disabled` 类名承载外观（view 无 `:disabled` 伪类，SFC 内联按同令牌兜底）。
- **键盘网格导航仅 H5**：方向键 / Home / End / PageUp / PageDown 的网格导航与焦点移动（roving tabindex）在 MP 端无键盘事件，由条件编译守卫直接不调用，MP 包内无死代码。
- **点击外部收起仅 H5**：input 模式下 plus 监听文档级 mousedown 收起面板；MP 无 document，面板由触发框点击切换开合。
- **aria 属性逐项显式绑定**：plus 模板里 share 的 `LhAriaAttrs` 属性包不能 `v-bind` 落图（MP 模板编译器不支持），改由胶水层把 `aria-*` 键摊成具体值逐项绑定，契约仍由 share 纯函数决定。
:::
