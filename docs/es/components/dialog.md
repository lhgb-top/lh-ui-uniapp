# Diálogo

## Uso básico

```vue
<template>
  <lh-button @click="visible = true">Abrir el diálogo</lh-button>

  <lh-dialog v-model="visible" title="Título" width="80%">
    <view>Este es el contenido del diálogo</view>
    <template #footer>
      <lh-button @click="visible = false">Cancelar</lh-button>
      <lh-button type="primary" @click="visible = false">Aceptar</lh-button>
    </template>
  </lh-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
</script>
```

## Posicionamiento

```vue
<template>
  <lh-dialog v-model="visible" position="bottom" title="Capa flotante inferior">
    <view>Contenido inferior</view>
  </lh-dialog>

  <lh-dialog v-model="visible" fullscreen title="Pantalla completa">
    <view>Contenido a pantalla completa</view>
  </lh-dialog>
</template>
```

La capa flotante inferior incorpora automáticamente `env(safe-area-inset-bottom)` para adaptarse a las pantallas completas.

## Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| modelValue (v-model) | Si está visible | `boolean` | `false` |
| title | Título | `string` | — |
| width | Ancho | `string \| number` | — |
| top | Distancia superior | `string \| number` | — |
| fullscreen | A pantalla completa | `boolean` | `false` |
| position | Posicionamiento | `'center' \| 'top' \| 'bottom'` | `'center'` |
| closeOnClickModal | Se cierra al hacer clic en la capa de fondo | `boolean` | `true` |
| closeOnPressEscape | Se cierra con Esc (**sin eventos de teclado en MP; no funciona**) | `boolean` | `true` |
| lockScroll | Bloquea el desplazamiento del fondo (**solo efectivo en H5**) | `boolean` | `true` |
| zIndex | Nivel; si no se pasa, se asigna de forma autoincremental | `number` | — |
| customClass | Clase personalizada | `string` | — |
| themeVars | Variables de tema a nivel de componente | `Record<string, string>` | — |
| sx | Props rápidas de disposición | `LhSxProps` | — |

## Slots

| Slot | Descripción |
| --- | --- |
| default | Contenido |
| footer | Zona de botones del pie |

## Events

| Evento | Descripción | Parámetros de la retrollamada |
| --- | --- | --- |
| update:modelValue | Cambio de visibilidad | `(visible: boolean)` |
| open | Apertura | — |
| close | Cierre | — |

::: tip Diferencias frente a la versión Vue3
- El montaje de la capa flotante usa `root-portal` (en H5 es teleport; en MP, root-portal o la degradación `fixed` dentro de la página).
- **focus-trap no está disponible en la plataforma MP**: la salvaguarda de compilación `LH_IS_H5` hace que devuelva false directamente, sin invocar focus-trap.
- **lockScroll no es efectivo en la plataforma MP**: el Mini Programa no puede bloquear el desplazamiento del body; la capa de fondo intercepta los clics como alternativa.
- `closeOnPressEscape` no es efectivo en la plataforma MP (no hay eventos de teclado).
:::
