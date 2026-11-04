# Tabs

Переключение между панелями в одной области. Заголовок вкладок поддерживает горизонтальную прокрутку, карточный стиль и закрываемые / добавляемые вкладки.

## Базовое использование

`v-model` привязывает `name` активной панели; если не указан, активируется первая доступная панель.

```vue
<template>
  <lh-tabs v-model="active">
    <lh-tab-pane
      name="ink"
      label="Тушь"
    >
      Тушь: выжженная, густая, тяжёлая, светлая, лёгкая.
    </lh-tab-pane>
    <lh-tab-pane
      name="danqing"
      label="Живопись"
    >
      Даньцин: киноварь и лазурит, классическое название живописи.
    </lh-tab-pane>
    <lh-tab-pane
      name="liubai"
      label="Пустота"
    >
      Пустота: белое считать чёрным, оставляя простор духу.
    </lh-tab-pane>
  </lh-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref('ink')
</script>
```

## Карточный стиль

`type="card"` переключает на карточный внешний вид.

```vue
<template>
  <lh-tabs
    v-model="active"
    type="card"
  >
    <lh-tab-pane
      name="spring"
      label="Весна"
    >
      Весна: растения пробуждаются.
    </lh-tab-pane>
    <lh-tab-pane
      name="summer"
      label="Лето"
    >
      Лето: всё цветёт.
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## Положение вкладок

`tab-position="bottom"` размещает заголовок вкладок под содержимым.

```vue
<template>
  <lh-tabs
    v-model="active"
    tab-position="bottom"
  >
    <lh-tab-pane
      name="poem"
      label="Поэзия"
    >
      Поэзия: выразить стремление.
    </lh-tab-pane>
    <lh-tab-pane
      name="painting"
      label="Живопись"
    >
      Живопись: передать идею.
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## Отключённые вкладки

Панель `lh-tab-pane` с `disabled` нельзя активировать (клики игнорируются, а `modelValue`, указывающий на неё, откатывается к первой доступной панели).

```vue
<template>
  <lh-tabs v-model="active">
    <lh-tab-pane
      name="first"
      label="Доступно"
    >
      Первая панель доступна.
    </lh-tab-pane>
    <lh-tab-pane
      name="second"
      label="Отключено"
      disabled
    >
      Эта панель отключена и не может быть активирована.
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## Закрываемые и добавляемые

`closable` отрисовывает кнопку закрытия на каждой вкладке (при клике генерируется `tab-remove`); `addable` отрисовывает кнопку добавления (генерируется `tab-add`). Компонент только генерирует события — добавление и удаление узлов панелей лежит на бизнес-уровне, как и в версии для Vue 3.

```vue
<template>
  <lh-tabs
    v-model="active"
    closable
    addable
    @tab-remove="handleRemove"
    @tab-add="handleAdd"
  >
    <lh-tab-pane
      v-for="pane in panes"
      :key="pane.name"
      :name="pane.name"
      :label="pane.label"
    >
      {{ pane.label }}: содержимое панели.
    </lh-tab-pane>
  </lh-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref('one')
const panes = ref([
  { name: 'one', label: 'Вкладка один' },
  { name: 'two', label: 'Вкладка два' },
])

function handleRemove(name: string) {
  panes.value = panes.value.filter((pane) => pane.name !== name)
}

function handleAdd() {
  panes.value.push({ name: `new-${panes.value.length + 1}`, label: 'Новая вкладка' })
}
</script>
```

## Tabs Props

| Prop | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| modelValue | `name` активной панели (v-model) | `string` | — |
| type | Внешний вид: `'line'` подчёркивание / `'card'` карточка | `'line' \| 'card'` | `'line'` |
| closable | Можно ли закрывать вкладки | `boolean` | `false` |
| addable | Показывать ли кнопку добавления | `boolean` | `false` |
| tabPosition | Положение вкладок: `'top'` / `'bottom'` | `'top' \| 'bottom'` | `'top'` |
| customClass | Пользовательский класс | `string` | — |
| sx | Быстрые свойства раскладки | `LhSxProps` | — |

## TabPane Props

| Prop | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| name | Уникальный идентификатор панели (стабильный ключ, не рекомендуется менять динамически) | `string` | — |
| label | Заголовок вкладки | `string` | `''` |
| disabled | Отключена ли панель | `boolean` | `false` |
| customClass | Пользовательский класс (применяется к корневому узлу панели) | `string` | — |

## Events

| Событие | Описание | Аргументы колбэка |
| --- | --- | --- |
| update:modelValue | Активная панель изменилась (v-model) | `(name: string)` |
| tab-change | Активная панель изменилась действием пользователя | `(name: string)` |
| tab-remove | Клик по кнопке закрытия; сам компонент не удаляет дочерние узлы — их поддерживает бизнес-уровень | `(name: string)` |
| tab-add | Клик по кнопке добавления; сам компонент не добавляет дочерние узлы — их поддерживает бизнес-уровень | — |

## Slots

| Slot | Описание |
| --- | --- |
| Tabs default | Узлы панелей (собираются только `lh-tab-pane`; можно оборачивать в `v-for` / `template`) |
| TabPane default | Содержимое панели |

## Различия между платформами

- Заголовок вкладок — это `scroll-view` (панель навигации с горизонтальной прокруткой): в WeChat Mini Program `enable-flex` превращает контейнер прокрутки в flex-раскладку, чтобы вкладки не сжимались и не переносились; в H5 применяется класс `display: flex`.
- **Подчёркивание активной вкладки — чистый CSS-переход** (тушевая линия `::after` активной вкладки), не зависящий от `transitionend`. Если позже появится JS-управляемый скользящий индикатор: в Mini Program `transitionend` ненадёжен, поэтому завершение анимации нужно выравнивать через `setTimeout` (тот же подход, что у переходов message / loading).
- **Клавиатурная навигация (стрелки / Home / End / Delete для закрытия) только для H5**: в Mini Program нет событий клавиатуры, а константа времени компиляции не пускает ветку навигации в MP-бандл (мёртвого кода нет). Атрибут `tabindex` (roving tabindex) в MP сохраняется, но не несёт клавиатурной семантики.
- Роли доступности `role="tablist" / "tab" / "tabpanel"` и `aria-selected` / `aria-controls` / `aria-labelledby` выводятся на обеих платформах; поддержка скринридеров в Mini Program зависит от платформы.
- `id` вкладок и панелей генерируются с уникальным префиксом экземпляра (`generateId`), поэтому несколько tabs на одной странице никогда не конфликтуют.
- **Решение по портированию (выровнено с версией Vue 3, никаких выдуманных API)**: на момент портирования эталонный исходник plus и core `@lh-ui/share` ещё не предоставляли `lazy`, `before-leave`, `editable` (= синтаксический сахар closable + addable) и внешний вид `border-card`, поэтому и эта библиотека их не предоставляет. Содержимое панелей всегда рендерится и переключается через `v-show`. Они будут добавлены, как только появятся в эталонном источнике.
