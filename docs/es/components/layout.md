# Layout (contenedor de diseño)

Esqueleto a nivel de página: `lh-layout` junto con los subcomponentes `lh-header` / `lh-aside` / `lh-main` / `lh-footer` (con easycom puedes usar las etiquetas directamente; al importar bajo demanda los nombres de los componentes son `LhLayout` / `LhHeader` / `LhAside` / `LhMain` / `LhFooter`).

## Uso básico (cabecera / contenido / pie)

El contenedor necesita una altura explícita: `lh-layout` es a su vez un contenedor flex con `flex: 1`, por lo que al colocarlo dentro de un padre en flujo normal debes darle una altura mediante `sx` o un estilo externo para que los hijos header / main / footer se repartan el espacio de forma proporcional.

```vue
<template>
  <lh-layout direction="vertical" :sx="{ h: '240px' }">
    <lh-header>Cabecera</lh-header>
    <lh-main>Contenido</lh-main>
    <lh-footer>Pie</lh-footer>
  </lh-layout>
</template>
```

## Dirección de disposición

`direction` controla explícitamente la dirección de los hijos: el valor predeterminado es `horizontal` (en fila); pasa a `vertical` de forma automática cuando hay un `lh-aside`, y también puede especificarse manualmente.

```vue
<template>
  <lh-layout direction="horizontal" :sx="{ h: '80px' }">
    <lh-main>En fila</lh-main>
    <lh-main>En fila</lh-main>
  </lh-layout>
  <lh-layout direction="vertical" :sx="{ h: '140px', mt: '12px' }">
    <lh-main>Apilados en vertical</lh-main>
    <lh-main>Apilados en vertical</lh-main>
  </lh-layout>
</template>
```

## Diseño con barra lateral

Cuando hay un `lh-aside`, el contenedor padre cambia a vertical de forma automática (header arriba, aside y main en fila).

```vue
<template>
  <lh-layout direction="vertical" :sx="{ h: '240px' }">
    <lh-header>Cabecera</lh-header>
    <lh-layout :sx="{ flex: '1', minHeight: '0px' }">
      <lh-aside :width="140" aria-label="Navegación lateral">Barra lateral</lh-aside>
      <lh-main>Contenido</lh-main>
    </lh-layout>
    <lh-footer>Pie</lh-footer>
  </lh-layout>
</template>
```

`width` acepta `number` (interpretado como px) o una `string` con unidades (por ejemplo `'30%'`); si se omite se usa `--lh-layout-aside-width` (220px por defecto).

## Layout Props

| Propiedad | Descripción | Tipo | Valor por defecto |
| --- | --- | --- | --- |
| direction | Dirección de disposición (vertical automática cuando hay un Aside) | `'horizontal' \| 'vertical'` | `'horizontal'` |
| customClass | Clase personalizada (se reenvía al nodo raíz) | `string` | — |
| sx | Propiedades rápidas de diseño sx | `LhSxProps` | — |

## Header / Main / Footer Props

| Propiedad | Descripción | Tipo | Valor por defecto |
| --- | --- | --- | --- |
| customClass | Clase personalizada (se reenvía al nodo raíz) | `string` | — |
| sx | Propiedades rápidas de diseño sx | `LhSxProps` | — |

## Aside Props

| Propiedad | Descripción | Tipo | Valor por defecto |
| --- | --- | --- | --- |
| width | Ancho de la barra lateral | `number \| string` | — |
| ariaLabel | Nombre accesible (denominación del landmark) | `string` | — |
| customClass | Clase personalizada (se reenvía al nodo raíz) | `string` | — |
| sx | Propiedades rápidas de diseño sx | `LhSxProps` | — |

## Slots

| Slot | Descripción |
| --- | --- |
| default | Contenido del diseño (los cinco componentes exponen un slot por defecto) |

## Diferencias de plataforma

- **Componente de diseño puramente CSS**: no existe un módulo layout en share core; la capa de lógica solo porta un contexto provide/inject (el padre cambia a vertical cuando un Aside se registra), sin medición, sin superposiciones y sin dependencias de `document`; el comportamiento es idéntico en H5 y en el Mini Programa de WeChat.
- **Sustitución de etiquetas**: las etiquetas `<section>` / `<header>` / `<aside>` / `<main>` / `<footer>` de la versión plus se sustituyen por elementos `view` (WXSS prohíbe los selectores de etiqueta; los estilos se aplican mediante las clases `lh-layout*`).
- **Semántica de landmark**: los roles de landmark que las etiquetas semánticas aportaban de forma nativa se restauran con atributos `role` — `banner` para header, `complementary` para aside, `main` para main y `contentinfo` para footer; cuando uses varios `aside` se recomienda distinguirlos con `ariaLabel` (por ejemplo "Navegación lateral", "Enlaces relacionados").
- **Contenedores de desplazamiento**: el `overflow: auto` de `lh-main` y `lh-aside` desplaza el propio elemento en H5; **la página de un Mini Programa no tiene un contenedor body desplazable** (el desplazamiento de la página lo asume el nodo raíz `page`), de modo que si colocas todo el contenido de una página directamente dentro de `lh-main` en un Mini Programa, el desplazamiento del elemento y el de la página pueden superponerse y producir barras de desplazamiento duplicadas. Para un diseño de página completa con barra lateral se recomienda dar al contenedor exterior `h: '100vh'` para que `lh-main` se desplace por sí mismo; o envolver el contenido en un `scroll-view` si lo necesitas.
- **Conclusión de portado**: disponible en todas las plataformas con un comportamiento idéntico al de la versión plus; la única consideración es la semántica de "desplazamiento a nivel de página frente a desplazamiento a nivel de elemento" en los Mini Programas.

::: tip Diferencias con la versión Vue 3
- Las etiquetas semánticas se sustituyen por `view` más atributos `role` (WXSS prohíbe los selectores de etiqueta) y se conserva la semántica de accesibilidad.
- Las etiquetas de los subcomponentes siguen la convención easycom: `lh-header` / `lh-aside` / `lh-main` / `lh-footer` (al importar bajo demanda los nombres correspondientes son `LhHeader`, etc.).
- Se añade la prop `customClass`: en uni-app una clase normal no atraviesa `styleIsolation`, por lo que las clases personalizadas se reenvían mediante una prop (la versión plus pasa las clases directamente).
- La dirección de disposición y el mecanismo provide/inject que activa el modo vertical al detectar un Aside son exactamente iguales que en la versión plus.
:::
