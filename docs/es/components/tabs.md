# Tabs

Cambia entre paneles dentro de la misma área. La cabecera de pestañas permite desplazamiento horizontal, estilo de tarjeta y pestañas cerrables / agregables.

## Uso básico

Vincula el `name` del panel activo con `v-model`; si se omite, se activa el primer panel habilitado.

```vue
<template>
  <lh-tabs v-model="active">
    <lh-tab-pane
      name="ink"
      label="Tinta"
    >
      Tinta: quemada, espesa, pesada, clara, ligera.
    </lh-tab-pane>
    <lh-tab-pane
      name="danqing"
      label="Pintura"
    >
      Danqing: bermellón y azurita, término clásico para la pintura.
    </lh-tab-pane>
    <lh-tab-pane
      name="liubai"
      label="Espacio en blanco"
    >
      Espacio en blanco: tratar lo blanco como tinta, dejando respirar al espíritu.
    </lh-tab-pane>
  </lh-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref('ink')
</script>
```

## Estilo de tarjeta

`type="card"` cambia a una apariencia de tarjeta.

```vue
<template>
  <lh-tabs
    v-model="active"
    type="card"
  >
    <lh-tab-pane
      name="spring"
      label="Primavera"
    >
      Primavera: brotan las plantas.
    </lh-tab-pane>
    <lh-tab-pane
      name="summer"
      label="Verano"
    >
      Verano: todo florece.
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## Posición de las pestañas

`tab-position="bottom"` coloca la cabecera de pestañas debajo del contenido.

```vue
<template>
  <lh-tabs
    v-model="active"
    tab-position="bottom"
  >
    <lh-tab-pane
      name="poem"
      label="Poesía"
    >
      Poesía: expresar la aspiración.
    </lh-tab-pane>
    <lh-tab-pane
      name="painting"
      label="Pintura"
    >
      Pintura: transmitir la idea.
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## Pestañas deshabilitadas

Un `lh-tab-pane` con `disabled` no se puede activar (los clics no tienen efecto y un `modelValue` que lo apunte retrocede al primer panel habilitado).

```vue
<template>
  <lh-tabs v-model="active">
    <lh-tab-pane
      name="first"
      label="Habilitado"
    >
      El primer panel está habilitado.
    </lh-tab-pane>
    <lh-tab-pane
      name="second"
      label="Deshabilitado"
      disabled
    >
      Este panel está deshabilitado y no se puede activar.
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## Cerrable y agregable

`closable` renderiza un botón de cierre en cada pestaña (emite `tab-remove` al hacer clic); `addable` renderiza un botón de añadir (emite `tab-add`). El componente solo emite eventos: añadir y eliminar nodos de panel corresponde a la capa de negocio, igual que en la versión Vue 3.

```vue
<template>
  <lh-tabs
    v-model="active"
    closable
    addable
    @tab-remove="handleRemove"
    @tab-add="handleAdd"
  >
    <lh-tab-pane
      v-for="pane in panes"
      :key="pane.name"
      :name="pane.name"
      :label="pane.label"
    >
      {{ pane.label }}: contenido del panel.
    </lh-tab-pane>
  </lh-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref('one')
const panes = ref([
  { name: 'one', label: 'Pestaña uno' },
  { name: 'two', label: 'Pestaña dos' },
])

function handleRemove(name: string) {
  panes.value = panes.value.filter((pane) => pane.name !== name)
}

function handleAdd() {
  panes.value.push({ name: `new-${panes.value.length + 1}`, label: 'Nueva pestaña' })
}
</script>
```

## Tabs Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| modelValue | Name del panel activo (v-model) | `string` | — |
| type | Apariencia: `'line'` subrayado / `'card'` tarjeta | `'line' \| 'card'` | `'line'` |
| closable | Si las pestañas se pueden cerrar | `boolean` | `false` |
| addable | Si se muestra el botón de añadir | `boolean` | `false` |
| tabPosition | Posición de las pestañas: `'top'` / `'bottom'` | `'top' \| 'bottom'` | `'top'` |
| customClass | Clase personalizada | `string` | — |
| sx | Props rápidas de layout | `LhSxProps` | — |

## TabPane Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| name | Identificador único del panel (clave estable, evitar cambiarlo dinámicamente) | `string` | — |
| label | Etiqueta de la pestaña | `string` | `''` |
| disabled | Si el panel está deshabilitado | `boolean` | `false` |
| customClass | Clase personalizada (se aplica al nodo raíz del panel) | `string` | — |

## Events

| Evento | Descripción | Argumentos del callback |
| --- | --- | --- |
| update:modelValue | Cambió el panel activo (v-model) | `(name: string)` |
| tab-change | Cambió el panel activo por interacción del usuario | `(name: string)` |
| tab-remove | Se hizo clic en el botón de cerrar; el componente no elimina los nodos hijos, los mantiene la capa de negocio | `(name: string)` |
| tab-add | Se hizo clic en el botón de añadir; el componente no añade nodos hijos, los mantiene la capa de negocio | — |

## Slots

| Slot | Descripción |
| --- | --- |
| Tabs default | Nodos de panel (solo se recogen los `lh-tab-pane`; pueden envolverse en `v-for` / `template`) |
| TabPane default | Contenido del panel |

## Diferencias entre plataformas

- La cabecera de pestañas es un `scroll-view` (barra de navegación con desplazamiento horizontal): en WeChat Mini Program `enable-flex` convierte el contenedor de desplazamiento en un layout flex, de modo que las pestañas nunca se encogen ni se envuelven; en H5 se aplica la clase `display: flex`.
- **El subrayado activo es una transición CSS pura** (la línea de tinta `::after` de la pestaña activa) y no depende de `transitionend`. Si en el futuro se añade un indicador deslizante controlado por JS: `transitionend` no es fiable en Mini Program, por lo que el cierre de la animación debe alinearse con `setTimeout` (el mismo enfoque que las transiciones de message / loading).
- **La navegación por teclado (flechas / Home / End / Delete para cerrar) es solo para H5**: Mini Program no tiene eventos de teclado y una constante de compilación evita que la rama de navegación entre al paquete MP (sin código muerto). El atributo `tabindex` del roving tabindex se mantiene en MP, pero allí no tiene semántica de teclado.
- Los roles de accesibilidad `role="tablist" / "tab" / "tabpanel"` y `aria-selected` / `aria-controls` / `aria-labelledby` se emiten en ambas plataformas; la compatibilidad del lector de pantalla en Mini Program depende de la plataforma.
- Los `id` de pestañas y paneles se generan con un prefijo único por instancia (`generateId`), de modo que varias tabs por página nunca colisionan.
- **Decisión de portado (alineada con la versión Vue 3, sin APIs inventadas)**: en el momento del portado, la fuente de verdad de plus y el core de `@lh-ui/share` aún no ofrecían `lazy`, `before-leave`, `editable` (= azúcar de closable + addable) ni el estilo `border-card`, por lo que esta biblioteca tampoco los ofrece. El contenido del panel siempre se renderiza y se alterna con `v-show`. Se incorporarán cuando la fuente de verdad los añada.
