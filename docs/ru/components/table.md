# Table Таблица

Таблица данных: многоуровневые заголовки, сортировка, фильтрация, виртуальный
скроллинг и настраиваемые ячейки. Построение заголовков (`buildHeaderCells`),
сортировка (`sortTableRows`), фильтрация (`filterTableRows`), виртуальный
интервал (`computeVisibleRange`), а также расчёт имён классов / sticky-смещений
полностью берутся из чистых функций core `@lh-ui/share`.

## Платформенные различия (важно)

- **Горизонтальный скроллинг**: на H5 шапка и тело — два независимых контейнера
  прокрутки, `scrollLeft` синхронизируется в обе стороны; на стороне WeChat
  внешний `scroll-view` (scroll-x) прокручивает всю таблицу по горизонтали, шапка
  и тело разделяют общую ось прокрутки, механизм синхронизации не нужен.
- **Фиксированные столбцы (только H5)**: фиксированные столбцы опираются на
  поддержку `position: sticky` ячейками таблицы, что ненадёжно под WXSS, поэтому
  стили фиксированных столбцов в MP вырезаются на этапе сборки (обёртка
  `#ifdef H5` в `build-styles`) и деградируют до обычных горизонтально
  прокручиваемых столбцов.
- **Перетаскивание ширины столбца (только H5)**: `mousedown` и клавиатурная
  семантика в MP не существуют, поэтому рукоятки перетаскивания рендерятся только
  на H5.
- **Полосатые строки**: правило `:nth-child(even)` из share — только для H5
  (WXSS не поддерживает nth-псевдоклассы); в MP шаблон добавляет класс `--alt`
  по индексу строки.
- **Виртуальный скроллинг**: H5 использует `clientHeight` + `ResizeObserver`,
  MP — `detail.scrollTop` из `scroll-view` + `createSelectorQuery`.

## Базовое использование

```vue
<template>
  <lh-table :data="rows" :columns="columns" />
</template>

<script setup lang="ts">
const rows = [
  { id: 1, name: 'Пользователь 1', age: 28, city: 'Пекин' },
  { id: 2, name: 'Пользователь 2', age: 34, city: 'Шанхай' },
]
const columns = [
  { prop: 'name', label: 'Имя', width: 140 },
  { prop: 'age', label: 'Возраст', width: 120, align: 'right' },
  { prop: 'city', label: 'Город', width: 160 },
]
</script>
```

## Полосатые строки и границы

```vue
<template>
  <lh-table :data="rows" :columns="columns" stripe border />
</template>
```

## Сортировка и фильтрация

```vue
<template>
  <lh-table
    :data="rows"
    :columns="columns"
    @sort-change="onSort"
    @filter-change="onFilter"
  />
</template>

<script setup lang="ts">
const columns = [
  { prop: 'age', label: 'Возраст', width: 120, sortable: true },
  {
    prop: 'city',
    label: 'Город',
    width: 160,
    filters: [
      { text: 'Пекин', value: 'Пекин' },
      { text: 'Шанхай', value: 'Шанхай' },
    ],
  },
]

function onSort(payload: { prop: string; order?: 'asc' | 'desc' }) {}
function onFilter(payload: { prop: string; values: (string | number)[] }) {}
</script>
```

Клик по заголовку сортируемого столбца переключает `нет → по возрастанию →
по убыванию` (`cycleSortOrder`); заголовок фильтруемого столбца несёт триггер
фильтра, а после отметки элементов в панели и подтверждения строки
фильтруются (логика фильтрации проходит через `filterTableRows` из share).
Состояние фильтра поддерживает управляемый (`filtered-values`) и неуправляемый
(`default-filtered-values`) режимы.

## Фиксированные столбцы и горизонтальный скроллинг (только H5)

```vue
<template>
  <lh-table :data="rows" :columns="columns" />
</template>

<script setup lang="ts">
const columns = [
  { prop: 'name', label: 'Имя', width: 140, fixed: 'left' },
  { prop: 'age', label: 'Возраст', width: 120 },
  { prop: 'city', label: 'Город', width: 160 },
  { prop: 'status', label: 'Статус', width: 120, fixed: 'right' },
]
</script>
```

`fixed: 'left' / 'right'` требует числовой ширины; для MP см. платформенные
различия выше.

## Виртуальный скроллинг (десятки тысяч строк)

```vue
<template>
  <lh-table :data="hugeRows" :columns="columns" :height="360" />
</template>
```

Установка `height` включает виртуальный скроллинг: тело таблицы получает
  фиксированную высоту и рендерит только видимое окно плюс оверхскан
