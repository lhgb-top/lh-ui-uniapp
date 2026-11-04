# Popover (всплывающая панель)

Всплывающая панель с богатым содержимым: несёт больше информации, чем Tooltip (заголовок, текст, интерактивные узлы). Триггер оборачивается в слот по умолчанию, а содержимое передаётся через слот `content`; панель имеет `role="dialog"`, а стрелка всегда указывает на триггер.

## Базовое использование

```vue
<template>
  <lh-popover title="Чернильная подсказка" placement="top">
    <lh-button>Нажмите, чтобы открыть</lh-button>
    <template #content>
      <text>Это богатое содержимое, сюда можно поместить любой узел.</text>
    </template>
  </lh-popover>
</template>
```

::: warning В мини-программе нет семантики hover / focus
`trigger` по умолчанию — `click` (доступно на всех целевых платформах). `hover` / `focus` действуют только в H5 — в мини-программе они автоматически заменяются переключением по нажатию / касанию (первое нажатие открывает, второе закрывает).
:::

## Способы запуска

```vue
<template>
  <!-- Запуск по наведению (только H5; в мини-программе заменяется переключением по нажатию) -->
  <lh-popover trigger="hover" title="Запуск по наведению">
    <lh-button>Наведите на меня</lh-button>
    <template #content><text>Перемещение указателя на панель не закрывает её.</text></template>
  </lh-popover>

  <!-- Запуск по фокусу (только H5) -->
  <lh-popover trigger="focus" title="Запуск по фокусу">
    <lh-input placeholder="Фокус на поле ввода" />
    <template #content><text>Появляется, когда поле ввода получает фокус.</text></template>
  </lh-popover>

  <!-- Ручное управление: видимость полностью контролируется внешним v-model:visible -->
  <lh-popover v-model:visible="manualVisible" trigger="manual" title="Ручное управление">
    <lh-button @click="manualVisible = !manualVisible">Внешний переключатель</lh-button>
    <template #content><text>Видимость полностью управляется внешним состоянием.</text></template>
  </lh-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const manualVisible = ref(false)
</script>
```

> Задержки `showAfter` / `hideAfter` применяются только к hover / focus (H5); `click` и `manual` реагируют немедленно.

## Двенадцать позиций

```vue
<template>
  <lh-popover
    v-for="p in placements"
    :key="p"
    :placement="p"
    :title="p"
  >
    <lh-button size="small">{{ p }}</lh-button>
    <template #content><text>Позиция: {{ p }}</text></template>
  </lh-popover>
</template>

<script setup lang="ts">
const placements = [
  'top', 'top-start', 'top-end',
  'bottom', 'bottom-start', 'bottom-end',
  'left', 'left-start', 'left-end',
  'right', 'right-start', 'right-end',
] as const
</script>
```

> Когда в области просмотра не хватает места, панель автоматически переворачивается (flip) и возвращается в пределы по поперечной оси (shift); положение стрелки меняется соответственно.

## Ширина, стрелка и отключение

```vue
<template>
  <!-- Фиксированная ширина -->
  <lh-popover title="Фиксированная ширина" width="240">
    <lh-button>Фиксированная ширина</lh-button>
    <template #content><text>Ширина панели задаётся через width.</text></template>
  </lh-popover>

  <!-- Без стрелки -->
  <lh-popover title="Без стрелки" :arrow="false">
    <lh-button>Без стрелки</lh-button>
    <template #content><text>При arrow равном false стрелка не отображается.</text></template>
  </lh-popover>

  <!-- Отключено -->
  <lh-popover title="Отключено" disabled>
    <lh-button disabled>Отключённый триггер</lh-button>
    <template #content><text>При disabled ни триггер, ни панель не реагируют.</text></template>
  </lh-popover>
</template>
```

## Popover API

### Props

