# Divisor

Línea separadora que distingue bloques de contenido distinto; admite la semántica de agrupación con texto.

## Uso básico

```vue
<template>
  <view>Texto superior</view>
  <lh-divider />
  <view>Texto inferior</view>
</template>
```

## Con texto

```vue
<template>
  <lh-divider>Tinta china</lh-divider>
  <lh-divider label-position="left">A la izquierda</lh-divider>
  <lh-divider label-position="right">A la derecha</lh-divider>
</template>
```

## Discontinua y estilos de borde

```vue
<template>
  <lh-divider dashed />
  <lh-divider border-style="dotted" />
</template>
```

`borderStyle` prevalece sobre `dashed`; solo `dashed` / `dotted` tienen un estilo asociado: los demás valores se renderizan con el trazo sólido por defecto.

## Dirección vertical

```vue
<template>
  <lh-space>
    <span>Tinta china</span>
    <lh-divider direction="vertical" />
    <span>Espacio en blanco</span>
  </lh-space>
</template>
```

::: tip La altura en dirección vertical
El divisor vertical es `inline-block`: dentro de una fila flex se estira hasta la altura del padre gracias a `align-self: stretch`. Colocado solo en un contenedor de bloque solo mide `1em`; su uso intuitivo es dentro de una fila flex.
:::

## Vertical con texto

La dirección vertical también admite texto: el trazo se dispone arriba y abajo del texto, el papel del elemento pasa a `role="separator"` y se declara `aria-orientation="vertical"`.

```vue
<template>
  <view class="vertical-text-row">
    <text>Arriba</text>
    <lh-divider direction="vertical">Tinta china</lh-divider>
    <text>Abajo</text>
  </view>
</template>

<style>
.vertical-text-row {
  display: flex;
  align-items: center;
  height: 120px;
}
</style>
```

::: tip La altura del divisor vertical con texto viene de la fila del padre
El divisor vertical con texto obtiene su altura del `align-self: stretch` de la fila del padre, de modo que el trazo puede estirarse: el contenedor padre debe ser una fila flex con una altura determinada (como el `height: 120px` del ejemplo). En un contenedor de bloque, al trazo solo le queda la longitud mínima de 12px.
:::

::: tip labelPosition no funciona en dirección vertical
`label-position` es la semántica de alineación izquierda / derecha de la dirección horizontal; en dirección vertical el texto siempre queda centrado y no se genera ninguna clase modificadora.
:::

## Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| direction | Dirección | `'horizontal' \| 'vertical'` | `'horizontal'` |
| dashed | Si es discontinua | `boolean` | `false` |
| labelPosition | Posición de alineación cuando lleva texto (efectiva en dirección horizontal; en vertical siempre centrada) | `'left' \| 'center' \| 'right'` | `'center'` |
| borderStyle | Estilo del borde (prevalece sobre dashed) | `string` | — |
| customClass | Clase personalizada | `string` | — |
| sx | Props rápidas de disposición | `LhSxProps` | — |

## Slots

| Slot | Descripción |
| --- | --- |
| default | Texto del divisor (en dirección horizontal se dispone a izquierda y derecha; en vertical, arriba y abajo) |
