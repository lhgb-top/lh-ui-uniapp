# InputNumber

Campo de entrada numérica: cambia el valor escribiendo o con los botones de incremento/decremento, con límites de rango, paso, precisión y pasos estrictos. La normalización de parámetros, el incremento y el ajuste (clamp) en la confirmación provienen de las funciones puras del core de `@lh-ui/share`.

## Uso básico

```vue
<template>
  <lh-input-number v-model="value" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const value = ref<number | null>(1)
</script>
```

## Límites de rango

`min` / `max` restringen tanto el incremento por botones como la confirmación del valor escrito (los valores fuera de rango se ajustan al rango).

```vue
<template>
  <lh-input-number v-model="level" :min="1" :max="10" />
</template>
```

## Paso y precisión

`step` ajusta el paso; `precision` fija los decimales (se aplica antes del ajuste); `step-strictly` ajusta el valor escrito a la cuadrícula del paso (redondeando).

```vue
<template>
  <lh-input-number v-model="value" :step="2" />
  <lh-input-number v-model="value" :precision="2" placeholder="2 decimales" />
  <lh-input-number v-model="value" :step="10" step-strictly placeholder="solo múltiplos de 10" />
</template>
```

## Tamaños y botones de control

`size` cambia entre small / medium / large; `controls` oculta los botones de incremento/decremento (solo entrada).

```vue
<template>
  <lh-input-number v-model="value" size="small" />
  <lh-input-number v-model="value" size="large" />
  <lh-input-number v-model="value" :controls="false" placeholder="sin botones" />
</template>
```

## Deshabilitado y nombre de formulario

`disabled` deshabilita todo (botones no pulsables, entrada no editable); `name` es el nombre nativo del formulario.

```vue
<template>
  <lh-input-number :model-value="5" disabled />
  <lh-input-number v-model="value" name="quantity" />
</template>
```

## Props

| Propiedad | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| modelValue / v-model | Valor actual (null para vacío) | `number \| null` | `null` |
| min | Mínimo | `number` | `-Infinity` |
| max | Máximo | `number` | `Infinity` |
| step | Paso | `number` | `1` |
| step-strictly | Solo se aceptan múltiplos del paso | `boolean` | `false` |
| precision | Precisión numérica (decimales) | `number` | — |
| disabled | Deshabilitado | `boolean` | `false` |
| size | Tamaño | `"small" \| "medium" \| "large" \| "mini" \| "x-large"` | `'medium'` |
| controls | Mostrar botones de control | `boolean` | `true` |
| placeholder | Texto de ayuda | `string` | `''` |
| name | Nombre nativo del formulario | `string` | `''` |
| customClass | Nombre de clase personalizado (reenviado al nodo raíz) | `string` | — |
| sx | Propiedades de diseño abreviadas sx | `LhSxProps` | — |

## Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| update:modelValue / change | Valor confirmado (los botones confirman al instante; el valor escrito se confirma al perder foco / confirmar, igual que el change nativo de plus) | `(value: number \| null)` |

## Diferencias de plataforma

- **Momento de confirmación (modelo de borrador)**: el componente input de uni no tiene evento change nativo (los miniprogramas solo tienen input / blur / confirm), por lo que al escribir solo se sincroniza un borrador interno y se confirma una vez al perder foco o con confirm (Enter en H5 / el «listo» del teclado en MP) — equivalente al change nativo de plus, que solo se dispara al confirmar (mismo enfoque que la versión React). El mismo valor nunca se emite dos veces (en MP, tras confirm se dispara otro blur; la deduplicación evita emisiones duplicadas).
- **Botones como view**: los `<button>` de plus se convierten en `<view role="button">` (los botones de MP no pueden restablecer sus estilos por defecto); la pulsación funciona en todas las plataformas. Las view no tienen la pseudo-clase `:disabled`, así que la apariencia deshabilitada la aporta una regla de respaldo en línea del componente con los mismos tokens.
- **Incremento con teclas de flecha solo en H5**: ↑ incrementa / ↓ decrementa (la confirmación con Enter no se cablea en keydown — en H5 los eventos keydown y confirm se disparan juntos, así que la confirmación pasa únicamente por confirm para evitar el doble envío); los miniprogramas no tienen eventos de teclado, sin diferencias de comportamiento.
- **Estilo del placeholder**: la regla `::placeholder` de share solo llega al paquete H5; en el miniprograma se usa la prop `placeholder-style` (color de respaldo por token).
- **Conexión con la validación de formulario no implementada**: plus emite `aria-invalid` en el input mediante el contexto del formulario; la familia input de este paquete no conecta ese aria, sin afectar a los valores ni a la validación.

::: tip Diferencias con la versión Vue 3
- La semántica lógica (normalización de parámetros, incremento, ajuste por precision / min/max / stepStrictly) coincide exactamente con plus (mismo core de share).
- Se añade la prop `customClass`: en uni-app las clases personalizadas no atraviesan `styleIsolation`, así que se reenvían mediante una prop.
- El momento de confirmación del valor escrito: véase la primera entrada de «Diferencias de plataforma» (modelo de borrador, equivalente al change de plus).
:::
