# Drawer (выдвижная панель)

Панель, выезжающая из края экрана; подходит для временных задач, которым нужно больше места, чем Dialog (подробности, фильтры, шаги мастера). Как и Dialog, использует `role="dialog"` + `aria-modal="true"`; закрывается кликом по маске и Esc (H5).

## Базовое использование

```vue
<template>
  <lh-button @click="visible = true">Открыть панель</lh-button>

  <lh-drawer v-model="visible" title="Детали заказа">
    <view>Здесь размещается основное содержимое панели.</view>
    <view>Ширина панели задаётся size, по умолчанию 30% ширины области просмотра.</view>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
</script>
```

## Четыре направления

`direction` принимает `right` (по умолчанию) / `left` / `top` / `bottom`; панель выезжает с соответствующего края.

```vue
<template>
  <!-- Открыть правую панель -->
  <lh-button @click="openDir('right')">right</lh-button>
  <!-- Открыть левую панель -->
  <lh-button @click="openDir('left')">left</lh-button>
  <!-- Открыть верхнюю панель -->
  <lh-button @click="openDir('top')">top</lh-button>
  <!-- Открыть нижнюю панель -->
  <lh-button @click="openDir('bottom')">bottom</lh-button>

  <!-- Выезжает в указанном направлении -->
  <lh-drawer v-model="dirVisible" :title="`Панель ${direction}`" :direction="direction" size="40%">
    <view>Текущее направление: {{ direction }}</view>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhDrawerDirection } from '@lh-ui/uniapp'

const dirVisible = ref(false)
const direction = ref<LhDrawerDirection>('right')
function openDir(d: LhDrawerDirection) {
  direction.value = d
  dirVisible.value = true
}
</script>
```

## Пользовательский размер

Числовой `size` — в px; строки поддерживают проценты (например, `'40%'`). Горизонтальные направления применяют его к ширине, вертикальные — к высоте.

```vue
<template>
  <!-- Открыть панель шириной 480px -->
  <lh-button @click="sized = true">Панель 480px</lh-button>

  <!-- Панель фиксированного размера с областью действий внизу -->
  <lh-drawer v-model="sized" title="Условия фильтрации" :size="480">
    <view>Фильтруйте данные по названию или метке.</view>
    <template #footer>
      <lh-button @click="sized = false">Отмена</lh-button>
      <lh-button type="primary" @click="sized = false">Применить фильтры</lh-button>
    </template>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const sized = ref(false)
</script>
```

## Переключатели поведения

`mask-closable` управляет закрытием по клику маски, `show-close` — кнопкой закрытия в правом верхнем углу, `close-on-esc` — закрытием по Esc (только H5), `lock-scroll` — блокировкой прокрутки страницы, пока панель открыта (только H5).

```vue
<template>
  <!-- Открыть панель «закрытие только кнопкой» -->
  <lh-button @click="locked = true">Закрытие только кнопкой</lh-button>

  <!-- Клики по маске и Esc не закрывают её; только кнопка -->
  <lh-drawer
    v-model="locked"
    title="Закрытие только кнопкой"
    :mask-closable="false"
    :show-close="false"
    :close-on-esc="false"
  >
    <view>Ни клики по маске, ни Esc (H5) её не закрывают.</view>
    <template #footer>
      <lh-button type="primary" @click="locked = false">Закрыть</lh-button>
    </template>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const locked = ref(false)
</script>
```

## Drawer API

### Props

| Свойство | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| modelValue (v-model) | Показана ли панель | `boolean` | `false` |
| title | Заголовок (или используйте слот header) | `string` | — |
| direction | Направление | `'right' \| 'left' \| 'top' \| 'bottom'` | `'right'` |
| size | Размер: числа — px, строки поддерживают проценты | `string \| number` | `'30%'` |
| maskClosable | Закрывать по клику маски | `boolean` | `true` |
| showClose | Показывать кнопку закрытия | `boolean` | `true` |
| lockScroll | Блокировать прокрутку, пока открыта (**только H5**) | `boolean` | `true` |
| closeOnEsc | Реагировать на Esc (**только H5**) | `boolean` | `true` |
| customClass | Пользовательское имя класса (передаётся корневому узлу) | `string` | — |
| themeVars | Переменные темы на уровне компонента | `Record<string, string>` | — |
| bgPattern | Фоновый узор на уровне компонента, переопределяет ConfigProvider | `string` | — |
| sx | Быстрые свойства компоновки sx (применяются к панели) | `LhSxProps` | — |

### Events

| Событие | Описание | Параметры |
| --- | --- | --- |
| update:modelValue | Видимость изменилась (после анимации) | `(visible: boolean)` |
| open | Открыта | — |
| close | Закрыта (после анимации) | — |

### Slots

| Слот | Описание |
| --- | --- |
| default | Основное содержимое |
| header | Своя область заголовка (заменяет текст title) |
| footer | Область действий внизу |

### Methods

| Метод | Описание |
| --- | --- |
| open | Открыть программно |
| close | Закрыть программно |

### Доступность

- Корневой узел — `role="dialog"` + `aria-modal="true"`; при наличии заголовка связь идёт через `aria-labelledby`, без заголовка используется `drawer.title` из языкового пакета как запасной `aria-label`
- Маска — декоративный узел (`aria-hidden="true"`)
- Кнопка закрытия несёт `role="button"` и `aria-label` из языкового пакета `drawer.close`
- Закрытие по Esc (отключается через `close-on-esc`, только H5)

::: tip Отличия платформы (отличия от версии Vue3)
- **Носитель оверлея**: нет пропа `teleportTarget` — в мини-программе нет DOM teleport, оверлей переносится через `root-portal` (в H5 — teleport). **В WeChat `root-portal` требует базовую библиотеку ≥ 2.25.2**; старые версии автоматически откатываются к `fixed` внутри страницы (узел остаётся в дереве страницы, но наслоение по-прежнему гарантируется автоинкрементным z-index, поведение не страдает).
- **Анимация появления/исчезновения**: plus управляет скольжением через `<Transition name="lh-drawer-fade">`; в мини-программе нет компонента `<Transition>`, а событие `transitionend` ненадёжно, поэтому этот порт вручную воспроизводит последовательность классов Vue Transition (начальное состояние снимается через кадр → активное состояние → размонтирование в конце) и выравнивает 300мс transition из SCSS share через `setTimeout` — маска плавно гаснет, панель скользит по направлению, одинаково на обеих платформах.
- **Нет фокус-ловушки (семантика клавиатурного фокуса есть только в H5), здесь не подключена**: plus удерживает последовательность Tab внутри панели, пока она открыта; у мини-программы нет семантики клавиатурного фокуса (`shouldDrawerTrapFocus` в share закорочен компиляционной защитой `LH_IS_H5`), и, как Dialog, этот порт не вызывает focus-trap из share — сохранено только закрытие по Esc.
- **lockScroll только H5**: мини-программа не может заблокировать прокрутку body; страховка — полноэкранная маска, перехватывающая клики.
- **closeOnEsc только H5**: Esc слушается на уровне документа, и при нескольких наложенных оверлеях отвечает только верхний; в мини-программе нет клавиатурных событий, весь блок вырезается условной компиляцией.
- **teleportTarget не реализован**: в соответствии с прецедентом select / tooltip / dropdown (в мини-программах нет DOM teleport).
- **Безопасная зона снизу**: при `direction="bottom"` панель автоматически получает внутренний отступ `env(safe-area-inset-bottom)` для полноэкранных устройств (адаптация, специфичная для uni-app; в источнике стилей share такой платформенной специализации нет).
:::
