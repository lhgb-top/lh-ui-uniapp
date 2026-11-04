# InputNumber 计数器

数字输入框：输入或点击加减按钮改值，支持范围钳制、步长、精度与严格步进。归一化参数、步进与提交钳制全部由 `@lh-ui/share` core 纯函数产出。

## 基础用法

```vue
<template>
  <lh-input-number v-model="value" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const value = ref<number | null>(1)
</script>
```

## 范围限制

`min` / `max` 同时约束按钮步进与输入提交（越界值钳回范围内）。

```vue
<template>
  <lh-input-number v-model="level" :min="1" :max="10" />
</template>
```

## 步长与精度

`step` 调整步长；`precision` 固定小数位（先于钳制生效）；`step-strictly` 把输入值吸附到 step 网格（四舍五入）。

```vue
<template>
  <lh-input-number v-model="value" :step="2" />
  <lh-input-number v-model="value" :precision="2" placeholder="保留2位小数" />
  <lh-input-number v-model="value" :step="10" step-strictly placeholder="只能是10的倍数" />
</template>
```

## 尺寸与控制按钮

`size` 切换 small / medium / large 档位；`controls` 关闭加减按钮（纯输入）。

```vue
<template>
  <lh-input-number v-model="value" size="small" />
  <lh-input-number v-model="value" size="large" />
  <lh-input-number v-model="value" :controls="false" placeholder="无控制按钮" />
</template>
```

## 禁用与表单名称

`disabled` 整体禁用（按钮不可点、输入框不可编辑）；`name` 原生表单名称。

```vue
<template>
  <lh-input-number :model-value="5" disabled />
  <lh-input-number v-model="value" name="quantity" />
</template>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 当前值（null 表示空值） | `number \| null` | `null` |
| min | 最小值 | `number` | `-Infinity` |
| max | 最大值 | `number` | `Infinity` |
| step | 步长 | `number` | `1` |
| step-strictly | 只能输入 step 的倍数 | `boolean` | `false` |
| precision | 数值精度（小数位数） | `number` | — |
| disabled | 是否禁用 | `boolean` | `false` |
| size | 尺寸 | `"small" \| "medium" \| "large" \| "mini" \| "x-large"` | `'medium'` |
| controls | 是否显示加减控制按钮 | `boolean` | `true` |
| placeholder | 占位文本 | `string` | `''` |
| name | 原生表单名称 | `string` | `''` |
| customClass | 自定义类名（透传到根节点） | `string` | — |
| sx | sx 快速布局属性 | `LhSxProps` | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue / change | 值提交（按钮步进立即提交；键入值在失焦 / 确认时提交，与 plus 原生 change 时机一致） | `(value: number \| null)` |

## 平台差异

- **提交时机（草稿模型）**：uni 的 input 组件没有原生 change 事件（小程序端只有 input / blur / confirm），键入期间只同步内部草稿、不提交，失焦或 confirm（H5 回车 / 小程序键盘「完成」）时一次性提交——等价 plus 原生 change 只在提交时机触发的语义（react 仓同款方案）。同一值不重复发事件（MP 端 confirm 后还会再触发一次 blur，去重避免同值双发）。
- **加减按钮是 view 自绘点击**：plus 的 `<button>` 换 `<view role="button">`（MP 的 button 无法 reset 默认样式），点击全端可用；view 无 `:disabled` 伪类，禁用外观由组件内联兜底规则按同一令牌补齐。
- **键盘上下键步进仅 H5**：↑ 增 / ↓ 减（回车提交不另挂 keydown——H5 端 keydown 与 confirm 会同时触发，统一走 confirm 避免双提交）；小程序无键盘事件，不产生行为差异。
- **placeholder 样式**：share 的 `::placeholder` 规则仅进 H5 产物，小程序端走 `placeholder-style` prop（令牌色兜底）。
- **表单校验联动未接**：plus 通过 form 上下文给 input 输出 `aria-invalid`；本仓 input 系组件未接表单上下文的 aria 透传，值与校验行为不受影响。

::: tip 与 Vue3 版的差异
- 逻辑口径（参数归一化、步进、precision / min/max / stepStrictly 钳制）与 plus 完全一致（同一 share core）。
- 增加了 `customClass` prop：uni-app 端自定义类名无法穿透 `styleIsolation`，统一走 prop 透传。
- 键入提交时机见「平台差异」第一条（草稿模型，等价 plus 的 change 语义）。
:::
