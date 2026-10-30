# Button 按鈕

基礎按鈕元件。由 uni 內建 `<button>` 渲染（各目標平台編譯為原生按鈕），點選事件由 uni 編譯為 `bindtap`。

## 基礎用法

```vue
<template>
  <lh-button>默认按钮</lh-button>
  <lh-button type="primary">主要按钮</lh-button>
  <lh-button type="success">成功按钮</lh-button>
  <lh-button type="warning">警告按钮</lh-button>
  <lh-button type="danger">危险按钮</lh-button>
  <lh-button type="info">信息按钮</lh-button>
</template>
```

## 狀態與外形

```vue
<template>
  <lh-button loading>加载中</lh-button>
  <lh-button disabled>禁用</lh-button>
  <lh-button plain>朴素</lh-button>
  <lh-button round>圆角</lh-button>
  <lh-button circle icon="search" />
  <lh-button block>块级按钮（占满整行）</lh-button>
  <lh-button icon="search" type="primary">带图标</lh-button>
</template>
```

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| type | 類型 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| size | 尺寸；未傳時從 ConfigProvider 繼承 | `'small' \| 'medium' \| 'large'` | — |
| loading | 載入狀態 | `boolean` | `false` |
| disabled | 停用 | `boolean` | `false` |
| plain | 樸素（描邊）樣式 | `boolean` | `false` |
| block | 區塊級版面配置 | `boolean` | `false` |
| round | 圓角 | `boolean` | `false` |
| circle | 圓形 | `boolean` | `false` |
| icon | 圖示名稱 | `LhIconName` | — |
| customClass | 自訂類別名（透傳到根節點） | `string` | — |
| themeVars | 元件級主題變數 | `Record<string, string>` | — |
| bgPattern | 元件級背景花紋 | `string` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

## Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| click | 點選 | `(event)` |

::: tip 與 Vue3 版的差異
小程序按鈕沒有 `nativeType` / `href` / `target` 語義，所以這三個 props 在本庫**不實作**。其餘 API 相同。
:::
