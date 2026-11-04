# Rate 評分

星級評分：點擊選星、可選半星與分數文字，唯讀態輸出星級文字供螢幕閱讀器朗讀。填充檔位、鉗制與步進演算法由 `@lh-ui/share` core 純函式產出。

## 基礎用法

```vue
<template>
  <lh-rate v-model="value" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const value = ref(3)
</script>
```

## 半星

`allow-half` 開啟半星：H5 端點選星星左半區記 0.5（依點擊的橫向偏移判定）。

```vue
<template>
  <lh-rate v-model="value" allow-half />
</template>
```

## 唯讀與分數文字

`readonly` 進入純展示分支（`role="img"`，星級文字走 `aria-label`）；`show-score` 追加分數文字，`score-template` 自訂模板（`{n}` 佔位）。

```vue
<template>
  <lh-rate :model-value="3.5" readonly allow-half show-score />
  <lh-rate :model-value="4" readonly show-score score-template="{n} 分" />
</template>
```

## 自訂星數與字元

`max` 調整星數上限（鉗制按 [0, max]）；`character` 取代預設字元 `★`。

```vue
<template>
  <lh-rate :model-value="5" :max="8" character="墨" />
</template>
```

## 停用

`disabled` 整組停用：點擊不生效，根節點追加 `lh-rate--disabled` 與 `aria-disabled`。

## Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| modelValue / v-model | 目前評分 | `number` | `0` |
| max | 星數上限 | `number` | `5` |
| allow-half | 允許半星 | `boolean` | `false` |
| readonly | 唯讀（純展示） | `boolean` | `false` |
| disabled | 停用 | `boolean` | `false` |
| character | 自訂字元 | `string` | — |
| show-score | 顯示分數文字 | `boolean` | `false` |
| score-template | 分數模板（`{n}` 佔位） | `string` | — |
| customClass | 自訂類別（透傳到根節點） | `string` | — |
| sx | sx 快速佈局屬性 | `LhSxProps` | — |

## Events

| 事件 | 說明 | 回調參數 |
| --- | --- | --- |
| update:modelValue / change | 評分變化（同一值不重複發出） | `(value: number)` |

## 平台差異

- **半星命中僅 H5**：半星判定依據點擊事件的橫向偏移（`offsetX`），**小程式事件無該欄位**，點擊退化為整星；如小程式端需要半星精度，可自行基於 touch 事件 + `uni.createSelectorQuery` 的非同步位移計算封裝（注意 SelectorQuery 是非同步的）。
- **星星載體**：plus 的 `<button>` 星星換成 `<view role="radio">`（MP 的 button 無法 reset 預設樣式），停用由點擊守衛 + `--disabled` 修飾類別 + `aria-disabled` 表達。
- **鍵盤步進僅 H5**：方向鍵 ±1（半星模式 ±0.5）、Home 清零、End 打滿；小程式無鍵盤事件，不產生行為差異。
- **分數文字**：走 share locales 的 `rate.stars`（`{n} 星`，九語言齊備），`score-template` 可覆蓋。

::: tip 與 Vue3 版的差異
- 邏輯口徑（鉗制、填充檔位、步進、aria）與 plus 完全一致（同一 share core）。
- 增加了 `customClass` prop：uni-app 端自訂類別無法穿透 `styleIsolation`，統一走 prop 透傳。
- 半星命中在小程式端退化整星（見「平台差異」）。
:::
