# Drawer (panel deslizante)

Un panel que se desliza desde el borde de la pantalla, adecuado para tareas temporales que necesitan más espacio que un Dialog (detalles, filtros, pasos de un asistente). Como Dialog usa `role="dialog"` + `aria-modal="true"`; los clics en la máscara y Esc (H5) lo cierran.

## Uso básico

```vue
<template>
  <lh-button @click="visible = true">Abrir drawer</lh-button>

  <lh-drawer v-model="visible" title="Detalles del pedido">
    <view>Coloque aquí el contenido del cuerpo del drawer.</view>
    <view>El ancho del panel lo controla size, el 30% del viewport por defecto.</view>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
</script>
```

## Cuatro direcciones

`direction` acepta `right` (por defecto) / `left` / `top` / `bottom`; el panel se desliza desde el borde correspondiente.

```vue
<template>
  <!-- Abrir el drawer derecho -->
  <lh-button @click="openDir('right')">right</lh-button>
  <!-- Abrir el drawer izquierdo -->
  <lh-button @click="openDir('left')">left</lh-button>
  <!-- Abrir el drawer superior -->
  <lh-button @click="openDir('top')">top</lh-button>
  <!-- Abrir el drawer inferior -->
  <lh-button @click="openDir('bottom')">bottom</lh-button>

  <!-- Se desliza en la dirección indicada -->
  <lh-drawer v-model="dirVisible" :title="`Drawer ${direction}`" :direction="direction" size="40%">
    <view>Dirección actual: {{ direction }}</view>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhDrawerDirection } from '@lh-ui/uniapp'

const dirVisible = ref(false)
const direction = ref<LhDrawerDirection>('right')
function openDir(d: LhDrawerDirection) {
  direction.value = d
  dirVisible.value = true
}
</script>
```

## Tamaño personalizado

Un `size` numérico es px; las cadenas admiten porcentajes (p. ej. `'40%'`). Las direcciones horizontales lo aplican al ancho y las verticales a la altura.

```vue
<template>
  <!-- Abrir un drawer de 480 px de ancho -->
  <lh-button @click="sized = true">Drawer de 480 px</lh-button>

  <!-- Drawer de tamaño fijo con una barra de acciones inferior -->
  <lh-drawer v-model="sized" title="Filtros" :size="480">
    <view>Filtra los datos por nombre o etiqueta.</view>
    <template #footer>
      <lh-button @click="sized = false">Cancelar</lh-button>
      <lh-button type="primary" @click="sized = false">Aplicar filtros</lh-button>
    </template>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const sized = ref(false)
</script>
```

## Interruptores de comportamiento

`mask-closable` controla el cierre con clic en la máscara, `show-close` el botón de cierre superior derecho, `close-on-esc` el cierre con Esc (solo H5) y `lock-scroll` el bloqueo del desplazamiento mientras está abierto (solo H5).

```vue
<template>
  <!-- Abrir el drawer «solo se cierra con el botón» -->
  <lh-button @click="locked = true">Solo se cierra con el botón</lh-button>

  <!-- Los clics en la máscara y Esc no lo cierran; solo el botón -->
  <lh-drawer
    v-model="locked"
    title="Solo se cierra con el botón"
    :mask-closable="false"
    :show-close="false"
    :close-on-esc="false"
  >
    <view>Ni los clics en la máscara ni Esc (H5) lo cierran.</view>
    <template #footer>
      <lh-button type="primary" @click="locked = false">Cerrar</lh-button>
    </template>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const locked = ref(false)
</script>
```

## Drawer API

### Props

