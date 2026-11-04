# Descriptions

Muestra una lista de atributos de un objeto, con número de columnas, expansión de columnas y modo con bordes. Las entradas se pasan por `items` (`LhDescriptionsItem` es el tipo de entrada proporcionado por el core de `@lh-ui/share`) y su contenido se puede sobrescribir con slots con ámbito.

## Uso básico

```vue
<template>
  <lh-descriptions
    title="Archivo de la colección"
    :column="2"
    :items="[
      { label: 'Nombre', value: 'Jarrón azul y blanco' },
      { label: 'Periodo', value: 'Yongle, Ming' },
      { label: 'Categoría', value: 'Porcelana' },
      { label: 'Grado', value: 'Grado I' },
    ]"
  />
</template>
```

## Columnas y expansión

`column` controla el número de entradas por fila, y la propiedad `span` de cada entrada controla cuántas columnas ocupa. Un `span` mayor que el ancho restante de la fila se ajusta automáticamente, y la última fila incompleta se rellena (las celdas de relleno llevan `aria-hidden`, son puramente decorativas).

```vue
<template>
  <lh-descriptions
    :column="3"
    :items="[
      { label: 'Nombre', value: 'Mil li de ríos', span: 2 },
      { label: 'Periodo', value: 'Song del Norte' },
      { label: 'Artista', value: 'Wang Ximeng' },
      { label: 'Técnica', value: 'Tinta y color sobre seda' },
      { label: 'Colección', value: 'Museo del Palacio, Pekín' },
    ]"
  />
</template>
```

## Modo con bordes

`border` activa los bordes de la tabla (en el modo con bordes el espaciado entre filas se anula y los bordes de las celdas forman la tabla).

```vue
<template>
  <lh-descriptions
    :column="2"
    border
    :items="[
      { label: 'Nombre', value: 'Prefacio del Pabellón de las Orquídeas' },
      { label: 'Autor', value: 'Wang Xizhi' },
      { label: 'Periodo', value: 'Jin Oriental' },
      { label: 'Estilo', value: 'Escritura cursiva' },
    ]"
  />
</template>
```

## Título y contenido personalizados

El slot `title` sobrescribe la cabecera; el slot con ámbito `item-<index>` sobrescribe el contenido de la entrada correspondiente (`index` es el índice de la celda dentro de su fila; el ámbito proporciona `{ item }`).

```vue
<template>
  <lh-descriptions :column="2" :items="items">
    <template #title>
      <text>Archivo de la colección (slot de título)</text>
    </template>
    <template #item-1="{ item }">
      <lh-tag type="success">{{ item.value }}</lh-tag>
    </template>
  </lh-descriptions>
</template>

<script setup lang="ts">
const items = [
  { label: 'Estado', value: 'En curso' },
  { label: 'Fase', value: 'Tasado' },
]
</script>
```

## Props

| Prop | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| title | Título de la lista | `string` | — |
| column | Número de entradas por fila | `number` | `3` |
| border | Mostrar bordes | `boolean` | `false` |
| items | Lista de entradas; tripletas label / value / span | `[LhDescriptionsItem](#lhdescriptionsitem-tipo)`[] | `() => []` |
| customClass | Nombre de clase personalizado | `string` | — |
| sx | Propiedades rápidas de layout | `LhSxProps` | — |

## LhDescriptionsItem (tipo)

Proviene del core de `@lh-ui/share` (`LhDescriptionsItem`); no se redefinir en este repositorio.

| Prop | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| label | Etiqueta de la entrada | `string` | — |
| value | Contenido de la entrada (también admite slot con ámbito) | `string \| number` | — |
| span | Columnas a ocupar; se ajusta si se excede | `number` | `1` |

## Slots

| Slot | Descripción | Ámbito |
| --- | --- | --- |
| title | Título personalizado | — |
| item-\<index\> | Sobrescribe el contenido de la entrada (index es el índice de la celda dentro de su fila) | `{ item }` |

## Diferencias entre plataformas

- Componente puramente visual, sin uso de ninguna API de la plataforma: se comporta exactamente igual en H5 y en el Mini Programa de WeChat. El comportamiento de `items` / `column` / `border` / `span` coincide con la versión Vue 3.
- La versión Vue 3 usa etiquetas semánticas `<dl>/<dt>/<dd>`, que aquí se reemplazan por `<view>` (WXSS prohíbe selectores de etiqueta; los estilos se aplican por clases). El layout de las filas se basa en `flex` en línea y `flex-basis` en porcentaje, con las mismas fórmulas de ancho que la versión Vue 3.
- Las líneas de la tabla del modo con bordes provienen del código fuente de estilos de `@lh-ui/share` y siguen sendo utilizables en el Mini Programa tras la purificación de `build-styles` (la salida solo contiene selectores de clase y propiedades, conforme a la lista blanca de WXSS).
- La agregación de filas (normalización de span, ajuste, ajuste de línea, relleno) la produce íntegramente la función pura `buildDescriptionRows` de `@lh-ui/share`; este repositorio solo añade el pegamento reactivo y nunca copia la implementación del core.
