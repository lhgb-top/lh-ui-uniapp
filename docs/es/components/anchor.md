# Anchor (Navegación de anclas)

Navegación de anclas: al pulsar se salta a la sección correspondiente y, al hacer scroll,
la sección actual se resalta automáticamente. El aplanamiento (`flattenAnchorItems`) y la
resolución del ancla activa (`resolveActiveAnchor`) provienen de las funciones puras del
core de `@lh-ui/share`.

## Diferencias de plataforma (importante)

- **H5**: el componente escucha por sí mismo el scroll de `window` (o del contenedor
  `target`), y el posicionamiento del ancla utiliza el `scrollIntoView` nativo.
- **Mini Programa de WeChat**: la sincronización del scroll requiere inyectar el
  `detail.scrollTop` del `scroll-view` a través de la prop `scrollTop`; al pulsar un
  ancla, el componente emite `update:scrollIntoView` (el id de la sección destino), que se
  enlaza al atributo `scroll-into-view` del `scroll-view` para completar el
  posicionamiento. Cuando no se pasa `target`, el posicionamiento es a nivel de página y
  el componente llama directamente a `uni.pageScrollTo({ selector })`.

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-into-view="anchorTarget"
    @scroll="onScroll"
  >
    <view id="section-a" class="my-section">区块 A</view>
    <view id="section-b" class="my-section">区块 B</view>
    <lh-anchor
      :items="items"
      :scroll-top="scrollTop"
      @update:scroll-into-view="anchorTarget = $event"
    />
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const items = [
  { id: 'section-a', title: '区块 A' },
  { id: 'section-b', title: '区块 B' },
]
const scrollTop = ref(0)
const anchorTarget = ref('')
function onScroll(event: { detail?: { scrollTop?: number } }) {
  scrollTop.value = event.detail?.scrollTop ?? 0
}
</script>
```

## Uso básico

```vue
<template>
  <lh-anchor :items="items" />
</template>

<script setup lang="ts">
const items = [
  { id: 'section-a', title: '区块 A' },
  {
    id: 'group-b',
    title: 'B 组',
    children: [
      { id: 'section-b', title: '区块 B' },
      { id: 'section-c', title: '区块 C' },
    ],
  },
]
</script>
```

`items` admite hijos (`children`); se aplanan en profundidad al renderizar y se les aplica
sangría automáticamente. Regla de resolución del ancla activa: el elemento activo es la
última ancla cuyo borde superior de sección ha cruzado la línea del umbral `offset` al
hacer scroll.

## Disposición horizontal

```vue
<template>
  <lh-anchor :items="items" direction="horizontal" />
</template>
```

## API

### Props

| Prop | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| items | Datos de las anclas (admite children) | `LhAnchorItem[]` | `[]` |
| target | Selector del contenedor de scroll en H5 (window por defecto) | `string` | — |
| scrollTop | Inyección de la posición de scroll (MP: `detail.scrollTop` del scroll-view) | `number` | — |
| offset | Umbral de la resolución activa (distancia del borde superior de la sección a la parte superior del contenedor) | `number` | `0` |
| direction | Dirección de la disposición | `'vertical' \| 'horizontal'` | `'vertical'` |
| smooth | Desplazamiento suave | `boolean` | `true` |
| sx | Props rápidas de layout | `LhSxProps` | — |

### Events

| Evento | Descripción | Argumentos |
| --- | --- | --- |
| change | Se emite cuando cambia el ancla activa | `(id: string)` |
| click | Se emite al pulsar un elemento del ancla (antes del posicionamiento del scroll) | `(id: string)` |
| update:scrollIntoView | Contrato de posicionamiento del MP: id de la sección destino, se enlaza a scroll-into-view | `(id: string)` |
