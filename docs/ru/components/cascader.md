# Cascader Каскадный селектор

Каскадный селектор для иерархических данных — например, выбора провинции / города / района. Нажатие на триггер открывает много колоночную панель; уровни раскрываются один за другим, а выбор завершается выбором листового узла (или любого уровня при `check-strictly`).

## Базовое использование

```vue
<template>
  <lh-cascader v-model="value" :options="options" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const options = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      {
        value: 'sheji',
        label: '设计指南',
        children: [
          { value: 'yuansze', label: '颜色' },
          { value: 'fuziyuanze', label: '字体' },
        ],
      },
      { value: 'shejiguize', label: '设计规则' },
    ],
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      { value: 'jiben', label: '基础' },
      { value: 'fankui', label: '反馈' },
    ],
  },
]
</script>
```

Нажатие на элемент с потомками сначала раскрывает следующую колонку, а последующее нажатие на листовой узел выбирает его (в режиме одиночного выбора панель закрывается сама).

## Множественный выбор

```vue
<template>
  <lh-cascader v-model="value" :options="options" multiple />
  <!-- Свёрнутые теги: только первый выбранный элемент + счётчик -->
  <lh-cascader v-model="value2" :options="options" multiple collapse-tags />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const value2 = ref<(string | number)[]>(['yuansze', 'fuziyuanze'])
const options = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      { value: 'sheji', label: '设计指南' },
      { value: 'shejiguize', label: '设计规则' },
    ],
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      { value: 'jiben', label: '基础组件' },
      { value: 'fankui', label: '反馈组件' },
    ],
  },
]
</script>
```

В режиме множественного выбора `v-model` привязан к массиву **значений последнего уровня** каждого выбранного пути; выбранные элементы показываются внутри триггера в виде тегов.

## Отключённые пункты

`disabled: true` в данных узла отключает этот узел (нажатие не раскрывает и не выбирает его); prop `disabled` отключает весь селектор; `readonly` показывает значение, не открывая панель.

```vue
<template>
  <lh-cascader v-model="value" :options="disabledOptions" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const disabledOptions = [
  {
    value: 'zhinan',
    label: '指南',
    disabled: true,
    children: [{ value: 'sheji', label: '设计指南' }],
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      { value: 'jiben', label: '基础组件' },
      { value: 'fankui', label: '反馈组件', disabled: true },
    ],
  },
]
</script>
```

## Отображение пути и возвращаемое значение

```vue
<template>
  <!-- Полный путь (по умолчанию) -->
  <lh-cascader v-model="value" :options="options" placeholder="Полный путь (по умолчанию)" />
  <!-- Только последний уровень -->
  <lh-cascader v-model="value" :options="options" :show-all-levels="false" placeholder="Только последний уровень" />
  <!-- Пользовательский разделитель -->
  <lh-cascader v-model="value" :options="options" separator=" > " placeholder="Разделитель >" />
  <!-- v-model привязан только к значению последнего уровня (эхо остаётся полным путём) -->
  <lh-cascader v-model="leafValue" :options="options" :emit-path="false" placeholder="Только значение последнего уровня" />
  <!-- Любой уровень доступен для выбора (нажатие на нелистовой узел выбирает его) -->
  <lh-cascader v-model="anyValue" :options="options" check-strictly placeholder="Любой уровень доступен для выбора" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>(['zhinan', 'sheji', 'yuansze'])
const leafValue = ref<(string | number)[]>(['yuansze'])
const anyValue = ref<(string | number)[]>(['zhinan', 'sheji'])
const options = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      { value: 'sheji', label: '设计指南', children: [{ value: 'yuansze', label: '颜色' }] },
    ],
  },
]
</script>
```

> Плейсхолдер по умолчанию берётся из ключа локали `cascader.placeholder` («请选择» в китайском) и может быть переопределён через `placeholder`.

## Фильтрация

`filterable` включает поиск: поле фильтра расположено внутри панели (в Mini Program нет семантики фокуса ввода внутри триггера); после ввода ключевого слова результаты показываются полным путём, а нажатие на результат выбирает его напрямую.

```vue
<template>
  <lh-cascader v-model="value" :options="options" filterable placeholder="Введите ключевое слово" />
</template>
```

При отсутствии совпадений показывается ключ локали `cascader.noMatch` («无匹配数据» в китайском), который можно переопределить через slot `no-match`.

## Псевдонимы полей

`item-config` объявляет псевдонимы полей узла (`value` / `label` / `children` / `disabled` / `leaf`), поэтому асинхронные данные или структуры бэкенда не требуют ручного преобразования:

```vue
<template>
  <lh-cascader
    v-model="value"
    :options="aliasedOptions"
    :item-config="{ value: 'id', label: 'name', children: 'sub' }"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>(['zhejiang', 'hangzhou', 'xihu'])
const aliasedOptions = [
  {
    id: 'zhejiang',
    name: '浙江省',
    sub: [{ id: 'hangzhou', name: '杭州市', sub: [{ id: 'xihu', name: '西湖区' }] }],
  },
]
</script>
```

## Cascader API

### Props

