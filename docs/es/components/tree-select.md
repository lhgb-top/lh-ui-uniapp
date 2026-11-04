# TreeSelect (selector en árbol)

Un selector en árbol para datos con jerarquía, como organigramas o árboles de categorías. Al pulsar el disparador se abre un panel en árbol; en selección única, pulsar un nodo lo selecciona y cierra el panel; en selección múltiple, la selección se hace mediante casillas de verificación (cascada padre-hijo).

## Uso básico

```vue
<template>
  <lh-tree-select v-model="value" :data="data" placeholder="请选择节点" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<string | undefined>(undefined)
const data = [
  {
    key: 'zhinan',
    label: '指南',
    children: [
      {
        key: 'sheji',
        label: '设计指南',
        children: [
          { key: 'yuansze', label: '颜色' },
          { key: 'fuziyuanze', label: '字体' },
        ],
      },
      { key: 'shejiguize', label: '设计规则' },
    ],
  },
  {
    key: 'zujian',
    label: '组件',
    children: [
      { key: 'jiben', label: '基础' },
      { key: 'fankui', label: '反馈' },
    ],
  },
]
</script>
```

Pulsar un nodo lo selecciona (incluidos los nodos no hoja) y cierra el panel; pulsar la flecha de expansión a la izquierda del nodo solo lo expande / colapsa sin cambiar el valor seleccionado. El disparador muestra el `label` del nodo seleccionado.

## Selección múltiple

```vue
<template>
  <lh-tree-select v-model="value" :data="data" multiple placeholder="请选择多个节点" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<string[]>(['jiben', 'fankui'])
const data = [
  {
    key: 'zujian',
    label: '组件',
    children: [
      { key: 'jiben', label: '基础' },
      { key: 'fankui', label: '反馈' },
    ],
  },
]
</script>
```

En selección múltiple, `v-model` se vincula al arreglo de claves marcadas (`string[]`) con cascada padre-hijo: marcar un nodo padre marca automáticamente a todos los descendientes marcables, un padre pasa a totalmente marcado cuando todos sus descendientes lo están y a parcialmente marcado (indeterminado) cuando lo están solo algunos. Pulsar la etiqueta del nodo solo lo expande; el marcado se hace con la casilla de verificación (igual que en la versión Vue3). El disparador muestra las etiquetas de todas las claves marcadas unidas con「、」.

## Deshabilitación

`disabled: true` en los datos del nodo deshabilita ese nodo (al pulsarlo no se expande ni se selecciona, y su casilla no se puede pulsar); la prop `disabled` deshabilita todo el selector.

```vue
<template>
  <lh-tree-select v-model="value" :data="disabledData" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<string | undefined>(undefined)
const disabledData = [
  {
    key: 'zhinan',
    label: '指南',
    children: [
      {
        key: 'sheji',
        label: '设计指南',
        disabled: true,
        children: [{ key: 'yuansze', label: '颜色' }],
      },
      { key: 'shejiguize', label: '设计规则' },
    ],
  },
]
</script>
```

## API de TreeSelect

### Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| modelValue | Valor vinculado (`string` en selección única / `string[]` en selección múltiple, v-model controlado) | `string \| string[] \| undefined` | — |
| data | Datos del árbol | `LhTreeNode[]` | `() => []` |
| multiple | Selección múltiple (se muestran casillas, el valor es el arreglo de claves marcadas, cascada padre-hijo) | `boolean` | `false` |
| disabled | Deshabilita todo el selector | `boolean` | `false` |
| placeholder | Marcador de posición (si no se pasa, se toma del paquete de idioma `select.placeholder`) | `string` | — |
| customClass | Clase personalizada (se reenvía al nodo raíz) | `string` | — |
| themeVars | Variables de tema a nivel de componente | `Record<string, string>` | — |
| sx | Propiedades de diseño rápido sx (se aplican a la raíz del disparador, el panel flotante no se ve afectado) | `LhSxProps` | — |

### Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| update:modelValue | Se emite cuando cambia el valor vinculado | `(value: string \| string[] \| undefined)` |
| change | Se emite cuando cambia la selección | `(value: string \| string[] \| undefined)` |

### Estructura de datos

Definición del tipo `LhTreeNode` (fuente de verdad en `@lh-ui/share/core/tree`):

```ts
interface LhTreeNode {
  /** Clave única */
  key: string
  /** Texto mostrado */
  label: string
  /** Nodos hijos */
  children?: LhTreeNode[]
  /** Deshabilitado */
  disabled?: boolean
  /** Si es un nodo hoja (se deduce de children si se omite) */
  isLeaf?: boolean
}
```

### Accesibilidad

- El disparador lleva `aria-haspopup="tree"` / `aria-expanded` / `aria-label` (del paquete de idioma `treeSelect.triggerLabel`)
- El panel es `role="listbox"`, el árbol integrado es `role="tree"`, los nodos son `role="treeitem"` con `aria-level` / `aria-expanded` / `aria-selected` / `aria-disabled`; en selección múltiple el panel lleva `aria-multiselectable` y las casillas son `role="checkbox"` con `aria-checked` (`mixed` para el estado intermedio)
- La indentación de niveles, la rotación de la flecha de expansión y el aspecto tri-estado de la casilla provienen de la fuente de estilos de share (`@lh-ui/share/styles/tree`), sin estilos duplicados en este lado

::: tip Diferencias de plataforma (frente a la versión Vue3)
- **Composición de pegamento en lugar de un core dedicado**: share core no tiene un módulo tree-select; este lado sigue la forma de implementación de plus y compone «un disparador select + un panel lh-tree» — el panel integra `lh-tree` y toda la lógica del árbol (expansión / selección / cascada de marcado) se consume desde las funciones puras de `core/tree` (`flattenTree` / `toggleCheckKeys` / `getNodeCheckState`, etc.), sin copiar nada. La API y los eventos están alineados con plus, sin capacidades añadidas por este lado.
- **Panel flotante**: plus monta el panel bajo `Teleport to="body"`; en uni-app lo porta `lh-root-portal` (con respaldo fixed dentro de la página en bases antiguas) y se posiciona con una medición asincrónica de dos pasos (render oculto para medir → `computePosition` para posicionar → mostrar, para evitar parpadeos). El cálculo de la posición es asincrónico: no asuma un resultado sincrónico.
- **Desplazamiento del panel del árbol**: el scss de share `.lh-tree-select__panel` usa `overflow: auto`, pero el `view` del MP no tiene un desbordamiento fiable, por lo que el panel envuelve el árbol en un `scroll-view` (`scroll-y`) para el desplazamiento vertical, con la altura máxima alineada con el valor de share de 320px.
- **Sin navegación por teclado**: el cierre con Escape y la escucha de teclado a nivel de documento de plus dependen de eventos de teclado que no existen en los Mini Programs; este lado cierra el panel al pulsar una máscara transparente dentro de la página (como select / cascader), sin degradación por compilación condicional.
- **Prop `teleported` no portada**: plus la usa para controlar si el panel se monta en body; en uni-app la capa emergente siempre pasa por `lh-root-portal`, por lo que esa semántica no existe.
- **Cierre al pulsar fuera**: plus escucha los clics del document con `useLhClickOutside`; uni-app usa una máscara transparente dentro de la página (pulsar la máscara cierra).
- **Corrección del estado controlado de las casillas**: plus no pasa `checked-keys` al árbol integrado, de modo que un valor múltiple preestablecido no se refleja en las casillas; este lado también pasa `v-model` como `checked-keys`, de modo que las casillas y el eco del disparador están impulsados por `v-model` (la API no cambia).
- **Sin cierre automático cuando el disparador sale de la ventana**: uni-app no tiene un canal unificado de escucha de desplazamiento / cambio de tamaño, por lo que no se porta.
:::
