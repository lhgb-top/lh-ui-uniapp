# Slider 滑桿

滑桿元件：在軌道上拖動觸點選擇數值，支援單滑桿與範圍（雙滑桿）兩種模式、`step` 步長吸附與 `marks` 刻度標記。軌道、觸點與填充條全部以 `view` 自繪，數值的鉗制 / 步長吸附 / 刻度排序 / 無障礙契約全部走 `@lh-ui/share` core 純函式，零拷貝。

## 基礎用法

```vue
<template>
  <lh-slider v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref(30)
</script>
```

未傳 `modelValue` 時元件內部以 `min` 初始化；傳入即受控（與全部表單類元件一致）。拖動過程中只更新內部狀態，**放開時才一次性發出 `update:modelValue` / `change`**（與 Vue3 版一致）。

## 範圍選擇

`range` 開啟雙滑桿模式，`modelValue` 為二元組 `[起始, 結束]`：

```vue
<template>
  <lh-slider v-model="span" range />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const span = ref<[number, number]>([20, 60])
</script>
```

拖動一端越過另一端時兩端自動交換（拖動的永遠是手指下方的那個滑桿），值始終保持 `[早, 晚]`。

## 步長與刻度

`step` 讓觸點吸附到步長網格；`marks` 以「數值 → 文案」的映射呈現刻度標記（按數值排序）：

```vue
<template>
  <lh-slider v-model="value" :min="0" :max="100" :step="10" :marks="marks" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref(30)
const marks: Record<number, string> = {
  0: '0',
  50: '半程',
  100: '滿',
}
</script>
```

## 停用

`disabled` 停用拖動與鍵盤步進，觸點移出 Tab 序列：

```vue
<template>
  <lh-slider v-model="value" disabled />
</template>
```

## 顯示數值

`show-input` 在軌道右側回顯目前數值（範圍模式為 `[起始, 結束]` 文字）：

```vue
<template>
  <lh-slider v-model="value" show-input />
</template>
```

## Slider API

### Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| modelValue | 目前值（受控 v-model；範圍模式傳二元組） | `number \| [number, number]` | — |
| min | 最小值 | `number` | `0` |
| max | 最大值 | `number` | `100` |
| step | 步長（觸點吸附的最小單位） | `number` | `1` |
| disabled | 整體停用 | `boolean` | `false` |
| range | 是否為範圍模式（雙滑桿） | `boolean` | `false` |
| showInput | 是否在軌道右側顯示目前數值 | `boolean` | `false` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| marks | 刻度標記（鍵為數值、值為文案，按數值排序） | `Record<number, string>` | — |
| customClass | 自訂類名（透傳到根節點） | `string` | — |
| sx | sx 快速佈局屬性（作用於根節點） | `LhSxProps` | — |

### Events

| 事件 | 說明 | 參數 |
| --- | --- | --- |
| update:modelValue | 值變化（v-model；拖動放開或鍵盤步進時觸發） | `(value: number \| [number, number])` |
| change | 值變化（與 update:modelValue 同載荷） | `(value: number \| [number, number])` |

### 無障礙

- 觸點為 `role="slider"`，帶 `aria-valuemin` / `aria-valuemax` / `aria-valuenow` / `aria-valuetext`（契約由 share 的 `getSliderThumbAria` 決定）
- 範圍模式下兩個觸點的 `aria-label` 區分「起始滑桿 / 結束滑桿」（語言包 `slider.thumbStart` / `slider.thumbEnd`，非範圍模式為 `slider.thumb`）
- 鍵盤步進（方向鍵按 `step` 增減、PageUp / PageDown 大步進、Home / End 直達極值）僅 H5 生效，見下方平台差異

::: tip 平台差異（與 Vue3 版的差異）
- **拖動載體**：plus 在觸點上掛 `mousedown` / `touchstart` 後把 move / up 監聽接到 `document`；小程式沒有 document，拖動改為 `touchstart` / `touchmove` / `touchend` 直接掛在觸點上（小程式的 touch 事件沿 touchstart 的目標節點派發，不依賴全域監聽）。H5 保留 document 級滑鼠監聽（mousedown 落點後滑鼠移出元件也能繼續拖），由條件編譯守衛，MP 包內無死程式碼。
- **位移計算是非同步的**：plus 用同步 `getBoundingClientRect` 測量軌道矩形；小程式只有非同步的 `createSelectorQuery`，本元件改走介面層 `getSingleLhRect`。測量結果依拖曳階段快取（touchstart 時預熱），正常拖曳幾乎無感；但語意上位移更新比觸碰晚一幀——**不要在 move 事件裡同步假定值已更新**，提交只在放開時發生。
- **軌道寬度為 0 時跳過**：版面尚未完成（或測試環境）時軌道矩形寬度為 0，位移換算會 0 除產生 NaN，此時跳過本次更新，不汙染值。
- **鍵盤步進僅 H5**：方向鍵 / Home / End / PageUp / PageDown 的步進在 MP 端無鍵盤事件，由條件編譯守衛直接不呼叫，MP 包內無死程式碼。
- **aria 屬性逐項顯式綁定**：plus 模板裡 share 的 `LhAriaAttrs` 屬性包不能 `v-bind` 落圖（MP 模板編譯器不支援），改由膠水層把 `aria-*` 鍵攤成具體值逐項綁定，契約仍由 share 純函式決定。
- **不提供 vertical 直向與 tooltip 氣泡**：plus 真源沒有 `vertical`（直向軌道）與 tooltip 提示氣泡屬性，本倉嚴格對齊、不私自新增。需要直向時可用外層容器旋轉包裹（自行處理觸控座標），需要數值提示時用 `show-input` 常顯目前值。
:::
