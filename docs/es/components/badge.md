# Insignia

Marca en la esquina superior derecha de un icono, para conteos de notificaciones, puntos de estado o texto personalizado.

## Uso básico

```vue
<template>
  <lh-badge :value="8">
    <lh-button size="small">Mensajes</lh-button>
  </lh-badge>
  <lh-badge :value="8" type="primary">
    <lh-button size="small">Principal</lh-button>
  </lh-badge>
</template>
```

## Tratamiento de valores

```vue
<template>
  <lh-badge :value="200" :max="99">
    <lh-button size="small">Supera max, muestra 99+</lh-button>
  </lh-badge>
  <lh-badge :value="0" show-zero>
    <lh-button size="small">Muestra 0</lh-button>
  </lh-badge>
  <lh-badge :value="0">
    <lh-button size="small">Oculta 0</lh-button>
  </lh-badge>
  <lh-badge content="Nuevo">
    <lh-button size="small">Texto personalizado</lh-button>
  </lh-badge>
</template>
```

## Punto rojo

```vue
<template>
  <lh-badge is-dot>
    <lh-button size="small">Hay mensajes nuevos</lh-button>
  </lh-badge>
</template>
```

## Desplazamiento y tamaño

```vue
<template>
  <lh-badge :value="8" :offset="[6, 4]">
    <lh-button size="small">Desplazada</lh-button>
  </lh-badge>
  <lh-badge :value="8" size="small">
    <lh-button size="small">Pequeña</lh-button>
  </lh-badge>
</template>
```

## Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| type | Tipo | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'default'` | `'danger'` |
| value | Valor numérico que se muestra | `string \| number` | — |
| size | Tamaño | `'small' \| 'medium' \| 'large'` | `'medium'` |
| max | Valor máximo; al superarlo se muestra `${max}+` | `number` | `99` |
| isDot | Si es un punto rojo (no muestra el valor) | `boolean` | `false` |
| hidden | Si está oculta | `boolean` | `false` |
| offset | Desplazamiento respecto a la posición por defecto `[x, y]`, implementado con margin negativo | `[number, number]` | — |
| showZero | Si se muestra cuando value es 0 | `boolean` | `false` |
| content | Texto personalizado (prevalece sobre value) | `string` | — |
| customClass | Clase personalizada | `string` | — |
| sx | Props rápidas de disposición | `LhSxProps` | — |

## Slots

| Slot | Descripción |
| --- | --- |
| default | Contenido del que cuelga la insignia |

::: tip Diferencias frente a la versión Vue3
Las animaciones de entrada y salida no dependen del `<transition>` integrado de Vue (el evento de fin de transición del Mini Programa no es fiable): se sustituyen por cambio de clase + temporizador para alinear la duración de la animación de 0.15 s, con un resultado visual idéntico al de plus.
:::
