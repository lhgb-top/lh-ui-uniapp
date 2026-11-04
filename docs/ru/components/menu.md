# Menu Меню навигации

Меню навигации для страниц и разделов. Поддерживает два режима расположения — вертикальный (по умолчанию) и горизонтальный — с рекурсивно вложенными подменю; активный элемент хранится в `v-model`, а набор раскрытых подменю может быть управляемым (`openeds`) или оставаться внутренним состоянием (`default-openeds`).

## Базовое использование

```vue
<template>
  <lh-menu v-model="active">
    <lh-menu-item index="1">Главная</lh-menu-item>
    <lh-menu-item index="2">Работы</lh-menu-item>
    <lh-menu-item index="3">О нас</lh-menu-item>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('1')
</script>
```

`index` — уникальный идентификатор элемента; при нажатии на листовой элемент он выбрасывается вместе с событием `select` (`update:modelValue` выбрасывается синхронно, поэтому его можно принять через `v-model`).

## Подменю и раскрытие по умолчанию

```vue
<template>
  <lh-menu v-model="active" :default-openeds="['2']" @select="onSelect">
    <lh-menu-item index="1">Главная</lh-menu-item>
    <lh-sub-menu index="2" title="Мои работы">
      <lh-menu-item index="2-1">Живопись тушью</lh-menu-item>
      <lh-menu-item index="2-2">Живопись гунби</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('')
function onSelect(index: string, indexPath: string[]) {
  console.log(index, indexPath)
}
</script>
```

Подменю могут вкладываться на несколько уровней: `indexPath` события `select` — полный путь от самого внешнего подменю до выбранного элемента (например `['2', '2-1', '2-1-1']`).

## Аккордеон

`unique-opened` оставляет раскрытым одновременно не более одного подменю (повторное нажатие на раскрытый заголовок сворачивает его; полностью свёрнутое состояние допустимо).

```vue
<template>
  <lh-menu v-model="active" unique-opened>
    <lh-sub-menu index="1" title="Первая группа">
      <lh-menu-item index="1-1">Пункт 1-1</lh-menu-item>
    </lh-sub-menu>
    <lh-sub-menu index="2" title="Вторая группа">
      <lh-menu-item index="2-1">Пункт 2-1</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>
```

## Управляемое раскрытие

Передача `openeds` включает управляемый режим: компонент больше не поддерживает состояние раскрытия сам, им управляет обратный вызов `update:openeds`.

```vue
<template>
  <lh-menu v-model="active" :openeds="openeds" @update:openeds="openeds = $event">
    <lh-sub-menu index="1" title="Управляемое подменю">
      <lh-menu-item index="1-1">Пункт 1-1</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('')
const openeds = ref<string[]>(['1'])
</script>
```

## Группировка

`lh-menu-item-group` объединяет однородные элементы (исключительно визуальная группировка; в логике раскрытия не участвует).

```vue
<template>
  <lh-menu v-model="active">
    <lh-menu-item-group title="Базовое содержимое">
      <lh-menu-item index="1">Статьи</lh-menu-item>
      <lh-menu-item index="2">Изображения</lh-menu-item>
    </lh-menu-item-group>
    <lh-menu-item-group title="Расширенные функции">
      <lh-menu-item index="3">Аналитика данных</lh-menu-item>
    </lh-menu-item-group>
  </lh-menu>
</template>
```

## Горизонтальный режим

```vue
<template>
  <lh-menu v-model="active" mode="horizontal">
    <lh-menu-item index="1">Главная</lh-menu-item>
    <lh-sub-menu index="2" title="Портфолио">
      <lh-menu-item index="2-1">Живопись тушью</lh-menu-item>
      <lh-menu-item index="2-2">Живопись гунби</lh-menu-item>
    </lh-sub-menu>
    <lh-menu-item index="3">О нас</lh-menu-item>
  </lh-menu>
</template>
```

В горизонтальном режиме подменю вылетают из-под заголовка (`bottom-start`), а вложенные уровни — справа (`right-start`).

## Свёрнутый режим

Вертикальный режим вместе с `collapse` сворачивает меню в узкую полосу; подменю превращаются в вылетающие панели справа.

```vue
<template>
  <lh-menu v-model="active" collapse>
    <lh-sub-menu index="1" title="Почта">
      <lh-menu-item index="1-1">Входящие</lh-menu-item>
      <lh-menu-item index="1-2">Отправленные</lh-menu-item>
    </lh-sub-menu>
    <lh-menu-item index="2">Черновики</lh-menu-item>
  </lh-menu>
</template>
```

## Menu API

### Props

| Свойство | Описание | Тип | Значение по умолчанию |
| --- | --- | --- | --- |
| modelValue | Активный элемент (v-model; поддерживается внутренне, если не передан) | `string` | — |
| mode | Режим расположения | `'horizontal' \| 'vertical'` | `'vertical'` |
| collapse | Сворачивает вертикальное меню в полосу значков (подменю становятся вылетающими панелями) | `boolean` | `false` |
| defaultOpeneds | Ключи подменю, раскрытых по умолчанию (неуправляемое) | `string[]` | `[]` |
| openeds | Ключи раскрытых подменю (управляемое) | `string[]` | — |
| uniqueOpened | Аккордеон: одновременно раскрыто не более одного подменю | `boolean` | `false` |
| sx | Быстрые props раскладки | `LhSxProps` | — |

### Events

