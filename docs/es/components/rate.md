# Rate (valoración)

Valoración por estrellas: clic para seleccionar, con medias estrellas y texto de puntuación opcionales; el modo de solo lectura expone la valoración como texto para lectores de pantalla. Los niveles de relleno, el recorte y el incremento provienen de funciones puras del core de `@lh-ui/share`.

## Uso básico

```vue
<template>
  <lh-rate v-model="value" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const value = ref(3)
</script>
```

## Medias estrellas

`allow-half` activa las medias estrellas: en H5, hacer clic en la mitad izquierda de una estrella cuenta 0.5 (según el desplazamiento horizontal del clic).

```vue
<template>
  <lh-rate v-model="value" allow-half />
</template>
```

## Solo lectura y texto de puntuación

`readonly` entra en la rama de pura visualización (`role="img"` con la valoración en `aria-label`); `show-score` añade el texto de puntuación y `score-template` lo personaliza (marcador `{n}`).

```vue
<template>
  <lh-rate :model-value="3.5" readonly allow-half show-score />
  <lh-rate :model-value="4" readonly show-score score-template="{n} pts" />
</template>
```

## Número de estrellas y carácter personalizados

`max` ajusta el límite de estrellas (recortado a [0, max]); `character` sustituye al `★` por defecto.

```vue
<template>
  <lh-rate :model-value="5" :max="8" character="墨" />
</template>
```

## Deshabilitado

`disabled` deshabilita todo el grupo: los clics no tienen efecto y la raíz recibe `lh-rate--disabled` junto con `aria-disabled`.

## Props

| Prop | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| modelValue / v-model | Valoración actual | `number` | `0` |
| max | Límite de estrellas | `number` | `5` |
| allow-half | Permitir medias estrellas | `boolean` | `false` |
| readonly | Solo lectura (solo visualización) | `boolean` | `false` |
| disabled | Deshabilitado | `boolean` | `false` |
| character | Carácter personalizado | `string` | — |
| show-score | Mostrar texto de puntuación | `boolean` | `false` |
| score-template | Plantilla de puntuación (marcador `{n}`) | `string` | — |
| customClass | Clase personalizada (se reenvía al nodo raíz) | `string` | — |
| sx | Propiedades de diseño abreviadas sx | `LhSxProps` | — |

## Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| update:modelValue / change | Valoración modificada (un mismo valor no se emite dos veces) | `(value: number)` |

## Diferencias entre plataformas

- **La detección de media estrella es solo de H5**: depende del desplazamiento horizontal del evento de clic (`offsetX`), que **los eventos del Mini Programa no incluyen**, así que ahí los clics degradan a estrellas completas. Si necesitas precisión de media estrella en el Mini Programa, impleméntala tú mismo con eventos touch + cálculo asíncrono de desplazamiento mediante `uni.createSelectorQuery` (ten en cuenta que SelectorQuery es asíncrono).
- **Elemento de la estrella**: las estrellas `<button>` de plus pasan a ser `<view role="radio">` (los button de MP no pueden resetear sus estilos por defecto); el estado deshabilitado se expresa con el guardia de clic + la clase modificadora `--disabled` + `aria-disabled`.
- **Incremento por teclado solo en H5**: flechas ±1 (±0.5 con medias estrellas), Home pone a cero y End al máximo; los Mini Programas no tienen eventos de teclado, así que no hay diferencia de comportamiento.
- **Texto de puntuación**: proviene de `rate.stars` en los locales de share (`{n} 星`, nueve idiomas completos); `score-template` puede sobreescribirlo.

::: tip Diferencias con la versión Vue 3
- La semántica lógica (recorte, niveles de relleno, incremento, aria) coincide exactamente con plus (mismo core de share).
- Se añade la prop `customClass`: en uni-app las clases personalizadas no atraviesan `styleIsolation`, así que se reenvían mediante una prop.
- La detección de media estrella degrada a estrellas completas en el Mini Programa (ver «Diferencias entre plataformas»).
:::
