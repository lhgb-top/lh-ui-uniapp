# Botón

Componente de botón básico. El soporte de renderizado es el `<button>` integrado de uni (compilado al botón nativo de cada plataforma) y el evento de clic lo compila uni como `bindtap`.

## Uso básico

```vue
<template>
  <lh-button>Predeterminado</lh-button>
  <lh-button type="primary">Principal</lh-button>
  <lh-button type="success">Éxito</lh-button>
  <lh-button type="warning">Aviso</lh-button>
  <lh-button type="danger">Peligro</lh-button>
  <lh-button type="info">Información</lh-button>
</template>
```

## Estados y formas

```vue
<template>
  <lh-button loading>Cargando</lh-button>
  <lh-button disabled>Desactivado</lh-button>
  <lh-button plain>Plano</lh-button>
  <lh-button round>Redondeado</lh-button>
  <lh-button circle icon="search" />
  <lh-button block>Bloque (ocupa toda la fila)</lh-button>
  <lh-button icon="search" type="primary">Con icono</lh-button>
</template>
```

## Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| type | Tipo | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| size | Tamaño; si no se pasa, se hereda de ConfigProvider | `'small' \| 'medium' \| 'large'` | — |
| loading | Estado de carga | `boolean` | `false` |
| disabled | Desactivado | `boolean` | `false` |
| plain | Estilo plano (contorneado) | `boolean` | `false` |
| block | Disposición en bloque | `boolean` | `false` |
| round | Esquinas redondeadas | `boolean` | `false` |
| circle | Circular | `boolean` | `false` |
| icon | Nombre del icono | `LhIconName` | — |
| customClass | Clase personalizada (se pasa al nodo raíz) | `string` | — |
| themeVars | Variables de tema a nivel de componente | `Record<string, string>` | — |
| bgPattern | Patrón de fondo a nivel de componente | `string` | — |
| sx | Props rápidas de disposición | `LhSxProps` | — |

## Events

| Evento | Descripción | Parámetros de la retrollamada |
| --- | --- | --- |
| click | Clic | `(event)` |

::: tip Diferencias frente a la versión Vue3
El botón del Mini Programa no tiene semántica de `nativeType` / `href` / `target`, de modo que estas tres props **no se implementan** en esta biblioteca. El resto de la API es idéntico.
:::
