# Select 選擇器

## 基礎用法

```vue
<template>
  <lh-select v-model="value" :options="options" placeholder="请选择" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref()
const options = [
  { label: '选项一', value: 'a' },
  { label: '选项二', value: 'b' },
  { label: '禁用项', value: 'c', disabled: true },
]
</script>
```

## 可清空 / 可過濾

```vue
<template>
  <lh-select v-model="value" :options="options" clearable />
  <lh-select v-model="value" :options="options" filterable placement="bottom" />
</template>
```

## Props

| 屬性 | 說明 | 類型 | 預設值 |
| --- | --- | --- | --- |
| modelValue (v-model) | 綁定值 | `unknown` | — |
| options | 選項列表 | `LhSelectOption[]` | — |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | — |
| disabled | 停用 | `boolean` | `false` |
| clearable | 可清空 | `boolean` | `false` |
| placeholder | 佔位文字 | `string` | — |
| filterable | 可過濾（MP 端在彈層內提供輸入框） | `boolean` | `false` |
| placement | 彈層位置（12 種方位） | `LhPlacement` | `'bottom'` |
| customClass | 自訂類別名 | `string` | — |
| themeVars | 元件級主題變數 | `Record<string, string>` | — |
| sx | 快速版面配置屬性 | `LhSxProps` | — |

### LhSelectOption

| 屬性 | 說明 | 類型 |
| --- | --- | --- |
| label | 顯示文案 | `string` |
| value | 值 | `unknown` |
| disabled | 停用 | `boolean` |

## Events

| 事件 | 說明 | 回呼參數 |
| --- | --- | --- |
| update:modelValue | 值變化 | `(value)` |
| change | 值變化（含清空時 `undefined`） | `(value)` |
| visible-change | 彈層顯隱 | `(visible: boolean)` |

::: tip 與 Vue3 版的差異
- 彈層走 `root-portal` + 兩幀非同步度量定位（不是 absolute 定位）。
- **鍵盤導覽（↑↓ / Home / End）僅 H5**，小程序無鍵盤事件，編譯期移除——MP 端只能點選選項。
- `filterable` 的過濾輸入框在 MP 端渲染在彈層內部。
:::
