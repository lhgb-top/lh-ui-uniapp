# Steps (индикатор этапов)

Проводит пользователя по процессу выполнения задачи. Поддерживаются горизонтальная / вертикальная раскладка, иконки, описания и навигация по клику. Чисто демонстрационный компонент с состояниями, полностью доступен на H5 и в WeChat Mini Program.

## Базовое использование

`current` задаёт индекс текущего этапа (от 0, поддерживает двустороннюю привязку `v-model:current`). Предыдущие этапы получают `finish`, текущий — `process`, последующие — `wait`.

```vue
<template>
  <lh-steps :current="current">
    <lh-step
      title="Растирать тушь"
      description="Тушь пяти оттенков"
    />
    <lh-step
      title="Эскиз"
      description="Компоновать композицию"
    />
    <lh-step
      title="Нанести тушь"
      description="Штрих как основа"
    />
    <lh-step
      title="Надпись"
      description="Финальный штрих"
    />
  </lh-steps>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const current = ref(1)
</script>
```

## Вертикальные этапы

`direction="vertical"` переключает на вертикальную раскладку (управляется CSS, отличается на платформах одинаково).

```vue
<template>
  <lh-steps
    :current="1"
    direction="vertical"
  >
    <lh-step
      title="Заказ оформлен"
      description="2026-10-01 10:00"
    />
    <lh-step
      title="Оплата получена"
      description="2026-10-01 10:05"
    />
    <lh-step
      title="Отправлен"
      description="Доставка 10-03"
    />
    <lh-step title="Подтвердить получение" />
  </lh-steps>
</template>
```

## С иконками

Передайте `icon` в `lh-step`, чтобы использовать встроенный шрифт иконок (имена см. в документации Icon). Без него `finish` показывает галочку, `error` — крестик, остальные — порядковый номер.

```vue
<template>
  <lh-steps :current="1">
    <lh-step
      title="Регистрация"
      icon="user"
    />
    <lh-step
      title="Проверка"
      icon="email"
    />
    <lh-step
      title="Готово"
      icon="check"
    />
  </lh-steps>
</template>
```

Слот `icon` полностью переопределяет стандартное заполнение (подойдёт любая графика или текст):

```vue
<template>
  <lh-steps :current="2">
    <lh-step title="Шаг один">
      <template #icon>
        <text class="step-badge">I</text>
      </template>
    </lh-step>
    <lh-step title="Шаг два">
      <template #icon>
        <text class="step-badge">II</text>
      </template>
    </lh-step>
    <lh-step title="Шаг три">
      <template #icon>
        <text class="step-badge">III</text>
      </template>
    </lh-step>
  </lh-steps>
</template>
```

## Навигация по клику

С `clickable` этапы в состоянии `finish` или `process` получают кликабельную головную часть; клик порождает `update:current` (v-model) и `change`. Предстоящие этапы `wait` недоступны для перехода.

```vue
<template>
  <lh-steps
    v-model:current="active"
    clickable
  >
    <lh-step title="Шаг один" />
    <lh-step title="Шаг два" />
    <lh-step title="Шаг три" />
  </lh-steps>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref(1)
</script>
```

## Принудительная установка состояния

`status` переопределяет вычисленное состояние всех этапов (`wait` / `process` / `finish` / `error`) для произвольной подачи.

```vue
<template>
  <lh-steps
    :current="2"
    status="error"
  >
    <lh-step title="Шаг один" />
    <lh-step title="Шаг два" />
    <lh-step title="Шаг три" />
  </lh-steps>
</template>
```

## Свойства Steps

| Свойство | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| current | Индекс текущего этапа (v-model:current, от 0) | `number` | `0` |
| direction | Направление: `'horizontal'` / `'vertical'` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| clickable | Доступность этапов для клика (только завершённые / текущие) | `boolean` | `false` |
| status | Переопределяет состояние всех этапов (произвольная подача) | `'wait' \| 'process' \| 'finish' \| 'error'` | — |
| customClass | Пользовательский класс (пробрасывается на корневой узел) | `string` | — |
| sx | Быстрые свойства раскладки | `LhSxProps` | — |

## Свойства Step

| Свойство | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| title | Заголовок этапа (также слот title) | `string` | `''` |
| description | Описание этапа (также слот description) | `string` | `''` |
| icon | Имя пользовательской иконки (без него finish/error — галочка/крестик, остальные — номер) | `LhIconName` | — |
| customClass | Пользовательский класс (пробрасывается на корневой узел элемента) | `string` | — |

## События

| Событие | Описание | Аргументы |
| --- | --- | --- |
| update:current | Текущий этап изменился (v-model:current) | `(index: number)` |
| change | Переход по клику на кликабельный этап | `(index: number)` |

## Слоты

| Слот | Описание |
| --- | --- |
| Steps default | Узлы этапов (собираются только `lh-step`) |
| Step icon | Содержимое кружка (переопределяет свойство icon и номер) |
| Step title | Заголовок (переопределяет свойство title) |
| Step description | Описание (переопределяет свойство description) |

## Платформенные различия

- **Чисто демонстрационный компонент с состояниями, полностью доступен на H5 и в WeChat Mini Program**; горизонтальная / вертикальная раскладка управляется CSS и одинакова на обеих платформах.
- `<ol>/<li>` заменены на `<view>` (WXSS запрещает селекторы по тегу); кликабельные головные части используют `view` + `role="button"` (у `<button>` Mini Program собственные стили, которые не сбросить). Доступные имена берутся из ключей `steps.step` / `steps.finish` / `steps.error` локалей share (все девять языков, копий в репозитории не хранится).
- **Механизм «последний этап без соединительной линии» различается по платформам**: в исходниках share линии (горизонтальная `::after` / вертикальная `::before`) опираются на структурный `:not(:last-child)`, чтобы пропустить последний элемент; WXSS не поддерживает `:not()`, поэтому сборка его убирает (линию рисуют все элементы), а скрытие последнего / конца строки делегируется классу `--line-last`:
  - Горизонталь: логика измерения переноса строк та же, что в версии Vue 3 (`getStepsLineLastIndices`), но измерение проходит через адаптер `getLhRect` (H5 — запросы к document, MP — асинхронный `createSelectorQuery`, обязательно после onMounted).
  - Вертикаль: переноса нет, поэтому последний элемент глобально помечается напрямую, а SFC компонента добавляет одно uni-app-правило, скрывающее `--line-last::before` (в исходниках share такого правила нет).
- **Перерасчёт переноса при изменении ширины контейнера — только для H5**: H5 использует `ResizeObserver`; в MP такого API нет, добавление / удаление этапов и смена направления всё равно вызывают перерасчёт, а вот динамическое изменение размеров потребует перезахода на страницу (допустимая деградация, чтобы в MP-бандле не было мёртвого кода).
- **Решение по портированию (выровнено с версией Vue 3, выдуманных API нет)**: на момент портирования в источнике plus не было режима `simple`, собственных статусов `process-status` / `finish-status`, интервалов `space` и подобных API (свойства источника — `current` / `direction` / `clickable` / `status` / `themeVars` / `sx`), поэтому и эта библиотека их не предоставляет. `themeVars` также отсутствует (список `componentTheme` ConfigProvider этого репозитория ещё не включает steps). Они появятся, как только их добавит источник.
