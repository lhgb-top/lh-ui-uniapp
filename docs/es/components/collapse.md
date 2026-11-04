# Collapse (panel plegable)

Plega y despliega bloques de contenido. Los paneles pueden coexistir o funcionar en modo acordeón (solo uno abierto a la vez).

## Uso básico

Sin `v-model` el componente no es controlado: gestiona el estado de expansión por sí mismo. Al hacer clic en la barra de título se alterna; el evento `change` lleva los paneles desplegados más recientes.

```vue
<template>
  <lh-collapse>
    <lh-collapse-item
      name="a"
      title="Coherencia y diversidad"
    >
      Mantener una apariencia e interacción coherentes con el resto de la página.
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="Retroalimentación"
    >
      Ofecer una retroalimentación clara y oportuna tras cada acción.
    </lh-collapse-item>
  </lh-collapse>
</template>
```

## Acordeón

En modo `accordion`, como máximo hay un panel abierto a la vez; al volver a hacer clic en un panel abierto todo se pliega.

```vue
<template>
  <lh-collapse accordion>
    <lh-collapse-item
      name="a"
      title="Solo uno abierto"
    >
      Como máximo un panel abierto a la vez.
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="Clic de nuevo para plegar"
    >
      Se puede plegar todo.
    </lh-collapse-item>
  </lh-collapse>
</template>
```

## v-model controlado y paneles deshabilitados

Vincula los paneles desplegados con `v-model` (un valor único o un arreglo; en modo acordeón suele ser un valor único); `disabled` deshabilita un panel concreto.

```vue
<template>
  <lh-collapse v-model="activeNames">
    <lh-collapse-item
      name="a"
      title="Panel A"
    >
      Contenido controlado A
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="Panel B (deshabilitado)"
      disabled
    >
      Contenido deshabilitado
    </lh-collapse-item>
    <lh-collapse-item
      name="c"
      title="Panel C"
    >
      Contenido controlado C
    </lh-collapse-item>
  </lh-collapse>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const activeNames = ref(['a'])
</script>
```

## Collapse Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| modelValue | Paneles activos (v-model controlado, valor único o arreglo) | `LhCollapseKey \| LhCollapseKey[]` | — |
| accordion | Modo acordeón: solo un panel abierto a la vez | `boolean` | `false` |
| customClass | Clase personalizada (se aplica al nodo raíz) | `string` | — |
| sx | Props de diseño rápido | `LhSxProps` | — |

## CollapseItem Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| name | Identificador único del panel (obligatorio) | `string \| number` | — |
| title | Título (también hay un slot `title`) | `string` | — |
| disabled | Si el panel está deshabilitado | `boolean` | `false` |
| customClass | Clase personalizada (se aplica al nodo raíz del ítem) | `string` | — |
| sx | Props de diseño rápido | `LhSxProps` | — |

## Eventos

| Evento | Descripción | Argumentos |
| --- | --- | --- |
| update:modelValue | Paneles desplegados cambiados (v-model controlado; el componente no guarda estado interno) | `(value: LhCollapseKey \| LhCollapseKey[])` |
| change | Paneles desplegados cambiados (no controlado; valor único en acordeón, `undefined` cuando todo está plegado) | `(value: LhCollapseKey \| LhCollapseKey[])` |

## Slots

| Slot | Descripción |
| --- | --- |
| Collapse default | Nodos de los paneles (`lh-collapse-item`) |
| CollapseItem default | Contenido del panel |
| CollapseItem title | Título del panel (sobrescribe la prop `title`) |

## Diferencias de plataforma

- **La animación de plegado / despliegue es CSS puro**: `grid-template-rows` transiciona entre `0fr / 1fr` y la flecha gira con `transform`. Nada escucha `transitionend` (es poco fiable en el Mini Programa de WeChat, así que esta librería nunca depende de él). El cambio de clase aterriza al instante: aunque algún motor de renderizado de MP no soporte transiciones de grid, el estado expandido final sigue siendo correcto; solo falta la transición.
- **El contenido siempre se renderiza** (sin atajo de `v-if`): `lh-collapse__wrap` se muestra mediante la clase `--active`. Si necesitas renderizar el contenido solo al desplegar, contrólalo tú mismo con `v-if` en el lado del contenido.
- `<h3>` / `<button>` se reemplazan por `<view>` / `<text>` (WXSS prohíbe selectores de etiqueta); el estado deshabilitado no depende de un `<button disabled>` nativo, sino de un guardia de clic + la clase `--disabled` + `aria-disabled`.
- La semántica de accesibilidad se emite en ambas plataformas: la cabecera lleva `role="button"` + `aria-expanded` / `aria-controls`, y la región de contenido `role="region"` + `aria-labelledby`. El soporte de lectores de pantalla en MP depende de la plataforma. En H5 la cabecera enfocada responde naturalmente a Enter / Space.
- Los `id` que relacionan cabecera y contenido se generan de forma localmente única con `generateId` (no se usa el `useId` de Vue 3.5, por compatibilidad con los núcleos de Vue de uni-app), de modo que varios grupos de colapso en una página nunca colisionan.
- **Decisión de portado (alineada con la versión Vue3, sin APIs inventadas)**: el portado sigue estrictamente la fuente de verdad de plus y proporciona únicamente `v-model` (valor único / arreglo), `accordion`, `name` / `title` / `disabled` del panel y el slot `title`. Lo que no existe en la fuente de verdad (colapsos anidados, slots de icono, renderizado diferido, etc.) no se añade por iniciativa propia; se seguirá a la fuente de verdad cuando lo añada.
- Hay una corrección de lectura del estado controlado en la capa de pegamento de este repositorio (registrada en el changeset): en modo controlado, el estado de expansión es un `computed` que se suscribe a `props.modelValue`, de modo que los paneles siguen de inmediato un v-model actualizado de forma asíncrona. Las funciones puras de core y el contrato de props son idénticos a plus.
