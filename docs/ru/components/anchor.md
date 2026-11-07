# Anchor (Навигация по якорям)

Навигация по якорям: клик переносит к соответствующему разделу, а при прокрутке текущий
раздел подсвечивается. Плоское преобразование (`flattenAnchorItems`) и определение
активного якоря (`resolveActiveAnchor`) предоставляются чистыми функциями core из
`@lh-ui/share`.

## Различия платформ (важно)

- **H5**: компонент самостоятельно отслеживает прокрутку `window` (или контейнера
  `target`), а позиционирование якоря выполняется через нативный `scrollIntoView`.
- **мини-программа WeChat**: для синхронизации прокрутки нужно передавать
  `detail.scrollTop` из `scroll-view` через prop `scrollTop`; при клике по якорю
  компонент генерирует `update:scrollIntoView` (id целевого раздела), который
  привязывается к атрибуту `scroll-into-view` контейнера `scroll-view` для
  позиционирования. Если `target` не передан, позиционирование страничного уровня, и
  компонент вызывает `uni.pageScrollTo({ selector })` напрямую.

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-into-view="anchorTarget"
    @scroll="onScroll"
  >
    <view id="section-a" class="my-section">区块 A</view>
    <view id="section-b" class="my-section">区块 B</view>
    <lh-anchor
      :items="items"
      :scroll-top="scrollTop"
      @update:scroll-into-view="anchorTarget = $event"
    />
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const items = [
  { id: 'section-a', title: '区块 A' },
  { id: 'section-b', title: '区块 B' },
]
const scrollTop = ref(0)
const anchorTarget = ref('')
function onScroll(event: { detail?: { scrollTop?: number } }) {
  scrollTop.value = event.detail?.scrollTop ?? 0
}
</script>
```

## Базовое использование

```vue
<template>
  <lh-anchor :items="items" />
</template>

<script setup lang="ts">
const items = [
  { id: 'section-a', title: '区块 A' },
  {
    id: 'group-b',
    title: 'B 组',
    children: [
      { id: 'section-b', title: '区块 B' },
      { id: 'section-c', title: '区块 C' },
    ],
  },
]
</script>
```

`items` поддерживает дочерние элементы (`children`): при рендеринге они преобразуются в
плоский список в порядке обхода в глубину с автоматическим отступом. Правило определения
активного якоря: активным считается последний якорь, чья верхняя граница раздела при
прокрутке пересекла линию порога `offset`.

## Горизонтальное расположение

```vue
<template>
  <lh-anchor :items="items" direction="horizontal" />
</template>
```

## API

### Props

| Свойство | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| items | Данные якорей (поддержка дочерних элементов children) | `LhAnchorItem[]` | `[]` |
| target | Селектор контейнера прокрутки на H5 (по умолчанию window) | `string` | — |
| scrollTop | Передача позиции прокрутки (MP: `detail.scrollTop` контейнера scroll-view) | `number` | — |
| offset | Порог определения активного якоря (расстояние от верхней границы раздела до верха контейнера) | `number` | `0` |
| direction | Направление расположения | `'vertical' \| 'horizontal'` | `'vertical'` |
| smooth | Плавная прокрутка | `boolean` | `true` |
| sx | Свойства быстрой раскладки | `LhSxProps` | — |

### Events

| Событие | Описание | Параметры |
| --- | --- | --- |
| change | Генерируется при изменении активного якоря | `(id: string)` |
| click | Генерируется при клике по элементу якоря (до позиционирования прокрутки) | `(id: string)` |
| update:scrollIntoView | Контракт позиционирования MP: id целевого раздела, привязывается к scroll-into-view | `(id: string)` |
