# Insignia de navegación (Breadcrumb)

Muestra la ruta de la página actual para volver rápidamente a cualquier nivel anterior.

## Uso básico

```vue
<template>
  <lh-breadcrumb separator="/">
    <lh-breadcrumb-item>Inicio</lh-breadcrumb-item>
    <lh-breadcrumb-item>Componentes</lh-breadcrumb-item>
    <lh-breadcrumb-item>Insignia</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## Elementos clicables

Los elementos que no son el último, con la prop `to`, se renderizan como enlaces y navegan mediante `uni.navigateTo` al hacer clic (la url debe ser una ruta de página que empiece con `/`).

```vue
<template>
  <lh-breadcrumb>
    <lh-breadcrumb-item to="/pages/index/index">Inicio</lh-breadcrumb-item>
    <lh-breadcrumb-item to="/pages/component/index">Componentes</lh-breadcrumb-item>
    <lh-breadcrumb-item>Insignia</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## Colapso

`maxItems` limita el número de elementos visibles (incluidos los puntos suspensivos): al superarlo se conservan el primer elemento, los puntos suspensivos y los últimos elementos; al hacer clic en los puntos suspensivos se expanden todos.

```vue
<template>
  <lh-breadcrumb :max-items="3">
    <lh-breadcrumb-item>Inicio</lh-breadcrumb-item>
    <lh-breadcrumb-item>Eventos</lh-breadcrumb-item>
    <lh-breadcrumb-item>Lista</lh-breadcrumb-item>
    <lh-breadcrumb-item>Detalle</lh-breadcrumb-item>
    <lh-breadcrumb-item>Reseñas</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## Breadcrumb Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| separator | Carácter separador | `string` | `'/'` |
| maxItems | Máximo de elementos visibles (primer elemento + puntos suspensivos + últimos elementos); al superarlo colapsa; `0` desactiva el colapso | `number` | `0` |
| customClass | Clase personalizada | `string` | — |
| sx | Propiedades rápidas de diseño | `LhSxProps` | — |

## BreadcrumbItem Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| to | Dirección de destino; cuando se establece y no es el último elemento, se renderiza como enlace y navega con `uni.navigateTo` al hacer clic | `string` | — |
| customClass | Clase personalizada | `string` | — |

## Slots

| Slot | Descripción |
| --- | --- |
| default | Contenido de texto del elemento de navegación |

::: tip Diferencias con la versión Vue 3
- `to` no usa vue-router (un proyecto uni-app no tiene router): la navegación es siempre `uni.navigateTo`; en H5 sigue la estrategia de enrutado H5 de uni.
- `<nav>/<ol>/<li>` se sustituyen por `<view>` (WXSS prohíbe selectores de etiqueta); se conservan `aria-current="page"` y `aria-label`.
- La lógica de colapso y puntos suspensivos reutiliza las mismas funciones puras de share core, igualando el comportamiento de plus.
:::
