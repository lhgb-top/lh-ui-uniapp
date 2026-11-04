# Image

Imagen con marcador de posición por fallo de carga y previsualización opcional al tocar
(mediante la API nativa `uni.previewImage`, disponible en todas las plataformas). El modo de
recorte se mapea al `mode` del `<image>` de uni, y la carga diferida usa el `lazy-load`
integrado del componente. La normalización de la lista de previsualización y los nombres de
clase de estado provienen de funciones puras del core de `@lh-ui/share`.

## Uso básico

```vue
<template>
  <lh-image src="https://picsum.photos/240/140" alt="Imagen de ejemplo" :sx="{ w: '240px', h: '140px' }" />
</template>
```

`alt` es obligatorio a nivel de TS, de modo que ninguna imagen carezca de texto alternativo.
El `<image>` de uni tiene 320×240 por defecto: establezca el tamaño explícitamente con `w` / `h`
de `sx` (o con style); el radio de las esquinas está integrado en la fuente de estilos de share
(`--lh-border-radius-small`), sin configuración.

## Modos de ajuste

`fit` describe la semántica de object-fit de CSS y se mapea al `mode` del `<image>` de uni:
`contain` → `aspectFit`, `cover` → `aspectFill`, `fill` → `scaleToFill`.

```vue
<template>
  <lh-image src="https://picsum.photos/240/140" alt="Recorte cover" fit="cover" :sx="{ w: '110px', h: '80px' }" />
  <lh-image src="https://picsum.photos/240/140" alt="Mostrar completo" fit="contain" :sx="{ w: '110px', h: '80px' }" />
  <lh-image src="https://picsum.photos/240/140" alt="Estirar" fit="fill" :sx="{ w: '110px', h: '80px' }" />
</template>
```

::: tip none / scale-down son aproximaciones
`none` se mapea a `center` (sin escalado, solo se muestra la zona central, la misma semántica
que object-fit: none); uni no tiene un `mode` equivalente a `scale-down`, por lo que se usa el
más cercano semánticamente, `aspectFit` (la misma desviación registrada que lh-avatar).
:::

## Carga diferida

`lazy` activa el `lazy-load` integrado del `<image>` de uni (carga al entrar en el viewport).

```vue
<template>
  <scroll-view scroll-y style="height: 140px; width: 100%">
    <lh-image
      v-for="i in 4"
      :key="i"
      :src="`https://picsum.photos/240/120?random=${i}`"
      :alt="`Imagen diferida ${i}`"
      lazy
      :sx="{ w: '240px', h: '120px', mb: 1 }"
    />
  </scroll-view>
</template>
```

En WeChat, `lazy-load` solo funciona para imágenes bajo page y scroll-view.

## Fallo de carga

Cuando la carga falla, el componente cambia al marcador de fallo (el nodo raíz recibe
`lh-image--error`). El texto por defecto proviene de la clave de idioma `image.error`
(nueve idiomas disponibles) y puede personalizarse con el slot `error`; además se emite el
evento `error`.

```vue
<template>
  <lh-image src="https://invalid.example.com/not-found.png" alt="Marcador por defecto" :sx="{ w: '240px', h: '140px' }" />
  <lh-image src="https://invalid.example.com/not-found.png" alt="Marcador personalizado" :sx="{ w: '240px', h: '140px' }">
    <template #error>Marcador de fallo personalizado</template>
  </lh-image>
</template>
```

## Previsualizar al tocar

Con `preview` activado, al tocar la imagen se abre la previsualización nativa de
`uni.previewImage` (disponible en todas las plataformas). Pase varias imágenes con
`preview-src-list`; si se omite, se recurre a `[src]` (misma normalización que plus,
índice inicial fijo en 0).

```vue
<template>
  <lh-image
    src="https://picsum.photos/240/140"
    alt="Previsualización de varias imágenes"
    preview
    :preview-src-list="[
      'https://picsum.photos/600/400?random=1',
      'https://picsum.photos/600/400?random=2',
      'https://picsum.photos/600/400?random=3',
    ]"
    :sx="{ w: '240px', h: '140px' }"
  />
  <lh-image src="https://picsum.photos/240/140" alt="Previsualización de una imagen" preview :sx="{ w: '140px', h: '140px' }" />
