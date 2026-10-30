# Бейдж

Угловой знак в правом верхнем углу элемента: для счётчика уведомлений, точки-статуса или произвольного текста.

## Базовое использование

```vue
<template>
  <lh-badge :value="8">
    <lh-button size="small">Сообщения</lh-button>
  </lh-badge>
  <lh-badge :value="8" type="primary">
    <lh-button size="small">Основной</lh-button>
  </lh-badge>
</template>
```

## Обработка значений

```vue
<template>
  <lh-badge :value="200" :max="99">
    <lh-button size="small">Превышение max даёт 99+</lh-button>
  </lh-badge>
  <lh-badge :value="0" show-zero>
    <lh-button size="small">Показывать 0</lh-button>
  </lh-badge>
  <lh-badge :value="0">
    <lh-button size="small">Скрывать 0</lh-button>
  </lh-badge>
  <lh-badge content="Нов">
    <lh-button size="small">Свой текст</lh-button>
  </lh-badge>
</template>
```

## Точка

```vue
<template>
  <lh-badge is-dot>
    <lh-button size="small">Есть новые сообщения</lh-button>
  </lh-badge>
</template>
```

## Смещение и размер

```vue
<template>
  <lh-badge :value="8" :offset="[6, 4]">
    <lh-button size="small">Смещение</lh-button>
  </lh-badge>
  <lh-badge :value="8" size="small">
    <lh-button size="small">Маленький</lh-button>
  </lh-badge>
</template>
```

## Props

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| type | Тип | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'default'` | `'danger'` |
| value | Отображаемое значение | `string \| number` | — |
| size | Размер | `'small' \| 'medium' \| 'large'` | `'medium'` |
| max | Максимальное значение, при превышении показывается `${max}+` | `number` | `99` |
| isDot | Точка-статус (без значения) | `boolean` | `false` |
| hidden | Скрыть | `boolean` | `false` |
| offset | Смещение относительно позиции по умолчанию `[x, y]`, реализуется отрицательным margin | `[number, number]` | — |
| showZero | Показывать ли при value, равном 0 | `boolean` | `false` |
| content | Произвольный текст (приоритет над value) | `string` | — |
| customClass | Пользовательский класс | `string` | — |
| sx | Быстрые свойства раскладки | `LhSxProps` | — |

## Slots

| Слот | Описание |
| --- | --- |
| default | Содержимое, к которому крепится бейдж |

::: tip Отличия от версии для Vue3
Анимации появления и скрытия не полагаются на встроенный `<transition>` Vue (событие завершения перехода в Mini Program ненадёжно): переключение класса + таймер, выравнивающий длительность анимации 0.15s, визуальный результат совпадает с plus.
:::