| Свойство | Описание | Тип | Значение по умолчанию |
| --- | --- | --- | --- |
| modelValue | Привязанное значение (при `emitPath` равном `false` — только последний уровень) | `(string \| number)[]` | `() => []` |
| options | Список пунктов (древовидная структура) | `LhCascaderNode[]` | `() => []` |
| size | Размер | `LhCascaderSize` | `'medium'` |
| disabled | Отключает весь селектор | `boolean` | `false` |
| clearable | Можно ли очищать | `boolean` | `true` |
| placeholder | Плейсхолдер (если не передан — ключ локали `cascader.placeholder`) | `string` | — |
| readonly | Только чтение (не открывает панель) | `boolean` | `false` |
| showAllLevels | Показывает ли триггер полный путь | `boolean` | `true` |
| checkStrictly | Любой уровень узла доступен для выбора | `boolean` | `false` |
| emitPath | Возвращаемое значение содержит полный путь | `boolean` | `true` |
| multiple | Множественный выбор | `boolean` | `false` |
| cascading | Каскадная связь (раскрывает потомков при наведении, действует только в H5) | `boolean` | `true` |
| separator | Разделитель пути | `string` | `'/'` |
| collapseTags | Сворачивать ли теги в режиме множественного выбора | `boolean` | `false` |
| filterable | Доступен ли поиск | `boolean` | `false` |
| itemConfig | Псевдонимы полей узла | `LhCascaderItemConfig` | `() => ({})` |
| customClass | Пользовательский класс (пробрасывается в корневой узел) | `string` | — |
| themeVars | Переменные темы на уровне компонента | `Record<string, string>` | — |
| sx | Быстрые props раскладки (применяются к корню триггера, плавающая панель не затрагивается) | `LhSxProps` | — |

### Events

| Событие | Описание | Параметры |
| --- | --- | --- |
| update:modelValue | Срабатывает при изменении привязанного значения | `(value: (string \| number)[])` |
| change | Срабатывает при изменении выбранного значения | `(value: (string \| number)[], path: LhCascaderNode[] \| null)` |

### Slots

| Slot | Описание |
| --- | --- |
| no-match | Пользовательское содержимое, когда фильтрация не нашла совпадений |

### Структура данных

Определение типа `LhCascaderNode`:

```ts
interface LhCascaderNode {
  value: string | number
  label: string
  disabled?: boolean
  leaf?: boolean
  children?: LhCascaderNode[]
}
```

### Доступность

- Триггер несёт `aria-haspopup="listbox"` / `aria-expanded` / `aria-controls` (пакет атрибутов выдаёт чистая функция `getCascaderTriggerAria` из share, привязываемая ключ за ключом в явном виде)
- Плавающая панель — `role="dialog"`, а каждая колонка — `role="listbox"` (`aria-label` берётся из ключа локали `cascader.columnLabel`, «第 N 级»); элементы колонок — `role="option"` и несут `aria-selected` / `aria-disabled` / `aria-expanded`
- Движок позиционирования — собственная реализация на чистых функциях (flip / shift от переполнения), без сторонних зависимостей в рантайме

::: tip Платформенные различия (отличия от версии Vue3)
- **Панель становится плавающим слоем**: в плюс панель подвешена под `Teleport to="body"` с затуханием через `Transition`; со стороны uni-app её несёт `lh-root-portal` (с внутристраничным fallback `fixed` для старых базовых версий), а позиционирование идёт через асинхронный двухкадровый замер (рендер скрытым для замера → `computePosition` ставит позицию → показ, чтобы избежать мерцания). Расчёт позиции асинхронный, нельзя рассчитывать на синхронный результат. Переходы появления и скрытия не привязаны (`Transition` ненадёжен в MP, как и tooltip / dropdown / popover).
- **Прокрутка колонок**: каждая колонка — `scroll-view` (`scroll-y`) с независимой вертикальной прокруткой — у `view` в MP нет надёжной прокрутки по переполнению, поэтому контейнер колонки с `overflow-y: auto` из scss share на H5 прикрывается эквивалентной реализацией `scroll-view`.
- **Клавиатурная навигация только на H5**: Enter/Space на триггере открывают и закрывают, стрелки переносят фокус в панель; внутри панели ↑↓ двигаются по колонке (пропуская отключённые), ←→ переключают колонки, Enter/Space эквивалентны клику; Escape закрывает через слушатель на уровне документа (при нескольких плавающих слоях закрывается только верхний). Всё тело обработчика вырезается условной компиляцией; мёртвого кода в MP-пакете нет.
- **Раскрытие при наведении только на H5**: раскрытие потомков при наведении, свойственное `cascading`, опирается на семантику hover, которой нет в Mini Program; там потомки раскрываются только кликом (`cascading` в MP эквивалентно отключению раскрытия при наведении).
- **Расположение поля фильтра**: в плюс полем фильтра `filterable` является сам триггер; сторона uni-app помещает его внутрь плавающей панели (как select), поскольку в MP нет семантики фокуса ввода внутри триггера.
- **Закрытие по клику снаружи**: плюс слушает клики по document через `useLhClickOutside`; сторона uni-app полагается на прозрачную маску внутри страницы (клик по маске закрывает).
- **Триггер не сворачивается при выходе из области просмотра**: uni-app не предоставляет единого канала прослушивания прокрутки и изменений размера, поэтому не перенесено.
- **Кольцо фокуса и roving tabindex только на H5**: в MP нет семантики клавиатурного фокуса, поэтому привязка `tabindex` не оставляет следа со стороны MP.
:::
