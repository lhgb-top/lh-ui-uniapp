# Button 按钮

基础按钮组件。渲染载体是 uni 内置 `<button>`（编译为各端原生按钮），点击事件由 uni 编译为 `bindtap`。

## 基础用法

```vue
<template>
  <lh-button>默认</lh-button>
  <lh-button type="primary">主要</lh-button>
  <lh-button type="success">成功</lh-button>
  <lh-button type="warning">警告</lh-button>
  <lh-button type="danger">危险</lh-button>
  <lh-button type="info">信息</lh-button>
</template>
```

## 状态与形状

```vue
<template>
  <lh-button loading>加载中</lh-button>
  <lh-button disabled>禁用</lh-button>
  <lh-button plain>朴素</lh-button>
  <lh-button round>圆角</lh-button>
  <lh-button circle icon="search" />
  <lh-button block>块级（占满一行）</lh-button>
  <lh-button icon="search" type="primary">带图标</lh-button>
</template>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 类型 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| size | 尺寸；不传则从 ConfigProvider 继承 | `'small' \| 'medium' \| 'large'` | — |
| loading | 加载中状态 | `boolean` | `false` |
| disabled | 禁用 | `boolean` | `false` |
| plain | 朴素（描边）样式 | `boolean` | `false` |
| block | 块级布局 | `boolean` | `false` |
| round | 圆角 | `boolean` | `false` |
| circle | 圆形 | `boolean` | `false` |
| icon | 图标名称 | `LhIconName` | — |
| customClass | 自定义类名（透传到根节点） | `string` | — |
| themeVars | 组件级主题变量 | `Record<string, string>` | — |
| bgPattern | 组件级背景花纹 | `string` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击 | `(event)` |

::: tip 与 Vue3 版的差异
小程序 button 无 `nativeType` / `href` / `target` 语义，这三个属性在本库**不实现**。
其余 API 一致。
:::
