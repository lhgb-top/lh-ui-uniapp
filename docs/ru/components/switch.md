# Переключатель

::: tip На платформе Mini Program рисуется во view
Стили нативного компонента switch в Mini Program не контролируются, поэтому ползунок рисуется во view — это гарантирует визуальное единство.
:::

## Базовое использование

```vue
<template>
  <lh-switch v-model="on" />
  <lh-switch v-model="on" active-text="Вкл" inactive-text="Выкл" />
  <lh-switch v-model="on" loading />
  <lh-switch v-model="on" disabled />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const on = ref(true)
</script>
```

## Props

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| modelValue (v-model) | Включён ли | `boolean` | `false` |
| disabled | Отключено | `boolean` | `false` |
| loading | Состояние загрузки | `boolean` | `false` |
| name | Нативное name | `string` | — |
| size | Размер | `'small' \| 'medium' \| 'large'` | — |
| activeText | Текст включённого состояния | `string` | — |
| inactiveText | Текст выключенного состояния | `string` | — |
| customClass | Пользовательский класс | `string` | — |
| sx | Быстрые свойства раскладки | `LhSxProps` | — |

## Events

| Событие | Описание | Параметр колбэка |
| --- | --- | --- |
| update:modelValue | Изменение значения | `(value: boolean)` |
| change | Изменение значения | `(value: boolean)` |
