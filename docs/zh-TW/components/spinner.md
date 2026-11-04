# Spinner 載入圈

基礎旋轉圖形，表示進行中的狀態。載入遮罩（LhLoading 服務）內部同樣由它呈現。

## 基礎用法

五種尺寸：`mini` / `small` / `medium` / `large` / `x-large`，直徑由 `@lh-ui/share` core 的 `LH_SPINNER_SIZE_PX` 常量統一映射（12 / 16 / 24 / 32 / 40 px）。

```vue
<template>
  <lh-spinner />
  <lh-spinner size="mini" />
  <lh-spinner size="small" />
  <lh-spinner size="medium" />
  <lh-spinner size="large" />
  <lh-spinner size="x-large" />
</template>
```

## 自訂顏色

`color` 接收任意 CSS color 值；未傳時繼承當前文字色（`currentColor`）。

```vue
<template>
  <lh-spinner color="#C4A35A" />
  <lh-spinner color="#5B8C5A" />
  <lh-spinner color="#B5462F" />
</template>
```

## 繼承文字色

不傳 `color` 時圖形跟隨所在容器的文字色，適合與文字混排。

```vue
<template>
  <view class="row">
    <text>載入中…</text>
    <lh-spinner size="small" />
  </view>
</template>
```

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| size | 尺寸 | `'mini' \| 'small' \| 'medium' \| 'large' \| 'x-large'` | `'medium'` |
| color | 旋轉顏色（CSS color 值，未傳時繼承 currentColor） | `string` | — |
| customClass | 自訂類名 | `string` | — |
| sx | 快速佈局屬性 | `LhSxProps` | — |

## 平台差異

- **旋轉動效是純 CSS animation**，不依賴任何平台 API，全端可用，H5 與微信小程式表現一致。
- **圖形載體分端渲染**：H5 端是 svg 描邊環（`stroke-dasharray` 雙動畫，與 Vue3 版逐像素同構）；小程式不支援 svg 模板標籤，改用 `view` + `border` 圓環——三邊著色構成約四分之三圓弧（與 Vue3 版 72% 弧視覺同構），描邊寬度按直徑的 10% 內聯計算（最小 1px）。兩端旋轉動畫同為 CSS animation，不觸及 `transitionend` 等小程式不可靠的能力。
- **顏色走 currentColor**：`color` 屬性寫入根節點 `color` 內聯樣式，圖形繼承之，與 Vue3 版一致。
- **無障礙**：圖形為純裝飾，`aria-hidden="true"` 移出無障礙樹；進行中狀態應由外層容器（如 `role="status"`）承載語意。
- **動效降級**：`prefers-reduced-motion` 降級為靜態半環由 `@lh-ui/share` 的 scss 源提供，該媒體查詢區塊在小程式端建構時被整體剔除（WXSS 不支援），因此降級僅 H5 生效。
- **移植結論**：spinner 是純展示元件（無度量 / 無彈層 / 無 document 依賴），尺寸映射與類名由 `@lh-ui/share` core 純函式（`getSpinnerClassNames` / `LH_SPINNER_SIZE_PX`）產出，倉內只寫響應式膠水。
