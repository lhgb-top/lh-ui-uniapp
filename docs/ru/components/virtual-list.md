# VirtualList Виртуальный список

Десятки тысяч строк, а рендерится только видимое окно. Расчёт диапазона с фиксированной
высотой (`computeVirtualRange`) и логика динамической высоты
(`buildVirtualItems` / `findVirtualRange`) целиком берутся из чистых функций core
`@lh-ui/share`; слой компонента отвечает только за управление скроллом и измерение
вьюпорта.

## Платформенные различия

- **H5**: контейнер рендерится как `view` (`overflow: auto`), высота вьюпорта
  измеряется через `clientHeight` + `ResizeObserver`.
- **Мини-программа WeChat**: контейнер рендерится как `scroll-view` (`scroll-y`),
  событие скролла читает `detail.scrollTop`, а высота вьюпорта измеряется через
  `createSelectorQuery` (в MP нет `ResizeObserver`).
- **Динамическая высота**: `itemSize` — декларативный функциональный контракт (вызывающая
  сторона возвращает высоту каждого элемента). Работает одинаково на обеих платформах и
  не полагается на API измерений, отсутствующие в MP.

## Базовое использование (фиксированная высота)

```vue
<template>
  <lh-virtual-list :data="items" :height="360" :item-height="48">
    <template #default="{ item, index }">
      <view class="my-item">Строка {{ index + 1 }}: {{ item.label }}</view>
    </template>
  </lh-virtual-list>
</template>

<script setup lang="ts">
const items = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  label: `Элемент ${i + 1}`,
}))
</script>
```

`height` задаёт высоту контейнера, а `item-height` — высоту элемента в режиме
фиксированной высоты (должна совпадать с реальной высотой элемента). За пределами
видимого окна сохраняются только буферные элементы в количестве `overscan`
(по умолчанию 2) экранов.

## Динамическая высота

```vue
<template>
  <lh-virtual-list :data="items" :height="360" :item-size="sizeOf">
    <template #default="{ item, index }">
      <view class="my-item" :style="{ height: `${sizeOf(index)}px` }">
        Строка {{ index + 1 }}: {{ item.label }}
      </view>
    </template>
  </lh-virtual-list>
</template>

<script setup lang="ts">
// itemSize — декларативная функция: возвращает высоту каждого элемента,
// одинаково на обеих платформах.
function sizeOf(index: number): number {
  return 48 + (index % 5) * 24
}
</script>
```

`item-height` и `item-size` исключают друг друга: передача `itemSize` включает режим
динамической высоты (смещения элементов рассчитываются заранее, а видимый диапазон
находится бинарным поиском).

## API

### Props

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| data | Источник данных (рендер элементов выполняет слот default) | `any[]` | `[]` |
| height | Высота контейнера (число — px) | `number \| string` | `300` |
| itemHeight | Высота элемента в режиме фиксированной высоты | `number` | `-` |
| itemSize | Режим динамической высоты: возвращает высоту каждого элемента | `(index: number) => number` | `-` |
| overscan | Количество элементов оверскана (буферные элементы вне видимого окна) | `number` | `2` |
| sx | свойства быстрой вёрстки sx | `LhSxProps` | `-` |

### Слоты

| Слот | Описание | Параметры области видимости |
| --- | --- | --- |
| default | Рендер элементов | `{ item, index }` |
