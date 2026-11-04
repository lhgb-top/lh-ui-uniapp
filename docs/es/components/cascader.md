# Cascader Selector en cascada

Selector en cascada para datos con varios niveles, por ejemplo la selección de provincia / ciudad / distrito. Al pulsar el disparador se abre un panel de varias columnas; se desciende nivel a nivel y la selección se completa al elegir un nodo hoja (o cualquier nivel con `check-strictly`).

## Uso básico

```vue
<template>
  <lh-cascader v-model="value" :options="options" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const options = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      {
        value: 'sheji',
        label: '设计指南',
        children: [
          { value: 'yuansze', label: '颜色' },
          { value: 'fuziyuanze', label: '字体' },
        ],
      },
      { value: 'shejiguize', label: '设计规则' },
    ],
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      { value: 'jiben', label: '基础' },
      { value: 'fankui', label: '反馈' },
    ],
  },
]
</script>
```

Al pulsar un elemento con hijos se expande primero la siguiente columna; luego, al pulsar un nodo hoja se selecciona (en selección única el panel se cierra solo).

## Selección múltiple

```vue
<template>
  <lh-cascader v-model="value" :options="options" multiple />
  <!-- Etiquetas colapsadas: solo el primer elemento seleccionado + un contador -->
  <lh-cascader v-model="value2" :options="options" multiple collapse-tags />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const value2 = ref<(string | number)[]>(['yuansze', 'fuziyuanze'])
const options = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      { value: 'sheji', label: '设计指南' },
      { value: 'shejiguize', label: '设计规则' },
    ],
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      { value: 'jiben', label: '基础组件' },
      { value: 'fankui', label: '反馈组件' },
    ],
  },
]
</script>
```

En modo múltiple `v-model` se ata al arreglo de los **valores del último nivel** de cada ruta seleccionada; los elementos seleccionados se muestran como etiquetas dentro del disparador.

## Opciones deshabilitadas

`disabled: true` en los datos de un nodo deshabilita ese nodo (al pulsarlo no se expande ni se selecciona); la prop `disabled` deshabilita todo el selector; con `readonly` el valor se muestra sin abrir el panel.

```vue
<template>
  <lh-cascader v-model="value" :options="disabledOptions" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const disabledOptions = [
  {
    value: 'zhinan',
    label: '指南',
    disabled: true,
    children: [{ value: 'sheji', label: '设计指南' }],
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      { value: 'jiben', label: '基础组件' },
      { value: 'fankui', label: '反馈组件', disabled: true },
    ],
  },
]
</script>
```

## Visualización de la ruta y valor de retorno

```vue
<template>
  <!-- Ruta completa (predeterminado) -->
  <lh-cascader v-model="value" :options="options" placeholder="Ruta completa (predeterminado)" />
  <!-- Solo el último nivel -->
  <lh-cascader v-model="value" :options="options" :show-all-levels="false" placeholder="Solo el último nivel" />
  <!-- Separador personalizado -->
  <lh-cascader v-model="value" :options="options" separator=" > " placeholder="Separador >" />
  <!-- v-model se ata solo al valor del último nivel (el eco sigue siendo la ruta completa) -->
  <lh-cascader v-model="leafValue" :options="options" :emit-path="false" placeholder="Solo el valor del último nivel" />
  <!-- Cualquier nivel seleccionable (pulsar un nodo no hoja lo selecciona directamente) -->
  <lh-cascader v-model="anyValue" :options="options" check-strictly placeholder="Cualquier nivel seleccionable" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>(['zhinan', 'sheji', 'yuansze'])
const leafValue = ref<(string | number)[]>(['yuansze'])
const anyValue = ref<(string | number)[]>(['zhinan', 'sheji'])
const options = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      { value: 'sheji', label: '设计指南', children: [{ value: 'yuansze', label: '颜色' }] },
    ],
  },
]
</script>
```

> El marcador de posición por defecto viene de la clave de locale `cascader.placeholder` («请选择» en chino) y puede sobrescribirse con `placeholder`.

## Filtrable

`filterable` activa la búsqueda: la caja de filtrado vive dentro del panel (el Mini Programa no tiene semántica de foco de entrada dentro del disparador); al teclear una palabra clave los resultados se muestran por ruta completa y al pulsar un resultado este se selecciona directamente.

```vue
<template>
  <lh-cascader v-model="value" :options="options" filterable placeholder="Teclea una palabra clave" />
</template>
```

Cuando no hay coincidencias se muestra la clave de locale `cascader.noMatch` («无匹配数据» en chino), personalizable con el slot `no-match`.

## Alias de campos

`item-config` declara los alias de los campos del nodo (`value` / `label` / `children` / `disabled` / `leaf`), de modo que los datos asincrónicos o las estructuras del backend no exigen conversión manual:

```vue
<template>
  <lh-cascader
    v-model="value"
    :options="aliasedOptions"
    :item-config="{ value: 'id', label: 'name', children: 'sub' }"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>(['zhejiang', 'hangzhou', 'xihu'])
const aliasedOptions = [
  {
    id: 'zhejiang',
    name: '浙江省',
    sub: [{ id: 'hangzhou', name: '杭州市', sub: [{ id: 'xihu', name: '西湖区' }] }],
  },
]
</script>
```

## Cascader API

### Props

