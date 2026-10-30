# Скелетон

Заглушка на время загрузки данных; когда `loading` равно false, рендерится реальное содержимое.

## Базовое использование

```vue
<template>
  <lh-skeleton :loading="loading">
    <view>Реальное содержимое</view>
  </lh-skeleton>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(true)
</script>
```

## Строки и аватар

```vue
<template>
  <lh-skeleton :loading="true" :rows="4" avatar />
</template>
```

## Отключение анимации

```vue
<template>
  <lh-skeleton :loading="true" :animated="false" :rows="3" />
</template>
```

## Самостоятельные блоки-заглушки

`lh-skeleton-item` можно использовать отдельно, чтобы собрать собственную заглушку; `variant` принимает `text` / `rect` / `circle`.

```vue
<template>
  <view class="custom-skeleton">
    <lh-skeleton-item variant="circle" class="avatar" />
    <lh-skeleton-item variant="text" class="line" />
  </view>
</template>
```

## Props (lh-skeleton)

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| loading | Находится ли в состоянии загрузки (при false рендерится реальное содержимое слота default) | `boolean` | `true` |
| rows | Количество текстовых строк | `number` | `3` |
| avatar | Включать ли круглую заглушку аватара | `boolean` | `false` |
| animated | Включена ли анимация | `boolean` | `true` |
| customClass | Пользовательский класс | `string` | — |
| sx | Быстрые свойства раскладки | `LhSxProps` | — |

## Props (lh-skeleton-item)

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| variant | Форма блока-заглушки | `'text' \| 'rect' \| 'circle'` | `'text'` |
| animated | Включена ли анимация | `boolean` | `true` |
| customClass | Пользовательский класс | `string` | — |
| sx | Быстрые свойства раскладки | `LhSxProps` | — |

## Slots (lh-skeleton)

| Слот | Описание |
| --- | --- |
| default | Реальное содержимое, рендерится при `loading`, равном false |

::: tip Доступность
Контейнер помечается `aria-busy="true"` и `aria-live="polite"`, сами блоки-заглушки скрыты от вспомогательных технологий; когда данные готовы, скринридер автоматически объявит реальное содержимое.
:::
