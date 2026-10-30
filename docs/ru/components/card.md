# Карточка

Контейнер для объединения информации; поддерживает обложку, шапку, тело, подвал и заглушку загрузки.

## Базовое использование

```vue
<template>
  <lh-card title="Тушь">
    <view>Содержимое карточки</view>
  </lh-card>
</template>
```

## Обложка и подвал

```vue
<template>
  <lh-card title="Альбом пейзажей">
    <template #cover>
      <image class="cover" src="https://placeholder.invalid/cover.png" mode="aspectFill" />
    </template>
    <view>Содержимое карточки</view>
    <template #footer>
      <view>Действия в подвале</view>
    </template>
  </lh-card>
</template>
```

::: tip Дочерним элементам обложки нужна явная ширина
Правило share «дочерний элемент обложки заполняет ширину» (`.lh-card__cover > *`) опирается на универсальный селектор, который WXSS не поддерживает, и санитизационный конвейер его отбрасывает. На платформе Mini Program задавайте дочерним элементам обложки (таким как `<image>`) явную ширину (например `width: 100%`).
:::

## Зона действий справа в шапке

Слот `extra` рендерится справа от заголовка и появляется только при наличии `title` или слота `header`.

```vue
<template>
  <lh-card title="Заказ">
    <template #extra>
      <lh-button size="small" text>Подробнее</lh-button>
    </template>
    <view>Содержимое карточки</view>
  </lh-card>
</template>
```

## Тень и кликабельность

```vue
<template>
  <lh-card shadow="hover" clickable @click="onClick">
    <view>При наведении приподнимается, клик вызывает событие</view>
  </lh-card>
</template>

<script setup lang="ts">
const onClick = () => console.log('Клик по карточке')
</script>
```

## Заглушка загрузки

```vue
<template>
  <lh-card title="Тушь" loading>
    <view>Не рендерится, пока содержимое в состоянии загрузки</view>
  </lh-card>
</template>
```

## Props

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| title | Заголовок карточки (можно также через слот header) | `string` | — |
| shadow | Когда показывать тень | `'always' \| 'hover' \| 'never'` | `'always'` |
| clickable | Вся карточка кликабельна (берёт на себя клавиатурную семантику button) | `boolean` | `false` |
| loading | Состояние загрузки: содержимое заменяется скелетон-заглушкой | `boolean` | `false` |
| themeVars | Переменные темы компонента (ключам автоматически добавляется префикс `--lh-`) | `Record<string, string>` | — |
| bgPattern | URL фонового узора (например `var(--lh-pattern-willow)`), не подчиняется глобальному белому списку | `string` | — |
| customClass | Пользовательский класс | `string` | — |
| sx | Быстрые свойства раскладки | `LhSxProps` | — |

## Events

| Событие | Описание | Параметр колбэка |
| --- | --- | --- |
| click | Клик по карточке (только при `clickable`) | `(e: Event)` |

## Slots

| Слот | Описание |
| --- | --- |
| cover | Обложка |
| header | Шапка (приоритет над title) |
| extra | Зона действий справа в шапке (зависит от наличия шапки) |
| default | Основное содержимое |
| footer | Подвал |

::: tip Активация с клавиатуры только на H5
Кликабельная карточка на H5 поддерживает активацию с клавиатуры через Enter / Space (в соответствии с паттерном button из APG); в Mini Program нет клавиатурных событий, эта обработка вырезается на стороне MP условной компиляцией.
:::
