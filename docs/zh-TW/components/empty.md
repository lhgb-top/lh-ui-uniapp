# Empty 空狀態

空資料時的佔位提示，自帶水墨插畫。

## 基礎用法

```vue
<template>
  <lh-empty />
</template>
```

`description` 未傳時取語言包的 `empty.description`（中文「暂无数据」），切換 ConfigProvider 語言自動跟隨。

## 自訂文案

```vue
<template>
  <lh-empty description="墨痕未干，暂无可览之物" />
</template>
```

## 自訂圖片

```vue
<template>
  <lh-empty image="https://placeholder.invalid/empty.png" description="空空如也" />
</template>
```

## 插槽自繪

預設插槽可完全替代預設插畫（傳入 `image` 時預設插畫也不渲染）。

```vue
<template>
  <lh-empty description="暂无收藏">
    <view class="my-illustration">🎨</view>
  </lh-empty>
</template>
```

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| description | 空狀態描述文案（未傳時取語言包 empty.description） | `string` | — |
| image | 自訂圖片 URL（替代預設插畫） | `string` | — |
| customClass | 自訂類別名 | `string` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

## Slots

| 插槽 | 說明 |
| --- | --- |
| default | 自繪插畫（傳入後替代預設插畫） |

::: tip 小程序端的預設插畫
H5 保留內聯 `<svg>` 插畫（主題著色完整保真）；小程序不支援 svg，預設插畫改用 CSS 繪製簡化版，顏色取主題變數，明暗模式自動適配。
:::
