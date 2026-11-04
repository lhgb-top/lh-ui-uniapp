# Rate 评分

星级评分：点击选星、可选半星与分数文本，只读态输出星级文本供屏读。填充档位、钳制与步进算法由 `@lh-ui/share` core 纯函数产出。

## 基础用法

```vue
<template>
  <lh-rate v-model="value" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const value = ref(3)
</script>
```

## 半星

`allow-half` 开启半星：H5 端点击星星左半区记 0.5（依据点击的横向偏移判定）。

```vue
<template>
  <lh-rate v-model="value" allow-half />
</template>
```

## 只读与分数文本

`readonly` 进入纯展示分支（`role="img"`，星级文本走 `aria-label`）；`show-score` 追加分数文本，`score-template` 自定义模板（`{n}` 占位）。

```vue
<template>
  <lh-rate :model-value="3.5" readonly allow-half show-score />
  <lh-rate :model-value="4" readonly show-score score-template="{n} 分" />
</template>
```

## 自定义星数与字符

`max` 调整星数上限（钳制按 [0, max]）；`character` 替换默认字符 `★`。

```vue
<template>
  <lh-rate :model-value="5" :max="8" character="墨" />
</template>
```

## 禁用

`disabled` 整组禁用：点击不生效，根节点追加 `lh-rate--disabled` 与 `aria-disabled`。

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 当前评分 | `number` | `0` |
| max | 星数上限 | `number` | `5` |
| allow-half | 允许半星 | `boolean` | `false` |
| readonly | 只读（纯展示） | `boolean` | `false` |
| disabled | 禁用 | `boolean` | `false` |
| character | 自定义字符 | `string` | — |
| show-score | 显示分数文本 | `boolean` | `false` |
| score-template | 分数模板（`{n}` 占位） | `string` | — |
| customClass | 自定义类名（透传到根节点） | `string` | — |
| sx | sx 快速布局属性 | `LhSxProps` | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue / change | 评分变化（同一值不重复发出） | `(value: number)` |

## 平台差异

- **半星命中仅 H5**：半星判定依据点击事件的横向偏移（`offsetX`），**小程序事件无该字段**，点击退化为整星；如小程序端需要半星精度，可自行基于 touch 事件 + `uni.createSelectorQuery` 的异步位移计算封装（注意 SelectorQuery 是异步的）。
- **星星载体**：plus 的 `<button>` 星星换成 `<view role="radio">`（MP 的 button 无法 reset 默认样式），禁用由点击守卫 + `--disabled` 修饰类 + `aria-disabled` 表达。
- **键盘步进仅 H5**：方向键 ±1（半星模式 ±0.5）、Home 清零、End 打满；小程序无键盘事件，不产生行为差异。
- **分数文案**：走 share locales 的 `rate.stars`（`{n} 星`，九语言齐备），`score-template` 可覆盖。

::: tip 与 Vue3 版的差异
- 逻辑口径（钳制、填充档位、步进、aria）与 plus 完全一致（同一 share core）。
- 增加了 `customClass` prop：uni-app 端自定义类名无法穿透 `styleIsolation`，统一走 prop 透传。
- 半星命中在小程序端退化整星（见「平台差异」）。
:::
