# ColorPicker Selector de color

Al pulsar el disparador se abre el panel de color: placa de saturación / luminosidad con arrastre +
deslizadores de tono / transparencia + entrada hex / rgb + muestras predefinidas. Todas las
conversiones de color provienen de las funciones puras de `@lh-ui/share/core/color-picker` (ida y
vuelta entre los espacios hex/rgb y HSV, con todos los canales acotados en todo momento); el
renderizado es consistente entre H5 y el Mini Programa de WeChat.

## Uso básico

```vue
<template>
  <lh-color-picker v-model="color" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const color = ref('#2B4C7C')
</script>
```

## Transparencia y muestras predefinidas

```vue
<template>
  <lh-color-picker
    v-model="color"
    show-alpha
    :predefine="predefine"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const color = ref('rgba(43, 76, 124, 0.6)')
// Con showAlpha activado, hex sale con 8 dígitos (#2b4c7c99) y rgb con rgba(): un valor de alfa nunca se pierde en silencio
const predefine = ['#2B4C7C', '#5B8C5A', '#C4A35A', '#B23A3A']
</script>
```

## Formato de salida

```vue
<lh-color-picker v-model="color" format="rgb" />
```

`format` solo afecta a la forma de salida de `v-model` (`hex` o `rgb`); un valor no válido retrocede a `hex`.

## Tamaño / borrado / deshabilitado

```vue
<lh-color-picker v-model="color" size="small" />
<lh-color-picker v-model="color" clearable />
<lh-color-picker v-model="color" disabled />
```

Con `clearable` activado, cuando ya hay un valor aparece un botón de borrado dentro del disparador;
al pulsarlo se vacía el valor y se emite el evento `clear`.

## Apertura y cierre imperativos

```vue
<template>
  <lh-color-picker ref="pickerRef" v-model="color" />
  <lh-button size="small" @click="pickerRef?.open()">Abrir panel</lh-button>
</template>
```

El componente expone `open` / `close` / `isOpen` a través de ref.

## ColorPicker API

### Props

| Prop | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| model-value | Valor vinculado (v-model controlado; cadena hex o rgb(), salida según format) | `string` | `''` |
| format | Formato de salida (un valor no válido retrocede a hex) | `'hex' \| 'rgb'` | `hex` |
| show-alpha | Canal de transparencia (al activarlo la salida es hex de 8 dígitos / rgba()) | `boolean` | `false` |
| predefine | Muestras predefinidas | `string[]` | `[]` |
| size | Tamaño | `'mini' \| 'small' \| 'medium' \| 'large' \| 'x-large'` | `medium` |
| disabled | Deshabilitar | `boolean` | `false` |
| clearable | Botón de borrado (vacía el valor) | `boolean` | `false` |
| placeholder | Marcador de posición (con valor vacío; si no se pasa, toma colorPicker.placeholder del paquete de idioma) | `string` | `''` |
| aria-label | Nombre accesible (si no se pasa, toma colorPicker.label del paquete de idioma) | `string` | — |
| custom-class | Clase personalizada (reenviada al nodo raíz) | `string` | — |
| sx | Props rápidas de maquetación sx | `LhSxProps` | — |

### Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| update:model-value | El color cambió (v-model) | `(value: string)` |
| change | Color confirmado (mismo payload que update:model-value) | `(value: string)` |
| clear | Se pulsó el botón de borrado | — |

### Expose

| Método | Descripción |
| --- | --- |
| open | Abre el panel |
| close | Cierra el panel |
| isOpen | Indica si el panel está abierto (ref) |

### Accesibilidad

- El disparador lleva `role="button"` + `aria-expanded` + `aria-label` (paquete de idioma colorPicker.label).
- Los deslizadores de tono / transparencia llevan `role="slider"` + `aria-valuenow/min/max`; ajuste
  fino con las flechas del teclado (Shift acelera).
- Cada celda de las muestras predefinidas es pulsable; su nombre accesible es la propia cadena del color.

::: tip Diferencias de plataforma (diferencias con la versión Vue3)
- Eje de arrastre: en MP los touchmove / touchend se despachan sobre el objetivo táctil (no hacen
  falta listeners de document); en H5 se añaden además listeners de ratón a nivel document (el
  arrastre continúa aunque el cursor salga del componente), la misma pauta que Slider.
- Las entradas hex / rgb del panel usan el `<input>` de uni: el envío con Enter va por `@confirm`
  (tecla «Listo» del teclado) y el envío al perder el foco va por `@blur` (MP no tiene keydown.enter).
- La interacción por teclado (ajuste fino con las flechas, abrir / cerrar con Enter / Space, cerrar
  con Esc) solo funciona en H5; en MP no hay eventos de teclado.
- El posicionamiento del panel va por root-portal + medición de dos fotogramas (medir → posicionar →
  mostrar, sin parpadeo).
:::
