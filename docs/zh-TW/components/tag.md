# Tag 標籤

## 基礎用法

```vue
<template>
  <lh-tag>默认</lh-tag>
  <lh-tag type="primary">主要</lh-tag>
  <lh-tag type="success">成功</lh-tag>
  <lh-tag type="warning">警告</lh-tag>
  <lh-tag type="danger">危险</lh-tag>
</template>
```

## 樣式與關閉

```vue
<template>
  <lh-tag round>圆角</lh-tag>
  <lh-tag hit>描边</lh-tag>
  <lh-tag closable @close="onClose">可关闭</lh-tag>
</template>

<script setup lang="ts">
const onClose = () => console.log('关闭了')
</script>
```

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| type | 類型 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | — |
| closable | 可關閉 | `boolean` | `false` |
| disabled | 停用 | `boolean` | `false` |
| round | 圓角 | `boolean` | `false` |
| hit | 描邊（無填充） | `boolean` | `false` |
| customClass | 自訂類別名 | `string` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

## Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| close | 點選關閉按鈕 | — |

::: tip 與 Vue3 版的差異
關閉按鈕裡的內聯 SVG 在本庫換成 lh-icon（iconfont 方案）。
:::
