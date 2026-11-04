# Image 圖片

帶載入失敗佔位的圖片，可選點擊預覽（走 `uni.previewImage` 原生 API，全端可用）。
裁切模式映射 uni `<image>` 的 `mode`，懶載入用元件內建的 `lazy-load`；
預覽列表正規化與狀態類名由 `@lh-ui/share` core 純函式產出。

## 基礎用法

```vue
<template>
  <lh-image src="https://picsum.photos/240/140" alt="範例圖片" :sx="{ w: '240px', h: '140px' }" />
</template>
```

`alt` 在 TS 層必填，杜絕無替代文字的圖片。uni `<image>` 預設 320×240，
尺寸用 `sx` 的 `w` / `h`（或 style）顯式給出；圓角由 share 樣式源內建
（`--lh-border-radius-small`），無需設定。

## 填充模式

`fit` 描述 CSS object-fit 的語義，映射到 uni `<image>` 的 `mode`：
`contain` → `aspectFit`、`cover` → `aspectFill`、`fill` → `scaleToFill`。

```vue
<template>
  <lh-image src="https://picsum.photos/240/140" alt="撐滿裁切" fit="cover" :sx="{ w: '110px', h: '80px' }" />
  <lh-image src="https://picsum.photos/240/140" alt="完整展示" fit="contain" :sx="{ w: '110px', h: '80px' }" />
  <lh-image src="https://picsum.photos/240/140" alt="拉伸鋪滿" fit="fill" :sx="{ w: '110px', h: '80px' }" />
</template>
```

::: tip none / scale-down 為近似映射
`none` 映射 `center`（不縮放、只顯示中間區域，與 object-fit: none 語義一致）；
uni 無 `scale-down` 等價模式，取語義最接近的 `aspectFit`（與 lh-avatar 同款偏離登記）。
:::

## 懶載入

`lazy` 開啟 uni `<image>` 內建的 `lazy-load`（進入可視區才載入）。

```vue
<template>
  <scroll-view scroll-y style="height: 140px; width: 100%">
    <lh-image
      v-for="i in 4"
      :key="i"
      :src="`https://picsum.photos/240/120?random=${i}`"
      :alt="`懶載入圖片 ${i}`"
      lazy
      :sx="{ w: '240px', h: '120px', mb: 1 }"
    />
  </scroll-view>
</template>
```

微信端 `lazy-load` 只對 page 與 scroll-view 下的 image 生效。

## 載入失敗

載入失敗時切換為失敗佔位（根節點追加 `lh-image--error`），預設文案走語言包
`image.error`（九語言齊備），也可用 `error` 插槽自訂；同時發出 `error` 事件。

```vue
<template>
  <lh-image src="https://invalid.example.com/not-found.png" alt="預設失敗佔位" :sx="{ w: '240px', h: '140px' }" />
  <lh-image src="https://invalid.example.com/not-found.png" alt="自訂失敗佔位" :sx="{ w: '240px', h: '140px' }">
    <template #error>自訂失敗佔位</template>
  </lh-image>
</template>
```

## 點擊預覽

`preview` 開啟後點擊圖片拉起 `uni.previewImage` 原生預覽（全端可用）；
`preview-src-list` 傳入多圖列表，未傳時退化為 `[src]`（與 plus 的正規化口徑一致，
初始下標固定 0）。

```vue
<template>
  <lh-image
    src="https://picsum.photos/240/140"
    alt="多圖預覽"
    preview
    :preview-src-list="[
      'https://picsum.photos/600/400?random=1',
      'https://picsum.photos/600/400?random=2',
      'https://picsum.photos/600/400?random=3',
    ]"
    :sx="{ w: '240px', h: '140px' }"
  />
  <lh-image src="https://picsum.photos/240/140" alt="單圖預覽" preview :sx="{ w: '140px', h: '140px' }" />
</template>
```

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| src | 圖片地址 | `string` | — |
| alt | 替代文字（a11y 強約束，TS 層必填） | `string` | — |
| fit | 裁切模式（映射 uni image 的 mode） | `'contain' \| 'cover' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` |
| preview | 是否可點擊預覽 | `boolean` | `false` |
| preview-src-list | 預覽圖列表（未傳時退化為 [src]） | `string[]` | — |
| lazy | 懶載入（uni image 原生 lazy-load） | `boolean` | `false` |
| customClass | 自訂類名（透傳到根節點） | `string` | — |
| sx | sx 快速佈局屬性 | `LhSxProps` | — |

## Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| load | 圖片載入成功時觸發 | `(event: Event)` |
| error | 圖片載入失敗時觸發（切換為失敗佔位） | `(event: Event)` |

## Slots

| 插槽 | 說明 |
| --- | --- |
| error | 載入失敗佔位內容（預設走語言包 image.error） |

## 平台差異

- **預覽走 `uni.previewImage` 原生 API**（全端可用）：plus 的預覽是自繪 Viewer 彈層
  （teleport 到 body，縮放 / 旋轉 / 多圖切換 / Esc 關閉 / 焦點圈），小程式沒有 document，
  無法照搬。uniapp 端改呼叫 `uni.previewImage`——H5 由 uni 執行時實現浮層、微信端走原生
  預覽頁面，互動能力由平台提供，**沒有遮罩透明度 / 關閉按鈕 / 工具列的自訂能力**。
  plus 的 `LhImageViewer` 獨立元件不在本倉交付範圍。
- **fit → mode 映射**：`contain` / `cover` / `fill` 映射 `aspectFit` / `aspectFill` /
  `scaleToFill`；`none` 映射 `center`；`scale-down` 無等價模式，取最接近的 `aspectFit`
  （與 lh-avatar 同款偏離登記）。`object-fit` 的 CSS 實現只對 H5 的真實 `<img>` 生效，
  uni `<image>` 跨端統一由 `mode` 控制。
- **懶載入**：uni `<image>` 內建 `lazy-load`（替代 plus 的 `loading="lazy"`）；
  微信端僅 page 與 scroll-view 下的 image 生效。
- **尺寸與圓角**：uni `<image>` 預設 320×240，尺寸用 `sx` / style 顯式給出；圓角由
  share 樣式源的 `--lh-border-radius-small` 內建。plus 同樣沒有 width / height / radius
  prop（尺寸走 sx、圓角走樣式源），本倉不私自新增。
- **alt**：MP 端 `<image>` 沒有 alt 概念（H5 端作為屬性透傳），無障礙兜底能力弱於
  Web 的 `<img alt>`，TS 層必填的約束保留。
- **viewer 樣式殘留**：share 樣式源含 `.lh-image-viewer*` 規則（plus 自繪彈層樣式），
  按樣式唯一源約束進入本元件 style.css 產物，兩端都無對應節點（無害冗餘，
  且仍守 WXSS 白名單：`:hover` / `:focus` 系列已條件編譯為 H5-only）。

::: tip 與 Vue3 版的差異
- 邏輯口徑（預覽列表正規化、載入狀態、類名）與 plus 完全一致（同一 share core）。
- 預覽由自繪 Viewer 彈層改為 `uni.previewImage` 原生 API（見「平台差異」）。
- 增加了 `customClass` prop：uni-app 端自訂類名無法穿透 styleIsolation，統一走 prop 透傳。
- fit 在小程式端的 `none` / `scale-down` 為近似映射（見「平台差異」）。
:::
