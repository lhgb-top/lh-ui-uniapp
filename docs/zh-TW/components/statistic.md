# Statistic 統計數值

展示統計數值，支援精度、千分位分隔、前綴後綴與超大數字串。

## 基礎用法

```vue
<template>
  <lh-statistic
    title="年造訪量"
    :value="2384712"
  />
</template>
```

## 精度與分隔符

`precision` 控制小數位（四捨五入），`separator` 控制千分位分隔（傳空字串關閉分組）。

```vue
<template>
  <lh-statistic
    title="評分"
    :value="4.8471"
    :precision="2"
  />
  <lh-statistic
    title="編號"
    :value="8899001"
    separator=""
  />
</template>
```

## 前綴與後綴

```vue
<template>
  <lh-statistic
    title="成交額"
    :value="128600"
    prefix="¥"
    suffix="元"
  />
  <lh-statistic
    title="成長率"
    :value="12.6"
    :precision="1"
    suffix="%"
  />
</template>
```

## 超大數與非數值文字

`value` 傳入字串時可承載超大數：超出 `Number.MAX_SAFE_INTEGER` 的整數字串走字串格式化路徑，全程不經 Number 轉換、不丟精度；無法解析為數值的字串按原文展示。

```vue
<template>
  <lh-statistic
    title="星辰"
    value="不可計數"
  />
  <lh-statistic
    title="星際距離"
    value="9007199254740993"
  />
</template>
```

## 插槽

`title` / `prefix` / `suffix` 三個插槽分別覆寫同名 props 文字。

```vue
<template>
  <lh-statistic :value="1024">
    <template #title>
      <text>自訂標題</text>
    </template>
    <template #prefix>
      <text>¥</text>
    </template>
    <template #suffix>
      <text>元</text>
    </template>
  </lh-statistic>
</template>
```

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| title | 數值標題（展示在數值上方） | `string` | — |
| value | 統計數值；字串形式可承載超大數或帶符號文字 | `string \| number` | `0` |
| precision | 小數精度 | `number` | `0` |
| separator | 千分位分隔符；空字串關閉分組 | `string` | `','` |
| prefix | 數值前綴，如貨幣符號 | `string` | — |
| suffix | 數值後綴，如單位 | `string` | — |
| customClass | 自訂類別名 | `string` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

## Slots

| 插槽 | 說明 |
| --- | --- |
| title | 自訂標題 |
| prefix | 自訂前綴 |
| suffix | 自訂後綴 |

## 平台差異

- 純展示組件，不觸及任何平台 API，H5 與微信小程序表現完全一致。
- 格式化邏輯（精度、千分位分隔、超大數字串路徑）全部由 `@lh-ui/share` 的 `formatStatisticValue` 純函式產出，本倉只寫響應式膠水，不複製 core 實作。
- 數值區帶 `aria-live="polite"`：H5 下 `value` 變化時螢幕閱讀器溫和播報新值；小程序讀屏支援以平台能力為準。
- 本組件不含數字滾動動畫（count-up）。若後續引入：小程序端 `setInterval` / `requestAnimationFrame` 均可用，但 `transitionend` 在小程序不可靠，動畫收尾須用 `setTimeout` 對齊時長（與 message / loading 的進出動畫同款處理）。
