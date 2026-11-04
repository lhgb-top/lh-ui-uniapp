# TimePicker 时间选择器

时间选择器用于选择时、分、秒。触发器点击后弹出面板：每列（时/分/秒）是一个独立纵向滚动的列，点击列项落位，底部「此刻 / 确定」提交选择。

## 基础用法

```vue
<template>
  <lh-time-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

默认 `format` 为 `HH:mm:ss`，面板渲染时/分/秒三列；点击列项即时落位（面板不关），点击「确定」提交 `Date` 并关闭面板，点击「此刻」把当前时刻填入列中。

## 时分格式

`format` 不含 `ss` 时面板只渲染时/分两列，占位符也按 `format` 生成：

```vue
<template>
  <lh-time-picker v-model="value" format="HH:mm" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## 时间范围

`start` / `end` 限定小时列的可选范围（与 0~23 求交集），范围外的已有选中小时会收敛回可选区间，「此刻」同样收敛：

```vue
<template>
  <lh-time-picker v-model="value" :start="8" :end="20" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## 步进

`step-hour` / `step-minute` / `step-second` 自定义各列的选项步进：

```vue
<template>
  <lh-time-picker v-model="value" :step-hour="2" :step-minute="5" :step-second="10" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## 禁用

`disabled` 禁用整个选择器（不弹层，清除按钮也不显示）：

```vue
<template>
  <lh-time-picker v-model="value" disabled />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## 占位与清除

`placeholder` 自定义占位文本（未传时按 `format` 生成，取语言包 `timepicker.hour/minute/second`）；有值后触发器右侧显示清除图标，点击置空（`clearable` 默认 `true`）：

```vue
<template>
  <lh-time-picker v-model="value" placeholder="选择提醒时间" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(null)
</script>
```

## TimePicker API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 绑定的时间 | `Date \| null` | `null` |
| size | 尺寸 | `LhTimePickerSize` | `'medium'` |
| disabled | 是否禁用整个选择器 | `boolean` | `false` |
| clearable | 是否显示清除按钮 | `boolean` | `true` |
| placeholder | 占位文本（未传时按 format 生成，取语言包 `timepicker.hour/minute/second`） | `string` | — |
| format | 时间格式（含 `ss` 才显示秒列） | `string` | `'HH:mm:ss'` |
| readonly | 只读标记（触发器为 view 自绘，无输入态，等价恒只读） | `boolean` | `false` |
| arrowControl | 是否显示箭头按钮（仅 H5 渲染，配合键盘步进） | `boolean` | `false` |
| start | 开始小时（与 0~23 求交集） | `number` | `0` |
| end | 结束小时（与 0~23 求交集） | `number` | `24` |
| stepHour | 小时列步进 | `number` | `1` |
| stepMinute | 分钟列步进 | `number` | `1` |
| stepSecond | 秒列步进 | `number` | `1` |
| customClass | 自定义类名（透传到根节点） | `string` | — |
| themeVars | 组件级主题变量 | `Record<string, string>` | — |
| sx | sx 快速布局属性（作用于触发器根元素，浮层面板不受影响） | `LhSxProps` | — |

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 绑定值变化时触发 | `(value: Date \| null)` |
| change | 点击「确定」或「清除」时触发 | `(value: Date \| null)` |

### 无障碍

- 触发器带 `aria-haspopup="dialog"` / `aria-expanded` / `aria-controls`（属性包由 share 的 `getTimePickerTriggerAria` 产出，逐键摊开绑定）
- 面板为 `role="dialog"`，每列为 `role="listbox"`（`aria-label` 走语言包 `timepicker.hourLabel/minuteLabel/secondLabel`），列项为 `role="option"` 并带 `aria-selected` / `aria-disabled`
- 定位引擎为自研纯函数（flip / shift 防溢出），零第三方运行时依赖

::: tip 平台差异（与 Vue3 版的差异）
- **滚轮改为 scroll-view 列面板**：plus 的列容器是 `overflow-y: auto` 的 `div`、靠 `@wheel.prevent` 拦截滚轮做步进、选中项走 `scrollIntoView`；uni-app 端每列改为独立的 `scroll-view`（`scroll-y`）纵向滚动（MP 的 `view` 没有可靠的溢出滚动），选中项由 `scroll-into-view` 自动滚入视口（MP 无 `scrollIntoView` API）。选择交互保持一致：点击列项落位、底部「此刻 / 确定」提交。
- **滚轮步进未移植**：列内滚动交给 `scroll-view` 原生滚动（H5 端滚轮自然滚动长列表），不再拦截 wheel 事件按 step 跳值；步进选项的生成（`step-hour` 等）与 plus 一致。
- **键盘导航仅 H5**：触发器 Enter/Space/方向键下开面板并把焦点放进第一列；面板内 ↑↓ 按 step 步进（小时回绕后再收拢回 start/end 范围）、←→ 在时分秒列之间跳焦、Enter/Space 确认并关闭、Escape 经文档级监听关闭（多弹层叠加时只关栈顶）。整段处理函数体由条件编译裁剪，MP 包内无死代码。
- **arrowControl 仅 H5 渲染**：箭头按钮依赖键盘步进语义，MP 端不渲染（模板 `v-if` 由编译期 `LH_IS_H5` 守卫）。
- **点击外部关闭**：plus 监听 document 点击；uni-app 端由页内透明遮罩承载（点击遮罩即关闭，不发 change）。
- **触发器自绘**：plus 的触发器是可输入的 `<input>`；uni-app 端触发器由 `<view>` + `<text>` 自绘（MP 无触发器内 input 聚焦语义，占位符走修饰类补色，`readonly` 因此等价恒只读）。
- **触发器图标**：plus 用 `date` 图标，本仓改用语义更贴切的 `clock` 图标。
- **进出过渡未绑定**：MP 的 `Transition` 不可靠，与 tooltip / dropdown / popover / cascader 一致，面板直接显隐。
:::