</template>
```

## Props

| Propiedad | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| src | URL de la imagen | `string` | — |
| alt | Texto alternativo (requisito a11y, obligatorio a nivel de TS) | `string` | — |
| fit | Modo de recorte (se mapea al mode de la imagen uni) | `'contain' \| 'cover' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` |
| preview | Si al tocar se abre la previsualización | `boolean` | `false` |
| preview-src-list | Lista de previsualización (recurre a [src] si se omite) | `string[]` | — |
| lazy | Carga diferida (lazy-load nativo de la imagen uni) | `boolean` | `false` |
| customClass | Nombre de clase personalizado | `string` | — |
| sx | Propiedades rápidas de diseño | `LhSxProps` | — |

## Events

| Evento | Descripción | Parámetros del callback |
| --- | --- | --- |
| load | Se emite cuando la imagen carga correctamente | `(event: Event)` |
| error | Se emite cuando la imagen falla al cargar (cambia al marcador) | `(event: Event)` |

## Slots

| Slot | Descripción |
| --- | --- |
| error | Contenido del marcador de fallo (por defecto usa la clave image.error del paquete de idioma) |

## Diferencias de plataforma

- **La previsualización usa la API nativa `uni.previewImage`** (disponible en todas las
  plataformas): la previsualización de plus es una capa viewer dibujada a mano (teleport al body,
  zoom / rotación / cambio de imágenes / cierre con Esc / trampa de foco), algo que no puede
  reproducirse en los mini programas porque no hay document. La versión uniapp llama a
  `uni.previewImage`: en H5 la capa la implementa el runtime de uni y en WeChat se usa la página
  de previsualización nativa. La interacción la provee la plataforma y **no admite personalización**
  (opacidad de la máscara / botón de cierre / barra de herramientas). El componente independiente
  `LhImageViewer` de plus no se entrega en este repositorio.
- **Mapeo fit → mode**: `contain` / `cover` / `fill` se mapean a `aspectFit` / `aspectFill` /
  `scaleToFill`; `none` se mapea a `center`; `scale-down` no tiene equivalente y usa el más
  cercano, `aspectFit` (misma desviación registrada que lh-avatar). La implementación CSS de
  object-fit solo aplica al `<img>` real en H5; el `<image>` de uni se controla con `mode` en
  todas las plataformas.
- **Carga diferida**: el `<image>` de uni incluye `lazy-load` (sustituye a `loading="lazy"` de
  plus); en WeChat solo aplica a imágenes bajo page y scroll-view.
- **Tamaño y radio**: el `<image>` de uni mide 320×240 por defecto; el tamaño se indica con
  `sx` / style. El radio está integrado en la fuente de estilos de share
  (`--lh-border-radius-small`). plus tampoco tiene prop width / height / radius (tamaño vía sx,
  radio vía fuente de estilos), así que aquí no se añade nada extra.
- **alt**: el `<image>` de MP no tiene concepto de alt (se pasa como atributo en H5), por lo que
  la reserva de accesibilidad es más débil que la del `<img alt>` web; se mantiene la obligación
  a nivel de TS.
- **Estilos residuales del viewer**: la fuente de estilos de share contiene reglas
  `.lh-image-viewer*` (estilos de la capa viewer de plus) que, por la restricción de fuente única
  de estilos, entran en el style.css de este componente; no hay nodos correspondientes en ninguna
  plataforma (redundancia inofensiva y sigue cumpliendo la lista blanca WXSS: la familia
  `:hover` / `:focus` queda compilada condicionalmente solo para H5).

::: tip Diferencias con la versión Vue3
- Los criterios lógicos (normalización de la lista de previsualización, estado de carga, nombres
  de clase) son idénticos a plus (mismo share core).
- La previsualización pasó de la capa viewer dibujada a mano a la API nativa `uni.previewImage`
  (ver «Diferencias de plataforma»).
- Añade la prop `customClass`: en uni-app los nombres de clase personalizados no atraviesan
  styleIsolation, por lo que se pasan mediante prop.
- `none` / `scale-down` son aproximaciones en mini programas (ver «Diferencias de plataforma»).
:::
