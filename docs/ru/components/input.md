# Поле ввода

## Базовое использование

```vue
<template>
  <lh-input v-model="text" placeholder="Введите текст" />
  <lh-input v-model="text" type="textarea" :rows="3" autosize placeholder="Несколько строк" />
  <lh-input v-model="text" type="password" placeholder="Пароль" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
```

## Стиль плейсхолдера (обязательно на MP)

::: warning Mini Program не поддерживает `::placeholder`
WXSS WeChat Mini Program не поддерживает псевдоэлемент `::placeholder`. Стиль плейсхолдера задавайте через props,
**не** пишите `::placeholder` в CSS (этот гейт перехватит и на этапе сборки).
:::

```vue
<lh-input placeholder="Введите текст" placeholder-style="color: #999; font-size: 13px" />
<!-- или через класс -->
<lh-input placeholder="Введите текст" placeholder-class="my-placeholder" />
```

## С иконками и состояниями

```vue
<template>
  <lh-input v-model="text" prefix-icon="search" placeholder="Поиск" clearable />
  <lh-input v-model="text" suffix-icon="close" placeholder="Суффиксная иконка" />
  <lh-input v-model="text" state="error" placeholder="Состояние ошибки валидации" />
  <lh-input v-model="text" :maxlength="20" show-word-limit placeholder="Подсчёт символов" />
</template>
```

## Props

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| modelValue (v-model) | Привязанное значение | `string` | — |
| type | Тип | `'text' \| 'textarea' \| 'password' \| 'number' \| 'email' \| 'url' \| 'tel' \| 'date' \| 'time'` | `'text'` |
| size | Размер | `'small' \| 'medium' \| 'large'` | — |
| disabled | Отключено | `boolean` | `false` |
| readonly | Только чтение | `boolean` | `false` |
| placeholder | Текст плейсхолдера | `string` | — |
| placeholderStyle | Инлайновый стиль плейсхолдера (заменяет `::placeholder`) | `string` | — |
| placeholderClass | Класс плейсхолдера (взаимоисключающий с placeholderStyle) | `string` | — |
| maxlength | Максимальная длина | `number` | — |
| minlength | Минимальная длина | `number` | — |
| showWordLimit | Показывать подсчёт символов | `boolean` | `false` |
| clearable | Можно очистить | `boolean` | `false` |
| prefixIcon | Иконка-префикс | `LhIconName` | — |
| suffixIcon | Иконка-суффикс | `LhIconName` | — |
| state | Состояние валидации | `'error' \| 'success' \| 'warning'` | — |
| name | Нативное name (для сбора формой) | `string` | — |
| password | Режим пароля | `boolean` | `false` |
| rows | Количество строк textarea | `number` | — |
| autosize | Авторазмер высоты textarea (auto-height в MP) | `boolean` | `false` |
| label | Текст метки | `string` | — |
| customClass | Пользовательский класс | `string` | — |
| themeVars | Переменные темы компонента | `Record<string, string>` | — |
| sx | Быстрые свойства раскладки | `LhSxProps` | — |

## Events

| Событие | Описание | Параметр колбэка |
| --- | --- | --- |
| update:modelValue | Изменение значения | `(value: string)` |
| input | Ввод (берётся `event.detail.value`) | `(value: string)` |
| blur | Потеря фокуса | — |
| focus | Получение фокуса | — |
| clear | Очистка | — |

::: tip Отличия от версии для Vue3
`autocomplete` / `autofocus` / `resize` / `form` / `tabindex` / `nativeType` /
`inputStyle` не имеют аналогов в Mini Program и в библиотеке **не реализуются**. `autosize` работает через свойство
`auto-height` штатного textarea Mini Program.
:::
