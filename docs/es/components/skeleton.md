# Esqueleto

Marca de posición para cuando los datos aún no están listos; cuando `loading` es false, se renderiza el contenido real.

## Uso básico

```vue
<template>
  <lh-skeleton :loading="loading">
    <view>Contenido real</view>
  </lh-skeleton>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(true)
</script>
```

## Número de líneas y avatar

```vue
<template>
  <lh-skeleton :loading="true" :rows="4" avatar />
</template>
```

## Desactivar la animación

```vue
<template>
  <lh-skeleton :loading="true" :animated="false" :rows="3" />
</template>
```

## Bloques de posición independientes

`lh-skeleton-item` se puede usar por separado para componer una distribución de posición personalizada; `variant` toma los valores `text` / `rect` / `circle`.

```vue
<template>
  <view class="custom-skeleton">
    <lh-skeleton-item variant="circle" class="avatar" />
    <lh-skeleton-item variant="text" class="line" />
  </view>
</template>
```

## Props (lh-skeleton)

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| loading | Si está en estado de carga (cuando es false se renderiza el contenido real del slot default) | `boolean` | `true` |
| rows | Número de líneas de texto | `number` | `3` |
| avatar | Si se incluye una posición de avatar circular | `boolean` | `false` |
| animated | Si la animación está activada | `boolean` | `true` |
| customClass | Clase personalizada | `string` | — |
| sx | Props rápidas de disposición | `LhSxProps` | — |

## Props (lh-skeleton-item)

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| variant | Forma del bloque de posición | `'text' \| 'rect' \| 'circle'` | `'text'` |
| animated | Si la animación está activada | `boolean` | `true` |
| customClass | Clase personalizada | `string` | — |
| sx | Props rápidas de disposición | `LhSxProps` | — |

## Slots (lh-skeleton)

| Slot | Descripción |
| --- | --- |
| default | Contenido real que se renderiza cuando `loading` es false |

::: tip Accesibilidad
El contenedor se marca con `aria-busy="true"` y `aria-live="polite"`; los bloques de posición permanecen ocultos para las tecnologías de asistencia y, cuando los datos están listos, el lector de pantalla anuncia automáticamente el contenido real.
:::
