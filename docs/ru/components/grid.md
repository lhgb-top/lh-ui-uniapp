# Grid (сетка)

Сетка из 24 колонок: `lh-row` в паре с `lh-col` (при easycom теги можно писать напрямую; при импорте по требованию имена компонентов — `LhRow` / `LhCol`). В основе лежит CSS Grid: `span` / `offset` / `push` / `pull` напрямую отображаются на позиционирование `grid-column`, а имена классов и алгоритм размещения полностью производятся чистыми функциями core из `@lh-ui/share`.

## Базовая раскладка

```vue
<template>
  <lh-row>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
  </lh-row>
</template>
```

## Интервал между колонками (gutter)

`gutter` принимает `number` (только по горизонтали) или массив `[горизонтальный, вертикальный]`; Row использует отрицательный внешний отступ, чтобы скомпенсировать внутренние отступы колонок.

```vue
<template>
  <lh-row :gutter="16">
    <lh-col :span="8"><view class="cell">8</view></lh-col>
    <lh-col :span="8"><view class="cell">8</view></lh-col>
    <lh-col :span="8"><view class="cell">8</view></lh-col>
  </lh-row>
  <lh-row :gutter="[16, 24]">
    <lh-col :span="12"><view class="cell">12</view></lh-col>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
  </lh-row>
</template>
```

## justify / align

`center` у `justify` и `middle` у `align` отображаются на независимые модификаторы-классы (оси не конфликтуют между собой); `align='center'` — совместимый псевдоним для `middle`.

```vue
<template>
  <lh-row justify="center" align="middle">
    <lh-col :span="6"><view class="cell">6</view></lh-col>
    <lh-col :span="6"><view class="cell">6</view></lh-col>
  </lh-row>
</template>
```

## Сдвиг и перемещение

- `offset`: сдвигает начало на N колонок вправо (явное начало `offset + 1`)
- `push` / `pull`: перемещает начало вправо / влево поверх offset

```vue
<template>
  <lh-row>
    <lh-col :span="6" :offset="6"><view class="cell">6 / offset 6</view></lh-col>
    <lh-col :span="9" :push="6"><view class="cell">9 / push 6</view></lh-col>
  </lh-row>
</template>
```

## Адаптивные точки останова

`xs` / `sm` / `md` / `lg` / `xl` действуют при `<640 / ≥640 / ≥768 / ≥1024 / ≥1280px` соответственно; если они не объявлены, происходит откат к ближайшему объявленному уровню (`xs` всегда последний). Также можно объявить их массово через `sizes`.

```vue
<template>
  <lh-row>
    <lh-col :xs="24" :sm="12" :md="8" :lg="6">
      <view class="cell">xs=24 sm=12 md=8 lg=6</view>
    </lh-col>
  </lh-row>
</template>
```

## Props Row

| Prop | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| gutter | Интервал между колонками (px или `[горизонтальный, вертикальный]`) | `number \| [number, number]` | `0` |
| justify | Расположение по главной оси | `'start' \| 'center' \| 'end' \| 'space-between' \| 'space-around'` | `'start'` |
| align | Выравнивание по поперечной оси | `'top' \| 'middle' \| 'bottom'` | `'top'` |
| wrap | Разрешить перенос строк | `boolean` | `true` |
| customClass | Пользовательский класс (пробрасывается на корневой узел) | `string` | — |
| sx | Краткие свойства раскладки sx | `LhSxProps` | — |

## Props Col

| Prop | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| span | Занимаемое число колонок (сетка из 24) | `number` | — |
| offset | Колонки начального отступа | `number` | — |
| push | Колонки сдвига вправо | `number` | — |
| pull | Колонки сдвига влево | `number` | — |
| xs / sm / md / lg / xl | Размер на каждой точке останова (`number` или `{ span, offset }`) | `LhColSize` | — |
| sizes | Массовое объявление по точкам останова (эквивалент xs–xl, на выбор) | `LhBreakpointSizes` | — |
| customClass | Пользовательский класс (пробрасывается на корневой узел) | `string` | — |
| sx | Краткие свойства раскладки sx | `LhSxProps` | — |

## Slots

| Slot | Описание |
| --- | --- |
| default | Содержимое сетки (Row и Col предоставляют слот по умолчанию) |

## Различия между платформами

- **Чисто разметочный компонент**: нет плавающих слоёв, нет измерений, нет зависимостей от document; поведение одинаково на H5 и в WeChat Mini Program.
- **Источник точек останова**: H5 слушает `matchMedia`, но **в Mini Program нет matchMedia**, поэтому всегда происходит деградация до уровня `xs` (правила отката по-прежнему определяются `resolveResponsiveSize` из core share; фиксирован только текущий уровень — `xs`). Если в Mini Program нужно сегментирование по ширине экрана, подключите `uni.getSystemInfoSync().windowWidth` к интерфейсу внедрения, который предоставляет `useLhBreakpoint`, либо задайте одну фиксированную раскладку для Mini Program.
- **Замена тегов**: `<div>` из plus становится `<view>` (WXSS запрещает селекторы по тегам; стили применяются через классы `lh-row*` / `lh-col*`).
- **Позиционирование `grid-column`**: простой `span` использует авто-размещение (`span N`); при наличии `offset` / `push` / `pull` начало задаётся явно и ограничивается системой из 24 колонок, чтобы выходящие за пределы комбинации не ломали контейнер.

::: tip Отличия от версии для Vue 3
- Структура компонентов, набор props, имена классов и алгоритм размещения полностью совпадают с plus (общий core share).
- Теги подкомпонентов следуют соглашению easycom: `lh-row` / `lh-col` (при импорте по требованию — `LhRow` / `LhCol`).
- Добавлен prop `customClass`: в uni-app пользовательские классы не проникают сквозь `styleIsolation`, поэтому они пробрасываются через prop (в plus классы передаются напрямую).
:::
