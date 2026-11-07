# Result результат

Отображение результата в конце потока обратной связи со встроенным значком состояния и цветовым оформлением.

## Базовое использование

```vue
<template>
  <lh-result
    status="success"
    title="Отправлено успешно"
    sub-title="Заказ-наряд перешёл к следующему этапу"
  />
</template>
```

Четыре состояния: `success` / `warning` / `error` / `info` (`info` по умолчанию), каждое со своим значком и оформлением; недопустимое значение состояния снижается до `info`.

## Пользовательский значок

```vue
<template>
  <lh-result
    icon="like"
    :icon-size="48"
    title="Лайк и избранное"
  />
</template>
```

Пустая строка `""` в `icon` отключает значок; если значение не передано, берётся значок состояния по умолчанию.

## Слоты

```vue
<template>
  <lh-result status="success">
    <template #subTitle> Пользовательский подзаголовок </template>
    <template #extra>
      <lh-button type="primary" size="small">На главную</lh-button>
    </template>
  </lh-result>
</template>
```

Слоты `title` / `subTitle` / `extra` переопределяют одноимённый prop.

## Props

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| status | Состояние результата | `'success' \| 'warning' \| 'info' \| 'error'` | `'info'` |
| icon | Имя пользовательского значка (переопределяет значок состояния по умолчанию; пустая строка не выводится) | `string` | — |
| iconSize | Размер значка | `string \| number` | `64` |
| title | Заголовок | `string` | — |
| subTitle | Подзаголовок | `string` | — |
| customClass | Пользовательский класс | `string` | — |
| sx | Быстрые пропы разметки | `LhSxProps` | — |

## Slots

| Слот | Описание |
| --- | --- |
| title | Заголовок (переопределяет prop title) |
| subTitle | Подзаголовок (переопределяет prop subTitle) |
| extra | Нижняя область действий |
