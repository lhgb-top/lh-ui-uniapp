# Выпадающий список

## Базовое использование

```vue
<template>
  <lh-select v-model="value" :options="options" placeholder="Выберите" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref()
const options = [
  { label: 'Вариант 1', value: 'a' },
  { label: 'Вариант 2', value: 'b' },
  { label: 'Отключённый пункт', value: 'c', disabled: true },
]
</script>
```

## Очищаемый / фильтруемый

```vue
<template>
  <lh-select v-model="value" :options="options" clearable />
  <lh-select v-model="value" :options="options" filterable placement="bottom" />
</template>
```

## Props

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| modelValue (v-model) | Привязанное значение | `unknown` | — |
| options | Список вариантов | `LhSelectOption[]` | — |
| size | Размер | `'small' \| 'medium' \| 'large'` | — |
| disabled | Отключено | `boolean` | `false` |
| clearable | Можно очистить | `boolean` | `false` |
| placeholder | Текст плейсхолдера | `string` | — |
| filterable | Фильтруемый (на стороне MP поле ввода предоставляется внутри слоя) | `boolean` | `false` |
| placement | Положение слоя (12 вариантов) | `LhPlacement` | `'bottom'` |
| customClass | Пользовательский класс | `string` | — |
| themeVars | Переменные темы компонента | `Record<string, string>` | — |
| sx | Быстрые свойства раскладки | `LhSxProps` | — |

### LhSelectOption

| Проп | Описание | Тип |
| --- | --- | --- |
| label | Отображаемый текст | `string` |
| value | Значение | `unknown` |
| disabled | Отключено | `boolean` |

## Events

| Событие | Описание | Параметр колбэка |
| --- | --- | --- |
| update:modelValue | Изменение значения | `(value)` |
| change | Изменение значения (включая `undefined` при очистке) | `(value)` |
| visible-change | Показ/скрытие слоя | `(visible: boolean)` |

::: tip Отличия от версии для Vue3
- Слой идёт через `root-portal` + асинхронное измерение за два кадра (а не абсолютное позиционирование).
- **Клавиатурная навигация (↑↓ / Home / End) только на H5**: в Mini Program нет клавиатурных событий, код удаляется на этапе компиляции — на стороне MP доступен только клик по варианту.
- Поле ввода фильтра `filterable` на стороне MP рендерится внутри слоя.
:::