(`LH_TABLE_OVERSCAN = 3`); `row-height` должен совпадать с реальной высотой
строки (по умолчанию 48).

## Настраиваемые ячейки

```vue
<template>
  <lh-table :data="rows" :columns="columns">
    <template #status="{ row }">
      <lh-tag :type="row.status === 'active' ? 'success' : 'danger'">
        {{ row.status === 'active' ? 'Включён' : 'Отключён' }}
      </lh-tag>
    </template>
  </lh-table>
</template>

<script setup lang="ts">
const columns = [
  { prop: 'name', label: 'Имя', width: 140 },
  { prop: 'status', label: 'Статус', width: 140, slot: 'status' },
]
</script>
```

Поле `slot` в конфигурации столбца объявляет именованный слот с областью видимости;
параметры слота — `{ row, column, index, value }`.

## Многоуровневые заголовки

```vue
<script setup lang="ts">
const columns = [
  { prop: 'name', label: 'Имя', width: 140 },
  {
    label: 'Группа',
    children: [
      { prop: 'age', label: 'Возраст', width: 120 },
      { prop: 'city', label: 'Город', width: 160 },
    ],
  },
]
</script>
```

Поле `children` в конфигурации столбца объявляет дочерние столбцы; строки
заголовков автоматически разбиваются по уровням и позиционируются сеткой
(`buildHeaderCells` вычисляет colspan / rowspan).

## API

### Props

| Свойство | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| data | Данные строк | `LhTableRow[]` | `[]` |
| columns | Конфигурация столбцов | `LhTableColumn[]` | `[]` |
| height | Высота тела (включает виртуальный скроллинг при установке) | `number \| string` | `-` |
| max-height | Максимальная высота в невиртуальном режиме | `number \| string` | `-` |
| row-height | Высота строки для виртуального скроллинга | `number` | `48` |
| stripe | Полосатые строки | `boolean` | `false` |
| border | Границы ячеек | `boolean` | `false` |
| size | Размер | `'small' \| 'default' \| 'large'` | `'default'` |
| row-key | Поле-ключ строки | `string` | `'id'` |
| default-sort-prop | Столбец сортировки по умолчанию | `string` | `-` |
| default-sort-order | Направление сортировки по умолчанию | `'asc' \| 'desc'` | `-` |
| sorter | Пользовательская функция сортировки | `(a, b) => number` | `-` |
| resizable | Включить перетаскивание ширины столбцов (только H5) | `boolean` | `false` |
| default-filtered-values | Состояние фильтра по умолчанию (неуправляемое) | `Record<string, (string \| number)[]>` | `{}` |
| filtered-values | Управляемое состояние фильтра | `Record<string, (string \| number)[]>` | `-` |
| sx | Быстрые пропы разметки | `LhSxProps` | `-` |

### LhTableColumn

| Свойство | Описание | Тип |
| --- | --- | --- |
| prop | Имя поля | `string` |
| label | Текст заголовка | `string` |
| width | Ширина столбца (числа — в px) | `number \| string` |
| align | Выравнивание | `'left' \| 'center' \| 'right'` |
| fixed | Фиксированный столбец (только H5) | `'left' \| 'right'` |
| sortable | Сортируемый | `boolean` |
| resizable | Можно перетаскивать (требуется поуровневое включение и числовой `width`, только H5) | `boolean` |
| filters | Элементы фильтра | `{ text, value }[]` |
| filter-multiple | Множественный выбор в фильтре (по умолчанию true) | `boolean` |
| formatter | Форматирование ячейки | `(row, value) => string` |
| slot | Имя slots для настраиваемой ячейки | `string` |
| children | Дочерние столбцы (многоуровневые заголовки) | `LhTableColumn[]` |

### Events

| Событие | Описание | Параметры |
| --- | --- | --- |
| sort-change | Сортировка изменилась | `(payload: { prop, order })` |
| row-click | Клик по строке | `(row, index)` |
| filter-change | Фильтр изменился | `(payload: { prop, values })` |
| update:filtered-values | Обновление управляемого фильтра | `(values)` |
| column-resize | Изменение ширины столбца (только H5) | `(payload: { prop, width })` |

### Слоты

| Слот | Описание | Параметры области видимости |
| --- | --- | --- |
| [Слот столбца] | Настраиваемая ячейка (имя задаётся полем `slot` конфигурации столбца) | `{ row, column, index, value }` |
| empty | Содержимое при отсутствии данных (по умолчанию «Нет данных») | `-` |
