# Segmented

Переключение взаимоисключающих вариантов, обычно используется для переключения представлений. Управляется данными: варианты передаются напрямую массивом `options`, дочерние компоненты собирать вручную не нужно.

## Базовое использование

`options` поддерживает строковую короткую форму; `modelValue` (`v-model`) — текущее выбранное значение.

```vue
<template>
  <lh-segmented v-model="view" :options="['Список', 'Карточки', 'Таблица']" />
</template>

<script setup>
import { ref } from 'vue'
const view = ref('Список')
</script>
```

## Объектные параметры

Объектная форма задаёт `label` / `value` и подходит, когда отображаемый текст отличается от значения.

```vue
<template>
  <lh-segmented
    v-model="mode"
    :options="[
      { label: 'День', value: 'day' },
      { label: 'Неделя', value: 'week' },
      { label: 'Месяц', value: 'month' },
    ]"
  />
</template>

<script setup>
import { ref } from 'vue'
const mode = ref('day')
</script>
```

## Отключённые пункты и отключение всей группы

Параметр-объект с `disabled: true` нельзя выбрать; `disabled` на уровне компонента отключает весь сегментированный элемент.

```vue
<template>
  <lh-segmented
    v-model="seg"
    :options="[
      { label: 'Начало весны', value: 'lichun' },
      { label: 'Дождевая вода', value: 'yushui' },
      { label: 'Пробуждение насекомых', value: 'jingzhe', disabled: true },
    ]"
  />
  <lh-segmented v-model="all" disabled :options="['А', 'Б', 'В']" />
</template>

<script setup>
import { ref } from 'vue'
const seg = ref('lichun')
const all = ref('А')
</script>
```

## Ширина блока

`block` заставляет сегментированный элемент заполнить контейнер, а варианты делят ширину поровну (часто используется в панелях переключения представлений).

```vue
<template>
  <lh-segmented v-model="block" block :options="['Ши', 'Цы', 'Цюй', 'Фу']" />
</template>

<script setup>
import { ref } from 'vue'
const block = ref('Ши')
</script>
```

## Props

| Свойство | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| modelValue (v-model) | Текущее значение (управляемое, используется с событием `update:modelValue`) | `string \| number` | — |
| options | Варианты (строковая короткая форма или объекты `{ label, value, disabled }`) | `[LhSegmentedInput](#заметки-о-типах)[]` | — |
| disabled | Отключить всю группу | `boolean` | `false` |
| block | Заполнить контейнер (варианты делят ширину поровну) | `boolean` | `false` |
| customClass | Пользовательское имя класса (пробрасывается на корневой узел) | `string` | — |
| sx | Быстрые свойства раскладки | `LhSxProps` | — |

### Заметки о типах

```ts
/** Тип значения варианта */
type LhSegmentedValue = string | number

/** Форма объекта варианта */
interface LhSegmentedOption {
  label: string
  value: LhSegmentedValue
  disabled?: boolean
}

/** Входной вариант (строковая короткая форма или объект) */
type LhSegmentedInput = LhSegmentedValue | LhSegmentedOption
```

## Events

| Имя события | Описание | Параметры обратного вызова |
| --- | --- | --- |
| update:modelValue | Срабатывает при изменении выбора, используется с v-model | `(value: string \| number)` |
| change | Срабатывает при изменении выбора (и по клику, и стрелками) | `(value: string \| number)` |

## Различия платформ

- **Сенсорное взаимодействие рисуется через view, доступно на всех платформах**: `<div>` + `<button>` из версии Vue 3 заменены на `<view>` (WXSS запрещает селекторы по тегам, стили применяются через классы); переключение выбора происходит по `@click` и ведёт себя одинаково на H5 и в WeChat Mini Program, без зависимостей от платформенных API.
- **Выбранный ползунок — чистый CSS-переход**: цвет фона / тень выбранного варианта управляется переключением класса, а WXSS поддерживает простые `transition`, поэтому затухание есть на обеих платформах; **нет зависимости от `transitionend`** (в Mini Program это событие ненадёжно — анимационные компоненты этого репозитория, такие как message / loading, согласовывают тайминги через setTimeout, тогда как сегментированному элементу не нужна даже JS-оркестрация: достаточно чистого CSS, без нагрузки по синхронизации).
- **Навигация стрелками только для H5**: roving tabindex (стрелки перемещают выбор, зацикливаясь на концах и пропуская отключённые варианты, с повторным использованием `getNextListIndex` / `getRovingTabIndex` из core `@lh-ui/share`) не имеет клавиатурных событий в Mini Program; обработчик `@keydown` в SFC защищён условной компиляцией и не вызывается в MP-бандле — в MP выбор возможен только касанием.
- **Внешний вид отключённых вариантов использует класс-заменитель**: стили отключения из исходников share написаны на псевдоклассе `&:disabled` (он совпадает только с элементами button), а у view такого псевдокласса нет, поэтому компонент добавляет в SFC inline-правило `lh-segmented__option--disabled` с тем же токеном (`--lh-disabled-text-color`), по прецеденту inline-замены lh-spinner / lh-empty (в очищенный вывод не попадает).
- **Атрибуты доступности привязываются по одному**: контракт для `role="radiogroup"` / `role="radio"` + `aria-checked` / `aria-disabled` по-прежнему определяют `getSegmentedAria` / `getSegmentedItemAria` из share; поскольку компилятор шаблонов Mini Program не поддерживает `v-bind` с объектом, слой-прокладка разворачивает пакет атрибутов в явные индивидуальные привязки.
- **Итог портирования**: Segmented — чистый переключательный компонент без измерений, слоёв-оверлеев и зависимостей от document; нормализация вариантов, имена классов и атрибуты доступности полностью производятся чистыми функциями core `@lh-ui/share`, а в репозитории пишется только реактивная прокладка. API полностью совпадает с версией Vue 3 (`modelValue` / `options` / `disabled` / `block` / `sx`).
