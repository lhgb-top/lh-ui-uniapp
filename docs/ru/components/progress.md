# Индикатор выполнения

Показывает прогресс задачи; поддерживает статусные цвета, собственный цвет и форматирование текста.

## Базовое использование

```vue
<template>
  <lh-progress :percentage="42" />
</template>
```

## Состояния

```vue
<template>
  <lh-progress :percentage="70" status="success" />
  <lh-progress :percentage="70" status="warning" />
  <lh-progress :percentage="70" status="exception" />
  <lh-progress :percentage="100" />
</template>
```

Если `status` равен `normal` и достигнуто 100, значение автоматически трактуется как `success`.

## Толщина линии и скрытие текста

```vue
<template>
  <lh-progress :percentage="60" :stroke-width="12" />
  <lh-progress :percentage="60" :show-text="false" />
</template>
```

## Собственный цвет

Строка используется как цвет линии напрямую, функция возвращает цвет в зависимости от процента.

```vue
<template>
  <lh-progress :percentage="60" color="#C4A35A" />
  <lh-progress :percentage="60" :color="gradient" />
</template>

<script setup lang="ts">
const gradient = (p: number) => `rgb(${p}, 0, 0)`
</script>
```

## Форматирование и слот текста

```vue
<template>
  <lh-progress :percentage="42" :format="format" />
  <lh-progress :percentage="42">
    <template #text="{ percentage }">
      <text>{{ percentage }} / 100</text>
    </template>
  </lh-progress>
</template>

<script setup lang="ts">
const format = (p: number) => `Прогресс ${p}`
</script>
```

## Props

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| percentage | Процент выполнения 0-100 (выход за пределы автоматически клампится) | `number` | `0` |
| type | Тип | `'line' \| 'circle'` | `'line'` |
| status | Состояние | `'normal' \| 'success' \| 'warning' \| 'exception'` | `'normal'` |
| color | Цвет линии: строка или функция, возвращающая цвет по проценту | `string \| ((percentage: number) => string)` | — |
| strokeWidth | Толщина линии, px | `number` | `6` |
| width | Ширина полотна в круговом режиме, px | `number` | `126` |
| showText | Показывать текст | `boolean` | `true` |
| format | Функция форматирования текста | `(percentage: number) => string` | — |
| customClass | Пользовательский класс | `string` | — |
| sx | Быстрые свойства раскладки | `LhSxProps` | — |

## Slots

| Слот | Описание | Параметры области видимости |
| --- | --- | --- |
| text | Текст прогресса | `{ percentage: number }` |

::: tip Круговой тип пока не реализован
Поддержка svg в Mini Program ограничена, в первом выпуске реализован только тип line. Передача `type="circle"` отрендерит линию и выдаст одно предупреждение в режиме разработки (без молчаливой деградации); круговой тип оставлен на вторую итерацию.
:::
