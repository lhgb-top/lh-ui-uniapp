# Tree (древовидный элемент)

Отображение иерархических данных и взаимодействие с ними. Вся чистая логика — раскрытие /
сворачивание, каскадное выделение чекбоксов, слияние отложенной загрузки — потребляется напрямую
из чистых функций core `@lh-ui/share` (`flattenTree` / `toggleCheckKeys` /
`mergeLoadedChildren` и др.); слой компонента отвечает только за рендеринг, события и
навигацию с клавиатуры.

## Базовое использование

```vue
<template>
  <lh-tree :data="treeData" :default-expanded-keys="['a']" />
</template>

<script setup lang="ts">
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const treeData: LhTreeNode[] = [
  {
    key: 'a',
    label: 'Фронтенд',
    children: [
      { key: 'a-1', label: 'Vue' },
      { key: 'a-2', label: 'React' },
    ],
  },
  { key: 'b', label: 'Бэкенд', children: [{ key: 'b-1', label: 'Node' }] },
  { key: 'c', label: 'DevOps', disabled: true },
]
</script>
```

`data` — это `LhTreeNode[]`: `key` уникален, `label` — отображаемый текст, `children` —
дочерние узлы, `disabled` отключает узел, а `isLeaf` отмечает лист (выводится из `children`,
если не задано). Отступ уровня задаётся инлайновым стилем `level * 18 + 8` px. Клик по всей
строке выбирает узел (`update:selectedKeys` / `select`); при включённом `expandOnClickNode`
(по умолчанию) клик по нелистового узлу также раскрывает / сворачивает его; клик по стрелке
переключает только раскрытие.

## Чекбоксы (каскад)

`show-checkbox` отображает чекбоксы. Отметка родителя каскадно распространяется на всех
потомков; когда все дети отмечены, родитель отмечается автоматически, а частичный выбор
показывает промежуточное состояние (indeterminate).

```vue
<template>
  <lh-tree :data="treeData" show-checkbox :default-expanded-keys="['a', 'b']" />
</template>
```

Набор отметок хранится в `default-checked-keys` (неуправляемый) или `v-model:checked-keys`
(управляемый), а изменения передаются через события `update:checkedKeys` / `check`. С
`checkStrictly` отметка действует только на сам узел: без каскада к потомкам, без возврата к
предкам и без промежуточного состояния.

## Отложенная загрузка

С включённым `lazy` раскрытие незагруженного узла вызывает коллбэк `load` (`resolve` передаёт
дочерние узлы и раскрывает, `reject` или исключение отменяет); во время загрузки стрелка
вращается.

```vue
<template>
  <lh-tree :data="lazyData" lazy :load="loadNodes" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const lazyData = ref<LhTreeNode[]>([{ key: 'lazy', label: 'Нажми, чтобы загрузить', isLeaf: false }])

function loadNodes(
  node: LhTreeNode,
  resolve: (children: LhTreeNode[]) => void,
  reject: (reason?: unknown) => void,
) {
  // имитация асинхронного запроса
  setTimeout(() => {
    if (node.key === 'lazy') {
      resolve([
        { key: 'lazy-1', label: 'Дочерний узел 1', isLeaf: true },
        { key: 'lazy-2', label: 'Дочерний узел 2', isLeaf: true },
      ])
    } else {
      reject(new Error('nothing to load'))
    }
  }, 600)
}
</script>
```

Загружаемый узел должен явно объявлять `isLeaf: false` (иначе узел без `children` выводится как
лист и не получает стрелку раскрытия); если загруженные дочерние узлы — это ветви, ожидающие
загрузки, также объявите им `isLeaf: false`, а настоящим листьям `isLeaf: true`. Результаты
сливаются в `props.data` неизменяемо через `mergeLoadedChildren` из share — данные
пользователя никогда не мутируются; прибытие дочерних узлов сопровождается событием `nodeLoad`.

## Выбор и управляемые ключи

`multiple` разрешает множественный выбор (клик по узлу переключает выделение, а не заменяет);
`default-selected-keys` / `v-model:selected-keys` управляют выделением;
`default-expanded-keys` / `v-model:expanded-keys` управляют раскрытием;
`disabled` отключает всё дерево (клики и нажатия клавиш не реагируют).

```vue
<template>
  <lh-tree
    v-model:selected-keys="selKeys"
    v-model:checked-keys="chkKeys"
    :data="ctrlData"
    multiple
    :default-expanded-keys="['x']"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const selKeys = ref(['x'])
const chkKeys = ref(['x-1'])
const ctrlData: LhTreeNode[] = [
  {
    key: 'x',
    label: 'Дизайн',
    children: [{ key: 'x-1', label: 'Цвет' }, { key: 'x-2', label: 'Шрифт' }],
  },
  { key: 'y', label: 'Инженерия' },
]
</script>
```

## Виртуализация больших данных (только для uni-app)

Для сотен или тысяч узлов включите `virtual`: список узлов переносится в `scroll-view` и
рендерится окнами с фиксированной высотой строки 34 px (значение `--lh-tree-node-height` по
умолчанию), отрисовывая только видимую область плюс буфер сверху и снизу; `virtualHeight`
задаёт высоту scroll-view (числа — в px, строки — как есть, по умолчанию 300 px).

```vue
<template>
  <lh-tree :data="bigData" virtual :virtual-height="320" />
</template>
```

Содержимое узла должно помещаться в одну строку (scss share `.lh-tree-node__label` уже
принудительно задаёт `nowrap` + многоточие). Без `virtual` узлы рендерятся непосредственно в
корневом контейнере, как в версии Vue3.

