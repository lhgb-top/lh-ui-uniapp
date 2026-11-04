# Alert 警告

用于页面中展示重要的语义提示信息（成功 / 警告 / 错误 / 信息），支持标题、描述、语义图标与关闭。

## 基础用法

```vue
<template>
  <lh-alert title="信息提示">
    当前操作已保存，可随时继续编辑。
  </lh-alert>
</template>
```

标题可通过 `title` 属性或同名插槽传入；默认插槽承载描述内容。

## 语义类型

```vue
<template>
  <lh-alert type="success" title="成功">
    数据已同步完成。
  </lh-alert>
  <lh-alert type="warning" title="警告">
    余额不足，请尽快充值。
  </lh-alert>
  <lh-alert type="danger" title="错误">
    提交失败，请检查网络后重试。
  </lh-alert>
  <lh-alert type="info" title="信息">
    新版本将于下周发布。
  </lh-alert>
</template>
```

## 语义图标

```vue
<template>
  <lh-alert show-icon type="success" title="带图标的成功提示">
    图标颜色跟随语义类型自动着色。
  </lh-alert>
</template>
```

## 可关闭

```vue
<template>
  <lh-alert closable title="可关闭的警告">
    点击右侧叉号后组件隐藏，并触发 close 事件。
  </lh-alert>
</template>
```

## 朴素样式

```vue
<template>
  <lh-alert plain title="朴素样式">
    白底 + 语义色描边，适合紧凑列表。
  </lh-alert>
</template>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 语义类型 | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` |
| title | 标题（也可用 title 插槽） | `string` | — |
| closable | 是否可关闭 | `boolean` | `false` |
| showIcon | 是否显示语义图标 | `boolean` | `false` |
| plain | 是否浅色朴素样式 | `boolean` | `false` |
| closeLabel | 关闭按钮的无障碍名称（未传时取语言包 `alert.close`） | `string` | — |
| customClass | 自定义类名 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| close | 点击关闭按钮时触发（组件随后隐藏） | — |

## Slots

| 插槽 | 说明 |
| --- | --- |
| default | 描述内容 |
| title | 标题内容（优先于 title 属性） |

## 平台差异

- **无障碍角色**：`warning` / `danger` 渲染 `role="alert"`（立即播报），`info` / `success` 渲染 `role="status"`（排队播报），与 plus 侧 APG 语义一致，两端无差异。
- **标签替换**：plus 的 `<div>` / `<span>` / `<p>` 在本仓换为 `view`，文字节点用 `view` 承载（WXSS 禁标签选择器，样式靠 `lh-alert__*` 类名生效）。
- **图标**：plus 内联的 svg 在小程序端不支持，统一换 `lh-icon` 图表节点（`info` / `check` / `warning` / `error`），样式类名 `lh-alert__icon` 与 share scss 对齐。
- **关闭按钮**：plus 的 `<button type="button">` 换成 `view` + `role="button"`；无障碍名称同样取 `closeLabel` 或语言包 `alert.close`（九语言齐备）。
- **无进出动画**：plus 侧关闭也只是 `v-if` 摘节点（无 `<transition>` 包裹），本仓行为完全一致，不涉及小程序 `transitionend` 不可靠的问题。
- **移植结论**：alert 是纯展示组件（无度量 / 无弹层 / 无 focus-trap / 无 document 依赖），全端可用，H5 与微信小程序表现一致。
