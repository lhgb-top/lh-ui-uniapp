# ConfigProvider (глобальная настройка)

Компонент глобальной конфигурации: предоставляет дочерним компонентам размер, язык, режим темы и переменные темы.

::: tip Реализация тёмной темы на платформе Mini Program
На web-стороне (plus) переключение тёмной темы — это манипуляция с `document.documentElement`, а в Mini Program нет document.
Тёмная тема здесь реализована **через добавление класса `dark` на оборачивающий узел** — в санитизированных стилях тёмный блок селекторов
выглядит как `page.dark, .dark`, поэтому область действия тёмной темы следует за границами обёртки ConfigProvider.
:::

## Базовое использование

```vue
<template>
  <lh-config-provider :size="size" :locale="locale" :theme="theme" :theme-vars="themeVars">
    <view class="app">
      <lh-button type="primary">Кнопка</lh-button>
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

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| size | Глобальный размер | `'small' \| 'medium' \| 'large'` | — |
| locale | Глобальный язык | `'zh-CN' \| 'en-US'` | — |
| theme | Режим темы (добавлено для платформы uni-app) | `'light' \| 'dark'` | `'light'` |
| themeVars | Глобальные переменные темы (ключам автоматически добавляется префикс `--lh-`) | `Record<string, string>` | — |
| componentTheme | Переменные темы по отдельным компонентам, переопределяют глобальные themeVars | `Partial<Record<LhThemeableComponent, Record<string, string>>>` | — |

### Ключи, поддерживаемые themeVars

- Основные цвета: `primary-color` / `success-color` / `warning-color` / `danger-color` / `info-color`
- Цвета в китайском стиле (国风): `gold-color` / `vermilion-color` / `jade-color`
- Нейтральные цвета: `bg-color` / `text-color` / `border-color`
- Узор: `bg-pattern` (например `var(--lh-pattern-willow)`) / `bg-pattern-opacity` / `bg-pattern-color`
- Декор: `decoration-color`

### Приоритет

Собственные props компонента > `componentTheme[имя компонента]` > глобальные `themeVars`.