| Событие | Описание | Параметры |
| --- | --- | --- |
| select | Срабатывает при выборе листового элемента | `(index: string, indexPath: string[])` |
| open | Срабатывает при раскрытии подменю | `(index: string, indexPath: string[])` |
| close | Срабатывает при сворачивании подменю | `(index: string, indexPath: string[])` |
| update:modelValue | Изменение активного элемента (v-model) | `(value: string)` |
| update:openeds | Изменение набора раскрытых | `(value: string[])` |

### Slots

| Slot | Описание |
| --- | --- |
| default | Содержимое меню (композиция из `LhMenuItem` / `LhSubMenu` / `LhMenuItemGroup`) |

## MenuItem API

### Props

| Свойство | Описание | Тип | Значение по умолчанию |
| --- | --- | --- | --- |
| index | Уникальный идентификатор (обязательный) | `string` | — |
| disabled | Отключён (сохраняется семантика aria-disabled; клик и активация с клавиатуры не срабатывают) | `boolean` | `false` |
| sx | Быстрые props раскладки | `LhSxProps` | — |

### Events

| Событие | Описание | Параметры |
| --- | --- | --- |
| click | Срабатывает при нажатии на листовой элемент (для отключённых не срабатывает) | `(index: string)` |

## SubMenu API

### Props

| Свойство | Описание | Тип | Значение по умолчанию |
| --- | --- | --- | --- |
| index | Уникальный идентификатор (обязательный) | `string` | — |
| title | Заголовок (также доступен slot `title`) | `string` | — |
| disabled | Отключён | `boolean` | `false` |
| sx | Быстрые props раскладки | `LhSxProps` | — |

### Events

| Событие | Описание | Параметры |
| --- | --- | --- |
| select | Срабатывает при выборе листового элемента-потомка (путь включает index этого уровня) | `(index: string, indexPath: string[])` |

### Slots

| Slot | Описание |
| --- | --- |
| default | Содержимое подменю (можно вкладывать дальше `LhMenuItem` / `LhSubMenu`) |
| title | Пользовательское содержимое заголовка |

## MenuItemGroup API

### Props

| Свойство | Описание | Тип | Значение по умолчанию |
| --- | --- | --- | --- |
| title | Заголовок группы (также доступен slot `title`) | `string` | — |
| sx | Быстрые props раскладки | `LhSxProps` | — |

### Slots

| Slot | Описание |
| --- | --- |
| default | Содержимое группы |
| title | Пользовательский заголовок группы |

### Доступность

- Контейнер имеет `role="menu"` (`role="menubar"` в горизонтальном режиме); листовые элементы и заголовки подменю — `role="menuitem"`, отключённые элементы несут `aria-disabled`, а заголовки подменю дополнительно — `aria-expanded` / `aria-haspopup` / `aria-controls`
- Клавиатура следует паттерну меню APG (только H5): в вертикальном режиме ↑/↓ циклически проходят по видимым элементам (пропуская отключённые и элементы внутри свёрнутых панелей), Home/End прыгают в крайние позиции; Enter/Space активируют листовой элемент; на заголовке подменю Enter/Space/→ раскрывают его и переносят фокус в панель, ←/Esc сворачивают
- В горизонтальном режиме семантика ←/→ оставлена самому заголовку; корневой контейнер не перехватывает стрелки

::: tip Платформенные различия (отличия от версии Vue3)
- **Вертикальный режим и аккордеон работают на всех платформах**: вертикальный режим (включая линейное раскрытие подменю, аккордеон и управление через v-model / openeds) реализован на чистом CSS и provide/inject, поведение на H5 и в WeChat Mini Program одинаково.
- **Горизонтальная прокрутка**: когда суммарная ширина элементов горизонтального режима превышает контейнер, прокрутку берёт на себя собственный `overflow-x` контейнера (view поддерживают прокрутку по переполнению в WXSS), без обёртки содержимого в `scroll-view` — последний на H5 оборачивает содержимое slot во внутренний слой `uni-scroll-view-content` и ломает flex-структуру прямых потомков share scss (в отличие от горизонтального заголовка lh-tabs, элементы меню — блочный flex, и не могут спастись inline-flex, как вкладки).
- **Вылетающие подменю едут на root-portal**: вылетающие панели горизонтального / свёрнутого режима заменяют плюсовый `<teleport to="body">` на `lh-root-portal` (с внутристраничным fallback `fixed` для старых базовых версий); позиционирование идёт через асинхронный двухкадровый замер (рендер скрытым для замера → `computePosition` ставит позицию → показ, чтобы избежать мерцания); расчёт позиции асинхронный, нельзя рассчитывать на синхронный результат; вложенные уровни вылетают справа (`right-start`).
- **Наведение только на H5**: раскрытие заголовка по наведению работает только на H5; в Mini Program нет семантики hover, поэтому открытие и закрытие вылетающих панелей осуществляется нажатиями на заголовок, а нажатие вне панели ловится прозрачной маской внутри страницы (эквивалент семантики сворачивания по mouseleave из плюс).
- **Клавиатурная навигация только на H5**: ↑/↓ / Home / End / Enter / Space / ←/→ / Esc работают только на H5; в Mini Program нет событий клавиатуры, и весь блок вырезается условной компиляцией (мёртвого кода в MP-пакете нет).
- **Переходов появления и скрытия нет**: плюс анимирует через `Transition`, что ненадёжно в MP, поэтому — как и в tooltip / select — переходы не привязываются; анимация линейного раскрытия панели на чистом CSS (grid-template-rows 0fr/1fr) без прослушивания transitionend (ненадёжно в MP); даже если MP не поддерживает переход, конечное состояние всё равно корректно.
:::
