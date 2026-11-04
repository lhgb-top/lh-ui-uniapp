# Dropdown (выпадающее меню)

Меню команд, раскрывающееся вниз. Триггером может быть любой элемент; пункты меню идентифицируются через `command` и передаются через событие `command` при клике.

## Базовое использование

```vue
<template>
  <lh-dropdown @command="onCommand">
    <lh-button>{{ selectedLabel || 'Ещё действия' }} ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="new">Создать</lh-dropdown-item>
      <lh-dropdown-item command="edit">Изменить</lh-dropdown-item>
      <lh-dropdown-item command="delete">Удалить</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const lastCommand = ref('')
// Текст триггера поддерживает потребитель: событие command передаёт только значение
// команды; какой ярлык показывать — решает внешняя сторона
const labelMap: Record<string, string> = { new: 'Создать', edit: 'Изменить', delete: 'Удалить' }
const selectedLabel = ref('')
function onCommand(command: string | number | undefined) {
  lastCommand.value = String(command)
  selectedLabel.value = labelMap[String(command)] ?? String(command)
}
</script>
```

## Способы запуска

По умолчанию `click`; также доступны наведение и долгое нажатие.

```vue
<template>
  <!-- Запуск наведением (только H5; в мини-программе деградирует до переключения по касанию) -->
  <lh-dropdown trigger="hover" @command="onHoverCommand">
    <lh-button>Запуск наведением ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="ink">Тушь</lh-dropdown-item>
      <lh-dropdown-item command="danqing">Живопись</lh-dropdown-item>
    </template>
  </lh-dropdown>

  <!-- Запуск правым кликом / долгим нажатием -->
  <lh-dropdown trigger="contextmenu" @command="onContextCommand">
    <lh-button>Запуск долгим нажатием ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="refresh">Обновить</lh-dropdown-item>
      <lh-dropdown-item command="copy">Копировать</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

## Отключённые пункты и разделители

```vue
<template>
  <!-- Меню действий с отключёнными пунктами и разделителями -->
  <lh-dropdown @command="onActionCommand">
    <lh-button>Действия ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="export">Экспорт</lh-dropdown-item>
      <lh-dropdown-item command="import">Импорт</lh-dropdown-item>
      <lh-dropdown-item divided command="audit">Журнал аудита</lh-dropdown-item>
      <lh-dropdown-item disabled command="purge">Очистить данные</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

> Отключённые пункты несут `aria-disabled="true"`, чтобы экранные дикторы могли их озвучить; стрелки их пропускают, а клики или Enter/Space не вызывают `command`.

## Позиция и максимальная высота

```vue
<template>
  <!-- Выравнивание по низу справа с ограничением максимальной высоты (прокрутка при превышении) -->
  <lh-dropdown placement="bottom-end" :max-height="160" @command="onItemCommand">
    <lh-button>Низ справа ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item v-for="i in 12" :key="i" :command="i">Пункт {{ i }}</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

## Управляемая видимость и поведение клика

`v-model:visible` управляет видимостью вручную; `hide-on-click` определяет, закрывается ли меню после выбора; `popper-class` добавляет свой класс к слою.

```vue
<template>
  <!-- Управляемая видимость: не закрывается после выбора -->
  <lh-dropdown v-model:visible="menuVisible" :hide-on-click="false" popper-class="demo-menu">
    <lh-button>{{ menuVisible ? 'Свернуть' : 'Развернуть' }} ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="copy">Копировать (не закрывается)</lh-dropdown-item>
      <lh-dropdown-item command="paste">Вставить</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const menuVisible = ref(false)
