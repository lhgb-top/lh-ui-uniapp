# Progress 进度条

展示任务进度，支持状态色、自定义颜色与文字格式化。

## 基础用法

```vue
<template>
  <lh-progress :percentage="42" />
</template>
```

## 状态

```vue
<template>
  <lh-progress :percentage="70" status="success" />
  <lh-progress :percentage="70" status="warning" />
  <lh-progress :percentage="70" status="exception" />
  <lh-progress :percentage="100" />
</template>
```

`status` 为 `normal` 且达到 100 时自动视为 `success`。

## 线宽与隐藏文字

```vue
<template>
  <lh-progress :percentage="60" :stroke-width="12" />
  <lh-progress :percentage="60" :show-text="false" />
</template>
```

## 自定义颜色

字符串直接作为条色，函数则按百分比返回颜色。

```vue
<template>
  <lh-progress :percentage="60" color="#C4A35A" />
  <lh-progress :percentage="60" :color="gradient" />
</template>

<script setup lang="ts">
const gradient = (p: number) => `rgb(${p}, 0, 0)`
</script>
```

## 自定义格式化与文字插槽

```vue
<template>
  <lh-progress :percentage="42" :format="format" />
  <lh-progress :percentage="42">
    <template #text="{ percentage }">
      <text>{{ percentage }} / 100</text>
    </template>
  </lh-progress>
</template>

<script setup lang="ts">
const format = (p: number) => `进度 ${p}`
</script>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| percentage | 进度百分比 0-100（超出会自动钳制） | `number` | `0` |
| type | 类型 | `'line' \| 'circle'` | `'line'` |
| status | 状态 | `'normal' \| 'success' \| 'warning' \| 'exception'` | `'normal'` |
| color | 进度条颜色：字符串或按百分比返回颜色的函数 | `string \| ((percentage: number) => string)` | — |
| strokeWidth | 线条宽度 px | `number` | `6` |
| width | 圆形模式画布宽度 px | `number` | `126` |
| showText | 是否显示文字 | `boolean` | `true` |
| format | 自定义文字格式化 | `(percentage: number) => string` | — |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Slots

| 插槽 | 说明 | 作用域参数 |
| --- | --- | --- |
| text | 自定义进度文字 | `{ percentage: number }` |

::: tip circle 型暂未实现
小程序对 svg 支持有限，首版只实现 line 型。传入 `type="circle"` 会按 line 渲染并在开发期告警一次（不静默降级），circle 留待二期。
:::
