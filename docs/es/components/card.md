# Tarjeta

Contenedor que agrega información; admite portada, cabecera, cuerpo, pie y posición de carga.

## Uso básico

```vue
<template>
  <lh-card title="Tinta china">
    <view>Contenido de la tarjeta</view>
  </lh-card>
</template>
```

## Portada y pie

```vue
<template>
  <lh-card title="Álbum de paisajes">
    <template #cover>
      <image class="cover" src="https://placeholder.invalid/cover.png" mode="aspectFill" />
    </template>
    <view>Contenido de la tarjeta</view>
    <template #footer>
      <view>Acciones del pie</view>
    </template>
  </lh-card>
</template>
```

::: tip Los elementos hijos de la portada necesitan una anchura explícita
La regla de share «los elementos hijos de la portada ocupan toda la anchura» (`.lh-card__cover > *`) depende de un selector comodín que WXSS no admite y la pipeline de sanitización lo descarta. En el Mini Programa, da a los elementos hijos de la portada (como `<image>`) una anchura explícita (p. ej. `width: 100%`).
:::

## Zona de acciones a la derecha del cabecera

El slot `extra` se renderiza a la derecha del título y solo aparece cuando existe `title` o el slot `header`.

```vue
<template>
  <lh-card title="Pedido">
    <template #extra>
      <lh-button size="small" text>Ver más</lh-button>
    </template>
    <view>Contenido de la tarjeta</view>
  </lh-card>
</template>
```

## Sombra y clic

```vue
<template>
  <lh-card shadow="hover" clickable @click="onClick">
    <view>Se eleva al pasar por encima; el clic dispara el evento</view>
  </lh-card>
</template>

<script setup lang="ts">
const onClick = () => console.log('Clic en la tarjeta')
</script>
```

## Posición de carga

```vue
<template>
  <lh-card title="Tinta china" loading>
    <view>No se renderiza mientras el contenido está cargando</view>
  </lh-card>
</template>
```

## Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| title | Título de la tarjeta (también disponible con el slot header) | `string` | — |
| shadow | Momento en que se muestra la sombra | `'always' \| 'hover' \| 'never'` | `'always'` |
| clickable | La tarjeta entera se puede clicar (asume la semántica de teclado de button) | `boolean` | `false` |
| loading | Estado de carga: el área de contenido se sustituye por un esqueleto de posición | `boolean` | `false` |
| themeVars | Variables de tema a nivel de componente (las claves reciben el prefijo `--lh-`) | `Record<string, string>` | — |
| bgPattern | URL del patrón de fondo (p. ej. `var(--lh-pattern-willow)`); no está sujeta a la lista blanca global | `string` | — |
| customClass | Clase personalizada | `string` | — |
| sx | Props rápidas de disposición | `LhSxProps` | — |

## Events

| Evento | Descripción | Parámetros de la retrollamada |
| --- | --- | --- |
| click | Clic en la tarjeta entera (solo se dispara con `clickable`) | `(e: Event)` |

## Slots

| Slot | Descripción |
| --- | --- |
| cover | Portada |
| header | Cabecera (prevalece sobre title) |
| extra | Zona de acciones a la derecha del cabecera (depende de que exista cabecera) |
| default | Contenido del cuerpo |
| footer | Pie |

::: tip La activación por teclado solo en H5
La tarjeta `clickable` admite en H5 la activación por teclado con Enter / Space (alineada con el patrón button de APG); el Mini Programa no tiene eventos de teclado y este tratamiento se elimina en la plataforma MP mediante compilación condicional.
:::
