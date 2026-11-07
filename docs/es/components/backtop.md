# BackTop Volver arriba

Botón de "volver arriba" que aparece cuando el desplazamiento supera un umbral. La
comprobación de visibilidad (`isBackTopVisible`) y la orden de desplazamiento
(`backToTop`) provienen de las funciones puras del core de `@lh-ui/share`.

## Diferencias entre plataformas (importante)

- **H5**: el propio componente escucha el evento `scroll` de `window` (o del
  contenedor `target`); al pulsar el botón se desplaza el contenedor destino
  directamente.
- **Mini Programa de WeChat**: debes inyectar el `detail.scrollTop` del evento de
  desplazamiento del `scroll-view` a través de la prop `scrollTop` para controlar
  la visibilidad; al pulsar, el componente emite `update:scrollTop` (valor 0), que
  se enlaza a la propiedad `scroll-top` del `scroll-view` para volver arriba. Si no
  se pasa `target`, el desplazamiento es de página y el componente invoca
  `uni.pageScrollTo` directamente.

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-top="scrollTop"
    @scroll="onScroll"
  >
    <!-- contenido largo -->
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

## Uso básico

```vue
<template>
  <lh-backtop :visibility-height="200" />
</template>
```

Cuando la página o el contenedor supera `visibility-height` (200px por defecto), el
botón aparece con una transición de fundido; al pulsar, vuelve arriba con un
desplazamiento suave.

## Contenido y posición personalizados

```vue
<template>
  <lh-backtop :right="24" :bottom="80">
    <view class="my-backtop">Arriba</view>
  </lh-backtop>
</template>
```

Por defecto se renderiza un botón circular (con el icono `arrow-up` integrado);
`right` / `bottom` controlan el desplazamiento respecto a la esquina inferior derecha
de la ventana; el slot por defecto personaliza el contenido del botón.

## API

### Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| target | Selector del contenedor de desplazamiento en H5 (la ventana por defecto; en MP solo distingue entre volver arriba a nivel de página o de scroll-view) | `string` | `-` |
| scrollTop | Inyección de la posición de desplazamiento (MP: `detail.scrollTop` del scroll-view) | `number` | `-` |
| visibility-height | Píxeles de desplazamiento necesarios para que aparezca | `number` | `200` |
| right | Desplazamiento desde la derecha (px) | `number` | `40` |
| bottom | Desplazamiento desde abajo (px) | `number` | `40` |
| smooth | Desplazamiento suave | `boolean` | `true` |
| sx | Props rápidas de disposición | `LhSxProps` | `-` |

### Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| click | Se dispara al pulsar el botón (antes de la orden de desplazamiento) | `(event: Event)` |
| scrollend | Se dispara cuando el desplazamiento se detiene (antirrebote de 150ms) | `(scrollTop: number)` |
| update:scrollTop | Contrato de vuelta arriba en MP: el valor es 0, se enlaza al scroll-top del scroll-view | `(scrollTop: number)` |

### Slots

| Nombre | Descripción |
| --- | --- |
| default | Contenido del botón (por defecto el icono arrow-up) |