## Слоты

Слот `node` с областью видимости получает `{ node, level, expanded, selected }` для настраиваемого
содержимого узла; слот `empty` настраивает пустое состояние (по умолчанию берётся ключ языка
`tree.empty`, русский «Нет данных»).

```vue
<template>
  <lh-tree :data="treeData">
    <template #node="{ node, level }">
      <text>{{ level > 0 ? '· ' : '' }}{{ node.label }}</text>
    </template>
  </lh-tree>
</template>
```

## API

### Props

| Свойство | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| data | Данные дерева | `LhTreeNode[]` | — |
| showCheckbox | Показывать чекбоксы | `boolean` | `false` |
| multiple | Множественный выбор (переключение вместо замены) | `boolean` | `false` |
| expandOnClickNode | Раскрывать / сворачивать нелистовые узлы по клику на строку | `boolean` | `true` |
| defaultExpandedKeys | Раскрытые по умолчанию ключи (неуправляемые) | `string[]` | `[]` |
| expandedKeys | Управляемые раскрытые ключи | `string[]` | — |
| defaultSelectedKeys | Выбранные по умолчанию ключи (неуправляемые) | `string[]` | `[]` |
| selectedKeys | Управляемые выбранные ключи | `string[]` | — |
| defaultCheckedKeys | Отмеченные по умолчанию ключи (неуправляемые) | `string[]` | `[]` |
| checkedKeys | Управляемые отмеченные ключи | `string[]` | — |
| checkStrictly | Родитель и ребёнок независимы (только сам узел, без каскада и промежуточного состояния) | `boolean` | `false` |
| lazy | Отложенный режим (вызывает load при раскрытии незагруженного узла) | `boolean` | `false` |
| load | Коллбэк отложенной загрузки (resolve передаёт детей и раскрывает, reject отменяет) | `(node: LhTreeNode, resolve: (children: LhTreeNode[]) => void, reject: (reason?: unknown) => void) => void` | — |
| disabled | Отключить всё дерево | `boolean` | `false` |
| virtual | Виртуализация больших данных (только для uni-app) | `boolean` | `false` |
| virtualHeight | Высота виртуального scroll-view (число в px / строка как есть) | `number \| string` | `300` |
| sx | Свойства быстрой раскладки sx | `LhSxProps` | — |

### Events

| Событие | Описание | Параметры |
| --- | --- | --- |
| update:expandedKeys | Изменился список раскрытых ключей (для v-model:expanded-keys) | `(keys: string[])` |
| update:selectedKeys | Изменился список выбранных ключей (для v-model:selected-keys) | `(keys: string[])` |
| update:checkedKeys | Изменился список отмеченных ключей (для v-model:checked-keys) | `(keys: string[])` |
| select | Срабатывает при выборе / переключении узла кликом | `(key: string, node: LhTreeNode)` |
| check | Срабатывает после изменения набора отметок | `(keys: string[], node: LhTreeNode)` |
| expand | Срабатывает после раскрытия / сворачивания узла | `(key: string, expanded: boolean)` |
| nodeLoad | Срабатывает после прибытия дочерних узлов отложенной загрузки | `(node: LhTreeNode, children: LhTreeNode[])` |

### Slots

| Слот | Описание |
| --- | --- |
| node | Содержимое узла (область видимости `{ node, level, expanded, selected }`) |
| empty | Пустое состояние (по умолчанию ключ языка `tree.empty`) |

### LhTreeNode

| Поле | Описание | Тип |
| --- | --- | --- |
| key | Уникальный ключ | `string` |
| label | Отображаемый текст | `string` |
| children | Дочерние узлы | `LhTreeNode[]` |
| disabled | Отключён | `boolean` |
| isLeaf | Лист ли это (выводится из children, если не задано) | `boolean` |

### Доступность

- `role="tree"` + `role="treeitem"`, с полным раскрытием `aria-level` / `aria-expanded` / `aria-selected` / `aria-disabled`
- Чекбоксы несут `role="checkbox"` + `aria-checked` (`mixed` для промежуточного состояния)

::: tip Платформенные отличия (отличия от версии Vue3)
- **Виртуализация — уникальная возможность этого пакета**: для больших объёмов (сотни или тысячи
  узлов) рекомендуется `virtual`; список узлов переносится в `scroll-view` и рендерится окнами с
  фиксированной высотой строки 34 px (видимая область + буфер), `virtualHeight` управляет высотой
  области просмотра. Содержимое узла должно быть в одну строку; без `virtual` узлы рендерятся
  непосредственно в корневом контейнере.
- **Навигация с клавиатуры только для H5**: клавиши по шаблону APG tree — ↑/↓ между элементами
  (пропуск отключённых, зацикленно), → для раскрытия или перехода к первому дочернему, ← для
  сворачивания или возврата к родителю, Home/End в начало / конец, Enter/Space для активации —
  работают только в H5; у мини-программы нет событий клавиатуры, и весь блок удаляется условной
  компиляцией (мёртвого кода в MP-пакете нет); roving tabindex также выводится только в H5.
- **Отступ при RTL**: отступ уровня использует физический `padding-left` на обеих платформах
  (в соответствии с действующим в репозитории решением «фиксированный LTR на MP»); если для H5
  нужно RTL-зеркалирование, переопределите на стороне потребителя.
- **Стрелка рисуется сама**: стрелка раскрытия — это глиф `▸` на `view` (поворот и вращение при
  загрузке — чистые CSS-трансформации), без зависимости от шрифта иконок.
:::
