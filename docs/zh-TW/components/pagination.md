# Pagination 分頁

頁碼導航：上一頁 / 頁碼 / 省略 / 下一頁 / 總條數 / 條數切換 / 跳頁。頁碼視窗收縮演算法（首末頁常駐、
當前頁兩側吸附、僅在真正產生間隙時輸出省略號）在 `@lh-ui/share` core 層純函數實現。

## 基礎用法

`total` 為資料總數（必填），預設每頁 10 筆。

```vue
<template>
  <lh-pagination :total="120" />
</template>
```

## 總數與條數切換

`show-total` 顯示總條數；`show-size-changer` 顯示每頁條數切換（uni 端由內建 picker 承載）。

```vue
<template>
  <lh-pagination :total="480" show-total show-size-changer />
</template>
```

## 跳頁

`show-jumper` 顯示跳頁輸入，輸入頁碼後按確認（confirm）或失焦提交，越界自動鉗制。

```vue
<template>
  <lh-pagination :total="480" show-total show-jumper />
</template>
```

## 簡潔模式

`simple` 收起頁碼區，只顯示「當前頁 / 總頁數」。

```vue
<template>
  <lh-pagination :total="480" simple show-jumper />
</template>
```

## 受控用法

當前頁用 `v-model:current` 受控。

```vue
<template>
  <lh-pagination v-model:current="page" :total="95" />
  <text>當前頁：{{ page }}</text>
</template>

<script setup>
import { ref } from 'vue'
const page = ref(2)
</script>
```

## 每頁條數與禁用

`v-model:page-size` 受控每頁條數，`page-sizes` 自訂條數選項；條數變化後當前頁越界會自動鉗制；
`disabled` 停用整個分頁。

```vue
<template>
  <lh-pagination
    v-model:page-size="pageSize"
    :total="480"
    show-size-changer
    :page-sizes="[10, 20, 50, 100]"
  />
  <text>每頁條數：{{ pageSize }}</text>
  <lh-pagination :total="480" disabled />
</template>

<script setup>
import { ref } from 'vue'
const pageSize = ref(20)
</script>
```

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| total | 資料總數（必填） | `number` | — |
| pageSize | 每頁條數（配合 `update:pageSize` 事件受控） | `number` | `10` |
| current | 當前頁（`v-model:current`） | `number` | — |
| pageSizes | 每頁條數選項 | `number[]` | `[10, 20, 30, 40]` |
| showTotal | 是否顯示總條數 | `boolean` | `false` |
| showSizeChanger | 是否顯示每頁條數切換 | `boolean` | `false` |
| showJumper | 是否顯示跳頁輸入 | `boolean` | `false` |
| simple | 緊湊模式 | `boolean` | `false` |
| disabled | 是否停用 | `boolean` | `false` |
| sx | 快速布局屬性 | `LhSxProps` | — |

## Events

| 事件名 | 說明 | 回呼參數 |
| --- | --- | --- |
| update:current | 當前頁變化時觸發，配合 `v-model:current` 使用 | `(page: number)` |
| update:pageSize | 每頁條數變化時觸發，配合 `v-model:page-size` 使用 | `(size: number)` |
| change | 當前頁變化時觸發（頁碼 / 前後翻頁 / 跳頁均觸發） | `(page: number)` |
| size-change | 每頁條數變化時觸發 | `(size: number)` |

## 無障礙

- 根節點 `role="navigation"` + `aria-label="pagination"`
- 當前頁按鈕自動設定 `aria-current="page"`，每個頁碼按鈕、上一頁 / 下一頁按鈕都有獨立的
  `aria-label`（取語言包 `pagination.page` / `prev` / `next`），純符號「‹」「›」由 `aria-hidden` 隱藏
- 頁碼按鈕、前後翻頁為 `role="button"`，停用時輸出 `aria-disabled`
- 省略號為純展示 `aria-hidden` 元素，不干擾閱讀

## 平台差異

- **view 自繪觸控互動，全端可用**：plus 的 `<nav>` / `<button>` / `<ul>` / `<span>` 在本庫換成
  `<view>` / `<text>`（WXSS 禁標籤選擇器，靠類名生效）；頁碼與前後翻頁透過 `@click` 觸發，
  H5 與微信小程式表現一致，無任何平台 API 依賴。
- **頁碼溢出省略邏輯走 core**：視窗收縮演算法（首末頁常駐、當前頁兩側各顯示 1 個頁碼、不足時向
  邊緣吸附、僅在真正產生間隙時輸出省略號）是 `@lh-ui/share` core 的純函數
  `getPaginationRange`，頁碼鉗制 `clampPage` 與總頁數 `getPageCount` 同樣出自 core，
  庫內只寫響應式膠水。
- **條數切換用內建 picker 承載**：uni 沒有 `<select>`，`show-size-changer` 用 uni 內建
  `<picker mode="selector">` 承載，選項即 `page-sizes`，change 事件的取值在
  `event.detail.value`（選項下標）；H5 端喚起 uni 的選擇器面板，小程式端喚起原生滾輪選擇器。
- **跳頁輸入提交時機不同**：uni 的 input 沒有原生 change 事件，提交統一在確認（confirm，
  H5 按下 Enter 與小程式鍵盤「完成」都觸發）或失焦（blur）時進行，輸入事件取值走
  `event.detail.value`（同 lh-input-number 先例）；原生 `min` / `max` 屬性不透傳，
  頁碼一律由 core 的 `clampPage` 鉗制。plus 對「輸入後清空再失焦」會鉗回第 1 頁，
  本庫收緊為不跳頁（空字串與非法數字都不發事件）。
- **停用外觀走類名兜底**：share 樣式源的停用樣式寫在 `&:disabled` 偽類上（只匹配 button 元素），
  view 沒有該偽類，本元件在 SFC 內聯按同一令牌（`--lh-disabled-text-color`）補了
  `lh-pagination__btn--disabled` 類規則（同 lh-segmented / lh-input-number 的內聯兜底先例，
  不進淨化產物）。
- **無障礙屬性攤開綁定**：頁碼按鈕的 `aria-current` / `aria-label` 契約由 share 的
  `getPaginationItemAria` 決定，因小程式模板編譯器不支援 `v-bind` 物件，膠水層把屬性包
  攤成逐項顯式綁定。
- **移植結論**：pagination 是無度量 / 無彈層 / 無 document 依賴的純切換元件，頁碼區間、
  鉗制與無障礙屬性全部由 `@lh-ui/share` core 純函數產出，庫內只寫響應式膠水；
  API 與 Vue3 版完全一致（`total` / `pageSize` / `current` / `pageSizes` / `showTotal` /
  `showSizeChanger` / `showJumper` / `simple` / `disabled` / `sx`）。
