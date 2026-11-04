# Tree (vista de árbol)

Visualización e interacción con datos jerárquicos. Toda la lógica pura —expandir / contraer,
cascada de casillas de verificación, fusión de carga diferida— se consume directamente de las
funciones puras del core de `@lh-ui/share` (`flattenTree` / `toggleCheckKeys` /
`mergeLoadedChildren`, entre otras); la capa del componente solo se ocupa del renderizado,
los eventos y la navegación por teclado.

## Uso básico

```vue
<template>
  <lh-tree :data="treeData" :default-expanded-keys="['a']" />
</template>

<script setup lang="ts">
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const treeData: LhTreeNode[] = [
  {
    key: 'a',
    label: 'Frontend',
    children: [
      { key: 'a-1', label: 'Vue' },
      { key: 'a-2', label: 'React' },
    ],
  },
  { key: 'b', label: 'Backend', children: [{ key: 'b-1', label: 'Node' }] },
  { key: 'c', label: 'DevOps', disabled: true },
]
</script>
```

`data` es un `LhTreeNode[]`: `key` es único, `label` el texto a mostrar, `children` los subnodos,
`disabled` deshabilita el nodo e `isLeaf` indica si es hoja (se infiere de `children` si se omite).
La sangría de nivel se aplica con el estilo en línea `level * 18 + 8` px. Al hacer clic en la fila
completa se selecciona el nodo (`update:selectedKeys` / `select`); con `expandOnClickNode`
activado (por defecto), hacer clic en un nodo no hoja también lo expande / contrae； el clic en la
flecha solo alterna la expansión.

## Casillas de verificación (cascada)

`show-checkbox` renderiza las casillas de verificación. Marcar un padre se propaga en cascada a
todos sus descendientes; cuando todos los hijos están marcados el padre se marca automáticamente,
y una selección parcial muestra el estado indeterminado.

```vue
<template>
  <lh-tree :data="treeData" show-checkbox :default-expanded-keys="['a', 'b']" />
</template>
```

El conjunto de casillas se gestiona con `default-checked-keys` (no controlado) o
`v-model:checked-keys` (controlado), y los cambios se emiten mediante `update:checkedKeys` /
`check`. Con `checkStrictly`, marcar afecta únicamente al propio nodo: sin cascada a
descendientes, sin retroceso a ancestros y sin estado indeterminado.

## Carga diferida

Con `lazy` activado, al expandir un nodo no cargado se invoca la devolución de llamada `load`
(`resolve` entrega los subnodos y los expande; `reject` o un error lanzado lo cancela)； mientras
carga, la flecha muestra un estado de giro.

```vue
<template>
  <lh-tree :data="lazyData" lazy :load="loadNodes" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const lazyData = ref<LhTreeNode[]>([{ key: 'lazy', label: 'Toca para cargar', isLeaf: false }])

function loadNodes(
  node: LhTreeNode,
  resolve: (children: LhTreeNode[]) => void,
  reject: (reason?: unknown) => void,
) {
  // simula una petición asíncrona
  setTimeout(() => {
    if (node.key === 'lazy') {
      resolve([
        { key: 'lazy-1', label: 'Subnodo uno', isLeaf: true },
        { key: 'lazy-2', label: 'Subnodo dos', isLeaf: true },
      ])
    } else {
      reject(new Error('nothing to load'))
    }
  }, 600)
}
</script>
```

Un nodo cargable debe declarar `isLeaf: false` explícitamente (de lo contrario, un nodo sin
`children` se infiere como hoja y no muestra flecha de expansión)； si los subnodos cargados son
a su vez ramas pendientes de carga, declara también `isLeaf: false` en ellos, y `isLeaf: true`
para las hojas reales. Los resultados se fusionan de forma inmutable sobre `props.data` mediante
`mergeLoadedChildren` de share (los datos del usuario nunca se mutan)； cada entrega de subnodos
viene acompañada del evento `nodeLoad`.

## Selección y claves controladas

`multiple` habilita la selección múltiple (al hacer clic en un nodo se alterna la selección en
lugar de reemplazarla)； `default-selected-keys` / `v-model:selected-keys` controlan la selección；
`default-expanded-keys` / `v-model:expanded-keys` controlan la expansión； `disabled` deshabilita
el árbol completo (los clics y las teclas no responden).

```vue
<template>
  <lh-tree
    v-model:selected-keys="selKeys"
    v-model:checked-keys="chkKeys"
    :data="ctrlData"
    multiple
    :default-expanded-keys="['x']"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const selKeys = ref(['x'])
const chkKeys = ref(['x-1'])
const ctrlData: LhTreeNode[] = [
  {
    key: 'x',
    label: 'Diseño',
    children: [{ key: 'x-1', label: 'Color' }, { key: 'x-2', label: 'Tipografía' }],
  },
  { key: 'y', label: 'Ingeniería' },
]
</script>
```

## Virtualización para grandes volúmenes de datos (exclusivo de uni-app)

Para cientos o miles de nodos, activa `virtual`: la lista de nodos pasa a un `scroll-view` y se
renderiza por ventanas con una altura de fila fija de 34 px (el valor por defecto de
`--lh-tree-node-height`), dibujando solo la zona visible más un margen superior e inferior；
`virtualHeight` define la altura del scroll-view (los números son px, las cadenas se usan
literalmente, por defecto 300 px).

```vue
<template>
  <lh-tree :data="bigData" virtual :virtual-height="320" />
</template>
```

