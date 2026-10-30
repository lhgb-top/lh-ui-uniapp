# Tooltip (подсказка)

## Базовое использование

```vue
<template>
  <lh-tooltip content="Это текст подсказки">
    <lh-button>Кликните, чтобы увидеть подсказку</lh-button>
  </lh-tooltip>
</template>
```

::: warning В Mini Program нет семантики hover
`trigger` по умолчанию равен `click` (работает на всех платформах). `hover` действует только на H5 —
на платформе MP используйте `trigger="click"`, срабатывание и закрытие по клику / касанию.
:::

## Позиция и ширина

```vue
<template>
  <lh-tooltip content="Подсказка снизу" placement="bottom">
    <lh-button>bottom</lh-button>
  </lh-tooltip>

  <lh-tooltip content="Длинный текст переносится автоматически" :max-width="200" placement="top">
    <lh-button>Ограничить ширину</lh-button>
  </lh-tooltip>
</template>
```

## Props

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| content | Текст подсказки | `string` | — |
| placement | Положение слоя (12 вариантов) | `LhTooltipPlacementCore` | `'top'` |
| trigger | Способ срабатывания: `click` (все платформы) / `hover` (только H5) | `'click' \| 'hover'` | `'click'` |
| showDelay | Задержка показа (миллисекунды) | `number` | — |
| hideDelay | Задержка скрытия (миллисекунды) | `number` | — |
| maxWidth | Максимальная ширина (содержимое переносится) | `string \| number` | — |
| disabled | Отключено | `boolean` | `false` |
| customClass | Пользовательский класс | `string` | — |
| themeVars | Переменные темы компонента | `Record<string, string>` | — |
| sx | Быстрые свойства раскладки | `LhSxProps` | — |

## Events

| Событие | Описание | Параметр колбэка |
| --- | --- | --- |
| update:modelValue | Изменение видимости (управляемое использование) | `(visible: boolean)` |
| show | Показ | — |
| hide | Скрытие | — |

::: tip Отличия от версии для Vue3
- Слой идёт через `root-portal` + асинхронное измерение за два кадра (сначала прозрачный рендер для замера → позиционирование → показ, чтобы не было мерцания).
- `showDelay` / `hideDelay` на стороне MP сохраняют мгновенное поведение только в режиме click.
- Расчёт позиции асинхронный (`getLhRect` возвращает Promise); нельзя рассчитывать получить результат синхронно.
:::
