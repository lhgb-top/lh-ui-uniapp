# Хлебные крошки (Breadcrumb)

Показывают путь к текущей странице, позволяя быстро вернуться на любой предыдущий уровень.

## Базовое использование

```vue
<template>
  <lh-breadcrumb separator="/">
    <lh-breadcrumb-item>Главная</lh-breadcrumb-item>
    <lh-breadcrumb-item>Компоненты</lh-breadcrumb-item>
    <lh-breadcrumb-item>Хлебные крошки</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## Клики и переходы

Не последние элементы с пропом `to` выводятся как ссылки и переходят через `uni.navigateTo` по клику (url должен быть путём страницы, начинающимся с `/`).

```vue
<template>
  <lh-breadcrumb>
    <lh-breadcrumb-item to="/pages/index/index">Главная</lh-breadcrumb-item>
    <lh-breadcrumb-item to="/pages/component/index">Компоненты</lh-breadcrumb-item>
    <lh-breadcrumb-item>Хлебные крошки</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## Свёртывание

`maxItems` ограничивает число видимых элементов (включая многоточие): при превышении сохраняются первый элемент, многоточие и несколько последних; клик по многоточию разворачивает все элементы.

```vue
<template>
  <lh-breadcrumb :max-items="3">
    <lh-breadcrumb-item>Главная</lh-breadcrumb-item>
    <lh-breadcrumb-item>События</lh-breadcrumb-item>
    <lh-breadcrumb-item>Список</lh-breadcrumb-item>
    <lh-breadcrumb-item>Детализация</lh-breadcrumb-item>
    <lh-breadcrumb-item>Отзывы</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## Breadcrumb Props

| Prop | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| separator | Символ-разделитель | `string` | `'/'` |
| maxItems | Максимум видимых элементов (первый + многоточие + несколько последних); при превышении сворачивается; `0` отключает свёртывание | `number` | `0` |
| customClass | Пользовательский класс | `string` | — |
| sx | Сокращения раскладки | `LhSxProps` | — |

## BreadcrumbItem Props

| Prop | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| to | Адрес перехода; если задан и элемент не последний, выводится ссылкой и переходит через `uni.navigateTo` по клику | `string` | — |
| customClass | Пользовательский класс | `string` | — |

## Slots

| Slot | Описание |
| --- | --- |
| default | Текстовое содержимое элемента хлебных крошек |

::: tip Отличия от версии Vue 3
- `to` не использует vue-router (в проекте uni-app нет роутера): навигация всегда через `uni.navigateTo`; на H5 следует стратегии H5-маршрутизации uni.
- `<nav>/<ol>/<li>` заменены на `<view>` (WXSS запрещает селекторы тегов); `aria-current="page"` и `aria-label` сохраняются.
- Логика свёртывания и многоточия переиспользует те же чистые функции share core, повторяя поведение plus.
:::
