# Link ссылка

Текстовая гиперссылка с поддержкой смысловых типов, формы подчёркивания и слотов под значки в начале и конце.

## Базовое использование

```vue
<template>
  <lh-link>Ссылка по умолчанию</lh-link>
  <lh-link type="primary">Основная ссылка</lh-link>
</template>
```

`type`: `default` (по умолчанию) / `primary` / `success` / `warning` / `danger` / `info`.

## Подчёркивание

```vue
<template>
  <lh-link underline="always">Всегда</lh-link>
  <lh-link underline="none">Нет</lh-link>
</template>
```

`underline`: `always` всегда / `hover` появляется при наведении (по умолчанию) / `none` нет.

## Отключение и префикс/суффикс

```vue
<template>
  <lh-link disabled>Отключённая ссылка</lh-link>
  <lh-link>
    <template #prefix><lh-icon name="left" /></template>
    Предыдущая страница
  </lh-link>
</template>
```

## Props

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| href | Адрес ссылки (href не выводится, когда отключено) | `string` | — |
| target | Целевое окно (только H5) | `string` | — |
| type | Смысловой тип ссылки | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| underline | Форма подчёркивания | `'always' \| 'hover' \| 'none'` | `'hover'` |
| disabled | Отключено | `boolean` | `false` |
| current | Маркер текущей страницы (выводит `aria-current`) | `'page' \| 'location' \| true` | — |
| customClass | Пользовательский класс | `string` | — |
| sx | Быстрые пропы разметки | `LhSxProps` | — |

## Slots

| Слот | Описание |
| --- | --- |
| default | Текст ссылки |
| prefix | Слот под значок в начале |
| suffix | Слот под значок в конце |

## Events

| Событие | Описание | Параметры |
| --- | --- | --- |
| click | Клик | `(event: Event)` |

## Платформенные различия

| Возможность | H5 | Мини-программа |
| --- | --- | --- |
| Носитель | view + `@click` | Как на H5 (`href` / `target` не несут навигационной семантики; переход обрабатывается бизнес-уровнем в событии `click`) |
| Подчёркивание при наведении | Есть | Нет (`underline="always"` / `"none"` продолжают действовать; вывод подчёркивания VIEW зависит от фактического результата) |
