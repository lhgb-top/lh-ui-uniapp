# Message (notificación)

Servicio global de mensajes de notificación. **Usa el patrón de punto de montaje**: el Mini Programa no puede crear DOM mediante JS, de modo que la página debe contener primero el componente de punto de montaje.

## Colocar el punto de montaje

Se coloca una vez en la página que necesite mensajes de notificación (o en un componente contenedor raíz permanente):

```vue
<template>
  <lh-config-provider>
    <view><!-- contenido de la página --></view>
    <lh-message />
  </lh-config-provider>
</template>
```

## Llamadas

```ts
import { useLhMessage } from '@lh-ui/uniapp'

const message = useLhMessage()

message.success('Guardado correctamente')
message.info('Mensaje informativo')
message.warning('Mensaje de aviso')
message.danger('Mensaje de error')
message.error('Mensaje de error (alias de danger)')

// Aviso de carga sin cierre automático (duration: 0); se cierra a mano
const handle = message.loading('Cargando...')
// ...tras completar la operación asíncrona
handle.close()

// Cerrar todos
message.closeAll()
```

::: danger La ausencia de punto de montaje genera una advertencia
Si se llama a `useLhMessage()` pero la página no tiene `<lh-message />`, en desarrollo se emite una advertencia clara mediante `console.error` y **no se degrada silenciosamente**. Es una decisión deliberada: la degradación silenciosa convertiría «la llamada parece funcionar, pero no ocurre nada» en un bug oculto.
:::

## Métodos

| Método | Descripción | Parámetros |
| --- | --- | --- |
| (llamada directa) | `message('xxx')` equivale a `message.info('xxx')` | `(options: LhMessageOptions \| string)` |
| success / info / warning / danger / error | Muestra un mensaje del tipo correspondiente | `(content: string, options?: Partial<LhMessageOptions>)` |
| loading | Muestra un aviso de carga sin cierre automático (`duration: 0`) y devuelve un handle para cerrarlo a mano | Igual que el anterior |
| close | Cierra el mensaje del id especificado | `(id: number)` |
| closeAll | Cierra todos | — |

## LhMessageOptions

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| content | Texto (obligatorio) | `string` | — |
| type | Tipo | `'success' \| 'info' \| 'warning' \| 'danger' \| 'loading'` | `'info'` |
| duration | Tiempo de mostrado (milisegundos); 0 significa sin cierre automático | `number` | `3000` |
| showClose | Muestra el botón de cierre | `boolean` | `false` |
| offset | Desplazamiento respecto a la parte superior (px) | `number` | — |
| onClose | Retrollamada de cierre | `() => void` | — |

## Configuración global

```ts
const message = useLhMessage()
message.config({ duration: 2000, max: 5, offset: 20 })
```

| Configuración | Descripción | Predeterminado |
| --- | --- | --- |
| duration | Tiempo de mostrado por defecto (milisegundos) | `3000` |
| max | Número máximo de mensajes simultáneos en pantalla | — |
| offset | Desplazamiento respecto a la parte superior | — |

::: tip Diferencias frente a la versión Vue3
- **No hay `appendTo`**: la versión web lo monta en `document.body`, concepto que no existe en el Mini Programa; la posición del punto de montaje la determina el lugar que ocupa `<lh-message />` en la página.
- Las animaciones de entrada y salida usan CSS transition + setTimeout para alinear la duración (`transitionend` no es fiable en el Mini Programa).
- El componente de notificaciones (Notification) no está en la primera versión; se sustituye por Message.
:::
