# Диалог

## Базовое использование

```vue
<template>
  <lh-button @click="visible = true">Открыть диалог</lh-button>

  <lh-dialog v-model="visible" title="Заголовок" width="80%">
    <view>Это содержимое диалога</view>
    <template #footer>
      <lh-button @click="visible = false">Отмена</lh-button>
      <lh-button type="primary" @click="visible = false">ОК</lh-button>
    </template>
  </lh-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
</script>
```

## Позиционирование

```vue
<template>
  <lh-dialog v-model="visible" position="bottom" title="Нижний слой">
    <view>Содержимое нижнего слоя</view>
  </lh-dialog>

  <lh-dialog v-model="visible" fullscreen title="Полный экран">
    <view>Содержимое на весь экран</view>
  </lh-dialog>
</template>
```

Нижний слой автоматически получает `env(safe-area-inset-bottom)` для полноэкранных устройств.

## Props

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| modelValue (v-model) | Показан ли | `boolean` | `false` |
| title | Заголовок | `string` | — |
| width | Ширина | `string \| number` | — |
| top | Отступ сверху | `string \| number` | — |
| fullscreen | Полный экран | `boolean` | `false` |
| position | Позиционирование | `'center' \| 'top' \| 'bottom'` | `'center'` |
| closeOnClickModal | Закрывать по клику на маску | `boolean` | `true` |
| closeOnPressEscape | Закрывать по Esc (**в MP нет клавиатурных событий, не работает**) | `boolean` | `true` |
| lockScroll | Блокировать прокрутку фона (**только на H5**) | `boolean` | `true` |
| zIndex | Z-index; если не передан, назначается по нарастающей | `number` | — |
| customClass | Пользовательский класс | `string` | — |
| themeVars | Переменные темы компонента | `Record<string, string>` | — |
| sx | Быстрые свойства раскладки | `LhSxProps` | — |

## Slots

| Слот | Описание |
| --- | --- |
| default | Содержимое |
| footer | Зона кнопок в подвале |

## Events

| Событие | Описание | Параметр колбэка |
| --- | --- | --- |
| update:modelValue | Изменение видимости | `(visible: boolean)` |
| open | Открытие | — |
| close | Закрытие | — |

::: tip Отличия от версии для Vue3
- Монтирование слоя идёт через `root-portal` (на H5 — teleport, на MP — root-portal или деградация до фиксированного позиционирования внутри страницы).
- **focus-trap недоступен на платформе MP**: сторож `LH_IS_H5` на этапе компиляции возвращает false, focus-trap не вызывается.
- **lockScroll не работает на платформе MP**: в Mini Program нет блокировки прокрутки body, fallback — перехват кликов маской.
- `closeOnPressEscape` не работает на платформе MP (нет клавиатурных событий).
:::
