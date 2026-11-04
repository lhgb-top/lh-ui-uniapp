# DatePicker 日期選擇器

日期選擇器：點擊觸發框彈出日曆面板，支援日期 / 月份 / 年份三種選擇模式、自訂顯示格式與區間值回顯。日曆網格演算法、日期格式化與停用判定全部消費 `@lh-ui/share` core 純函式，面板為 `view` 自繪網格，H5 與微信小程式渲染一致。

## 值類型契約

元件的綁定值**始終是 `Date` 物件**（區間為 `[Date, Date]` 元組），不接受也不產出 ISO 日期字串：

```vue
<template>
  <lh-date-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
// ✅ 正確：Date 物件
const value = ref<Date | null>(new Date(2026, 10, 3))
// ❌ 錯誤：'2026-11-03' 字串不會回顯，也不會被解析
</script>
```

`format` prop 只影響**觸發器與面板的顯示**（定寬 token `yyyy` / `MM` / `dd` / `HH` / `mm` / `ss`），不改變綁定值形態。拿到的是 `Date`，要落庫 ISO 字串請自行 `formatDate` 或 `toISOString()`。

## 基礎用法

```vue
<template>
  <lh-date-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3))
</script>
```

日期模式下面板內點擊日期為**暫存**，點底部「確定」才提交（兩步提交，與 Vue3 版一致）；「今天」按鈕把面板跳回本月並暫存當天。

## 月份與年份模式

`mode="month"` / `mode="year"` 時打開面板即落在對應網格，點擊直接選中並關閉（無底部按鈕）。日期模式下點擊面板標題可逐級下鑽：日期 → 月份 → 年份，年份視圖點標題回到月份。

```vue
<template>
  <lh-date-picker v-model="month" mode="month" />
  <lh-date-picker v-model="year" mode="year" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const month = ref<Date | null>(new Date(2026, 5, 1))
const year = ref<Date | null>(new Date(2024, 0, 1))
</script>
```

## 日期格式化

```vue
<template>
  <lh-date-picker v-model="value" format="MM/dd/yyyy" />
  <lh-date-picker v-model="value" format="yyyy年MM月dd日" />
</template>
```

未傳 `placeholder` 時佔位文字由 `format` 產生（`yyyy` → 語言包「年」、`MM` → 「月」、`dd` → 「日」）。

## 停用與唯讀

```vue
<template>
  <lh-date-picker v-model="value" disabled />
  <lh-date-picker :model-value="value" readonly />
</template>
```

`disabled` 停用整個選擇器（點擊不彈層）；`readonly` 唯讀（可程式化賦值，點擊不彈層）。

## 尺寸與清除

```vue
<template>
  <lh-date-picker v-model="value" size="small" />
  <lh-date-picker v-model="value" size="medium" />
  <lh-date-picker v-model="value" size="large" />
  <lh-date-picker v-model="value" :clearable="false" />
</template>
```

`size` 未傳時取 ConfigProvider 全域尺寸，最終回退 `medium`；`clearable` 預設開，觸發器右側顯示清除圖示。

## 區間值回顯

綁定值為 `[Date, Date]` 時觸發器正常回顯兩端，分隔符由 `range-separator` 控制（預設 `~`）：

```vue
<template>
  <lh-date-picker v-model="span" range-separator=" 至 " />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const span = ref<[Date, Date]>([new Date(2026, 10, 1), new Date(2026, 10, 7)])
</script>
```

::: warning 區間 / 日期時間選擇 UI 尚未實作
與 Vue3 版一致，`mode="datetime"` 與區間選擇**只有類型預留，沒有對應的選擇 UI**（時間列與區間面板未實作，見家族待辦 P-08）。區間值可以回顯，但面板內點「確定」不會用單個 `Date` 覆寫已傳入的區間值。
:::

## 單元格與面板客製化

```vue
<template>
  <lh-date-picker v-model="value" :cell-class-name="cellClassName" popper-class="my-popper" />
</template>

<script setup lang="ts">
const cellClassName = (date: Date) => (date.getDay() === 0 || date.getDay() === 6 ? 'my-weekend' : '')
</script>
```

`cell-class-name` 依日期給單元格附加自訂類別（回傳空值時跳過）；`popper-class` 透傳到彈層根節點，供寫面板級客製化樣式。

## DatePicker API

### Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| modelValue | 綁定值（Date / 區間元組 / null，**不接受 ISO 字串**） | `Date \| [Date, Date] \| null` | `null` |
| mode | 選擇模式 | `'date' \| 'month' \| 'year' \| 'datetime' \| 'range'` | `'date'` |
| size | 尺寸（未傳取 ConfigProvider 全域尺寸，回退 medium） | `'small' \| 'medium' \| 'large' \| 'mini' \| 'x-large'` | `'medium'` |
| disabled | 是否停用整個選擇器 | `boolean` | `false` |
| clearable | 是否顯示清除按鈕 | `boolean` | `true` |
| placeholder | 佔位文字（未傳時依 format 產生） | `string` | `''` |
| format | 顯示格式（定寬 token，只影響顯示） | `string` | `'yyyy-MM-dd'` |
| readonly | 唯讀（不彈層） | `boolean` | `true` |
| rangeSeparator | 區間分隔符（區間值回顯拼接） | `string` | `'~'` |
| cellClassName | 日期單元格自訂類別回呼 | `(date: Date) => string` | — |
| popperClass | 面板自訂類別 | `string` | — |
| customClass | 根節點自訂類別 | `string` | — |
| themeVars | 元件級主題變數，覆寫 ConfigProvider 配置 | `Record<string, string>` | — |
| sx | sx 快速佈局屬性（作用於根元素，浮層面板不受影響） | `LhSxProps` | — |

::: tip mode 取值
`'datetime'` 與 `'range'` 為**類型預留**：`LhDatePickerMode`（share core）包含這兩個值，但面板內的時間列與區間選擇 UI 尚未實作（待辦 P-08），暫請只使用 `'date'` / `'month'` / `'year'`。
:::

### Events

| 事件 | 說明 | 參數 |
| --- | --- | --- |
| update:modelValue | 值改變時觸發（v-model） | `(value: Date \| [Date, Date] \| null)` |
| change | 值確認改變時觸發（與 update:modelValue 同載荷） | `(value: Date \| [Date, Date] \| null)` |

### 無障礙

- 觸發器為 `role="combobox"`（`aria-expanded` / `aria-haspopup="dialog"` / `aria-controls` 指向面板），屬性包由 share 的 `getDatePickerTriggerAria` 產出
- 面板為 `role="dialog"`；日曆為 `role="grid"`，日期格 `role="gridcell"`，帶 `aria-selected` / `aria-current="date"`（今天）/ `aria-disabled`（停用）
- 日期格 `aria-label` 為「YYYY年M月D日 星期X」完整文案，供讀屏識別
- 翻月按鈕為 `role="button"` + `aria-label`（語言包 `datepicker.prevMonth` / `datepicker.nextMonth`）
- 鍵盤網格導覽與觸發器鍵盤行為僅 H5 生效，見下方平台差異

::: tip 平台差異（與 Vue3 版的差異）
- **面板化選擇**：plus 的日曆面板本就是面板式（非滾輪式選擇器），本倉沿用同一互動；浮層載體由 `Teleport to="body"` 改為 `lh-root-portal`（舊版本頁內 fixed 兜底），定位走兩幀非同步度量（先隱藏渲染量尺寸 → `computePosition` 定位 → 顯示，防閃爍），進出過渡未綁定。
- **DOM 元素映射**：plus 的 `<div>` / `<button>` / `<input>` 全部換成 `<view>`；觸發器回顯與佔位由 `<text>` 自繪（MP 不支援 `::placeholder`，佔位色由 SFC 內嵌修飾類依同令牌補色）；翻月 / 今天 / 確定按鈕的停用態由類別承載（view 無 `:disabled` 偽類）。
- **點擊外部關閉**：由 plus 的文件級 click 監聽改為頁內透明遮罩點擊關閉（等價語義，MP 無 document），遮罩點擊只關閉不發 change。
- **鍵盤導覽僅 H5**：觸發器 Enter / Space 開合、網格方向鍵移動（含翻月）/ Home / End / PageUp / PageDown、roving tabindex、Escape 關棧頂在 MP 端無鍵盤事件，由條件編譯守衛直接不呼叫，MP 包內無死程式碼。
- **aria 屬性逐項顯式綁定**：plus 模板裡 share 的 `LhAriaAttrs` 屬性包不能 `v-bind` 落圖（MP 模板編譯器不支援），改由膠水層把 `aria-*` 鍵攤成具體值逐項綁定，契約仍由 share 純函式決定。
- **值類型契約**：與 plus 一致——綁定值是 `Date` / `[Date, Date]`，絕不接收或產出 ISO 日期字串；`format` 只作用於顯示層。
:::
