# ConfigProvider

Global configuration component that provides size, locale, theme mode, and theme variables to descendant components.

::: tip Dark mode implementation on the Mini Program
On the web builds (plus), switching to dark mode operates on `document.documentElement`; the Mini Program has no document. Dark mode in this library is implemented by **adding a `dark` class to the wrapping node** — in the sanitized styles the dark block selectors are `page.dark, .dark`, so the dark scope follows the scope wrapped by ConfigProvider.
:::

## Basic usage

```vue
<template>
  <lh-config-provider :size="size" :locale="locale" :theme="theme" :theme-vars="themeVars">
    <view class="app">
      <lh-button type="primary">Button</lh-button>
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

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| size | Global size | `'small' \| 'medium' \| 'large'` | — |
| locale | Global locale | `'zh-CN' \| 'en-US'` | — |
| theme | Theme mode (new on the uni-app target) | `'light' \| 'dark'` | `'light'` |
| themeVars | Global theme variables (the keys get the `--lh-` prefix automatically) | `Record<string, string>` | — |
| componentTheme | Per-component theme variables, overriding the global themeVars | `Partial<Record<LhThemeableComponent, Record<string, string>>>` | — |

### Keys supported by themeVars

- Theme colors: `primary-color` / `success-color` / `warning-color` / `danger-color` / `info-color`
- Chinese style colors: `gold-color` / `vermilion-color` / `jade-color`
- Neutral colors: `bg-color` / `text-color` / `border-color`
- Patterns: `bg-pattern` (such as `var(--lh-pattern-willow)`) / `bg-pattern-opacity` / `bg-pattern-color`
- Decoration: `decoration-color`

### Precedence

The component's own props > `componentTheme[component name]` > the global `themeVars`.
