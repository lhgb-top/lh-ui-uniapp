# ConfigProvider 全域配置

全域配置元件，為子孫元件提供尺寸、語言、主題模式與主題變數。

::: tip 小程序端的暗色實作
web 端（plus）切換暗色是操作 `document.documentElement`，小程序沒有 document。
本庫的暗色透過**給包裹節點加 `dark` 類別**實作——淨化後的樣式裡暗色區塊選擇器是
`page.dark, .dark`，所以暗色作用域跟著 ConfigProvider 的包裹範圍走。
:::

## 基礎用法

```vue
<template>
  <lh-config-provider :size="size" :locale="locale" :theme="theme" :theme-vars="themeVars">
    <view class="app">
      <lh-button type="primary">按钮</lh-button>
    </view>
  </lh-config-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const size = ref<'small' | 'medium' | 'large'>('medium')
const locale = ref<'zh-CN' | 'en-US'>('zh-CN')
const theme = ref<'light' | 'dark'>('light')
const themeVars = ref({
  'primary-color': '#1677ff',
  'bg-pattern': 'var(--lh-pattern-willow)',
})
</script>
```

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| size | 全域尺寸 | `'small' \| 'medium' \| 'large'` | — |
| locale | 全域語言 | `'zh-CN' \| 'en-US'` | — |
| theme | 主題模式（uni-app 端新增） | `'light' \| 'dark'` | `'light'` |
| themeVars | 全域主題變數（鍵名自動加 `--lh-` 前綴） | `Record<string, string>` | — |
| componentTheme | 按元件單獨設定主題變數，覆蓋全域 themeVars | `Partial<Record<LhThemeableComponent, Record<string, string>>>` | — |

### themeVars 支援的鍵

- 主題色：`primary-color` / `success-color` / `warning-color` / `danger-color` / `info-color`
- 國風色：`gold-color` / `vermilion-color` / `jade-color`
- 中性色：`bg-color` / `text-color` / `border-color`
- 花紋：`bg-pattern`（如 `var(--lh-pattern-willow)`）/ `bg-pattern-opacity` / `bg-pattern-color`
- 裝飾：`decoration-color`

### 優先級

元件自身 props > `componentTheme[元件名]` > 全域 `themeVars`。
