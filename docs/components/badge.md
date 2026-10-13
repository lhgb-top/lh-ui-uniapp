# Badge 徽标

图标右上角的角标，用于通知数、状态点或自定义文案。

## 基础用法

```vue
<template>
  <lh-badge :value="8">
    <lh-button size="small">消息</lh-button>
  </lh-badge>
  <lh-badge :value="8" type="primary">
    <lh-button size="small">主要</lh-button>
  </lh-badge>
</template>
```

## 数值处理

```vue
<template>
  <lh-badge :value="200" :max="99">
    <lh-button size="small">超出 max 显示 99+</lh-button>
  </lh-badge>
  <lh-badge :value="0" show-zero>
    <lh-button size="small">显示 0</lh-button>
  </lh-badge>
  <lh-badge :value="0">
    <lh-button size="small">隐藏 0</lh-button>
  </lh-badge>
  <lh-badge content="新">
    <lh-button size="small">自定义文案</lh-button>
  </lh-badge>
</template>
```

## 小红点

```vue
<template>
  <lh-badge is-dot>
    <lh-button size="small">有新消息</lh-button>
  </lh-badge>
</template>
```

## 偏移与尺寸

```vue
<template>
  <lh-badge :value="8" :offset="[6, 4]">
    <lh-button size="small">偏移</lh-button>
  </lh-badge>
  <lh-badge :value="8" size="small">
    <lh-button size="small">小号</lh-button>
  </lh-badge>
</template>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 类型 | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'default'` | `'danger'` |
| value | 显示的数值 | `string \| number` | — |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| max | 最大值，超出显示 `${max}+` | `number` | `99` |
| isDot | 是否为小红点（不显示数值） | `boolean` | `false` |
| hidden | 是否隐藏 | `boolean` | `false` |
| offset | 相对默认位置的偏移 `[x, y]`，取负 margin 实现 | `[number, number]` | — |
| showZero | value 为 0 时是否显示 | `boolean` | `false` |
| content | 自定义文案（优先于 value） | `string` | — |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| default | 徽标依附的内容 |

::: tip 与 Vue3 版的差异
进出动画不依赖 Vue 内置 `<transition>`（小程序的过渡结束事件不可靠），改 class 切换 + 定时器对齐 0.15s 动画时长，视觉表现与 plus 一致。
:::
