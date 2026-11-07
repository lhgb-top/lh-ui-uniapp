# ColorPicker 顏色選擇器

點擊觸發器彈出調色面板：飽和度 / 明度板拖曳 + 色相 / 透明度滑桿 + hex / rgb
輸入 + 預設色板。顏色換算全部來自 `@lh-ui/share/core/color-picker` 純函式
（hex/rgb 與 HSV 雙空間往返，通道全程鉗制），H5 與微信小程式渲染一致。

## 基礎用法

```vue
<template>
  <lh-color-picker v-model="color" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const color = ref('#2B4C7C')
</script>
```

## 透明度與預設色板

```vue
<template>
  <lh-color-picker
    v-model="color"
    show-alpha
    :predefine="predefine"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const color = ref('rgba(43, 76, 124, 0.6)')
// 開啟 showAlpha 後 hex 輸出 8 位（#2b4c7c99）、rgb 輸出 rgba()——alpha 有值永不靜默遺失
const predefine = ['#2B4C7C', '#5B8C5A', '#C4A35A', '#B23A3A']
</script>
```

## 輸出格式

```vue
<lh-color-picker v-model="color" format="rgb" />
```

`format` 只影響 `v-model` 的輸出形態（`hex` 或 `rgb`），非法值回退 `hex`。

## 尺寸 / 清除 / 停用

```vue
<lh-color-picker v-model="color" size="small" />
<lh-color-picker v-model="color" clearable />
<lh-color-picker v-model="color" disabled />
```

`clearable` 開啟後，已有值時觸發器內出現清除按鈕，點擊置空並拋出 `clear` 事件。

## 命令式開合

```vue
<template>
  <lh-color-picker ref="pickerRef" v-model="color" />
  <lh-button size="small" @click="pickerRef?.open()">開啟面板</lh-button>
</template>
```

元件透過 ref 暴露 `open` / `close` / `isOpen`。

## ColorPicker API

### Props

| 屬性 | 說明 | 型別 | 預設值 |
| --- | --- | --- | --- |
| model-value | 綁定值（受控 v-model，hex 或 rgb() 字串，按 format 輸出） | string | `''` |
| format | 輸出格式（非法值回退 hex） | `'hex' \| 'rgb'` | `hex` |
| show-alpha | 透明度通道（開啟後輸出 8 位 hex / rgba()） | boolean | `false` |
| predefine | 預設色板 | string[] | `[]` |
| size | 尺寸 | `'mini' \| 'small' \| 'medium' \| 'large' \| 'x-large'` | `medium` |
| disabled | 停用 | boolean | `false` |
| clearable | 清除（置空）按鈕 | boolean | `false` |
| placeholder | 佔位提示（空值時；未傳取語言包 colorPicker.placeholder） | string | `''` |
| aria-label | 無障礙名稱（未傳取語言包 colorPicker.label） | string | — |
| custom-class | 自訂類名（透傳根節點） | string | — |
| sx | sx 快速佈局屬性 | LhSxProps | — |

### Events

| 事件 | 說明 | 參數 |
| --- | --- | --- |
| update:model-value | 顏色變化（v-model） | `(value: string)` |
| change | 顏色確認變化（與 update:model-value 同載荷） | `(value: string)` |
| clear | 點擊清除按鈕 | — |

### Expose

| 方法 | 說明 |
| --- | --- |
| open | 開啟面板 |
| close | 關閉面板 |
| isOpen | 面板是否展開（ref） |

### 無障礙

- 觸發器 `role="button"` + `aria-expanded` + `aria-label`（語言包 colorPicker.label）。
- 色相 / 透明度滑桿 `role="slider"` + `aria-valuenow/min/max`，方向鍵微調（Shift 加速）。
- 預設色板每格可點擊，無障礙名稱即色值字串。

::: tip 平台差異（與 Vue3 版的差異）
- 拖曳軸：MP 沿觸控目標派發 touchmove / touchend（無需 document 監聽），H5 另走
  document 級滑鼠監聽（移出元件可繼續拖曳），做法與 Slider 一致。
- 面板內 hex / rgb 輸入用 uni `<input>`：按 Enter 提交走 `@confirm`（鍵盤「完成」），
  失焦提交走 `@blur`（MP 無 keydown.enter）。
- 鍵盤互動（方向鍵微調、Enter / Space 開合、Esc 關閉）僅 H5 生效，MP 端無鍵盤事件。
- 面板定位走 root-portal + 兩幀度量（measure → 定位 → 顯示，防閃爍）。
:::
