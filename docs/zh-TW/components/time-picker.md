# TimePicker 時間選擇器

時間選擇器用於選擇時、分、秒。點擊觸發器後彈出面板：每列（時/分/秒）是一個獨立縱向捲動的列，點擊列項落位，底部「此刻 / 確定」提交選擇。

## 基礎用法

```vue
<template>
  <lh-time-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

預設 `format` 為 `HH:mm:ss`，面板渲染時/分/秒三列；點擊列項即時落位（面板不關），點擊「確定」提交 `Date` 並關閉面板，點擊「此刻」把當前時刻填入列中。

## 時分格式

`format` 不含 `ss` 時面板只渲染時/分兩列，佔位符也按 `format` 生成：

```vue
<template>
  <lh-time-picker v-model="value" format="HH:mm" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## 時間範圍

`start` / `end` 限定小時列的可選範圍（與 0~23 求交集），範圍外的已有選中小時會收斂回可選區間，「此刻」同樣收斂：

```vue
<template>
  <lh-time-picker v-model="value" :start="8" :end="20" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## 步進

`step-hour` / `step-minute` / `step-second` 自訂各列的選項步進：

```vue
<template>
  <lh-time-picker v-model="value" :step-hour="2" :step-minute="5" :step-second="10" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## 停用

`disabled` 停用整個選擇器（不彈層，清除按鈕也不顯示）：

```vue
<template>
  <lh-time-picker v-model="value" disabled />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## 佔位與清除

`placeholder` 自訂佔位文字（未傳時按 `format` 生成，取語言包 `timepicker.hour/minute/second`）；有值後觸發器右側顯示清除圖示，點擊置空（`clearable` 預設 `true`）：

```vue
<template>
  <lh-time-picker v-model="value" placeholder="選擇提醒時間" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(null)
</script>
```

## TimePicker API

### Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| modelValue | 綁定的時間 | `Date \| null` | `null` |
| size | 尺寸 | `LhTimePickerSize` | `'medium'` |
| disabled | 是否停用整個選擇器 | `boolean` | `false` |
| clearable | 是否顯示清除按鈕 | `boolean` | `true` |
| placeholder | 佔位文字（未傳時按 format 生成，取語言包 `timepicker.hour/minute/second`） | `string` | — |
| format | 時間格式（含 `ss` 才顯示秒列） | `string` | `'HH:mm:ss'` |
| readonly | 唯讀標記（觸發器為 view 自繪，無輸入態，等價恆唯讀） | `boolean` | `false` |
| arrowControl | 是否顯示箭頭按鈕（僅 H5 繪製，配合鍵盤步進） | `boolean` | `false` |
| start | 開始小時（與 0~23 求交集） | `number` | `0` |
| end | 結束小時（與 0~23 求交集） | `number` | `24` |
| stepHour | 小時列步進 | `number` | `1` |
| stepMinute | 分鐘列步進 | `number` | `1` |
| stepSecond | 秒列步進 | `number` | `1` |
| customClass | 自訂類名（透傳到根節點） | `string` | — |
| themeVars | 元件級主題變數 | `Record<string, string>` | — |
| sx | sx 快速佈局屬性（作用於觸發器根元素，浮層面板不受影響） | `LhSxProps` | — |

### Events

| 事件 | 說明 | 參數 |
| --- | --- | --- |
| update:modelValue | 綁定值變化時觸發 | `(value: Date \| null)` |
| change | 點擊「確定」或「清除」時觸發 | `(value: Date \| null)` |

### 無障礙

- 觸發器帶 `aria-haspopup="dialog"` / `aria-expanded` / `aria-controls`（屬性包由 share 的 `getTimePickerTriggerAria` 產出，逐鍵攤開綁定）
- 面板為 `role="dialog"`，每列為 `role="listbox"`（`aria-label` 走語言包 `timepicker.hourLabel/minuteLabel/secondLabel`），列項為 `role="option"` 並帶 `aria-selected` / `aria-disabled`
- 定位引擎為自研純函式（flip / shift 防溢出），零第三方執行時依賴

::: tip 平台差異（與 Vue3 版的差異）
- **滾輪改為 scroll-view 列面板**：plus 的列容器是 `overflow-y: auto` 的 `div`、靠 `@wheel.prevent` 攔截滾輪做步進、選中項走 `scrollIntoView`；uni-app 端每列改為獨立的 `scroll-view`（`scroll-y`）縱向捲動（MP 的 `view` 沒有可靠的溢出捲動），選中項由 `scroll-into-view` 自動捲入視窗（MP 無 `scrollIntoView` API）。選擇互動保持一致：點擊列項落位、底部「此刻 / 確定」提交。
- **滾輪步進未移植**：列內捲動交給 `scroll-view` 原生捲動（H5 端滾輪自然捲動長列表），不再攔截 wheel 事件按 step 跳值；步進選項的生成（`step-hour` 等）與 plus 一致。
- **鍵盤導航僅 H5**：觸發器 Enter/Space/方向鍵下開面板並把焦點放進第一列；面板內 ↑↓ 按 step 步進（小時迴繞後再收斂回 start/end 範圍）、←→ 在時分秒列之間跳焦、Enter/Space 確認並關閉、Escape 經文件級監聽關閉（多彈層疊加時只關棧頂）。整段處理函式主體由條件編譯裁剪，MP 包內無死程式碼。
- **arrowControl 僅 H5 繪製**：箭頭按鈕依賴鍵盤步進語義，MP 端不繪製（範本 `v-if` 由編譯期 `LH_IS_H5` 守衛）。
- **點擊外部關閉**：plus 監聽 document 點擊；uni-app 端由頁內透明遮罩承載（點擊遮罩即關閉，不發 change）。
- **觸發器自繪**：plus 的觸發器是可輸入的 `<input>`；uni-app 端觸發器由 `<view>` + `<text>` 自繪（MP 無觸發器內 input 聚焦語義，佔位符走修飾類補色，`readonly` 因此等價恆唯讀）。
- **觸發器圖示**：plus 用 `date` 圖示，本倉改用語義更貼切的 `clock` 圖示。
- **進出過渡未綁定**：MP 的 `Transition` 不可靠，與 tooltip / dropdown / popover / cascader 一致，面板直接顯隱。
:::