| Propiedad | Descripción | Tipo | Valor por defecto |
| --- | --- | --- | --- |
| modelValue | Valor atado (con `emitPath` a `false`, solo el último nivel) | `(string \| number)[]` | `() => []` |
| options | Lista de opciones (estructura de árbol) | `LhCascaderNode[]` | `() => []` |
| size | Tamaño | `LhCascaderSize` | `'medium'` |
| disabled | Deshabilita todo el selector | `boolean` | `false` |
| clearable | Si se puede limpiar | `boolean` | `true` |
| placeholder | Marcador de posición (si no se pasa, la clave de locale `cascader.placeholder`) | `string` | — |
| readonly | Solo lectura (no abre el panel) | `boolean` | `false` |
| showAllLevels | Si el disparador muestra la ruta completa | `boolean` | `true` |
| checkStrictly | Cualquier nivel del nodo es seleccionable | `boolean` | `false` |
| emitPath | Si el valor de retorno incluye la ruta completa | `boolean` | `true` |
| multiple | Selección múltiple | `boolean` | `false` |
| cascading | Asociación en cascada (despliega los hijos al pasar el cursor, solo efectivo en H5) | `boolean` | `true` |
| separator | Separador de ruta | `string` | `'/'` |
| collapseTags | Si se colapsan las etiquetas en modo múltiple | `boolean` | `false` |
| filterable | Si se puede buscar | `boolean` | `false` |
| itemConfig | Alias de los campos del nodo | `LhCascaderItemConfig` | `() => ({})` |
| customClass | Clase personalizada (se reenvía al nodo raíz) | `string` | — |
| themeVars | Variables de tema a nivel de componente | `Record<string, string>` | — |
| sx | Props rápidas de layout (actúan sobre la raíz del disparador, el panel flotante no se ve afectado) | `LhSxProps` | — |

### Events

| Evento | Descripción | Parámetros |
| --- | --- | --- |
| update:modelValue | Al cambiar el valor atado | `(value: (string \| number)[])` |
| change | Al cambiar el valor seleccionado | `(value: (string \| number)[], path: LhCascaderNode[] \| null)` |

### Slots

| Slot | Descripción |
| --- | --- |
| no-match | Contenido personalizado cuando el filtro no encuentra coincidencias |

### Estructura de datos

Definición del tipo `LhCascaderNode`:

```ts
interface LhCascaderNode {
  value: string | number
  label: string
  disabled?: boolean
  leaf?: boolean
  children?: LhCascaderNode[]
}
```

### Accesibilidad

- El disparador lleva `aria-haspopup="listbox"` / `aria-expanded` / `aria-controls` (el paquete de atributos lo produce la función pura `getCascaderTriggerAria` de share, y se vincula key a key de forma explícita)
- El panel flotante es `role="dialog"` y cada columna es `role="listbox"` (el `aria-label` viene de la clave de locale `cascader.columnLabel`, «第 N 级»); los elementos de cada columna son `role="option"` y llevan `aria-selected` / `aria-disabled` / `aria-expanded`
- El motor de posicionamiento es una implementación propia de funciones puras (flip / shift contra el desbordamiento), sin dependencias de terceros en tiempo de ejecución

::: tip Diferencias de plataforma (frente a la versión Vue3)
- **El panel se convierte en capa flotante**: en plus el panel cuelga de un `Teleport to="body"` con un fundido de `Transition`; en el lado uni-app lo porta `lh-root-portal` (con un respaldo de `fixed` dentro de la página en versiones antiguas de la base), y el posicionamiento pasa por una medición asincrónica en dos fotogramas (se rinde oculto para medir → `computePosition` posiciona → se muestra, para evitar parpadeos). El cálculo del posicionamiento es asincrónico, no se puede asumir un resultado síncrono. No se vincula ninguna transición de entrada y salida (`Transition` no es fiable en MP, al igual que tooltip / dropdown / popover).
- **Desplazamiento de columnas**: cada columna es un `scroll-view` (`scroll-y`) con desplazamiento vertical independiente — el `view` del MP no ofrece un desplazamiento por desbordamiento fiable, de modo que el contenedor de columna con `overflow-y: auto` del scss de share queda cubierto en H5 por la implementación equivalente de `scroll-view`.
- **Navegación por teclado solo en H5**: Enter/Space sobre el disparador abre y cierra, y las flechas envían el foco al panel; dentro del panel ↑↓ se mueven dentro de la columna (omitiendo los deshabilitados), ←→ cambian de columna, Enter/Space equivalen a un clic; Escape cierra mediante un escucha a nivel de documento (con varias capas flotantes solo se cierra la superior). Todo el cuerpo del manejador queda recortado por la compilación condicional; el paquete de MP no contiene código muerto.
- **La expansión al pasar el cursor solo en H5**: la expansión de los hijos al pasar el cursor propia de `cascading` depende de la semántica hover, que no existe en el Mini Programa; allí los hijos solo pueden expandirse con un clic (`cascading` equivale en MP a desactivar la expansión por cursor).
- **Ubicación de la caja de filtrado**: en plus la caja de filtrado de `filterable` es el propio disparador; el lado uni-app la coloca dentro del panel flotante (igual que select), porque el MP no tiene semántica de foco de entrada dentro del disparador.
- **El cierre al pulsar fuera**: plus escucha clics en el document con `useLhClickOutside`; el lado uni-app lo asume una máscara transparente dentro de la página (pulsar la máscara cierra).
- **El disparador no se repliega al salir del viewport**: uni-app no ofrece un canal unificado de escucha de desplazamiento y cambios de tamaño, así que no se ha portado.
- **Anillo de foco y roving tabindex solo en H5**: el MP no tiene semántica de foco por teclado, de modo que la vinculación de `tabindex` no deja rastro en el lado MP.
:::
