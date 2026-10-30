# Значок

::: tip На платформе Mini Program рендерится шрифтом
На web-стороне (plus) используется инлайн `<svg><path>`, а Mini Program **не поддерживает тег `<svg>`**.
На этапе сборки набор SVG path из share преобразуется в шрифт iconfont (base64 встранивается в
`iconfont.css`), а компонент рендерит `<text class="lh-iconfont lh-iconfont--<name>">`.
Цвет задаётся через CSS `color` (**`fill` / `stroke` использовать нельзя**), что полностью заменяет семантику `currentColor` на web-стороне.
:::

## Базовое использование

```vue
<template>
  <lh-icon name="search" />
  <lh-icon name="loading" size="24" color="#1677ff" />
  <lh-icon name="star" size="1.5em" />
</template>
```

## Props

| Проп | Описание | Тип | По умолчанию |
| --- | --- | --- | --- |
| name | Имя иконки (ключ из `LH_ICON_SVGS_CONST` share) | `LhIconName` | — |
| size | Размер (число трактуется как px; строка передаётся как есть, например `'1.5em'`) | `string \| number` | — |
| color | Цвет (заменяет `currentColor` на web-стороне) | `string` | — |
| customClass | Пользовательский класс (пробрасывается на корневой узел) | `string` | — |
| themeVars | Переменные темы компонента | `Record<string, string>` | — |
| bgPattern | Фоновый узор компонента | `string` | — |

## Список иконок

Всего 37 иконок (24×24, однотонные, по одному path), все из `LH_ICON_SVGS_CONST` пакета `@lh-ui/share`.
Команда сборки `pnpm build:iconfont` перегенерирует шрифт и карту кодов (`src/icon/icon-map.ts`).

::: warning Не забудьте подключить стили шрифта
Пользователь должен подключить `@lh-ui/uniapp/src/icon/iconfont.css`, иначе иконки отображаются как пустые квадраты.
:::