</script>
```

## Dropdown API

### Props

| Свойство | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| trigger | Способ запуска: `click` (все платформы) / `hover` (только H5, на MP деградирует до касания) / `contextmenu` (через долгое нажатие) | `'hover' \| 'click' \| 'contextmenu'` | `'click'` |
| placement | Позиция слоя (12 позиций) | `LhDropdownPlacement` | `'bottom-start'` |
| visible | Состояние видимости (v-model:visible) | `boolean` | — |
| disabled | Отключить триггер | `boolean` | `false` |
| hideOnClick | Закрывать после клика по пункту меню | `boolean` | `true` |
| popperClass | Пользовательский класс слоя | `string` | — |
| maxHeight | Максимальная высота меню (числа в px) | `string \| number` | — |
| themeVars | Переменные темы уровня компонента | `Record<string, string>` | — |
| bgPattern | Фоновый узор уровня компонента, перекрывает ConfigProvider | `string` | — |
| sx | Свойства быстрой вёрстки (применяются к корню триггера) | `LhSxProps` | — |

### Events

| Событие | Описание | Параметры |
| --- | --- | --- |
| command | Срабатывает при клике по пункту меню | `(command: string \| number \| undefined)` |
| visible-change | Изменение видимости | `(value: boolean)` |
| update:visible | Изменение видимости (v-model) | `(value: boolean)` |

### Slots

| Слот | Описание |
| --- | --- |
| default | Содержимое триггера |
| dropdown | Содержимое меню (список `LhDropdownItem`) |

### Methods

| Метод | Описание |
| --- | --- |
| show | Открыть программно |
| hide | Закрыть программно |
| toggle | Переключить программно |

## DropdownItem API

### Props

| Свойство | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| command | Идентификатор команды, передаётся с событием `command` при клике | `string \| number` | — |
| disabled | Отключён | `boolean` | `false` |
| divided | Показывает разделитель над пунктом | `boolean` | `false` |

### Events

| Событие | Описание | Параметры |
| --- | --- | --- |
| click | Срабатывает при клике по пункту (не для отключённых) | `(command: string \| number \| undefined)` |

### Доступность

- Триггер несёт `aria-haspopup="menu"` плюс `aria-expanded` / `aria-controls`; меню — `role="menu"`, пункты — `role="menuitem"`
- Клавиатура следует паттерну меню APG (только H5): ↑/↓ цикл (с пропуском отключённых), Home/End — к краям, Enter/Space вызывают `command` и закрывают, Esc закрывает и возвращает фокус
- При раскрытии переполнение по главной оси переворачивается автоматически, а по поперечной — зажимается в пределы viewport

::: tip Отличия платформы (отличия от версии Vue3)
- **Способы запуска**: в мини-программе нет семантики hover, поэтому `trigger="hover"` деградирует до переключения по касанию на MP; правого клика тоже нет — `trigger="contextmenu"` выполняется долгим нажатием (`longpress`) на обеих платформах (включая H5, без блокировки нативного контекстного меню — plus вызывает `preventDefault`).
- **Носитель слоя и позиционирование**: нет пропа `teleportTarget` — в мини-программе нет DOM teleport, слой несёт `root-portal` (с fallback fixed внутри страницы на старых версиях); позиционирование идёт через асинхронное измерение в два кадра (скрытый рендер для замера → `computePosition` → показ, против мерцания). Вычисление асинхронно: не рассчитывайте на синхронный результат.
- **Клавиатурная навигация только в H5**: стрелки / Home / End / Enter / Space / Esc работают только в H5 (Esc через слушатель уровня документа, при наложении нескольких слоёв закрывает только верхний); в мини-программе нет событий клавиатуры, и весь блок вырезается условной компиляцией.
- **Закрытие по клику снаружи** выполняет прозрачная маска внутри страницы (эквивалент слушателя click-outside уровня document в plus).
- **Нет перехода появления/исчезновения**: plus анимирует через `Transition`; на MP `Transition` ненадёжен, и, как у tooltip / select, переход не привязывается.
- **Нет автозакрытия, если триггер уходит за viewport**: у `useLhPopper` в plus есть колбэк scroll-out; в uni-app нет единого канала отслеживания прокрутки/изменения размеров, поэтому он не перенесён.
:::
