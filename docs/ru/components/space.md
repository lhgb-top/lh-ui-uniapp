# Интервал

Задаёт интервалы между соседними элементами в раскладке, заменяя ручной margin. Интервалы полностью опираются на CSS `gap`, обе платформы поддерживают его нативно.

## Базовое использование

```vue
<template>
  <lh-space>
    <lh-tag>Тушь</lh-tag>
    <lh-tag>Пустое пространство</lh-tag>
    <lh-tag>Китайский стиль</lh-tag>
  </lh-space>
</template>
```

## Направление

```vue
<template>
  <lh-space direction="vertical">
    <lh-tag>Тушь</lh-tag>
    <lh-tag>Пустое пространство</lh-tag>
  </lh-space>
</template>
```

## Шаги интервала

Предустановленные шаги ссылаются на токены spacing (можно переопределить через `--lh-spacing-*`); число трактуется как px; массив задаёт горизонтальный и вертикальный интервалы раздельно.

```vue
<template>
  <lh-space size="small">
    <lh-tag>Малый</lh-tag>
    <lh-tag>Малый</lh-tag>
  </lh-space>
  <lh-space size="medium">
    <lh-tag>Средний</lh-tag>
    <lh-tag>Средний</lh-tag>
  </lh-space>
  <lh-space size="large">
    <lh-tag>Большой</lh-tag>
    <lh-tag>Большой</lh-tag>
  </lh-space>
  <lh-space :size="24">
    <lh-tag>24px</lh-tag>
    <lh-tag>24px</lh-tag>
  </lh-space>
  <lh-space :size="[8, 16]">
    <lh-tag>Горизонталь 8</lh-tag>
    <lh-tag>Вертикаль 16</lh-tag>
  </lh-space>
</template>
```

## Выравнивание и перенос

```vue
<template>
  <lh-space alignment="center">
    <lh-tag>По центру</lh-tag>
    <lh-button type="primary" size="small">Кнопка</lh-button>
  </lh-space>
  <lh-space :wrap="true">
    <lh-tag v-for="i in 20" :key="i">Тег {{ i }}</lh-tag>
  </lh-space>
</template>
```

::: tip Перенос работает только в горизонтальном направлении
`wrap` имеет смысл только при `direction="horizontal"`, в вертикальном направлении переданное значение игнорируется.
:::

## Props

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| direction | Направление раскладки | `'horizontal' \| 'vertical'` | `'horizontal'` |
| size | Интервал: предустановленный шаг / число в пикселях / [горизонталь, вертикаль] | `'small' \| 'medium' \| 'large' \| number \| [number, number]` | `'medium'` |
| wrap | Разрешить перенос (только горизонтальное направление) | `boolean` | `true` |
| alignment | Выравнивание | `'start' \| 'center' \| 'end' \| 'baseline'` | `'start'` |
| customClass | Пользовательский класс | `string` | — |
| sx | Быстрые свойства раскладки | `LhSxProps` | — |

## Slots

| Слот | Описание |
| --- | --- |
| default | Дочерние элементы, между которыми расставляются интервалы |
