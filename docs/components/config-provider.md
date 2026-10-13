# ConfigProvider 全局配置

全局配置组件，为子孙组件提供尺寸、语言、主题模式与主题变量。

::: tip 小程序端的暗色实现
web 端（plus）切换暗色是操作 `document.documentElement`，小程序没有 document。
本库的暗色通过**给包裹节点加 `dark` 类**实现——净化后的样式里暗色块选择器是
`page.dark, .dark`，所以暗色作用域跟着 ConfigProvider 的包裹范围走。
:::

## 基础用法

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 全局尺寸 | `'small' \| 'medium' \| 'large'` | — |
| locale | 全局语言 | `'zh-CN' \| 'en-US'` | — |
| theme | 主题模式（uni-app 端新增） | `'light' \| 'dark'` | `'light'` |
| themeVars | 全局主题变量（键名自动加 `--lh-` 前缀） | `Record<string, string>` | — |
| componentTheme | 按组件单独配置主题变量，覆盖全局 themeVars | `Partial<Record<LhThemeableComponent, Record<string, string>>>` | — |

### themeVars 支持的键

- 主题色：`primary-color` / `success-color` / `warning-color` / `danger-color` / `info-color`
- 国风色：`gold-color` / `vermilion-color` / `jade-color`
- 中性色：`bg-color` / `text-color` / `border-color`
- 花纹：`bg-pattern`（如 `var(--lh-pattern-willow)`）/ `bg-pattern-opacity` / `bg-pattern-color`
- 装饰：`decoration-color`

### 优先级

组件自身 props > `componentTheme[组件名]` > 全局 `themeVars`。
