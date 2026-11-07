# Affix

Fija el contenido en la parte superior o inferior del viewport. La decisión del
estado fijo (`isAffixFixed`) y el estilo fijo (`getAffixFixedStyle`) provienen de
las funciones puras del core de `@lh-ui/share`; la capa del componente solo se
encarga de la suscripción al scroll, la medición del marcador de posición y el
enganche reactivo.

## Diferencias de plataforma (importante)

La semántica del scroll difiere entre H5 y el Mini Programa de WeChat, por lo que
este componente usa un enfoque de doble plataforma:

- **H5**: el componente escucha por sí mismo el evento `scroll` de `window` (o
  del contenedor al que apunta el selector `target`) y usa el
  `getBoundingClientRect` del nodo marcador de posición para decidir el estado
  fijo.
- **Mini Programa de WeChat**: el evento `scroll` solo se puede vincular a la
  etiqueta `scroll-view`, por lo que el componente no puede suscribirse por sí
  mismo. Coloca el componente dentro de un `scroll-view` e inyecta el
  `detail.scrollTop` del evento de scroll mediante la prop `scrollTop`:

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-top="scrollTop"
    @scroll="onScroll"
  >
    <lh-affix :scroll-top="scrollTop" :offset-top="20">
      <view class="my-bar">Barra fija superior</view>
    </lh-affix>
    <!-- contenido largo -->
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

En H5, si no se pasa `scrollTop`, el componente escucha `window`
automáticamente; si se pasa un selector `target`, escucha ese contenedor.

## Uso básico

```vue
<template>
  <lh-affix :offset-top="20">
    <lh-button type="primary">Botón fijo superior</lh-button>
  </lh-affix>
</template>
```

Cuando el contenido al desplazarse supera `offset-top`, se fija en la parte
superior del viewport; una vez fijo, el marcador de posición mantiene la posición
del documento con la altura original, de modo que el contenido posterior no
da saltos.

## Modo de fijación inferior

```vue
<template>
  <lh-affix :offset-bottom="24">
    <view class="my-bar">Barra fija inferior</view>
  </lh-affix>
</template>
```

`offset-bottom` tiene prioridad sobre `offset-top`: el borde inferior del
marcador de posición se fija abajo en cuanto supera "altura del viewport -
offset-bottom".

## API

### Props

| Prop | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| offset-top | Píxeles desde la parte superior del viewport que activan la fijación superior | `number` | `0` |
| offset-bottom | Píxeles desde la parte inferior del viewport que activan la fijación inferior (tiene prioridad sobre offset-top) | `number` | `0` |
| target | Selector del contenedor de scroll en H5 (el viewport por defecto; sin efecto en MP) | `string` | `-` |
| scrollTop | Inyección de la posición de scroll (MP: `detail.scrollTop` del scroll-view) | `number` | `-` |
| sx | Props de maquetación rápida (espaciado / tamaño / flex) | `LhSxProps` | `-` |

### Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| change | Se dispara cuando cambia el estado fijo | `(fixed: boolean)` |

### Slots

| Ranura | Descripción |
| --- | --- |
| default | El contenido a fijar |
