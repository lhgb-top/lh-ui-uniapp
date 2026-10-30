# Флажок

::: tip На платформе Mini Program рисуется во view
Нативный компонент checkbox не используется (стили в MP не контролируются); вместо этого галочка рисуется во view + иконка lh-icon,
что гарантирует визуальное единство с другими платформами семейства.
:::

## Базовое использование

```vue
<template>
  <lh-checkbox v-model="checked" label="Согласен с условиями" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const checked = ref(false)
</script>
```

## Группа флажков

```vue
<template>
  <lh-checkbox-group v-model="values">
    <lh-checkbox value="a" label="Вариант 1" />
    <lh-checkbox value="b" label="Вариант 2" />
    <lh-checkbox value="c" label="Вариант 3" disabled />
  </lh-checkbox-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const values = ref(['a'])
</script>
```

## Неопределённое состояние

```vue
<lh-checkbox v-model="checked" indeterminate label="Выбрать все (часть выбрана)" />
```

## Checkbox Props

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| modelValue (v-model) | Отмечен ли | `boolean` | `false` |
| value | Значение-идентификатор в группе | `unknown` | — |
| label | Текст | `string` | — |
| disabled | Отключено | `boolean` | `false` |
| indeterminate | Неопределённое состояние | `boolean` | `false` |
| name | Нативное name | `string` | — |
| size | Размер | `'small' \| 'medium' \| 'large'` | — |
| customClass | Пользовательский класс | `string` | — |
| sx | Быстрые свойства раскладки | `LhSxProps` | — |

## CheckboxGroup Props

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| modelValue (v-model) | Массив выбранных значений | `unknown[]` | `[]` |
| disabled | Отключить все дочерние элементы | `boolean` | `false` |
| name | Нативное name | `string` | — |
| size | Размер (пробрасывается дочерним элементам) | `'small' \| 'medium' \| 'large'` | — |

## Events

| Событие | Описание | Параметр колбэка |
| --- | --- | --- |
| update:modelValue | Изменение значения | `(value)` |
| change | Изменение значения | `(value)` |
