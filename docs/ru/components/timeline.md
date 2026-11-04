# Timeline

Вертикальный поток событий. Хронологический порядок совпадает с порядком в документе. Поддерживаются метки времени, семантические типы, полые точки и чередующаяся раскладка.

> Чисто презентационный компонент: нет событий и управляемого состояния — H5 и Mini Program WeChat ведут себя абсолютно одинаково (см. «Отличия платформ» в конце).

## Базовое использование

`timestamp` задаёт текст метки времени; `type` придаёт точке узла семантический цвет (`'primary'` / `'success'` / `'warning'` / `'danger'`).

```vue
<template>
  <lh-timeline>
    <lh-timeline-item timestamp="2026-09-01">
      Ревью запуска проекта
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="2026-09-15"
      type="success"
    >
      Первый этап сдан
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="2026-09-25"
      type="warning"
    >
      Приёмка в процессе
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## Чередующаяся раскладка

`mode="alternate"` располагает события относительно центральной оси контейнера: элементы чередуются слева и справа по индексу (чётные индексы слева, нечётные справа).

```vue
<template>
  <lh-timeline mode="alternate">
    <lh-timeline-item timestamp="Q1">
      Планирование
    </lh-timeline-item>
    <lh-timeline-item timestamp="Q2">
      Разработка
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q3"
      type="danger"
    >
      Нагрузочное тестирование
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q4"
      type="success"
    >
      Релиз
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## Полые точки

`hollow` выводит узел в виде полой точки — обычно для незавершённых состояний.

```vue
<template>
  <lh-timeline>
    <lh-timeline-item
      timestamp="Q1"
      hollow
    >
      Не начато
    </lh-timeline-item>
    <lh-timeline-item timestamp="Q2">
      В процессе
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q3"
      type="success"
    >
      Завершено
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## Пользовательские метка времени и точка

И `timestamp`, и `dot` — слоты: вместо prop можно использовать слот `#timestamp` для произвольного содержимого; слот `#dot` заменяет точку по умолчанию (например, значком).

```vue
<template>
  <lh-timeline>
    <lh-timeline-item type="primary">
      <template #timestamp>
        Сентябрь 2026
      </template>
      Пользовательская метка времени
    </lh-timeline-item>
    <lh-timeline-item type="success">
      <template #dot>
        <lh-icon
          name="check"
          :size="12"
        />
      </template>
      Пользовательская точка (lh-icon)
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## Timeline Props

| Prop | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| mode | Раскладка: `'left'` с одной стороны / `'alternate'` чередующаяся | `'left' \| 'alternate'` | `'left'` |
| customClass | Пользовательское имя класса | `string` | — |
| sx | Быстрые свойства раскладки | `LhSxProps` | — |

## TimelineItem Props

| Prop | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| timestamp | Текст метки времени (допустим слот `#timestamp`) | `string` | — |
| type | Семантический тип узла (рамка точки окрашивается по токенам) | `'primary' \| 'success' \| 'warning' \| 'danger'` | — |
| hollow | Полый узел (обычно для незавершённых состояний) | `boolean` | `false` |
| customClass | Пользовательское имя класса (прокидывается на корневой узел элемента) | `string` | — |
| sx | Быстрые свойства раскладки | `LhSxProps` | — |

## Slots

| Slot | Описание |
| --- | --- |
| Timeline default | Узлы элементов (`lh-timeline-item`) |
| TimelineItem default | Основное содержимое элемента |
| TimelineItem timestamp | Содержимое метки времени (строка не выводится, если не заданы ни prop, ни слот) |
| TimelineItem dot | Пользовательская точка (точка по умолчанию чисто декоративная и не попадает в дерево доступности) |

## Отличия платформ

- Хронология — **чисто презентационный компонент**: нет событий, управляемого состояния, измерений и вызовов платформенных API; H5 и Mini Program WeChat полностью поддерживаются и выводятся одинаково.
- Семантический список `<ol>` / `<li>` реализован через `<view>` на обеих платформах (WXSS запрещает селекторы по тегу, стили применяются через классы), а семантика списка сохраняется через `role="list"` / `role="listitem"`; поддержка скринридеров в Mini Program зависит от платформы.
- Соединительные линии и центральная ось — чистые CSS-псевдоэлементы (`::before`) без JS-измерений; чередование в режиме `alternate` строится на чётности индекса и направлении flex, одинаково на обеих платформах.
- **Очистка WXSS**: `.lh-timeline__item:not(.lh-timeline__item--last)` из источника стилей share лишается модификатора `:not()` на этапе сборки (WXSS не поддерживает `:not()`). Видимость соединительной линии у не последних элементов берёт на себя правило `.lh-timeline__item--last::before`, специфичность которого не ниже, — результат рендеринга на обеих платформах не меняется.
- Доступность: точки узлов чисто декоративные (`aria-hidden="true"`), и слот пользовательской точки также не попадает в дерево доступности — как в версии для Vue 3.
- **Решение по портированию (выровнено с версией Vue 3, без выдуманных API)**: на момент портирования источник истины plus и ядро `@lh-ui/share` ещё не предоставляли `placement` (положение метки времени) и `center` (центрированная раскладка), поэтому и эта библиотека их не предоставляет; `mode` сейчас предлагает только `'left'` / `'alternate'`. Они появятся, как только источник истины их добавит.
