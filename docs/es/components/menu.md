# Menu Menú de navegación

Menú de navegación para páginas y funciones. Admite dos modos de disposición — vertical (predeterminado) y horizontal — con submenús anidados de forma recursiva; el elemento activo se aloja en `v-model`, y el conjunto expandido puede ser controlado (`openeds`) o dejarse como estado interno (`default-openeds`).

## Uso básico

```vue
<template>
  <lh-menu v-model="active">
    <lh-menu-item index="1">Inicio</lh-menu-item>
    <lh-menu-item index="2">Obras</lh-menu-item>
    <lh-menu-item index="3">Acerca de</lh-menu-item>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('1')
</script>
```

`index` es el identificador único del elemento; al pulsar un elemento hoja se emite con el evento `select` (`update:modelValue` se emite a la vez, de modo que puede recibirse con `v-model`).

## Submenús y expansión por defecto

```vue
<template>
  <lh-menu v-model="active" :default-openeds="['2']" @select="onSelect">
    <lh-menu-item index="1">Inicio</lh-menu-item>
    <lh-sub-menu index="2" title="Mis obras">
      <lh-menu-item index="2-1">Pintura de tinta</lh-menu-item>
      <lh-menu-item index="2-2">Pintura Gongbi</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('')
function onSelect(index: string, indexPath: string[]) {
  console.log(index, indexPath)
}
</script>
```

Los submenús pueden anidarse en varios niveles: el `indexPath` del evento `select` es la ruta completa desde el submenú más externo hasta el elemento elegido (p. ej. `['2', '2-1', '2-1-1']`).

## Acordeón

`unique-opened` mantiene como máximo un submenú expandido a la vez (pulsar de nuevo un título ya expandido lo contrae; se permite que todo quede contraído).

```vue
<template>
  <lh-menu v-model="active" unique-opened>
    <lh-sub-menu index="1" title="Primer grupo">
      <lh-menu-item index="1-1">Opción 1-1</lh-menu-item>
    </lh-sub-menu>
    <lh-sub-menu index="2" title="Segundo grupo">
      <lh-menu-item index="2-1">Opción 2-1</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>
```

## Expansión controlada

Al pasar `openeds` se entra en modo controlado: el componente ya no mantiene el estado de expansión por su cuenta, sino que lo impulsa la devolución de llamada `update:openeds`.

```vue
<template>
  <lh-menu v-model="active" :openeds="openeds" @update:openeds="openeds = $event">
    <lh-sub-menu index="1" title="Submenú controlado">
      <lh-menu-item index="1-1">Opción 1-1</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('')
const openeds = ref<string[]>(['1'])
</script>
```

## Agrupación

`lh-menu-item-group` agrupa elementos del mismo tipo (agrupación puramente visual; no participa en la lógica de expansión).

```vue
<template>
  <lh-menu v-model="active">
    <lh-menu-item-group title="Contenido básico">
      <lh-menu-item index="1">Artículos</lh-menu-item>
      <lh-menu-item index="2">Imágenes</lh-menu-item>
    </lh-menu-item-group>
    <lh-menu-item-group title="Funciones avanzadas">
      <lh-menu-item index="3">Análisis de datos</lh-menu-item>
    </lh-menu-item-group>
  </lh-menu>
</template>
```

## Modo horizontal

```vue
<template>
  <lh-menu v-model="active" mode="horizontal">
    <lh-menu-item index="1">Inicio</lh-menu-item>
    <lh-sub-menu index="2" title="Portafolio">
      <lh-menu-item index="2-1">Pintura de tinta</lh-menu-item>
      <lh-menu-item index="2-2">Pintura Gongbi</lh-menu-item>
    </lh-sub-menu>
    <lh-menu-item index="3">Acerca de</lh-menu-item>
  </lh-menu>
</template>
```

En modo horizontal los submenús se despliegan debajo de su título (`bottom-start`); los niveles anidados se despliegan hacia la derecha (`right-start`).

## Modo colapsado

El modo vertical combinado con `collapse` contrae el menú a una franja estrecha; entonces los submenús pasan a ser paneles desplegables a la derecha.

```vue
<template>
  <lh-menu v-model="active" collapse>
    <lh-sub-menu index="1" title="Correo">
      <lh-menu-item index="1-1">Bandeja de entrada</lh-menu-item>
      <lh-menu-item index="1-2">Enviados</lh-menu-item>
    </lh-sub-menu>
    <lh-menu-item index="2">Borradores</lh-menu-item>
  </lh-menu>
</template>
```

## Menu API

### Props

| Propiedad | Descripción | Tipo | Valor por defecto |
| --- | --- | --- | --- |
| modelValue | Elemento activo (v-model; se mantiene internamente si se omite) | `string` | — |
| mode | Modo de disposición | `'horizontal' \| 'vertical'` | `'vertical'` |
| collapse | Contrae el menú vertical a una franja de iconos (los submenús pasan a paneles desplegables) | `boolean` | `false` |
| defaultOpeneds | Claves de los submenús expandidos por defecto (no controlado) | `string[]` | `[]` |
| openeds | Claves de los submenús expandidos (controlado) | `string[]` | — |
| uniqueOpened | Acordeón: mantener como máximo un submenú expandido | `boolean` | `false` |
| sx | Props rápidas de layout | `LhSxProps` | — |

### Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| select | Al seleccionar un elemento hoja | `(index: string, indexPath: string[])` |
| open | Al expandirse un submenú | `(index: string, indexPath: string[])` |
| close | Al contraerse un submenú | `(index: string, indexPath: string[])` |
| update:modelValue | Cambio del elemento activo (v-model) | `(value: string)` |
| update:openeds | Cambio del conjunto expandido | `(value: string[])` |

### Slots

| Slot | Descripción |
| --- | --- |
| default | Contenido del menú (combinación de `LhMenuItem` / `LhSubMenu` / `LhMenuItemGroup`) |

## MenuItem API

### Props

| Propiedad | Descripción | Tipo | Valor por defecto |
| --- | --- | --- | --- |
| index | Identificador único (obligatorio) | `string` | — |
| disabled | Deshabilitado (mantiene la semántica de aria-disabled; ni el clic ni la activación por teclado lo disparan) | `boolean` | `false` |
| sx | Props rápidas de layout | `LhSxProps` | — |

### Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| click | Al pulsar el elemento hoja (no se dispara en los deshabilitados) | `(index: string)` |

## SubMenu API

### Props

| Propiedad | Descripción | Tipo | Valor por defecto |
| --- | --- | --- | --- |
| index | Identificador único (obligatorio) | `string` | — |
| title | Título (también admite el slot `title`) | `string` | — |
| disabled | Deshabilitado | `boolean` | `false` |
| sx | Props rápidas de layout | `LhSxProps` | — |

### Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| select | Al seleccionarse un elemento hoja descendiente (la ruta incluye el índice de este nivel) | `(index: string, indexPath: string[])` |

### Slots

| Slot | Descripción |
| --- | --- |
| default | Contenido del submenú (puede anidar más `LhMenuItem` / `LhSubMenu`) |
| title | Contenido personalizado del título |

## MenuItemGroup API

### Props

| Propiedad | Descripción | Tipo | Valor por defecto |
| --- | --- | --- | --- |
| title | Título del grupo (también admite el slot `title`) | `string` | — |
| sx | Props rápidas de layout | `LhSxProps` | — |

### Slots

| Slot | Descripción |
| --- | --- |
| default | Contenido del grupo |
| title | Título personalizado del grupo |

### Accesibilidad

- El contenedor es `role="menu"` (`role="menubar"` en modo horizontal); los elementos hoja y los títulos de los submenús son `role="menuitem"`, los elementos deshabilitados emiten `aria-disabled`, y los títulos de los submenús llevan además `aria-expanded` / `aria-haspopup` / `aria-controls`
- El teclado sigue el patrón de menú de APG (solo en H5): en modo vertical ↑/↓ recorre los elementos visibles en ciclo (omite los deshabilitados y los de paneles contraídos), Home/End saltan a los extremos; Enter/Space activan el elemento hoja; sobre el título de un submenú Enter/Space/→ lo expanden y mueven el foco al panel, ←/Esc lo contraen
- En modo horizontal la semántica de ←/→ queda reservada a cada título; el contenedor raíz no intercepta las flechas

::: tip Diferencias de plataforma (frente a la versión Vue3)
- **El modo vertical y el acordeón sirven para todas las plataformas**: el modo vertical (incluida la expansión en línea de los submenús, el acordeón y el control mediante v-model / openeds) está implementado con CSS puro y provide/inject, y se comporta de forma idéntica en H5 y en el Mini Programa de WeChat.
- **Desplazamiento horizontal**: cuando la anchura total de los elementos del modo horizontal supera el contenedor, el desplazamiento lo asume el propio `overflow-x` del contenedor (en WXSS las vistas admiten el desplazamiento por desbordamiento), sin envolver el contenido en un `scroll-view` — este último en H5 envolvería el contenido del slot en una capa interna `uni-scroll-view-content` y rompería la estructura flex de hijos directos del scss de share (a diferencia de la cabecera horizontal de lh-tabs, los elementos del menú son flex de bloque y no pueden refugiarse en inline-flex como las pestañas).
- **Los submenús desplegables van sobre root-portal**: los paneles desplegables del modo horizontal / colapsado sustituyen el `<teleport to="body">` de plus por `lh-root-portal` (con un respaldo de `fixed` dentro de la página en versiones antiguas de la base); el posicionamiento pasa por una medición asincrónica en dos fotogramas (se rinde oculto para medir → `computePosition` posiciona → se muestra, para evitar parpadeos); el cálculo del posicionamiento es asincrónico, no se puede asumir un resultado síncrono; los niveles anidados se despliegan hacia la derecha (`right-start`).
- **El paso del cursor solo en H5**: la expansión al pasar el cursor por un título solo funciona en H5; el Mini Programa no tiene semántica de hover, de modo que abrir y cerrar los paneles desplegables se asume con pulsos sobre el título, y el toque fuera del panel lo captura una máscara transparente dentro de la página (equivalente a la semántica de contracción por mouseleave de plus).
- **La navegación por teclado solo en H5**: ↑/↓ / Home / End / Enter / Space / ←/→ / Esc solo funcionan en H5; el Mini Programa no tiene eventos de teclado y todo el bloque queda recortado por la compilación condicional (el paquete MP no contiene código muerto).
- **Sin transición de entrada y salida**: plus anima con `Transition`, que no es fiable en MP, así que —al igual que tooltip / select— no se vincula ninguna transición; la animación de expansión del panel en línea es CSS puro (grid-template-rows 0fr/1fr) y no se escucha transitionend (no es fiable en MP); aun cuando el MP no soporte la transición, el estado final sigue siendo correcto.
:::
