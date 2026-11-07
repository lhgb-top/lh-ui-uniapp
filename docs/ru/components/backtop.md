# BackTop Наверх

Кнопка «наверх», появляющаяся, когда прокрутка превышает порог. Проверка видимости
(`isBackTopVisible`) и команда прокрутки (`backToTop`) берутся из чистых функций
core `@lh-ui/share`.

## Различия платформ (важно)

- **H5**: компонент сам слушает событие `scroll` объекта `window` (или контейнера
  `target`); по клику целевой контейнер прокручивается напрямую.
- **Mini Program WeChat**: нужно передавать `detail.scrollTop` события прокрутки
  `scroll-view` через prop `scrollTop`, чтобы управлять видимостью; по клику
  компонент порождает `update:scrollTop` (значение 0), который привязывается к
  свойству `scroll-top` контейнера `scroll-view` для возврата наверх. Если
  `target` не передан, прокрутка страничная, и компонент вызывает
  `uni.pageScrollTo` напрямую.

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-top="scrollTop"
    @scroll="onScroll"
  >
    <!-- длинный контент -->
    <lh-backtop :scroll-top="scrollTop" @update:scroll-top="scrollTop = $event" />
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const scrollTop = ref(0)
function onScroll(event: { detail?: { scrollTop?: number } }) {
  scrollTop.value = event.detail?.scrollTop ?? 0
}
</script>
```

## Базовое использование

```vue
<template>
  <lh-backtop :visibility-height="200" />
</template>
```

Когда страница или контейнер прокручивается дальше `visibility-height` (по
умолчанию 200px), кнопка появляется с плавным переходом; клик плавно возвращает
наверх.

## Свое содержимое и позиция

```vue
<template>
  <lh-backtop :right="24" :bottom="80">
    <view class="my-backtop">Наверх</view>
  </lh-backtop>
</template>
```

По умолчанию рендерится круглая кнопка (со встроенной иконкой `arrow-up`);
`right` / `bottom` задают отступ от правого нижнего угла окна; содержимое кнопки
можно задать через slot по умолчанию.

## API

### Props

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| target | Селектор контейнера прокрутки на H5 (по умолчанию окно просмотра; на MP лишь различает возврат наверх на уровне страницы или scroll-view) | `string` | `-` |
| scrollTop | Инъекция позиции прокрутки (MP: `detail.scrollTop` контейнера scroll-view) | `number` | `-` |
| visibility-height | Сколько пикселей прокрутки до появления | `number` | `200` |
| right | Отступ справа (px) | `number` | `40` |
| bottom | Отступ снизу (px) | `number` | `40` |
| smooth | Плавная прокрутка | `boolean` | `true` |
| sx | Быстрые свойства раскладки | `LhSxProps` | `-` |

### Events

| Событие | Описание | Параметр колбэка |
| --- | --- | --- |
| click | Порождается при клике по кнопке (раньше команды прокрутки) | `(event: Event)` |
| scrollend | Порождается после остановки прокрутки (дебаунс 150мс) | `(scrollTop: number)` |
| update:scrollTop | Контракт возврата наверх для MP: значение 0, привязывается к scroll-top контейнера scroll-view | `(scrollTop: number)` |

### Slots

| Имя | Описание |
| --- | --- |
| default | Содержимое кнопки (по умолчанию иконка arrow-up) |
