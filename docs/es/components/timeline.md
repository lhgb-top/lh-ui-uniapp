# Timeline

Un flujo de eventos vertical. El orden temporal es el orden del documento. Admite marcas de tiempo, tipos semánticos, puntos huecos y un diseño alternado.

> Componente puramente visual: sin eventos ni estado controlado; H5 y el Mini Programa de WeChat se comportan exactamente igual (véase «Diferencias de plataforma» al final).

## Uso básico

`timestamp` define el texto de la marca de tiempo; `type` da al punto del nodo un color semántico (`'primary'` / `'success'` / `'warning'` / `'danger'`).

```vue
<template>
  <lh-timeline>
    <lh-timeline-item timestamp="2026-09-01">
      Revisión de inicio del proyecto
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="2026-09-15"
      type="success"
    >
      Primera fase entregada
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="2026-09-25"
      type="warning"
    >
      Aceptación en curso
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## Diseño alternado

`mode="alternate"` divide la línea de tiempo en torno a un eje central: los elementos se alternan a izquierda y derecha según el índice (índices pares a la izquierda, impares a la derecha).

```vue
<template>
  <lh-timeline mode="alternate">
    <lh-timeline-item timestamp="Q1">
      Planificación
    </lh-timeline-item>
    <lh-timeline-item timestamp="Q2">
      Desarrollo
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q3"
      type="danger"
    >
      Pruebas de carga
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q4"
      type="success"
    >
      Lanzamiento
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## Puntos huecos

`hollow` renderiza el nodo como un punto hueco, habitual para estados pendientes.

```vue
<template>
  <lh-timeline>
    <lh-timeline-item
      timestamp="Q1"
      hollow
    >
      No comenzado
    </lh-timeline-item>
    <lh-timeline-item timestamp="Q2">
      En progreso
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q3"
      type="success"
    >
      Completado
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## Marca de tiempo y punto personalizados

Tanto `timestamp` como `dot` son slots: usa el slot `#timestamp` en lugar de la prop para contenido arbitrario; el slot `#dot` reemplaza el punto predeterminado (por ejemplo, un icono).

```vue
<template>
  <lh-timeline>
    <lh-timeline-item type="primary">
      <template #timestamp>
        Septiembre de 2026
      </template>
      Contenido de marca de tiempo personalizada
    </lh-timeline-item>
    <lh-timeline-item type="success">
      <template #dot>
        <lh-icon
          name="check"
          :size="12"
        />
      </template>
      Punto personalizado (lh-icon)
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## Timeline Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| mode | Diseño: `'left'` en un lado / `'alternate'` alternado | `'left' \| 'alternate'` | `'left'` |
| customClass | Nombre de clase personalizado | `string` | — |
| sx | Propiedades de diseño rápido | `LhSxProps` | — |

## TimelineItem Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| timestamp | Texto de la marca de tiempo (también admite el slot `#timestamp`) | `string` | — |
| type | Tipo semántico del nodo (el borde del punto se colorea según los tokens) | `'primary' \| 'success' \| 'warning' \| 'danger'` | — |
| hollow | Nodo hueco (habitual para estados pendientes) | `boolean` | `false` |
| customClass | Nombre de clase personalizado (se reenvía al nodo raíz del elemento) | `string` | — |
| sx | Propiedades de diseño rápido | `LhSxProps` | — |

## Slots

| Slot | Descripción |
| --- | --- |
| Timeline default | Nodos de los elementos (`lh-timeline-item`) |
| TimelineItem default | Contenido del cuerpo del elemento |
| TimelineItem timestamp | Contenido de la marca de tiempo (la fila no se renderiza si no se indica ni la prop ni el slot) |
| TimelineItem dot | Punto personalizado (el punto predeterminado es puramente decorativo y queda fuera del árbol de accesibilidad) |

## Diferencias de plataforma

- La línea de tiempo es un **componente puramente visual**: sin eventos, sin estado controlado, sin mediciones ni llamadas a APIs de plataforma; H5 y el Mini Programa de WeChat son totalmente compatibles y se renderizan de forma idéntica.
- La lista semántica `<ol>` / `<li>` se implementa con `<view>` en ambas plataformas (WXSS prohíbe los selectores de etiqueta, los Estilos aplican vía clases), y se conserva la semántica de lista con `role="list"` / `role="listitem"`; la compatibilidad con lectores de pantalla en el Mini Programa depende de la plataforma.
- Las líneas conectoras y el eje central son pseudo-elementos CSS puros (`::before`) sin mediciones JS; el diseño alternado se basa en la paridad del índice más la dirección flex, de forma idéntica en ambas plataformas.
- **Purificación WXSS**: el `.lh-timeline__item:not(.lh-timeline__item--last)` de la hoja de estilos de share ve su modificador `:not()` eliminado en tiempo de construcción (WXSS no admite `:not()`). La visibilidad de la línea conectora de los elementos no finales la asume `.lh-timeline__item--last::before`, cuya especificidad no es inferior; el resultado visual es el mismo en ambas plataformas.
- Accesibilidad: los puntos de los nodos son puramente decorativos (`aria-hidden="true"`) y el slot de punto personalizado también queda fuera del árbol de accesibilidad, igual que en la versión Vue 3.
- **Decisión de portado (alineada con la versión Vue 3, sin APIs inventadas)**: en el momento del portado, la fuente de verdad de plus y el core de `@lh-ui/share` aún no ofrecían `placement` (posición de la marca de tiempo) ni `center` (diseño centrado), así que esta librería tampoco los ofrece; `mode` actualmente solo admite `'left'` / `'alternate'`. Se añadirán cuando la fuente de verdad los incorpore.
