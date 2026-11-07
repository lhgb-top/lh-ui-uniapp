# ColorPicker Палитра цветов

По нажатию на триггер открывается панель подбора цвета: перетаскивание по панели насыщенности / яркости + слайдеры тона / прозрачности + ввод hex / rgb + предустановленные образцы. Все пересчёты цвета целиком берутся из чистых функций `@lh-ui/share/core/color-picker` (туда-обратно между пространствами hex/rgb и HSV, клампинг каналов на всех этапах), рендеринг в H5 и WeChat Mini Program идентичен.

## Базовое использование

```vue
<template>
  <lh-color-picker v-model="color" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const color = ref('#2B4C7C')
</script>
```

## Прозрачность и предустановленные образцы

```vue
<template>
  <lh-color-picker
    v-model="color"
    show-alpha
    :predefine="predefine"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const color = ref('rgba(43, 76, 124, 0.6)')
// После включения showAlpha hex выдаётся в 8 знаков (#2b4c7c99), rgb — как rgba(): если alpha имеет значение, оно никогда не теряется молча
const predefine = ['#2B4C7C', '#5B8C5A', '#C4A35A', '#B23A3A']
</script>
```

## Формат вывода

```vue
<lh-color-picker v-model="color" format="rgb" />
```

`format` влияет только на форму вывода `v-model` (`hex` или `rgb`); при недопустимом значении выполняется откат к `hex`.

## Размер / очистка / отключение

```vue
<lh-color-picker v-model="color" size="small" />
<lh-color-picker v-model="color" clearable />
<lh-color-picker v-model="color" disabled />
```

Когда включён `clearable`, при наличии значения в триггере появляется кнопка очистки; нажатие обнуляет значение и генерирует событие `clear`.

## Императивное открытие и закрытие

```vue
<template>
  <lh-color-picker ref="pickerRef" v-model="color" />
  <lh-button size="small" @click="pickerRef?.open()">Открыть панель</lh-button>
</template>
```

Компонент через ref предоставляет `open` / `close` / `isOpen`.

## ColorPicker API

### Props

| Свойство | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| model-value | Привязанное значение (управляемый v-model — строка hex или rgb(), вывод в виде по format) | string | `''` |
| format | Формат вывода (при недопустимом значении откат к hex) | `'hex' \| 'rgb'` | `hex` |
| show-alpha | Канал прозрачности (после включения выводится 8-значный hex / rgba()) | boolean | `false` |
| predefine | Предустановленные образцы | string[] | `[]` |
| size | Размер | `'mini' \| 'small' \| 'medium' \| 'large' \| 'x-large'` | `medium` |
| disabled | Отключение | boolean | `false` |
| clearable | Кнопка очистки (обнуления значения) | boolean | `false` |
| placeholder | Подсказка-заполнитель (при пустом значении; если не передан — colorPicker.placeholder из языкового пакета) | string | `''` |
| aria-label | Имя для доступности (если не передан — colorPicker.label из языкового пакета) | string | — |
| custom-class | Пользовательский класс (передаётся корневому узлу) | string | — |
| sx | Быстрые свойства разметки sx | LhSxProps | — |

### Events

| Событие | Описание | Параметры |
| --- | --- | --- |
| update:model-value | Изменение цвета (v-model) | `(value: string)` |
| change | Изменение цвета подтверждено (тот же payload, что у update:model-value) | `(value: string)` |
| clear | Нажата кнопка очистки | — |

### Expose

| Метод | Описание |
| --- | --- |
| open | Открывает панель |
| close | Закрывает панель |
| isOpen | Развёрнута ли панель (ref) |

### Доступность

- Триггер имеет `role="button"` + `aria-expanded` + `aria-label` (colorPicker.label из языкового пакета).
- Слайдеры тона / прозрачности имеют `role="slider"` + `aria-valuenow/min/max`; точная подстройка стрелками клавиатуры (Shift ускоряет).
- Каждая ячейка предустановленных образцов кликабельна; доступное имя — строка значения цвета.

::: tip Различия платформ (отличия от версии Vue3)
- Носитель перетаскивания: в MP события touchmove / touchend доставляются по цели касания (слушатели document не нужны), H5 дополнительно использует слушатели мыши уровня document (перетаскивание продолжается и за пределами компонента) — парадигма совпадает со Slider.
- Ввод hex / rgb внутри панели использует uni `<input>`: отправка по Enter идёт через `@confirm` (клавиша «Готово» клавиатуры), отправка при потере фокуса — через `@blur` (в MP нет keydown.enter).
- Управление с клавиатуры (точная подстройка стрелками, Enter / Space — открытие и закрытие, Esc — закрытие) работает только в H5; на стороне MP клавиатурных событий нет.
- Позиционирование панели идёт через root-portal + двухкадровое измерение (measure → позиционирование → показ, против мерцания).
:::
