# Statistic 统计数值

展示统计数值，支持精度、千位分隔、前缀后缀与超大数字符串。

## 基础用法

```vue
<template>
  <lh-statistic
    title="年访问量"
    :value="2384712"
  />
</template>
```

## 精度与分隔符

`precision` 控制小数位（四舍五入），`separator` 控制千位分隔（传空串关闭分组）。

```vue
<template>
  <lh-statistic
    title="评分"
    :value="4.8471"
    :precision="2"
  />
  <lh-statistic
    title="编号"
    :value="8899001"
    separator=""
  />
</template>
```

## 前缀与后缀

```vue
<template>
  <lh-statistic
    title="成交额"
    :value="128600"
    prefix="¥"
    suffix="元"
  />
  <lh-statistic
    title="增长率"
    :value="12.6"
    :precision="1"
    suffix="%"
  />
</template>
```

## 超大数与非数值文本

`value` 传入字符串时可承载超大数：超出 `Number.MAX_SAFE_INTEGER` 的整数字符串走字符串格式化路径，全程不经 Number 转换、不丢精度；无法解析为数值的字符串按原文展示。

```vue
<template>
  <lh-statistic
    title="星辰"
    value="不可计数"
  />
  <lh-statistic
    title="星际距离"
    value="9007199254740993"
  />
</template>
```

## 插槽

`title` / `prefix` / `suffix` 三个插槽分别覆盖同名 props 文本。

```vue
<template>
  <lh-statistic :value="1024">
    <template #title>
      <text>自定义标题</text>
    </template>
    <template #prefix>
      <text>¥</text>
    </template>
    <template #suffix>
      <text>元</text>
    </template>
  </lh-statistic>
</template>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 数值标题（展示在数值上方） | `string` | — |
| value | 统计数值；字符串形式可承载超大数或带符号文本 | `string \| number` | `0` |
| precision | 小数精度 | `number` | `0` |
| separator | 千位分隔符；空串关闭分组 | `string` | `','` |
| prefix | 数值前缀，如货币符号 | `string` | — |
| suffix | 数值后缀，如单位 | `string` | — |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| title | 自定义标题 |
| prefix | 自定义前缀 |
| suffix | 自定义后缀 |

## 平台差异

- 纯展示组件，不触及任何平台 API，H5 与微信小程序表现完全一致。
- 格式化逻辑（精度、千位分隔、超大数字符串路径）全部由 `@lh-ui/share` 的 `formatStatisticValue` 纯函数产出，本仓只写响应式胶水，不复制 core 实现。
- 数值区带 `aria-live="polite"`：H5 下 `value` 变化时屏幕阅读器温和播报新值；小程序读屏支持以平台能力为准。
- 本组件不含数字滚动动画（count-up）。若后续引入：小程序端 `setInterval` / `requestAnimationFrame` 均可用，但 `transitionend` 在小程序不可靠，动画收尾须用 `setTimeout` 对齐时长（与 message / loading 的进出动画同款处理）。
