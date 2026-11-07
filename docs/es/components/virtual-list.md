# VirtualList Lista virtual

Renderiza únicamente la ventana visible, aunque haya decenas de miles de filas. El rango
de altura fija (`computeVirtualRange`) y la lógica de altura dinámica
(`buildVirtualItems` / `findVirtualRange`) provienen por completo de las funciones
puras del core de `@lh-ui/share`; la capa del componente solo se ocupa del manejo del
scroll y de la medición del viewport.

## Diferencias de plataforma

- **H5**: el contenedor se renderiza como `view` (`overflow: auto`); la altura del
  viewport se mide con `clientHeight` + `ResizeObserver`.
- **Mini Programa de WeChat**: el contenedor se renderiza como `scroll-view`
  (`scroll-y`), los eventos de scroll leen `detail.scrollTop` y la altura del viewport
  se mide con `createSelectorQuery` (MP no tiene `ResizeObserver`).
- **Altura dinámica**: `itemSize` es un contrato de función declarativa (quien llama
  devuelve la altura de cada elemento). Funciona igual en ambos extremos y no depende
  de APIs de medición que el MP no tiene.

## Uso básico (altura fija)

```vue
<template>
  <lh-virtual-list :data="items" :height="360" :item-height="48">
    <template #default="{ item, index }">
      <view class="my-item">Fila {{ index + 1 }}: {{ item.label }}</view>
    </template>
  </lh-virtual-list>
</template>

<script setup lang="ts">
const items = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  label: `Elemento ${i + 1}`,
}))
</script>
```

`height` define la altura del contenedor; `item-height` es la altura del elemento en
modo de altura fija (debe coincidir con la altura real del elemento). Fuera de la
ventana visible solo se mantienen `overscan` (por defecto 2) pantallas de elementos
de reserva.

## Altura dinámica

```vue
<template>
  <lh-virtual-list :data="items" :height="360" :item-size="sizeOf">
    <template #default="{ item, index }">
      <view class="my-item" :style="{ height: `${sizeOf(index)}px` }">
        Fila {{ index + 1 }}: {{ item.label }}
      </view>
    </template>
  </lh-virtual-list>
</template>

<script setup lang="ts">
// itemSize es una función declarativa: devuelve la altura de cada elemento,
// igual en ambos extremos.
function sizeOf(index: number): number {
  return 48 + (index % 5) * 24
}
</script>
```

Se usa `item-height` o `item-size`, no ambos: proporcionar `itemSize` activa el modo
de altura dinámica (se precalculan los desplazamientos de cada elemento y el rango
visible se encuentra por búsqueda binaria).

## API

### Props

| Prop | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| data | Fuente de datos (el renderizado de los elementos lo hace el slot default) | `any[]` | `[]` |
| height | Altura del contenedor (un número es px) | `number \| string` | `300` |
| itemHeight | Altura del elemento en modo de altura fija | `number` | `-` |
| itemSize | Modo de altura dinámica: devuelve la altura de cada elemento | `(index: number) => number` | `-` |
| overscan | Número de elementos de sobrebarrido (elementos de reserva fuera de la ventana visible) | `number` | `2` |
| sx | Propiedades de maquetación rápida sx | `LhSxProps` | `-` |

### Slots

| Slot | Descripción | Parámetros de ámbito |
| --- | --- | --- |
| default | Renderizado de los elementos | `{ item, index }` |