| Свойство | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| placement | Позиция панели (12 позиций) | `LhPopoverPlacement` | `'top'` |
| trigger | Способ запуска: `click` (все платформы) / `hover`, `focus` (только H5, в MP заменяется нажатием) / `manual` (управляемый) | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'` |
| title | Заголовок (также доступен как слот title) | `string` | — |
| visible | Управляемое состояние видимости (v-model:visible) | `boolean` | — |
| disabled | Отключено | `boolean` | `false` |
| arrow | Показывать стрелку | `boolean` | `true` |
| width | Ширина панели (числа — в px) | `string \| number` | — |
| popperClass | Пользовательский класс для панели | `string` | — |
| showAfter | Задержка показа (мс, только hover / focus в H5) | `number` | — |
| hideAfter | Задержка скрытия (мс, только hover / focus в H5) | `number` | — |
| themeVars | Переменные темы на уровне компонента | `Record<string, string>` | — |
| bgPattern | Фоновый узор на уровне компонента, переопределяет ConfigProvider | `string` | — |
| sx | Быстрые свойства компоновки sx (применяются к корневому элементу триггера) | `LhSxProps` | — |

### Events

| Событие | Описание | Параметры |
| --- | --- | --- |
| update:visible | Изменение видимости (v-model) | `(value: boolean)` |
| show | Срабатывает после показа | — |
| hide | Срабатывает после скрытия | — |

### Slots

| Слот | Описание |
| --- | --- |
| default | Содержимое триггера |
| title | Пользовательский заголовок |
| content | Содержимое панели |

### Methods

| Метод | Описание |
| --- | --- |
| show | Показать программно |
| hide | Скрыть программно |
| toggle | Переключить программно |

### Доступность

- Триггер несёт `aria-haspopup="true"` вместе с `aria-expanded` / `aria-controls`; панель — `role="dialog"`, при наличии заголовка связывается через `aria-labelledby`
- Закрытие по Esc и по клику вне панели (прозрачная маска на странице); при нескольких наложенных панелях Esc закрывает только верхнюю (всё это только в H5)
- Движок позиционирования — собственная чистая функция (защита от переполнения flip / shift), без сторонних runtime-зависимостей

::: tip Отличия платформ (отличия от версии Vue3)
- **Способы запуска**: в мини-программе нет семантики hover / focus, поэтому `trigger="hover"` / `trigger="focus"` на MP заменяются переключением по нажатию / касанию; задержки (`showAfter` / `hideAfter`) действуют только в режимах hover / focus в H5, тогда как `click` и `manual` реагируют немедленно.
- **Носитель панели и позиционирование**: нет пропа `teleportTarget` — в мини-программе нет DOM-teleport, поэтому панель переносится через `root-portal` (с откатом к fixed внутри страницы на старых версиях); позиционирование popper выполняется асинхронным измерением в два кадра (скрытый рендер для замера → `computePosition` → показ, против мерцания). Вычисление асинхронно — не рассчитывайте на синхронный результат. Смещение стрелки записывается клеевым слоем компонента в `--lh-arrow-offset` из `arrowOffset` результата позиционирования.
- **Поведение клавиатуры только в H5**: закрытие по Esc использует слушатель на уровне документа (при наложении закрывает только верхнюю панель); в мини-программе нет событий клавиатуры, и весь блок вырезается условной компиляцией.
- **Фокусная ловушка не перенесена**: клик-запуск в plus удерживает фокус внутри панели (focus-trap) и возвращает его при закрытии; в MP нет семантики клавиатурного фокуса, и, как у Dialog этого репозитория, она не переносилась вовсе.
- **Нет перехода появления/исчезновения**: plus анимирует через `Transition`; на MP `Transition` ненадёжна, и, как у tooltip / dropdown, переход не привязывается.
- **Нет автозакрытия при уходе триггера за пределы области просмотра**: у `useLhPopper` в plus есть обратный вызов scroll-out; в uni-app нет единого канала отслеживания прокрутки / изменения размеров, поэтому он не перенесён.
:::
