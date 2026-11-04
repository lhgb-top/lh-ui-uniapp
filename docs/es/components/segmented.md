# Segmented

Conmutación de opciones mutuamente excluyentes, habitual en escenarios de cambio de vista. Basado en datos: las opciones se pasan directamente como un arreglo `options`, sin necesidad de ensamblar componentes hijos a mano.

## Uso básico

`options` admite la forma abreviada de cadena; `modelValue` (`v-model`) es el valor seleccionado actualmente.

```vue
<template>
  <lh-segmented v-model="view" :options="['Lista', 'Tarjeta', 'Tabla']" />
</template>

<script setup>
import { ref } from 'vue'
const view = ref('Lista')
</script>
```

## Opciones como objetos

La forma de objeto proporciona `label` / `value`, útil cuando el texto mostrado difiere del valor.

```vue
<template>
  <lh-segmented
    v-model="mode"
    :options="[
      { label: 'Día', value: 'day' },
      { label: 'Semana', value: 'week' },
      { label: 'Mes', value: 'month' },
    ]"
  />
</template>

<script setup>
import { ref } from 'vue'
const mode = ref('day')
</script>
```

## Opciones deshabilitadas y deshabilitación de todo el grupo

Una opción de objeto con `disabled: true` no se puede seleccionar; el `disabled` a nivel de componente deshabilita todo el control segmentado.

```vue
<template>
  <lh-segmented
    v-model="seg"
    :options="[
      { label: 'Inicio de la primavera', value: 'lichun' },
      { label: 'Agua de lluvia', value: 'yushui' },
      { label: 'Despertar de los insectos', value: 'jingzhe', disabled: true },
    ]"
  />
  <lh-segmented v-model="all" disabled :options="['A', 'B', 'C']" />
</template>

<script setup>
import { ref } from 'vue'
const seg = ref('lichun')
const all = ref('A')
</script>
```

## Ancho de bloque

`block` hace que el control segmentado ocupe todo el contenedor y reparta el ancho a partes iguales entre las opciones (habitual en barras de cambio de vista).

```vue
<template>
  <lh-segmented v-model="block" block :options="['Shi', 'Ci', 'Qu', 'Fu']" />
</template>

<script setup>
import { ref } from 'vue'
const block = ref('Shi')
</script>
```

## Props

| Prop | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| modelValue (v-model) | Valor actual (controlado, se usa con el evento `update:modelValue`) | `string \| number` | — |
| options | Opciones (forma abreviada de cadena u objetos `{ label, value, disabled }`) | `[LhSegmentedInput](#notas-de-tipos)[]` | — |
| disabled | Deshabilitar todo el grupo | `boolean` | `false` |
| block | Ocupar todo el contenedor (las opciones reparten el ancho) | `boolean` | `false` |
| customClass | Nombre de clase personalizado (se reenvía al nodo raíz) | `string` | — |
| sx | Propiedades rápidas de maquetación | `LhSxProps` | — |

### Notas de tipos

```ts
/** Tipo del valor de una opción */
type LhSegmentedValue = string | number

/** Forma del objeto de opción */
interface LhSegmentedOption {
  label: string
  value: LhSegmentedValue
  disabled?: boolean
}

/** Opción de entrada (forma abreviada de cadena u objeto) */
type LhSegmentedInput = LhSegmentedValue | LhSegmentedOption
```

## Events

| Evento | Descripción | Parámetros de retorno |
| --- | --- | --- |
| update:modelValue | Se emite cuando cambia la selección, se usa con v-model | `(value: string \| number)` |
| change | Se emite cuando cambia la selección (tanto al hacer clic como con las flechas) | `(value: string \| number)` |

## Diferencias de plataforma

- **Interacción táctil dibujada con view, disponible en todas las plataformas**: los `<div>` + `<button>` de la versión Vue 3 se sustituyen por `<view>` (WXSS prohíbe los selectores de etiqueta, los estilos se aplican por clases); la selección se cambia con `@click` y el comportamiento es idéntico en H5 y en el Mini Programa de WeChat, sin dependencia de ninguna API de plataforma.
- **El control deslizante de selección es una transición CSS pura**: el color de fondo / sombra de la opción seleccionada se controla con el cambio de clase, y WXSS admite transiciones `transition` sencillas, de modo que ambas plataformas obtienen el fundido; **no depende de `transitionend`** (ese evento no es fiable en el Mini Programa —los componentes animados del repositorio, como message / loading, alinean sus tiempos con setTimeout, mientras que el control segmentado no necesita siquiera orquestación JS, con CSS puro basta y no hay carga de sincronización).
- **La navegación con flechas es solo para H5**: el roving tabindex (las flechas mueven la selección, con bucle en los extremos y saltando las opciones deshabilitadas, reutilizando `getNextListIndex` / `getRovingTabIndex` del core de `@lh-ui/share`) no dispone de eventos de teclado en el Mini Programa; el manejador `@keydown` del SFC está protegido por compilación condicional y no se invoca en el paquete MP; en MP solo se puede elegir pulsando.
- **El aspecto de las opciones deshabilitadas usa un comodín de clase**: los estilos de deshabilitación del código fuente de share están en la pseudoclase `&:disabled` (que solo coincide con elementos button), y view no tiene esa pseudoclase, por lo que el componente añade una regla `lh-segmented__option--disabled` inline con el mismo token (`--lh-disabled-text-color`), siguiendo el precedente de comodín inline de lh-spinner / lh-empty (no forma parte de la salida purificada).
- **Los atributos de accesibilidad se enlazan uno a uno**: el contrato de `role="radiogroup"` / `role="radio"` + `aria-checked` / `aria-disabled` lo siguen decidiendo `getSegmentedAria` / `getSegmentedItemAria` de share; como el compilador de plantillas del Mini Programa no admite `v-bind` con un objeto, la capa de pegamento expande el paquete de atributos en enlaces explícitos por cada atributo.
- **Conclusión de la portabilidad**: Segmented es un componente puro de conmutación sin medición, sin capas superpuestas y sin dependencia de document; la normalización de opciones, las clases y los atributos de accesibilidad los producen las funciones puras del core de `@lh-ui/share`, y este repositorio solo añade el pegamento reactivo. La API es idéntica a la versión Vue 3 (`modelValue` / `options` / `disabled` / `block` / `sx`).