El contenido del nodo debe mantenerse en una sola línea (el scss de share `.lh-tree-node__label`
ya fuerza `nowrap` + puntos suspensivos). Sin `virtual`, los nodos se renderizan directamente
bajo el contenedor raíz, la misma estructura que la versión Vue3.

## Slots

El slot con alcance `node` recibe `{ node, level, expanded, selected }` para personalizar el
contenido del nodo； el slot `empty` personaliza el estado vacío (por defecto toma la clave de
idioma `tree.empty`, español «Sin datos»).

```vue
<template>
  <lh-tree :data="treeData">
    <template #node="{ node, level }">
      <text>{{ level > 0 ? '· ' : '' }}{{ node.label }}</text>
    </template>
  </lh-tree>
</template>
```

## API

### Props

| Propiedad | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| data | Datos del árbol | `LhTreeNode[]` | — |
| showCheckbox | Mostrar casillas de verificación | `boolean` | `false` |
| multiple | Selección múltiple (alternar en lugar de reemplazar) | `boolean` | `false` |
| expandOnClickNode | Expandir / contraer nodos no hoja al hacer clic en la fila | `boolean` | `true` |
| defaultExpandedKeys | Claves expandidas por defecto (no controlado) | `string[]` | `[]` |
| expandedKeys | Claves expandidas controladas | `string[]` | — |
| defaultSelectedKeys | Claves seleccionadas por defecto (no controlado) | `string[]` | `[]` |
| selectedKeys | Claves seleccionadas controladas | `string[]` | — |
| defaultCheckedKeys | Claves marcadas por defecto (no controlado) | `string[]` | `[]` |
| checkedKeys | Claves marcadas controladas | `string[]` | — |
| checkStrictly | Padre e hijo no se influyen (solo el propio nodo, sin cascada ni indeterminado) | `boolean` | `false` |
| lazy | Modo diferido (invoca load al expandir un nodo no cargado) | `boolean` | `false` |
| load | Devolución diferida (resolve entrega los subnodos y expande, reject cancela) | `(node: LhTreeNode, resolve: (children: LhTreeNode[]) => void, reject: (reason?: unknown) => void) => void` | — |
| disabled | Deshabilitar el árbol completo | `boolean` | `false` |
| virtual | Virtualización para grandes volúmenes (exclusivo de uni-app) | `boolean` | `false` |
| virtualHeight | Altura del scroll-view virtual (número en px / cadena literal) | `number \| string` | `300` |
| sx | Props de rápida disposición sx | `LhSxProps` | — |

### Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| update:expandedKeys | Lista de claves expandidas cambió (para v-model:expanded-keys) | `(keys: string[])` |
| update:selectedKeys | Lista de claves seleccionadas cambió (para v-model:selected-keys) | `(keys: string[])` |
| update:checkedKeys | Lista de claves marcadas cambió (para v-model:checked-keys) | `(keys: string[])` |
| select | Selecciona / alterna un nodo al hacer clic | `(key: string, node: LhTreeNode)` |
| check | Tras cambiar el conjunto de casillas | `(keys: string[], node: LhTreeNode)` |
| expand | Tras expandir / contraer un nodo | `(key: string, expanded: boolean)` |
| nodeLoad | Tras llegar los subnodos de carga diferida | `(node: LhTreeNode, children: LhTreeNode[])` |

### Slots

| Slot | Descripción |
| --- | --- |
| node | Contenido del nodo (con alcance `{ node, level, expanded, selected }`) |
| empty | Estado vacío (por defecto la clave de idioma `tree.empty`) |

### LhTreeNode

| Campo | Descripción | Tipo |
| --- | --- | --- |
| key | Clave única | `string` |
| label | Texto a mostrar | `string` |
| children | Subnodos | `LhTreeNode[]` |
| disabled | Deshabilitado | `boolean` |
| isLeaf | Si es hoja (se infiere de children si se omite) | `boolean` |

### Accesibilidad

- `role="tree"` + `role="treeitem"`, con `aria-level` / `aria-expanded` / `aria-selected` / `aria-disabled` expuestos por completo
- Las casillas llevan `role="checkbox"` + `aria-checked` (`mixed` para indeterminado)

::: tip Diferencias de plataforma (diferencias con la versión Vue3)
- **La virtualización es exclusiva de este paquete**: para grandes volúmenes (cientos o miles de
  nodos) se recomienda `virtual`; la lista de nodos corre sobre un `scroll-view` y se renderiza por
  ventanas con altura de fila fija de 34 px (zona visible + márgenes), con `virtualHeight` para la
  altura de la ventanilla. El contenido del nodo debe ser de una sola línea； sin `virtual`, los
  nodos se renderizan directamente bajo el contenedor raíz.
- **La navegación por teclado es solo H5**: las teclas del patrón APG tree —↑/↓ entre elementos
  (saltando los deshabilitados, en bucle), → para expandir o bajar al primer hijo, ← para contraer
  o subir al padre, Home/End a los extremos, Enter/Space para activar— solo funcionan en H5； el
  Mini Programa no tiene eventos de teclado y todo el bloque se elimina por compilación condicional
  (sin código muerto en el paquete MP); el roving tabindex likewise solo se produce en H5.
- **Sangría RTL**: la sangría de nivel usa el estilo físico `padding-left` en ambos destinos
  (en línea con la decisión existente del repositorio de «RTL fijo en MP»)；
  si necesitas un espejo RTL en H5, sobrescríbelo en el lado del consumidor.
- **La flecha se dibuja por sí misma**: la flecha de expansión es el glifo `▸` sobre un `view`
  (la rotación y el giro de carga son puras transformaciones CSS)， sin depender de una fuente de iconos.
:::
