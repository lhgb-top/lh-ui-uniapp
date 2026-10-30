# Радиокнопка

::: tip На платформе Mini Program рисуется во view
Нативный компонент radio не используется (стили в MP не контролируются); вместо этого галочка рисуется во view.
:::

## Базовое использование

```vue
<template>
  <lh-radio-group v-model="value">
    <lh-radio value="a" label="Вариант 1" />
    <lh-radio value="b" label="Вариант 2" />
    <lh-radio value="c" label="Вариант 3" disabled />
  </lh-radio-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref('a')
</script>
```

## Radio Props

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| modelValue (v-model) | Отмечен ли | `unknown` | — |
| value | Значение этого пункта | `unknown` | — |
| label | Текст | `string` | — |
| disabled | Отключено | `boolean` | `false` |
| name | Нативное name | `string` | — |
| size | Размер | `'small' \| 'medium' \| 'large'` | — |
| customClass | Пользовательский класс | `string` | — |
| sx | Быстрые свойства раскладки | `LhSxProps` | — |

## RadioGroup Props

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| modelValue (v-model) | Выбранное значение | `unknown` | — |
| disabled | Отключить все дочерние элементы | `boolean` | `false` |
| name | Нативное name | `string` | — |
| size | Размер (пробрасывается дочерним элементам) | `'small' \| 'medium' \| 'large'` | — |

## Events

| Событие | Описание | Параметр колбэка |
| --- | --- | --- |
| update:modelValue | Изменение значения | `(value)` |
| change | Изменение значения | `(value)` |
