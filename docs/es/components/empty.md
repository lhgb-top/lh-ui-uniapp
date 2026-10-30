# Vacío

Marca de posición con ilustración de 水墨 (tinta china) para cuando no hay datos.

## Uso básico

```vue
<template>
  <lh-empty />
</template>
```

Cuando no se pasa `description` se toma `empty.description` del paquete de idioma (en chino, «暂无数据»); al cambiar el idioma de ConfigProvider el cambio es automático.

## Texto personalizado

```vue
<template>
  <lh-empty description="La tinta aún no se ha secado; no hay nada que mostrar" />
</template>
```

## Imagen personalizada

```vue
<template>
  <lh-empty image="https://placeholder.invalid/empty.png" description="Totalmente vacío" />
</template>
```

## Ilustración propia mediante slot

El slot default puede sustituir por completo la ilustración por defecto (cuando se pasa `image`, la ilustración por defecto tampoco se renderiza).

```vue
<template>
  <lh-empty description="Aún no hay favoritos">
    <view class="my-illustration">🎨</view>
  </lh-empty>
</template>
```

## Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| description | Texto descriptivo del estado vacío (si no se pasa, se toma empty.description del paquete de idioma) | `string` | — |
| image | URL de una imagen personalizada (sustituye a la ilustración por defecto) | `string` | — |
| customClass | Clase personalizada | `string` | — |
| sx | Props rápidas de disposición | `LhSxProps` | — |

## Slots

| Slot | Descripción |
| --- | --- |
| default | Ilustración propia (al pasarse, sustituye a la ilustración por defecto) |

::: tip La ilustración por defecto en el Mini Programa
H5 conserva la ilustración `<svg>` en línea (con la coloración del tema plenamente fiel); el Mini Programa no admite svg, de modo que la ilustración por defecto se dibuja con CSS en una versión simplificada, los colores se toman de las variables de tema y el modo claro / oscuro se adapta automáticamente.
:::
