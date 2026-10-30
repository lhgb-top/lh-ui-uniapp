# Тег

## Базовое использование

```vue
<template>
  <lh-tag>По умолчанию</lh-tag>
  <lh-tag type="primary">Основной</lh-tag>
  <lh-tag type="success">Успех</lh-tag>
  <lh-tag type="warning">Предупреждение</lh-tag>
  <lh-tag type="danger">Опасность</lh-tag>
</template>
```

## Стиль и закрытие

```vue
<template>
  <lh-tag round>Скруглённый</lh-tag>
  <lh-tag hit>С обводкой</lh-tag>
  <lh-tag closable @close="onClose">Можно закрыть</lh-tag>
</template>

<script setup lang="ts">
const onClose = () => console.log('Закрыто')
</script>
```

## Props

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| type | Тип | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| size | Размер | `'small' \| 'medium' \| 'large'` | — |
| closable | Можно закрыть | `boolean` | `false` |
| disabled | Отключено | `boolean` | `false` |
| round | Скруглённый | `boolean` | `false` |
| hit | Обводка (без заливки) | `boolean` | `false` |
| customClass | Пользовательский класс | `string` | — |
| sx | Быстрые свойства раскладки | `LhSxProps` | — |

## Events

| Событие | Описание | Параметр колбэка |
| --- | --- | --- |
| close | Клик по кнопке закрытия | — |

::: tip Отличия от версии для Vue3
Инлайн SVG в кнопке закрытия заменён на lh-icon (решение на iconfont).
:::
