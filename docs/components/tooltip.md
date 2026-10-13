# Tooltip 文字提示

## 基础用法

```vue
<template>
  <lh-tooltip content="这是提示文案">
    <lh-button>点击查看提示</lh-button>
  </lh-tooltip>
</template>
```

::: warning 小程序没有 hover 语义
`trigger` 默认是 `click`（全端可用）。`hover` 仅 H5 有效——
小程序端请用 `trigger="click"`，通过点击 / 触摸触发与关闭。
:::

## 位置与宽度

```vue
<template>
  <lh-tooltip content="底部提示" placement="bottom">
    <lh-button>bottom</lh-button>
  </lh-tooltip>

  <lh-tooltip content="长文案会自动换行" :max-width="200" placement="top">
    <lh-button>限制宽度</lh-button>
  </lh-tooltip>
</template>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 提示文案 | `string` | — |
| placement | 弹层位置（12 种方位） | `LhTooltipPlacementCore` | `'top'` |
| trigger | 触发方式：`click`（全端）/ `hover`（仅 H5） | `'click' \| 'hover'` | `'click'` |
| showDelay | 显示延迟（毫秒） | `number` | — |
| hideDelay | 隐藏延迟（毫秒） | `number` | — |
| maxWidth | 最大宽度（内容自动换行） | `string \| number` | — |
| disabled | 禁用 | `boolean` | `false` |
| customClass | 自定义类名 | `string` | — |
| themeVars | 组件级主题变量 | `Record<string, string>` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 显隐变化（受控用法） | `(visible: boolean)` |
| show | 显示 | — |
| hide | 隐藏 | — |

::: tip 与 Vue3 版的差异
- 弹层走 `root-portal` + 两帧异步度量定位（先透明渲染量尺寸 → 定位 → 显示，防闪烁）。
- MP 端 `showDelay` / `hideDelay` 仅 click 模式下保留立即行为。
- 定位计算是异步的（`getLhRect` 返回 Promise），不能假设同步拿到结果。
:::
