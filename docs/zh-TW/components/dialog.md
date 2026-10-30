# Dialog 對話框

## 基礎用法

```vue
<template>
  <lh-button @click="visible = true">打开对话框</lh-button>

  <lh-dialog v-model="visible" title="标题" width="80%">
    <view>这是对话框内容</view>
    <template #footer>
      <lh-button @click="visible = false">取消</lh-button>
      <lh-button type="primary" @click="visible = false">确定</lh-button>
    </template>
  </lh-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
</script>
```

## 定位

```vue
<template>
  <lh-dialog v-model="visible" position="bottom" title="底部弹层">
    <view>底部内容</view>
  </lh-dialog>

  <lh-dialog v-model="visible" fullscreen title="全屏">
    <view>全屏内容</view>
  </lh-dialog>
</template>
```

底部彈層會自動帶 `env(safe-area-inset-bottom)` 適配全螢幕。

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| modelValue (v-model) | 是否顯示 | `boolean` | `false` |
| title | 標題 | `string` | — |
| width | 寬度 | `string \| number` | — |
| top | 頂部距離 | `string \| number` | — |
| fullscreen | 全螢幕 | `boolean` | `false` |
| position | 定位 | `'center' \| 'top' \| 'bottom'` | `'center'` |
| closeOnClickModal | 點選遮罩關閉 | `boolean` | `true` |
| closeOnPressEscape | Esc 關閉（**MP 無鍵盤事件，無效**） | `boolean` | `true` |
| lockScroll | 鎖定背景捲動（**僅 H5 有效**） | `boolean` | `true` |
| zIndex | 層級；不傳時自增分配 | `number` | — |
| customClass | 自訂類別名 | `string` | — |
| themeVars | 元件級主題變數 | `Record<string, string>` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

## Slots

| 插槽 | 說明 |
| --- | --- |
| default | 內容 |
| footer | 底部按鈕區 |

## Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| update:modelValue | 顯隱變化 | `(visible: boolean)` |
| open | 開啟 | — |
| close | 關閉 | — |

::: tip 與 Vue3 版的差異
- 彈層掛載走 `root-portal`（H5 是 teleport，MP 是 root-portal 或頁內 fixed 降級）。
- **focus-trap 在 MP 端不可用**：由 `LH_IS_H5` 編譯期守護直接傳回 false，不呼叫 focus-trap。
- **lockScroll 在 MP 端無效**：小程序無 body 捲動鎖定，由遮罩攔截點選兜底。
- `closeOnPressEscape` 在 MP 端無效（無鍵盤事件）。
:::
