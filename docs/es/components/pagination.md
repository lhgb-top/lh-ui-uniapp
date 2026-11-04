# Pagination

Navegación de páginas: página anterior / números de página / elipsis / página siguiente / total /
cambiador de tamaño / salto de página. El algoritmo de contracción de la ventana de páginas
(primera y última página siempre visibles, páginas adyacentes alrededor de la actual, elipsis solo
cuando hay un hueco real) se implementa como función pura en el core de `@lh-ui/share`.

## Uso básico

`total` es el número de elementos (obligatorio); el tamaño de página por defecto es 10.

```vue
<template>
  <lh-pagination :total="120" />
</template>
```

## Total y cambiador de tamaño

`show-total` muestra el total; `show-size-changer` muestra el cambiador de elementos por página
(en uni lo soporta el picker integrado).

```vue
<template>
  <lh-pagination :total="480" show-total show-size-changer />
</template>
```

## Salto de página

`show-jumper` muestra el campo de salto; tras escribir el número de página, se confirma con Enter
(confirm) o al perder el foco, y los valores fuera de rango se acotan automáticamente.

```vue
<template>
  <lh-pagination :total="480" show-total show-jumper />
</template>
```

## Modo simple

`simple` pliega la zona de números de página y solo muestra "página actual / páginas totales".

```vue
<template>
  <lh-pagination :total="480" simple show-jumper />
</template>
```

## Uso controlado

La página actual se controla con `v-model:current`.

```vue
<template>
  <lh-pagination v-model:current="page" :total="95" />
  <text>Página actual: {{ page }}</text>
</template>

<script setup>
import { ref } from 'vue'
const page = ref(2)
</script>
```

## Tamaño de página y deshabilitado

`v-model:page-size` controla el tamaño de página y `page-sizes` personaliza las opciones; si la
página actual se queda fuera de rango tras un cambio de tamaño se acota automáticamente;
`disabled` deshabilita toda la paginación.

```vue
<template>
  <lh-pagination
    v-model:page-size="pageSize"
    :total="480"
    show-size-changer
    :page-sizes="[10, 20, 50, 100]"
  />
  <text>Elementos por página: {{ pageSize }}</text>
  <lh-pagination :total="480" disabled />
</template>

<script setup>
import { ref } from 'vue'
const pageSize = ref(20)
</script>
```

## Props

| Propiedad | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| total | Número total de elementos (obligatorio) | `number` | — |
| pageSize | Elementos por página (controlado con el evento `update:pageSize`) | `number` | `10` |
| current | Página actual (`v-model:current`) | `number` | — |
| pageSizes | Opciones de elementos por página | `number[]` | `[10, 20, 30, 40]` |
| showTotal | Mostrar el total de elementos | `boolean` | `false` |
| showSizeChanger | Mostrar el cambiador de elementos por página | `boolean` | `false` |
| showJumper | Mostrar el campo de salto de página | `boolean` | `false` |
| simple | Modo compacto | `boolean` | `false` |
| disabled | Si está deshabilitado | `boolean` | `false` |
| sx | Propiedades rápidas de layout | `LhSxProps` | — |

## Events

| Evento | Descripción | Parámetros del callback |
| --- | --- | --- |
| update:current | Se emite cuando cambia la página actual, junto con `v-model:current` | `(page: number)` |
| update:pageSize | Se emite cuando cambia el tamaño de página, junto con `v-model:page-size` | `(size: number)` |
| change | Se emite cuando cambia la página actual (números de página, anterior / siguiente y salto lo disparan) | `(page: number)` |
| size-change | Se emite cuando cambia el tamaño de página | `(size: number)` |

## Accesibilidad

- Nodo raíz con `role="navigation"` + `aria-label="pagination"`
- El botón de la página actual recibe automáticamente `aria-current="page"`; cada botón de página y
  los botones anterior / siguiente llevan su propio `aria-label` (de las claves del paquete de
  idioma `pagination.page` / `prev` / `next`); los símbolos «‹» «›» se ocultan con `aria-hidden`
- Los botones de página y de navegación son `role="button"` y emiten `aria-disabled` cuando están
  deshabilitados
- La elipsis es un elemento puramente decorativo con `aria-hidden` que no interfiere en la lectura

## Diferencias de plataforma

- **Interacción táctil dibujada con view, disponible en todas las plataformas**: los `<nav>` /
  `<button>` / `<ul>` / `<span>` de la versión Vue 3 se sustituyen por `<view>` / `<text>`
  (WXSS prohíbe los selectores de etiqueta, los estilos van por clase); los números de página y la
  navegación se disparan con `@click` y se comportan igual en H5 y en el Mini Programa de WeChat,
  sin dependencia de ninguna API de plataforma.
- **La lógica de elipsis por desbordamiento de páginas vive en core**: el algoritmo de contracción
  de la ventana (primera / última página siempre visibles, una página hermana a cada lado de la
  actual, anclaje a los bordes cuando faltan páginas, elipsis solo con hueco real) es la función
  pura `getPaginationRange` del core de `@lh-ui/share`; el acotado `clampPage` y el conteo
  `getPageCount` también salen de core — este repositorio solo añade la capa reactiva.
- **El cambiador de tamaño lo soporta el picker integrado**: uni no tiene `<select>`, así que
  `show-size-changer` se soporta con el `<picker mode="selector">` integrado de uni, con
  `page-sizes` como opciones; el valor del evento change llega en `event.detail.value` (el índice
  de la opción). En H5 se abre el panel selector de uni; en Mini Programa, el selector nativo de rueda.
- **El salto de página confirma en otro momento**: el input de uni no tiene evento change nativo, así
  que la confirmación ocurre en Enter (confirm — lo disparan tanto la tecla Enter de H5 como el
  «Listo» del teclado del Mini Programa) o al perder el foco (blur), y el valor del evento de
  entrada se lee de `event.detail.value` (mismo precedente que lh-input-number); los atributos
  nativos `min` / `max` no se reenvían — el número de página siempre lo acota el `clampPage` de
  core. La versión Vue 3 vuelve a la página 1 si se vacía el campo y se pierde el foco; esta
  biblioteca lo endurece a "no saltar" (las cadenas vacías y los números inválidos no emiten eventos).
- **Los estados deshabilitados usan una clase de respaldo**: los estilos deshabilitados del origen de
  estilos de share viven en la pseudo-clase `&:disabled` (que solo coincide con elementos button) y
  view no tiene esa pseudo-clase, así que el componente añade una regla en línea
  `lh-pagination__btn--disabled` con el mismo token (`--lh-disabled-text-color`), siguiendo el
  precedente de respaldo en línea de lh-segmented / lh-input-number (no forma parte del producto
  purificado).
- **Los atributos de accesibilidad se vinculan uno a uno**: el contrato de `aria-current` /
  `aria-label` de los botones de página lo decide `getPaginationItemAria` de share; como el
  compilador de plantillas del Mini Programa no soporta `v-bind` con objeto, la capa pegamento
  aplana la bolsa de atributos en vinculaciones explícitas por elemento.
- **Conclusión de la portabilidad**: Pagination es un componente puramente conmutativo sin medidas,
  sin superposiciones y sin dependencia de document; el rango de páginas, el acotado y los atributos
  de accesibilidad los producen las funciones puras del core de `@lh-ui/share`, y este repositorio
  solo añade la capa reactiva. La API es idéntica a la versión Vue 3 (`total` / `pageSize` /
  `current` / `pageSizes` / `showTotal` / `showSizeChanger` / `showJumper` / `simple` / `disabled` /
  `sx`).
