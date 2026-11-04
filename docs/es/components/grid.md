# Grid (rejilla)

Rejilla de 24 columnas: `lh-row` junto con `lh-col` (con easycom puedes usar las etiquetas directamente; al importar bajo demanda los nombres de los componentes son `LhRow` / `LhCol`). Por debajo usa CSS Grid: `span` / `offset` / `push` / `pull` se mapean directamente a la posición de `grid-column`, y tanto los nombres de clase como el algoritmo de posicionamiento los producen funciones puras del core de `@lh-ui/share`.

## Diseño básico

```vue
<template>
  <lh-row>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
  </lh-row>
</template>
```

## Separación entre columnas (gutter)

`gutter` accepts a `number` (solo horizontal) o un array `[horizontal, vertical]`; Row usa un margen negativo para compensar el padding de las columnas.

```vue
<template>
  <lh-row :gutter="16">
    <lh-col :span="8"><view class="cell">8</view></lh-col>
    <lh-col :span="8"><view class="cell">8</view></lh-col>
    <lh-col :span="8"><view class="cell">8</view></lh-col>
  </lh-row>
  <lh-row :gutter="[16, 24]">
    <lh-col :span="12"><view class="cell">12</view></lh-col>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
  </lh-row>
</template>
```

## justify / align

El `center` de `justify` y el `middle` de `align` se mapean a clases modificadoras independientes (los dos ejes nunca colisionan); `align='center'` es un alias de compatibilidad de `middle`.

```vue
<template>
  <lh-row justify="center" align="middle">
    <lh-col :span="6"><view class="cell">6</view></lh-col>
    <lh-col :span="6"><view class="cell">6</view></lh-col>
  </lh-row>
</template>
```

## Desplazamiento y traslación

- `offset`: desplaza el inicio N columnas a la derecha (inicio explícito `offset + 1`)
- `push` / `pull`: mueve el inicio a la derecha / izquierda sobre la base del offset

```vue
<template>
  <lh-row>
    <lh-col :span="6" :offset="6"><view class="cell">6 / offset 6</view></lh-col>
    <lh-col :span="9" :push="6"><view class="cell">9 / push 6</view></lh-col>
  </lh-row>
</template>
```

## Puntos de corte responsivos

`xs` / `sm` / `md` / `lg` / `xl` se aplican en `<640 / ≥640 / ≥768 / ≥1024 / ≥1280px` respectivamente y, si no se declaran, retroceden al punto definido más cercano (`xs` siempre como último recurso). También puedes declararlos en bloque con `sizes`.

```vue
<template>
  <lh-row>
    <lh-col :xs="24" :sm="12" :md="8" :lg="6">
      <view class="cell">xs=24 sm=12 md=8 lg=6</view>
    </lh-col>
  </lh-row>
</template>
```

## Props de Row

| Prop | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| gutter | Separación entre columnas (px, o `[horizontal, vertical]`) | `number \| [number, number]` | `0` |
| justify | Disposición en el eje principal | `'start' \| 'center' \| 'end' \| 'space-between' \| 'space-around'` | `'start'` |
| align | Alineación en el eje cruzado | `'top' \| 'middle' \| 'bottom'` | `'top'` |
| wrap | Si permite ajuste de línea | `boolean` | `true` |
| customClass | Clase personalizada (se reenvía al nodo raíz) | `string` | — |
| sx | Propiedades de diseño abreviadas sx | `LhSxProps` | — |

## Props de Col

| Prop | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| span | Columnas ocupadas (rejilla de 24) | `number` | — |
| offset | Columnas de desplazamiento iniciales | `number` | — |
| push | Columnas a desplazar a la derecha | `number` | — |
| pull | Columnas a desplazar a la izquierda | `number` | — |
| xs / sm / md / lg / xl | Tamaño por punto de corte (`number` o `{ span, offset }`) | `LhColSize` | — |
| sizes | Declaración en bloque por punto de corte (equivalente a xs–xl, usa cualquiera) | `LhBreakpointSizes` | — |
| customClass | Clase personalizada (se reenvía al nodo raíz) | `string` | — |
| sx | Propiedades de diseño abreviadas sx | `LhSxProps` | — |

## Slots

| Slot | Descripción |
| --- | --- |
| default | Contenido de la rejilla (Row y Col exponen el slot por defecto) |

## Diferencias entre plataformas

- **Componente de_layout puro**: sin capas flotantes, sin mediciones, sin dependencias de `document`; se comporta igual en H5 y en el Mini Programa de WeChat.
- **Origen de los puntos de corte**: H5 escucha `matchMedia`, pero **el Mini Programa no tiene matchMedia**, así que degrada fijándose en el punto `xs` (las reglas de retroceso siguen viniendo de `resolveResponsiveSize` del core de share; solo el punto actual queda fijo en `xs`). Si necesitas segmentar por ancho de pantalla en el Mini Programa, conecta `uni.getSystemInfoSync().windowWidth` a la interfaz de inyección de `useLhBreakpoint`, o define un único diseño fijo para el Mini Programa.
- **Sustitución de etiquetas**: el `<div>` de plus pasa a ser `<view>` (WXSS prohíbe selectores de etiqueta; los estilos se aplican mediante las clases `lh-row*` / `lh-col*`).
- **Posicionamiento con `grid-column`**: un `span` simple usa auto-placement (`span N`); cuando se usan `offset` / `push` / `pull`, el inicio se coloca explícitamente y se limita al sistema de 24 columnas para que las combinaciones fuera de rango no rompan el contenedor.

::: tip Diferencias con la versión Vue 3
- La estructura de los componentes, la superficie de props, los nombres de clase y el algoritmo de posicionamiento coinciden exactamente con plus (mismo core de share).
- Las etiquetas de los subcomponentes siguen la convención easycom `lh-row` / `lh-col` (`LhRow` / `LhCol` al importar bajo demanda).
- Se añade la prop `customClass`: en uni-app las clases personalizadas no atraviesan `styleIsolation`, así que se reenvían mediante una prop (plus pasa las clases directamente).
:::
