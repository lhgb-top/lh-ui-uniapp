# Кнопка

Базовый компонент кнопки. Носителем рендеринга служит встроенный `<button>` uni (компилируется в нативную кнопку на каждой платформе), событие клика компилируется в `bindtap`.

## Базовое использование

```vue
<template>
  <lh-button>По умолчанию</lh-button>
  <lh-button type="primary">Основная</lh-button>
  <lh-button type="success">Успех</lh-button>
  <lh-button type="warning">Предупреждение</lh-button>
  <lh-button type="danger">Опасность</lh-button>
  <lh-button type="info">Информация</lh-button>
</template>
```

## Состояния и форма

```vue
<template>
  <lh-button loading>Загрузка</lh-button>
  <lh-button disabled>Отключена</lh-button>
  <lh-button plain>Плоская</lh-button>
  <lh-button round>Скруглённая</lh-button>
  <lh-button circle icon="search" />
  <lh-button block>Блочная (на всю строку)</lh-button>
  <lh-button icon="search" type="primary">С иконкой</lh-button>
</template>
```

## Props

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| type | Тип | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| size | Размер; если не передан, наследуется от ConfigProvider | `'small' \| 'medium' \| 'large'` | — |
| loading | Состояние загрузки | `boolean` | `false` |
| disabled | Отключена | `boolean` | `false` |
| plain | Плоский (с обводкой) стиль | `boolean` | `false` |
| block | Блочный макет | `boolean` | `false` |
| round | Скруглённая | `boolean` | `false` |
| circle | Круглая | `boolean` | `false` |
| icon | Имя иконки | `LhIconName` | — |
| customClass | Пользовательский класс (пробрасывается на корневой узел) | `string` | — |
| themeVars | Переменные темы компонента | `Record<string, string>` | — |
| bgPattern | Фоновый узор компонента | `string` | — |
| sx | Быстрые свойства раскладки | `LhSxProps` | — |

## Events

| Событие | Описание | Параметр колбэка |
| --- | --- | --- |
| click | Клик | `(event)` |

::: tip Отличия от версии для Vue3
У кнопки Mini Program нет семантики `nativeType` / `href` / `target`, эти три свойства в библиотеке **не реализуются**.
Остальной API совпадает.
:::