| Propiedad | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| modelValue (v-model) | Si se muestra | `boolean` | `false` |
| title | Título (o use el slot header) | `string` | — |
| direction | Dirección | `'right' \| 'left' \| 'top' \| 'bottom'` | `'right'` |
| size | Tamaño: los números son px, las cadenas admiten porcentajes | `string \| number` | `'30%'` |
| maskClosable | Cerrar al hacer clic en la máscara | `boolean` | `true` |
| showClose | Mostrar el botón de cierre | `boolean` | `true` |
| lockScroll | Bloquear el desplazamiento mientras está abierto (**solo H5**) | `boolean` | `true` |
| closeOnEsc | Responder a Esc (**solo H5**) | `boolean` | `true` |
| customClass | Nombre de clase personalizado (pasado al nodo raíz) | `string` | — |
| themeVars | Variables de tema a nivel de componente | `Record<string, string>` | — |
| bgPattern | Patrón de fondo a nivel de componente, anula ConfigProvider | `string` | — |
| sx | Propiedades de diseño rápido sx (aplicadas al panel) | `LhSxProps` | — |

### Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| update:modelValue | Cambió la visibilidad (tras la animación) | `(visible: boolean)` |
| open | Abierto | — |
| close | Cerrado (tras la animación) | — |

### Slots

| Slot | Descripción |
| --- | --- |
| default | Contenido del cuerpo |
| header | Área de título de la cabecera personalizada (sustituye al texto del título) |
| footer | Barra de acciones inferior |

### Methods

| Método | Descripción |
| --- | --- |
| open | Abrir programáticamente |
| close | Cerrar programáticamente |

### Accesibilidad

- El nodo raíz es `role="dialog"` + `aria-modal="true"`; con título se vincula mediante `aria-labelledby`, sin título se usa `drawer.title` del paquete de idioma como `aria-label` de respaldo
- La máscara es decorativa (`aria-hidden="true"`)
- El botón de cierre lleva `role="button"` y un `aria-label` del paquete de idioma `drawer.close`
- Esc cierra (se desactiva con `close-on-esc`, solo H5)

::: tip Diferencias de plataforma (diferencias con la versión Vue3)
- **Portador del overlay**: sin prop `teleportTarget` — el Mini Program no tiene DOM teleport, el overlay lo porta `root-portal` (en H5 es teleport). **En WeChat, `root-portal` requiere la librería base ≥ 2.25.2**; las versiones anteriores caen automáticamente a `fixed` dentro de la página (permanece en el árbol de nodos de la página, pero la capa sigue garantizada por el z-index autoincremental, así que el comportamiento no se ve afectado).
- **Transición de entrada/salida**: plus anima el deslizamiento con `<Transition name="lh-drawer-fade">`; el Mini Program no tiene el componente `<Transition>` y su evento `transitionend` no es fiable, así que este portado reproduce manualmente la secuencia de clases de Vue Transition (estado inicial retirado un fotograma después → estado activo → desmontaje al final) y alinea los 300 ms de la transición SCSS de share con `setTimeout` — la máscara se desvanece mientras el panel se desliza según la dirección, igual en ambos destinos.
- **Sin trampa de foco (la semántica de foco por teclado es solo de H5)**: plus encierra la secuencia de Tab dentro del panel mientras está abierto; el Mini Program no tiene semántica de foco por teclado (el `shouldDrawerTrapFocus` de share se cortocircuita con la guarda de compilación `LH_IS_H5`) y, como Dialog, este portado no llama al focus-trap de share — solo se conserva el cierre con Esc.
- **lockScroll solo H5**: el Mini Program no puede bloquear el desplazamiento del body; la máscara a pantalla completa que intercepta los clics es el respaldo.
- **closeOnEsc solo H5**: Esc usa un escuchador de teclado a nivel de documento y solo responde el overlay superior cuando hay varios apilados; el Mini Program no tiene eventos de teclado y todo el bloque se elimina por compilación condicional.
- **teleportTarget no implementado**: sigue el precedente de select / tooltip / dropdown (no hay DOM teleport en los Mini Programs).
- **Área segura inferior**: con `direction="bottom"` el panel añade automáticamente el relleno `env(safe-area-inset-bottom)` para dispositivos de pantalla completa (adaptación específica de uni-app; la fuente de estilos de share no tiene esta especialización).
:::
