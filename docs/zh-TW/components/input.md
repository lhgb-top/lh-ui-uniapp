# Input 輸入框

## 基礎用法

```vue
<template>
  <lh-input v-model="text" placeholder="请输入" />
  <lh-input v-model="text" type="textarea" :rows="3" autosize placeholder="多行" />
  <lh-input v-model="text" type="password" placeholder="密码" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
```

## 佔位樣式（MP 必需）

::: warning 小程序不支援 `::placeholder`
微信小程序的 WXSS 不支援 `::placeholder` 偽元素。佔位樣式請透過 prop 傳入，
**不要**在 CSS 裡寫 `::placeholder`（構建期門禁也會攔）。
:::

```vue
<lh-input placeholder="请输入" placeholder-style="color: #999; font-size: 13px" />
<!-- 或用類別名 -->
<lh-input placeholder="请输入" placeholder-class="my-placeholder" />
```

## 帶圖示與狀態

```vue
<template>
  <lh-input v-model="text" prefix-icon="search" placeholder="搜索" clearable />
  <lh-input v-model="text" suffix-icon="close" placeholder="后缀图标" />
  <lh-input v-model="text" state="error" placeholder="校验失败状态" />
  <lh-input v-model="text" :maxlength="20" show-word-limit placeholder="字数统计" />
</template>
```

## 標籤位置

`label` 現已真正渲染（此前 prop 宣告未接線）。預設 `float` 浮動標籤——聚焦或有值時浮到左上缺口；
`labelPosition` 可切換為靜態位置 `top` / `bottom` / `left` / `right`：

```vue
<template>
  <!-- 預設：浮動標籤（聚焦/有值浮到左上缺口） -->
  <lh-input v-model="text" label="用户名" />
  <!-- 上方 -->
  <lh-input v-model="text" label="用户名" label-position="top" />
  <!-- 下方 -->
  <lh-input v-model="text" label="用户名" label-position="bottom" />
  <!-- 左側定寬（labelWidth 僅 left / right 生效） -->
  <lh-input v-model="text" label="用户名" label-position="left" :label-width="80" />
  <!-- 右側 -->
  <lh-input v-model="text" label="用户名" label-position="right" />
</template>
```

::: warning 【uni-app 差異】
- `float` 的 size 檔位垂直微調依賴 `:has` 選擇器（WXSS 不支援），小程式端僅 `medium` 檔精確、
  其餘檔位 label 垂直位置略偏；靜態位置（`top` / `left` / `right` / `bottom`）全端可用。
- `textarea` + `float` 的浮起位置已由內聯樣式兜底，全端可用。
:::

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| modelValue (v-model) | 綁定值 | `string` | — |
| type | 類型 | `'text' \| 'textarea' \| 'password' \| 'number' \| 'email' \| 'url' \| 'tel' \| 'date' \| 'time'` | `'text'` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | — |
| disabled | 停用 | `boolean` | `false` |
| readonly | 唯讀 | `boolean` | `false` |
| placeholder | 佔位文字 | `string` | — |
| placeholderStyle | 佔位內聯樣式（替代 `::placeholder`） | `string` | — |
| placeholderClass | 佔位類別名（與 placeholderStyle 二選一） | `string` | — |
| maxlength | 最大長度 | `number` | — |
| minlength | 最小長度 | `number` | — |
| showWordLimit | 顯示字數統計 | `boolean` | `false` |
| clearable | 可清空 | `boolean` | `false` |
| prefixIcon | 前綴圖示 | `LhIconName` | — |
| suffixIcon | 後綴圖示 | `LhIconName` | — |
| state | 驗證狀態 | `'error' \| 'success' \| 'warning'` | — |
| name | 原生 name（供表單收集） | `string` | — |
| password | 密碼模式 | `boolean` | `false` |
| rows | textarea 行數 | `number` | — |
| autosize | textarea 自適應高度（MP 的 auto-height） | `boolean` | `false` |
| label | 浮動標籤（預設）；配合 labelPosition 可切換位置 | `string` | — |
| labelPosition | 標籤位置 | `'float' \| 'top' \| 'left' \| 'right' \| 'bottom'` | `'float'` |
| labelWidth | 標籤定寬（僅 left / right 生效；數字按 px，字串原樣） | `string \| number` | — |
| customClass | 自訂類別名 | `string` | — |
| themeVars | 元件級主題變數 | `Record<string, string>` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

## Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| update:modelValue | 值變化 | `(value: string)` |
| input | 輸入（取 `event.detail.value`） | `(value: string)` |
| blur | 失焦 | — |
| focus | 聚焦 | — |
| clear | 清空 | — |

::: tip 與 Vue3 版的差異
`autocomplete` / `autofocus` / `resize` / `form` / `tabindex` / `nativeType` /
`inputStyle` 在小程序無對應能力，本庫**不實作**。`autosize` 走小程序 textarea
的 `auto-height` 屬性。
:::
