# Input 输入框

## 基础用法

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

## 占位样式（MP 必需）

::: warning 小程序不支持 `::placeholder`
微信小程序的 WXSS 不支持 `::placeholder` 伪元素。占位样式请通过 prop 传入，
**不要**在 CSS 里写 `::placeholder`（构建期门禁也会拦）。
:::

```vue
<lh-input placeholder="请输入" placeholder-style="color: #999; font-size: 13px" />
<!-- 或用类名 -->
<lh-input placeholder="请输入" placeholder-class="my-placeholder" />
```

## 带图标与状态

```vue
<template>
  <lh-input v-model="text" prefix-icon="search" placeholder="搜索" clearable />
  <lh-input v-model="text" suffix-icon="close" placeholder="后缀图标" />
  <lh-input v-model="text" state="error" placeholder="校验失败状态" />
  <lh-input v-model="text" :maxlength="20" show-word-limit placeholder="字数统计" />
</template>
```

## Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue (v-model) | 绑定值 | `string` | — |
| type | 类型 | `'text' \| 'textarea' \| 'password' \| 'number' \| 'email' \| 'url' \| 'tel' \| 'date' \| 'time'` | `'text'` |
| size | 尺寸 | `'small' \| 'medium' \| 'large'` | — |
| disabled | 禁用 | `boolean` | `false` |
| readonly | 只读 | `boolean` | `false` |
| placeholder | 占位文本 | `string` | — |
| placeholderStyle | 占位内联样式（替代 `::placeholder`） | `string` | — |
| placeholderClass | 占位类名（与 placeholderStyle 二选一） | `string` | — |
| maxlength | 最大长度 | `number` | — |
| minlength | 最小长度 | `number` | — |
| showWordLimit | 显示字数统计 | `boolean` | `false` |
| clearable | 可清空 | `boolean` | `false` |
| prefixIcon | 前缀图标 | `LhIconName` | — |
| suffixIcon | 后缀图标 | `LhIconName` | — |
| state | 校验状态 | `'error' \| 'success' \| 'warning'` | — |
| name | 原生 name（供表单收集） | `string` | — |
| password | 密码模式 | `boolean` | `false` |
| rows | textarea 行数 | `number` | — |
| autosize | textarea 自适应高度（MP 的 auto-height） | `boolean` | `false` |
| label | 标签文案 | `string` | — |
| customClass | 自定义类名 | `string` | — |
| themeVars | 组件级主题变量 | `Record<string, string>` | — |
| sx | 快速布局属性 | `LhSxProps` | — |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 值变化 | `(value: string)` |
| input | 输入（取 `event.detail.value`） | `(value: string)` |
| blur | 失焦 | — |
| focus | 聚焦 | — |
| clear | 清空 | — |

::: tip 与 Vue3 版的差异
`autocomplete` / `autofocus` / `resize` / `form` / `tabindex` / `nativeType` /
`inputStyle` 在小程序无对应能力，本库**不实现**。`autosize` 走小程序 textarea
的 `auto-height` 属性。
:::
