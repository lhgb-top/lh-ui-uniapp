# Calendar 日曆

日曆元件：以月度網格展示日期，支援單選 / 一段時間（起止）/ 多選三種選擇模式，可用 `range` 約束可選範圍。網格、星期表頭與月份標題的文案全部走語言包（`datepicker.weeks.*` / `datepicker.month1~12` / `datepicker.panelTitle`）。日曆是 `view` 自繪網格，不依賴任何原生日曆控件，行動端天然友好、全端可用。

## 基礎用法

```vue
<template>
  <lh-calendar v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date>()
</script>
```

未傳 `modelValue` 時元件內部維護選中狀態；傳入即受控（與全部表單類元件一致）。

## 一段時間選擇

`selection="range"` 時，第一次點擊確定起點（此時值為 `[起點, 起點]`），第二次點擊確定終點並自動正規化（反序點擊也能得到 `[早, 晚]`）：

```vue
<template>
  <lh-calendar v-model="span" selection="range" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const span = ref<Date[]>([])
</script>
```

起止兩端落 `--selected`，中間日期落 `--in-range` 區間底色（不含兩端）。

## 可選範圍約束

`range` 傳入 `[開始, 結束]` 二元組，區間外日期停用（停用判定由 share 純函式負責，反序區間自動正規化）：

```vue
<template>
  <lh-calendar v-model="value" :range="[start, end]" />
</template>

<script setup lang="ts">
const start = new Date(2026, 10, 1)
const end = new Date(2026, 10, 30)
</script>
```

## 多選模式

`selection="multiple"` 時再次點擊已選日期即取消，結果按時間排序：

```vue
<template>
  <lh-calendar v-model="dates" selection="multiple" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const dates = ref<Date[]>([])
</script>
```

## input 觸發模式

`mode="input"` 時只渲染一個觸發框，點擊展開 / 收起面板，選中後自動收起（`close-on-select` 預設開；一段時間模式需點完兩個日期）：

```vue
<template>
  <lh-calendar v-model="value" mode="input" placeholder="請選擇日期" />

  <!-- 一段時間 + 不自動收起 -->
  <lh-calendar v-model="span" mode="input" selection="range" :close-on-select="false" />
</template>
```

觸發框文案預設為 `YYYY-MM-DD`（一段時間為 `早 ~ 晚`），佔位文案取語言包 `select.placeholder`。

## 多面板與自訂文案

`panels` 控制同時展示的月面板數（flex 換行排列）；`header` / `cell` 具名插槽分別自訂面板標題與日期單元格：

```vue
<template>
  <lh-calendar v-model="value" :panels="2">
    <template #header="{ year, month }">
      <view class="my-title">{{ year }} / {{ month + 1 }}</view>
    </template>
    <template #cell="{ date }">
      <view class="my-cell">{{ date.getDate() }}</view>
    </template>
  </lh-calendar>
</template>
```

::: tip 行動端友好
日曆面板是純 `view` 網格（7 欄等寬布局），不依賴 picker 原生元件、不依賴 DOM 度量，
H5 與微信小程式渲染完全一致；小螢幕上面板隨容器寬度自適應。
:::

## Calendar API

### Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| modelValue | 目前選中（受控 v-model；未傳時內部維護） | `Date \| Date[]` | — |
| selection | 選擇模式：單選 / 一段時間 / 多選 | `'single' \| 'range' \| 'multiple'` | `'single'` |
| range | 可選日期範圍約束（區間外停用，反序自動正規化） | `[Date, Date]` | — |
| mode | 展示形態：panel 常駐面板 / input 點擊觸發框展開 | `'panel' \| 'input'` | `'panel'` |
| panels | 同時展示的月面板數 | `number` | `1` |
| placeholder | input 模式佔位文字（預設取語言包 select.placeholder） | `string` | — |
| closeOnSelect | input 模式選中後是否自動收起面板 | `boolean` | `true` |
| customClass | 自訂類別名（透傳到根節點） | `string` | — |
| sx | sx 快速布局屬性（作用於根節點） | `LhSxProps` | — |

### Events

| 事件 | 說明 | 參數 |
| --- | --- | --- |
| update:modelValue | 選中值變化（v-model） | `(value: Date \| Date[])` |
| change | 選中值變化（與 update:modelValue 同承載） | `(value: Date \| Date[])` |
| select | 點擊某個日期時觸發（停用日期不會觸發） | `(date: Date)` |

### Slots

| 插槽 | 說明 | 作用域參數 |
| --- | --- | --- |
| header | 自訂面板標題 | `{ year: number, month: number }`（month 為 0 起） |
| cell | 自訂日期單元格 | `{ date: Date }` |

### 無障礙

- 網格為 `role="grid"`，每行 `role="row"`，日期單元格 `role="gridcell"`，表頭 `role="columnheader"`，並帶 `aria-selected` / `aria-current="date"`（今天）/ `aria-disabled`（停用）
- 單元格 `aria-label` 為 `YYYY-MM-DD` 格式，供讀屏識別
- 翻月按鈕為 `role="button"` + `aria-label`（語言包 `datepicker.prevMonth` / `datepicker.nextMonth`）
- 鍵盤網格導航（方向鍵翻日、Home / End 行首行尾、PageUp / PageDown 翻月）僅 H5 生效，見下方平台差異

::: tip 平台差異（與 Vue3 版的差異）
- **網格載體**：日曆是 `view` 自繪 7 欄網格（WXSS `grid-template-columns: repeat(7, 1fr)`），不使用任何原生日曆控件，H5 / 微信小程式渲染與互動完全一致，行動端天然友好。
- **DOM 元素映射**：plus 的 `<div>` / `<button>` / `<input>` 全部換成 `<view>`；input 模式的觸發框由 `<view>` 自繪渲染佔位與回顯文案（MP 不支援 `::placeholder`，走原生 `<input>` 還需額外配 `placeholder-style`）。停用單元格由 `--disabled` 類別名承載外觀（view 無 `:disabled` 偽類，SFC 內聯按同 token 兜底）。
- **鍵盤網格導航僅 H5**：方向鍵 / Home / End / PageUp / PageDown 的網格導航與焦點移動（roving tabindex）在 MP 端無鍵盤事件，由條件編譯守衛直接不呼叫，MP 包內無死程式碼。
- **點擊外部收起僅 H5**：input 模式下 plus 監聽文件級 mousedown 收起面板；MP 無 document，面板由觸發框點擊切換開合。
- **aria 屬性逐項顯式綁定**：plus 模板裡 share 的 `LhAriaAttrs` 屬性包不能 `v-bind` 落圖（MP 模板編譯器不支援），改由膠水層把 `aria-*` 鍵攤成具體值逐項綁定，契約仍由 share 純函式決定。
:::
