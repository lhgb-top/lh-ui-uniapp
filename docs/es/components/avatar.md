# Avatar

Muestra el avatar de una persona o de una cosa; admite tres formas: imagen, icono y texto.

## Uso básico

```vue
<template>
  <lh-avatar src="https://placeholder.invalid/avatar.png" />
  <lh-avatar icon="user" />
  <lh-avatar text="Tinta china" />
</template>
```

## Forma y tamaño

```vue
<template>
  <lh-avatar text="Tinta" shape="circle" />
  <lh-avatar text="China" shape="square" />
  <lh-avatar text="Pequeño" size="small" />
  <lh-avatar text="Grande" size="large" />
</template>
```

## Modo de recorte

`fit` se mapea al `mode` de `<image>` de uni: `fill` → `scaleToFill`, `contain` → `aspectFit`, `cover` → `aspectFill`, `none` → `center`.

```vue
<template>
  <lh-avatar src="https://placeholder.invalid/avatar.png" fit="cover" />
  <lh-avatar src="https://placeholder.invalid/avatar.png" fit="contain" />
</template>
```

::: tip scale-down es aproximado
uni no tiene un mode equivalente a `scale-down`, de modo que se toma el `aspectFit`, que es el más cercano semánticamente (mantiene la proporción y muestra la imagen completa, sin ampliarla).
:::

## Alternativa ante fallo de carga

Cuando la imagen no se puede cargar, se cae en cascada por el orden «icono → texto → vacío» y se dispara el evento `error`.

```vue
<template>
  <lh-avatar
    src="https://placeholder.invalid/broken.png"
    icon="user"
    alt="Avatar"
    @error="onError"
  />
</template>

<script setup lang="ts">
const onError = () => console.log('La imagen no se ha podido cargar')
</script>
```

## Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| src | Dirección de la imagen; si está vacía, se cae sucesivamente al icono y al texto | `string` | — |
| alt | Texto alternativo cuando la imagen no se puede cargar; también hace las veces de nombre accesible | `string` | — |
| icon | Nombre del icono (se muestra cuando src está vacío o la carga falla) | `LhIconName` | — |
| text | Contenido del avatar de texto (cuando src e icon están ausentes, se muestra el primer carácter) | `string` | — |
| shape | Forma | `'circle' \| 'square'` | `'circle'` |
| size | Tamaño | `'small' \| 'medium' \| 'large'` | `'medium'` |
| fit | Modo de recorte de la imagen (mapeado al mode de uni image) | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'cover'` |
| customClass | Clase personalizada | `string` | — |
| sx | Props rápidas de disposición | `LhSxProps` | — |

## Events

| Evento | Descripción | Parámetros de la retrollamada |
| --- | --- | --- |
| error | La imagen no se ha podido cargar | `(e: Event)` |
