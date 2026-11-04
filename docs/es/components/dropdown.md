# Dropdown (menú desplegable)

Menú de comandos que se despliega hacia abajo. El disparador puede ser cualquier elemento; los elementos del menú se identifican con `command` y se notifican mediante el evento `command` al hacer clic.

## Uso básico

```vue
<template>
  <lh-dropdown @command="onCommand">
    <lh-button>{{ selectedLabel || 'Más acciones' }} ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="new">Nuevo</lh-dropdown-item>
      <lh-dropdown-item command="edit">Editar</lh-dropdown-item>
      <lh-dropdown-item command="delete">Eliminar</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const lastCommand = ref('')
// El texto del disparador lo mantiene el consumidor: el evento command solo entrega el
// valor del comando; qué etiqueta mostrar lo decide el exterior
const labelMap: Record<string, string> = { new: 'Nuevo', edit: 'Editar', delete: 'Eliminar' }
const selectedLabel = ref('')
function onCommand(command: string | number | undefined) {
  lastCommand.value = String(command)
  selectedLabel.value = labelMap[String(command)] ?? String(command)
}
</script>
```

## Métodos de disparo

Por defecto es `click`; también se pueden usar hover y pulsación larga.

```vue
<template>
  <!-- Disparo por hover (solo H5; en el Mini Programa degrada a alternar por toque) -->
  <lh-dropdown trigger="hover" @command="onHoverCommand">
    <lh-button>Disparo por hover ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="ink">Tinta</lh-dropdown-item>
      <lh-dropdown-item command="danqing">Pintura</lh-dropdown-item>
    </template>
  </lh-dropdown>

  <!-- Disparo por clic derecho / pulsación larga -->
  <lh-dropdown trigger="contextmenu" @command="onContextCommand">
    <lh-button>Disparo por pulsación larga ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="refresh">Actualizar</lh-dropdown-item>
      <lh-dropdown-item command="copy">Copiar</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

## Elementos deshabilitados y divisores

```vue
<template>
  <!-- Menú de acciones con elementos deshabilitados y divisores -->
  <lh-dropdown @command="onActionCommand">
    <lh-button>Acciones ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="export">Exportar</lh-dropdown-item>
      <lh-dropdown-item command="import">Importar</lh-dropdown-item>
      <lh-dropdown-item divided command="audit">Registro de auditoría</lh-dropdown-item>
      <lh-dropdown-item disabled command="purge">Borrar datos</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

> Los elementos deshabilitados llevan `aria-disabled="true"` para que los lectores de pantalla los anuncien; las flechas los omiten y los clics o Enter/Space no disparan `command`.

## Posición y altura máxima

```vue
<template>
  <!-- Alineado abajo a la derecha con altura máxima limitada (se desplaza al exceder) -->
  <lh-dropdown placement="bottom-end" :max-height="160" @command="onItemCommand">
    <lh-button>Abajo a la derecha ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item v-for="i in 12" :key="i" :command="i">Elemento {{ i }}</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

## Visibilidad controlada y comportamiento del clic

`v-model:visible` controla la visibilidad manualmente; `hide-on-click` decide si el menú se cierra tras una selección; `popper-class` añade una clase personalizada a la capa.

```vue
<template>
  <!-- Visibilidad controlada: no se cierra tras seleccionar -->
  <lh-dropdown v-model:visible="menuVisible" :hide-on-click="false" popper-class="demo-menu">
    <lh-button>{{ menuVisible ? 'Contraer' : 'Desplegar' }} ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="copy">Copiar (no se cierra)</lh-dropdown-item>
      <lh-dropdown-item command="paste">Pegar</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const menuVisible = ref(false)
