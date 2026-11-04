# Popconfirm (подтверждение во всплывающем окне)

Лёгкое подтверждение: рядом с триггером появляется всплывающее окно подтверждения, не требующее открытия диалога. Семантика — блокирующее подтверждение (`role="alertdialog"`): Escape считается отменой. Содержимое подтверждения передаётся через слот `content` или свойство `title`, а триггер оборачивается в слот по умолчанию.

## Базовое использование

```vue
<template>
  <lh-popconfirm title="Удалить эту запись?" @confirm="onConfirm" @cancel="onCancel">
    <lh-button type="danger">Удалить</lh-button>
  </lh-popconfirm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const action = ref('')
function onConfirm() {
  action.value = 'Подтверждено'
}
function onCancel() {
  action.value = 'Отменено'
}
</script>
```

::: warning В мини-программе нет семантики hover / focus
`trigger` по умолчанию `click` (доступен на всех платформах). `hover` / `focus` работают только на H5 —
в мини-программе они автоматически снижаются до переключения по клику / касанию (первый клик открывает, второй закрывает).
:::

## Три тональности

`type` задаёт иконку тональности и класс-модификатор: `info` (информация) / `warning` (предупреждение, по умолчанию) / `danger` (опасность).

```vue
<template>
  <lh-popconfirm type="info" title="Посмотреть журнал посещений этой записи?">
    <lh-button>Информация</lh-button>
  </lh-popconfirm>
  <lh-popconfirm type="warning" title="Эта операция уведомит всех участников.">
    <lh-button type="warning">Предупреждение</lh-button>
  </lh-popconfirm>
  <lh-popconfirm type="danger" title="После удаления восстановление невозможно.">
    <lh-button type="danger">Опасность</lh-button>
  </lh-popconfirm>
</template>
```

## Пользовательский текст и позиция

```vue
<template>
  <lh-popconfirm
    title="После архивации восстановление возможно через корзину."
    confirm-text="Архивировать"
    cancel-text="Передумал"
    placement="right"
  >
    <lh-button>Пользовательский текст</lh-button>
  </lh-popconfirm>

  <!-- Срабатывание по наведению (только H5, в мини-программе снижается до переключения по клику) -->
  <lh-popconfirm title="Достаточно навести для подтверждения." trigger="hover" :show-after="0" placement="bottom">
    <lh-button>Наведение</lh-button>
  </lh-popconfirm>
</template>
```

> Текст кнопок по умолчанию берётся из языкового пакета `popconfirm.confirm` / `popconfirm.cancel` и может быть переопределён через `confirm-text` / `cancel-text`.

## Управляемое отображение и иконки

```vue
<template>
  <!-- Управляемый режим: отображение полностью контролируется внешним v-model:visible -->
  <lh-popconfirm v-model:visible="pcVisible" trigger="manual" title="Управляемое окно">
    <lh-button @click="pcVisible = !pcVisible">{{ pcVisible ? 'Свернуть' : 'Развернуть' }}</lh-button>
  </lh-popconfirm>

  <!-- Отключение иконки и тип кнопки подтверждения -->
  <lh-popconfirm title="Удалить эту запись?" :show-icon="false" confirm-button-type="primary">
    <lh-button type="danger">Без иконки</lh-button>
  </lh-popconfirm>

  <!-- Отключение -->
  <lh-popconfirm title="Эта операция недоступна." disabled>
    <lh-button disabled>Отключено</lh-button>
  </lh-popconfirm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const pcVisible = ref(false)
</script>
```

## Popconfirm API

### Props

| Свойство | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| type | Тональность подтверждения: `info` / `warning` / `danger` | `'info' \| 'warning' \| 'danger'` | `'warning'` |
| placement | Позиция отображения (12 вариантов) | `LhPopconfirmPlacement` | `'top'` |
| trigger | Способ срабатывания: `click` (все платформы) / `hover`, `focus` (только H5, в MP снижается до клика) / `manual` (управляемый) | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'` |
| title | Содержимое подтверждения (можно также использовать слот content) | `string` | — |
| confirmText | Текст кнопки подтверждения (если не передан, берётся из языкового пакета popconfirm.confirm) | `string` | — |
| cancelText | Текст кнопки отмены (если не передан, берётся из языкового пакета popconfirm.cancel) | `string` | — |
| confirmButtonType | Тип кнопки подтверждения | `'default' \| 'primary'` | `'primary'` |
| visible | Управляемое состояние отображения (v-model:visible) | `boolean` | — |
| disabled | Отключено | `boolean` | `false` |
| showIcon | Показывать ли иконку тональности | `boolean` | `true` |
| popperClass | Пользовательский класс всплывающего слоя | `string` | — |
| showAfter | Задержка перед показом (мс, действительна только для hover / focus на H5) | `number` | — |
| hideAfter | Задержка перед скрытием (мс, действительна только для hover / focus на H5) | `number` | — |
| themeVars | Переменные темы на уровне компонента | `Record<string, string>` | — |
| bgPattern | Фоновый узор на уровне компонента, переопределяет ConfigProvider | `string` | — |
| sx | sx сокращённые свойства раскладки (применяются к корневому элементу триггера) | `LhSxProps` | — |

