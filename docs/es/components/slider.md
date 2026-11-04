# Slider

Un control deslizante que permite elegir un valor arrastrando un pulsador a lo largo de una pista. Admite los modos de un solo pulsador y de rango (dos pulsadores), la alineación a `step` y las etiquetas de marca con `marks`. La pista, los pulsadores y la barra de relleno se dibujan con `view`; el amarre de valores, la alineación a pasos, la ordenación de las marcas y el contrato de accesibilidad provienen de las funciones puras de `@lh-ui/share` (sin copias).

## Uso básico

```vue
<template>
  <lh-slider v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref(30)
</script>
```

Si no se pasa `modelValue`, el componente se inicializa con `min`; al pasarlo, el componente pasa a ser controlado (como el resto de los componentes de formulario). Durante el arrastre solo se actualiza el estado interno; `update:modelValue` / `change` se emiten **una sola vez, al soltar** (igual que en la versión Vue3).

## Selección de rango

`range` activa el modo de dos pulsadores; `modelValue` es una tupla `[inicio, fin]`:

```vue
<template>
  <lh-slider v-model="span" range />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const span = ref<[number, number]>([20, 60])
</script>
```

Al arrastrar un extremo más allá del otro, los dos extremos se intercambian (el pulsador bajo el dedo es siempre el que se arrastra), de modo que el valor siempre permanece como `[temprano, tarde]`.

## Paso y marcas

`step` hace que el pulsador se ajuste a la rejilla del paso; `marks` renderiza etiquetas de marca a partir de un mapa `valor → etiqueta` (ordenado por valor):

```vue
<template>
  <lh-slider v-model="value" :min="0" :max="100" :step="10" :marks="marks" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref(30)
const marks: Record<number, string> = {
  0: '0',
  50: 'Mitad',
  100: 'Máx.',
}
</script>
```

## Deshabilitado

`disabled` bloquea el arrastre y la navegación por teclado y saca al pulsador del orden de tabulación:

```vue
<template>
  <lh-slider v-model="value" disabled />
</template>
```

## Mostrar el valor

`show-input` muestra el valor actual a la derecha de la pista (en el modo de rango, una cadena `[inicio, fin]`):

```vue
<template>
  <lh-slider v-model="value" show-input />
</template>
```

## Slider API

### Props

| Prop | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| modelValue | Valor actual (v-model controlado; tupla en el modo de rango) | `number \| [number, number]` | — |
| min | Valor mínimo | `number` | `0` |
| max | Valor máximo | `number` | `100` |
| step | Tamaño del paso (la unidad mínima de alineación) | `number` | `1` |
| disabled | Deshabilitar todo el control | `boolean` | `false` |
| range | Modo de rango (dos pulsadores) | `boolean` | `false` |
| showInput | Mostrar el valor actual junto a la pista | `boolean` | `false` |
| size | Tamaño | `'small' \| 'medium' \| 'large'` | `'medium'` |
| marks | Etiquetas de marca (las claves son valores, orden ascendente) | `Record<number, string>` | — |
| customClass | Clase personalizada reenviada al nodo raíz | `string` | — |
| sx | Props rápidas de maquetación (aplicadas al nodo raíz) | `LhSxProps` | — |

### Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| update:modelValue | El valor cambió (v-model; se emite al soltar el arrastre o al usar el teclado) | `(value: number \| [number, number])` |
| change | El valor cambió (mismo payload que update:modelValue) | `(value: number \| [number, number])` |

### Accesibilidad

- El pulsador es `role="slider"` con `aria-valuemin` / `aria-valuemax` / `aria-valuenow` / `aria-valuetext` (el contrato lo decide `getSliderThumbAria` de share)
- En el modo de rango, los dos pulsadores llevan `aria-label` distintos («pulsador de inicio» / «pulsador de fin»; claves de locale `slider.thumbStart` / `slider.thumbEnd`; `slider.thumb` en caso contrario)
- La navegación por teclado (flechas se mueven `step`, PageUp / PageDown dan pasos mayores, Home / End van a los extremos) solo funciona en H5; véanse las diferencias de plataforma

::: tip Diferencias de plataforma (diferencias con la versión Vue3)
- **Soporte del arrastre**: plus registra `mousedown` / `touchstart` en el pulsador y luego traslada los listeners de move / up a `document`; un Mini Programa no tiene document, de modo que `touchstart` / `touchmove` / `touchend` permanecen vinculados al propio pulsador (los eventos touch de un Mini Programa siguen disparándose sobre el objetivo de touchstart; no hacen falta listeners globales). H5 mantiene los listeners de ratón a nivel document (tras pulsar el ratón, el arrastre continúa aunque el cursor salga del componente), protegidos por compilación condicional; el paquete MP no contiene código muerto.
- **El cálculo de la posición es asíncrono**: plus mide la pista con un `getBoundingClientRect` síncrono; un Mini Programa solo dispone del `createSelectorQuery` asíncrono, por lo que este componente pasa por el `getSingleLhRect` del adaptador. La medición se cachea por sesión de arrastre (se pre-calienta en touchstart), de modo que un arrastre normal apenas lo nota; pero, semánticamente, la actualización del valor va un fotograma por detrás del toque. **No asumas dentro de un evento move que el valor ya se ha actualizado de forma síncrona**; el envío solo ocurre al soltar.
- **Se omite cuando la pista tiene anchura 0**: si el diseño aún no está listo (o en un entorno de pruebas), el rectángulo de la pista tiene anchura 0, lo que produciría una división por cero; se omite esa actualización en lugar de contaminar el valor con NaN.
- **La navegación por teclado es solo para H5**: el paso con flechas / Home / End / PageUp / PageDown no tiene eventos de teclado en MP; el código protegido no se llama en absoluto y el paquete MP no contiene código muerto.
- **Los atributos aria se vinculan uno a uno**: el paquete `LhAriaAttrs` de share no se puede extender con `v-bind` (el compilador de plantillas MP no lo soporta); la capa de pegamento expande las claves `aria-*` en vínculos explícitos, pero el contrato lo siguen decidiendo las funciones puras de share.
- **Sin modo vertical ni burbuja tooltip**: la fuente de plus no tiene una prop `vertical` (pista vertical) ni de burbuja tooltip; este porte se mantiene estrictamente alineado y no añade ninguna. Si necesitas una pista vertical, puedes rotar un contenedor envolvente (gestionando tú mismo las coordenadas táctiles); si necesitas mostrar el valor, usa `show-input` para mantenerlo siempre visible.
:::
