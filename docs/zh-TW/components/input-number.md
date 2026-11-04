# InputNumber 計數器

數字輸入框：輸入或點擊加減按鈕改值，支援範圍鉗制、步長、精度與嚴格步進。歸一化參數、步進與提交鉗制全部由 `@lh-ui/share` core 純函式產出。

## 基礎用法

```vue
<template>
  <lh-input-number v-model="value" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const value = ref<number | null>(1)
</script>
```

## 範圍限制

`min` / `max` 同時約束按鈕步進與輸入提交（越界值鉗回範圍內）。

```vue
<template>
  <lh-input-number v-model="level" :min="1" :max="10" />
</template>
```

## 步長與精度

`step` 調整步長；`precision` 固定小數位（先於鉗制生效）；`step-strictly` 把輸入值吸附到 step 網格（四捨五入）。

```vue
<template>
  <lh-input-number v-model="value" :step="2" />
  <lh-input-number v-model="value" :precision="2" placeholder="保留2位小數" />
  <lh-input-number v-model="value" :step="10" step-strictly placeholder="只能是10的倍數" />
</template>
```

## 尺寸與控制按鈕

`size` 切換 small / medium / large 檔位；`controls` 關閉加減按鈕（純輸入）。

```vue
<template>
  <lh-input-number v-model="value" size="small" />
  <lh-input-number v-model="value" size="large" />
  <lh-input-number v-model="value" :controls="false" placeholder="無控制按鈕" />
</template>
```

## 禁用與表單名稱

`disabled` 整體禁用（按鈕不可點、輸入框不可編輯）；`name` 原生表單名稱。

```vue
<template>
  <lh-input-number :model-value="5" disabled />
  <lh-input-number v-model="value" name="quantity" />
</template>
```

## Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| modelValue / v-model | 當前值（null 表示空值） | `number \| null` | `null` |
| min | 最小值 | `number` | `-Infinity` |
| max | 最大值 | `number` | `Infinity` |
| step | 步長 | `number` | `1` |
| step-strictly | 只能輸入 step 的倍數 | `boolean` | `false` |
| precision | 數值精度（小數位數） | `number` | — |
| disabled | 是否禁用 | `boolean` | `false` |
| size | 尺寸 | `"small" \| "medium" \| "large" \| "mini" \| "x-large"` | `'medium'` |
| controls | 是否顯示加減控制按鈕 | `boolean` | `true` |
| placeholder | 佔位文字 | `string` | `''` |
| name | 原生表單名稱 | `string` | `''` |
| customClass | 自訂類名（透傳到根節點） | `string` | — |
| sx | sx 快速佈局屬性 | `LhSxProps` | — |

## Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| update:modelValue / change | 值提交（按鈕步進立即提交；鍵入值在失焦 / 確認時提交，與 plus 原生 change 時機一致） | `(value: number \| null)` |

## 平台差異

- **提交時機（草稿模型）**：uni 的 input 元件沒有原生 change 事件（小程式端只有 input / blur / confirm），鍵入期間只同步內部草稿、不提交，失焦或 confirm（H5 送出鍵 / 小程式鍵盤「完成」）時一次性提交——等價 plus 原生 change 只在提交時機觸發的語義（react 倉同款方案）。同一值不重複發事件（MP 端 confirm 後還會再觸發一次 blur，去重避免同值雙發）。
- **加減按鈕是 view 自繪點擊**：plus 的 `<button>` 換 `<view role="button">`（MP 的 button 無法 reset 預設樣式），點擊全端可用；view 無 `:disabled` 偽類，禁用外觀由元件內聯兜底規則按同一令牌補齊。
- **鍵盤上下鍵步進僅 H5**：↑ 增 / ↓ 減（送出鍵提交不另掛 keydown——H5 端 keydown 與 confirm 會同時觸發，統一走 confirm 避免雙提交）；小程式無鍵盤事件，不產生行為差異。
- **placeholder 樣式**：share 的 `::placeholder` 規則僅進 H5 產物，小程式端走 `placeholder-style` prop（令牌色兜底）。
- **表單校驗聯動未接**：plus 透過 form 上下文給 input 輸出 `aria-invalid`；本倉 input 系元件未接表單上下文的 aria 透傳，值與校驗行為不受影響。

::: tip 與 Vue3 版的差異
- 邏輯口徑（參數歸一化、步進、precision / min/max / stepStrictly 鉗制）與 plus 完全一致（同一 share core）。
- 增加了 `customClass` prop：uni-app 端自訂類名無法穿透 `styleIsolation`，統一走 prop 透傳。
- 鍵入提交時機見「平台差異」第一條（草稿模型，等價 plus 的 change 語義）。
:::