</script>
```

## Dropdown API

### Props

| Propiedad | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| trigger | Método de disparo: `click` (todos los destinos) / `hover` (solo H5, degrada a toque en MP) / `contextmenu` (mediante pulsación larga) | `'hover' \| 'click' \| 'contextmenu'` | `'click'` |
| placement | Posición de la capa (12 posiciones) | `LhDropdownPlacement` | `'bottom-start'` |
| visible | Estado de visibilidad (v-model:visible) | `boolean` | — |
| disabled | Deshabilitar el disparador | `boolean` | `false` |
| hideOnClick | Cerrar tras hacer clic en un elemento del menú | `boolean` | `true` |
| popperClass | Clase personalizada de la capa | `string` | — |
| maxHeight | Altura máxima del menú (los números son px) | `string \| number` | — |
| themeVars | Variables de tema a nivel de componente | `Record<string, string>` | — |
| bgPattern | Patrón de fondo a nivel de componente, anula ConfigProvider | `string` | — |
| sx | Propiedades de maquetación rápida (aplicadas a la raíz del disparador) | `LhSxProps` | — |

### Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| command | Se dispara al hacer clic en un elemento del menú | `(command: string \| number \| undefined)` |
| visible-change | Cambio de visibilidad | `(value: boolean)` |
| update:visible | Cambio de visibilidad (v-model) | `(value: boolean)` |

### Slots

| Slot | Descripción |
| --- | --- |
| default | Contenido del disparador |
| dropdown | Contenido del menú (lista de `LhDropdownItem`) |

### Methods

| Método | Descripción |
| --- | --- |
| show | Abrir programáticamente |
| hide | Cerrar programáticamente |
| toggle | Alternar programáticamente |

## DropdownItem API

### Props

| Propiedad | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| command | Identificador del comando, entregado con el evento `command` al hacer clic | `string \| number` | — |
| disabled | Deshabilitado | `boolean` | `false` |
| divided | Muestra un divisor encima del elemento | `boolean` | `false` |

### Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| click | Se dispara al hacer clic en el elemento (no en los deshabilitados) | `(command: string \| number \| undefined)` |

### Accesibilidad

- El disparador lleva `aria-haspopup="menu"` además de `aria-expanded` / `aria-controls`; el menú es `role="menu"` y los elementos `role="menuitem"`
- El teclado sigue el patrón de menú APG (solo H5): ↑/↓ cicla (omitiendo los deshabilitados), Home/End salta a los extremos, Enter/Space dispara `command` y cierra, Esc cierra y devuelve el foco
- Al desplegar, el desbordamiento del eje principal se voltea automáticamente y el del eje cruzado se recorta al viewport

::: tip Diferencias de plataforma (diferencias con la versión Vue3)
- **Métodos de disparo**: el Mini Programa no tiene semántica de hover, así que `trigger="hover"` degrada a alternar por toque en MP; no hay clic derecho, por lo que `trigger="contextmenu"` se maneja con pulsación larga (`longpress`) en ambos destinos (H5 incluido, sin bloquear el menú contextual nativo — plus llama a `preventDefault`).
- **Portador y posicionamiento de la capa**: no hay prop `teleportTarget` — el Mini Programa no tiene teleport de DOM, así que la capa la porta `root-portal` (con fixed en página como respaldo en versiones antiguas); el posicionamiento usa medición asíncrona de dos fotogramas (renderizar oculto para medir → `computePosition` → mostrar, para evitar parpadeos). El cálculo es asíncrono: no asumas un resultado sincrónico.
- **Navegación por teclado solo en H5**: flechas / Home / End / Enter / Space / Esc solo funcionan en H5 (Esc usa un listener a nivel de documento y solo cierra la capa superior cuando hay varias apiladas); el Mini Programa no tiene eventos de teclado y todo el bloque se elimina por compilación condicional.
- **Cierre al hacer clic fuera** lo porta una máscara transparente en la página (equivalente al listener click-outside a nivel document de plus).
- **Sin transición de entrada/salida**: plus anima con `Transition`; en MP `Transition` no es fiable y, como en tooltip / select, no se enlaza ninguna transición.
- **No se cierra automáticamente si el disparador sale del viewport**: el `useLhPopper` de plus tiene un callback scroll-out; uni-app no tiene un canal unificado de scroll/resize, así que no se portó.
:::