### Events

| Событие | Описание | Параметры |
| --- | --- | --- |
| confirm | Срабатывает после нажатия кнопки подтверждения | — |
| cancel | Срабатывает после нажатия кнопки отмены или Escape | — |
| update:visible | Изменение видимости (v-model) | `(value: boolean)` |
| show | Срабатывает после отображения | — |
| hide | Срабатывает после скрытия | — |

### Slots

| Слот | Описание |
| --- | --- |
| default | Содержимое триггера |
| content | Пользовательское содержимое подтверждения |

### Methods

| Метод | Описание |
| --- | --- |
| show | Программный показ |
| hide | Программное скрытие |
| toggle | Программное переключение |

### Доступность

- Всплывающий слой имеет `role="alertdialog"` + `aria-modal="true"`, содержимое подтверждения связано через `aria-labelledby`; триггер несёт `aria-haspopup` / `aria-expanded` / `aria-controls` (пакет атрибутов создаётся чистой функцией share)
- Escape считается отменой (соответствует WAI-ARIA alertdialog: Escape закрывает окно и трактуется как отрицательный ответ); при наложении нескольких слоёв Esc закрывает только верхний (только H5)
- При нажатии на кнопку отмены или на прозрачную маску вне кнопки подтверждения окно сворачивается; иконка тональности декоративная (`aria-hidden`)
- Движок позиционирования — самописные чистые функции (flip / shift от переполнения), без сторонних зависимостей времени выполнения

::: tip Платформенные различия (отличия от версии Vue 3)
- **Способ срабатывания**: в мини-программе нет семантики hover / focus, `trigger="hover"` / `trigger="focus"` в MP снижаются до переключения по клику / касанию; задержки отображения (`showAfter` / `hideAfter`) действуют только для режимов hover / focus на H5, `click` и `manual` срабатывают мгновенно.
- **Носитель всплывающего слоя и позиционирование**: нет prop `teleportTarget` — в мини-программе нет DOM teleport, всплывающий слой единообразно размещается через `root-portal` (на старых версиях — page-in fixed fallback); позиционирование popper идёт через двухкадровое асинхронное измерение (сначала скрытый рендер для замера → `computePosition` позиционирование → показ, для предотвращения мерцания); расчёт позиции асинхронный, не предполагайте синхронное получение результата; смещение стрелки записывается компонентным клеем в `--lh-arrow-offset` из результата позиционирования.
- **Клавиатурное поведение только H5**: Esc = отмена через document-уровневый слушатель (при наложении слоёв закрывается только верхний); в мини-программе нет клавиатурных событий, весь этот блок вырезан условной компиляцией.
- **Фокусная ловушка не перенесена**: plus при открытии помещает фокус на кнопку «OK», зацикливает Tab между двумя кнопками и удерживает его во всплывающем слое (focus-trap), а после закрытия возвращает фокус; в MP нет семантики клавиатурного фокуса, и в целях единообразия с Dialog / Popover в этом репозитории это не переносится.
- **Переходы появления / скрытия не реализованы**: plus использует `Transition` для плавного появления (`lh-popconfirm-fade`); в MP `Transition` ненадёжен, и, как и в tooltip / dropdown / popover, переходы не привязаны.
- **Сворачивание при прокрутке триггера за пределы viewport не реализовано**: у plus в `useLhPopper` есть callback scroll-out, но в uni-app нет единого канала прослушивания прокрутки / изменения размеров — не перенесено.
- **Значение aria-haspopup**: plus жёстко прописывает в шаблоне `aria-haspopup="dialog"`; в этом репозитории пакет атрибутов триггера единообразно создаётся share-функцией `getPopconfirmTriggerAria` (значение `'true'`), контрактом считаются чистые функции share.
:::
