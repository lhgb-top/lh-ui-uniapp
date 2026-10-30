# Icono

::: tip En el Mini Programa se renderiza como fuente
La versión web (plus) usa `<svg><path>` en línea, pero el Mini Programa **no admite la etiqueta `<svg>`**.
Esta biblioteca convierte en tiempo de compilación el conjunto de SVG path de share a una fuente iconfont (base64 incrustada en `iconfont.css`); el componente renderiza `<text class="lh-iconfont lh-iconfont--<name>">`.
El color se controla con `color` en CSS (**no se puede usar `fill` / `stroke`**); sustituye por completo a la semántica `currentColor` de la versión web.
:::

## Uso básico

```vue
<template>
  <lh-icon name="search" />
  <lh-icon name="loading" size="24" color="#1677ff" />
  <lh-icon name="star" size="1.5em" />
</template>
```

## Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| name | Nombre del icono (clave de `LH_ICON_SVGS_CONST` de share) | `LhIconName` | — |
| size | Tamaño (un número se interpreta como px; una cadena se pasa tal cual, p. ej. `'1.5em'`) | `string \| number` | — |
| color | Color (sustituye al `currentColor` de la versión web) | `string` | — |
| customClass | Clase personalizada (se pasa al nodo raíz) | `string` | — |
| themeVars | Variables de tema a nivel de componente | `Record<string, string>` | — |
| bgPattern | Patrón de fondo a nivel de componente | `string` | — |

## Lista de iconos

En total 37 iconos (24×24, un solo color, de un solo path), todos procedentes de `LH_ICON_SVGS_CONST` de `@lh-ui/share`.
El comando de compilación `pnpm build:iconfont` regenera la fuente y el mapeo de puntos de código (`src/icon/icon-map.ts`).

::: warning No olvides importar los estilos de la fuente
Quien usa la biblioteca debe importar `@lh-ui/uniapp/src/icon/iconfont.css`; de lo contrario, los iconos se muestran como cuadros en blanco.
:::
