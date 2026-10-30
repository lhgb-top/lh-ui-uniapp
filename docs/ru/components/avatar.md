# Аватар

Аватар пользователя или сущности; поддерживает три варианта: картинка, иконка, текст.

## Базовое использование

```vue
<template>
  <lh-avatar src="https://placeholder.invalid/avatar.png" />
  <lh-avatar icon="user" />
  <lh-avatar text="Тушь" />
</template>
```

## Форма и размер

```vue
<template>
  <lh-avatar text="Вода" shape="circle" />
  <lh-avatar text="Тушь" shape="square" />
  <lh-avatar text="М" size="small" />
  <lh-avatar text="Б" size="large" />
</template>
```

## Режим обрезки

`fit` отображается на `mode` компонента `<image>` из uni: `fill` → `scaleToFill`, `contain` → `aspectFit`, `cover` → `aspectFill`, `none` → `center`.

```vue
<template>
  <lh-avatar src="https://placeholder.invalid/avatar.png" fit="cover" />
  <lh-avatar src="https://placeholder.invalid/avatar.png" fit="contain" />
</template>
```

::: tip scale-down — приближённо
В uni нет режима, эквивалентного `scale-down`; берётся ближайший по семантике `aspectFit` (сохраняет пропорции и показывает целиком, без увеличения).
:::

## Fallback при ошибке загрузки

Если картинка не загрузилась, fallback идёт по цепочке «иконка → текст → пусто» и срабатывает событие `error`.

```vue
<template>
  <lh-avatar
    src="https://placeholder.invalid/broken.png"
    icon="user"
    alt="Аватар"
    @error="onError"
  />
</template>

<script setup lang="ts">
const onError = () => console.log('Ошибка загрузки картинки')
</script>
```

## Props

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| src | Адрес картинки; если пусто — fallback по цепочке: иконка, затем текст | `string` | — |
| alt | Замещающий текст при ошибке загрузки; одновременно имя для доступности | `string` | — |
| icon | Имя иконки (показывается, если src пуст или не загрузился) | `LhIconName` | — |
| text | Содержимое текстового аватара (если нет ни src, ни иконки — берётся первый символ) | `string` | — |
| shape | Форма | `'circle' \| 'square'` | `'circle'` |
| size | Размер | `'small' \| 'medium' \| 'large'` | `'medium'` |
| fit | Режим обрезки картинки (отображается на mode компонента image из uni) | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'cover'` |
| customClass | Пользовательский класс | `string` | — |
| sx | Быстрые свойства раскладки | `LhSxProps` | — |

## Events

| Событие | Описание | Параметр колбэка |
| --- | --- | --- |
| error | Ошибка загрузки картинки | `(e: Event)` |
