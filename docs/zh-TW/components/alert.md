# Alert 警告

在頁面中展示重要的語意提示訊息（成功 / 警告 / 錯誤 / 資訊），支援標題、描述、語意圖示與關閉。

## 基礎用法

```vue
<template>
  <lh-alert title="資訊提示">
    目前操作已儲存，可隨時繼續編輯。
  </lh-alert>
</template>
```

標題可透過 `title` 屬性或同名插槽傳入；預設插槽承載描述內容。

## 語意類型

```vue
<template>
  <lh-alert type="success" title="成功">
    資料已同步完成。
  </lh-alert>
  <lh-alert type="warning" title="警告">
    餘額不足，請盡快儲值。
  </lh-alert>
  <lh-alert type="danger" title="錯誤">
    提交失敗，請檢查網路後重試。
  </lh-alert>
  <lh-alert type="info" title="資訊">
    新版本將於下週發布。
  </lh-alert>
</template>
```

## 語意圖示

```vue
<template>
  <lh-alert show-icon type="success" title="帶圖示的成功提示">
    圖示顏色跟隨語意類型自動著色。
  </lh-alert>
</template>
```

## 可關閉

```vue
<template>
  <lh-alert closable title="可關閉的警告">
    點擊右側叉號後元件隱藏，並觸發 close 事件。
  </lh-alert>
</template>
```

## 樸素樣式

```vue
<template>
  <lh-alert plain title="樸素樣式">
    白底 + 語意色描邊，適合緊湊列表。
  </lh-alert>
</template>
```

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| type | 語意類型 | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` |
| title | 標題（也可用 title 插槽） | `string` | — |
| closable | 是否可關閉 | `boolean` | `false` |
| showIcon | 是否顯示語意圖示 | `boolean` | `false` |
| plain | 是否淺色樸素樣式 | `boolean` | `false` |
| closeLabel | 關閉按鈕的無障礙名稱（未傳時取語言包 `alert.close`） | `string` | — |
| customClass | 自訂類名 | `string` | — |
| sx | 快速佈局屬性 | `LhSxProps` | — |

## Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| close | 點擊關閉按鈕時觸發（元件隨後隱藏） | — |

## Slots

| 插槽 | 說明 |
| --- | --- |
| default | 描述內容 |
| title | 標題內容（優先於 title 屬性） |

## 平台差異

- **無障礙角色**：`warning` / `danger` 渲染 `role="alert"`（立即播報），`info` / `success` 渲染 `role="status"`（排隊播報），與 plus 側 APG 語意一致，兩端無差異。
- **標籤替換**：plus 的 `<div>` / `<span>` / `<p>` 在本倉換為 `view`，文字節點用 `view` 承載（WXSS 禁標籤選擇器，樣式靠 `lh-alert__*` 類名生效）。
- **圖示**：plus 內嵌的 svg 在小程式端不支援，統一換 `lh-icon` 圖表節點（`info` / `check` / `warning` / `error`），樣式類名 `lh-alert__icon` 與 share scss 對齊。
- **關閉按鈕**：plus 的 `<button type="button">` 換成 `view` + `role="button"`；無障礙名稱同樣取 `closeLabel` 或語言包 `alert.close`（九語言齊備）。
- **無進出動畫**：plus 側關閉也只是 `v-if` 摘節點（無 `<transition>` 包裹），本倉行為完全一致，不涉及小程式 `transitionend` 不可靠的問題。
- **移植結論**：alert 是純展示元件（無度量 / 無彈層 / 無 focus-trap / 無 document 依賴），全端可用，H5 與微信小程式表現一致。
