# Cargando

Servicio global de capa de fondo de carga. Al igual que Message, usa el **patrón de punto de montaje**.

## Colocar el punto de montaje

```vue
<template>
  <lh-config-provider>
    <view><!-- contenido de la página --></view>
    <lh-loading />
  </lh-config-provider>
</template>
```

## Llamadas

```ts
import { useLhLoading } from '@lh-ui/uniapp'

const loading = useLhLoading()

// show admite un objeto de opciones o una simple cadena de texto, y devuelve un handle
const handle = loading.show({ text: 'Cargando...' })
handle.close()

// Cerrar todos
loading.closeAll()
```

::: danger La ausencia de punto de montaje genera una advertencia
Igual que con Message: si se llama a `useLhLoading()` pero la página no tiene `<lh-loading />`, en desarrollo se emite una advertencia clara mediante `console.error`, sin degradación silenciosa.
:::

## LhLoadingOptions

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| target | Nodo objetivo (**solo efectivo en H5**; en la plataforma MP siempre es a pantalla completa) | `string` | — |
| text | Texto de carga | `string` | — |
| background | Color de fondo de la capa | `string` | — |
| lock | Bloquea el desplazamiento (**solo efectivo en H5**) | `boolean` | `false` |
| zIndex | Nivel; si no se pasa, se asigna de forma autoincremental | `number` | — |

## Métodos

| Método | Descripción | Parámetros |
| --- | --- | --- |
| show | Muestra la capa de fondo de carga y devuelve un handle (`{ close }`) | `(options: LhLoadingOptions \| string)` |
| close | Cierra la capa del id especificado | `(id: number)` |
| closeAll | Cierra todas | — |

## Diferencias frente a la versión Vue3

- `target`, en la plataforma del Mini Programa, **solo admite capa de fondo a pantalla completa**: el Mini Programa no puede seleccionar un nodo arbitrario para la capa de fondo, de modo que la primera versión ignora `target` en la plataforma MP (el campo se conserva y se documenta).
- `lock` solo es efectivo en H5; el Mini Programa no puede bloquear el desplazamiento del body.
- Cuando se superponen varias instancias, `useLhZIndex` garantiza que la capa abierta más reciente quede por encima.
