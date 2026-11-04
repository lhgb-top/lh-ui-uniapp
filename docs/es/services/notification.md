# Notification

Servicio global de notificaciones. Muestra tarjetas con título y cuerpo en las esquinas del viewport, útil para retroalimentación de resultados que requiere la atención del usuario. Al igual que Message / Loading, usa el **patrón de punto de montaje**——el Mini Programa no puede crear DOM mediante JS, por lo que la página debe contener primero el componente de punto de montaje.

## Colocar el punto de montaje

Colóquelo una vez en las páginas que necesiten notificaciones (o en un componente raíz persistente):

```vue
<template>
  <lh-config-provider>
    <view><!-- contenido de la página --></view>
    <lh-notification />
  </lh-config-provider>
</template>
```

::: danger La ausencia del punto de montaje genera una advertencia
Si llama a `useLhNotification()` pero la página no tiene `<lh-notification />`, se emite una advertencia de `console.error` durante el desarrollo y **no se degrada silenciosamente**. Igual que Message: la degradación silenciosa convertiría "la llamada parece funcionar pero no ocurre nada" en un error oculto.
:::

## Uso

```ts
import { useLhNotification } from '@lh-ui/uniapp'

const notification = useLhNotification()

notification.success({ title: 'Notificación de éxito', content: 'El documento se escribió en la nube' })
notification.info({ title: 'Notificación de información' })
notification.warning({ title: 'Notificación de advertencia' })
notification.danger({ title: 'Notificación de peligro' })

// Cada esquina es un contenedor independiente
notification.info({ title: 'Superior izquierda', position: 'top-left' })

// Sin cierre automático, cierre manual
const handle = notification.warning({ title: 'Advertencia persistente', duration: 0 })
handle.close()

// cerrar todas
notification.closeAll()
```

## Métodos

| Método | Descripción | Parámetros |
| --- | --- | --- |
| (llamada directa) | `notification(options)` abre una notificación | `(options: LhNotificationOptions)` |
| success / info / warning / danger | Abre una notificación del tipo semántico correspondiente | `(options: LhNotificationOptions)` |
| close | Cierra la notificación con el id indicado | `(id: number)` |
| closeAll | Cierra todas | — |
| config | Cambia la configuración global predeterminada | `(config: LhNotificationConfig)` |

## LhNotificationOptions

| Propiedad | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| title | Título (obligatorio) | `string` | — |
| content | Contenido del cuerpo | `string` | — |
| type | Tipo semántico | `'success' \| 'info' \| 'warning' \| 'danger' \| 'error'` | `'info'` |
| duration | Milisegundos hasta el cierre automático; 0 significa sin cierre automático | `number` | `4500` |
| position | Posición de aparición | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` |
| showClose | Muestra el botón de cierre | `boolean` | `true` |
| sx | Propiedades de maquetación rápida sx | `LhSxProps` | — |
| onClick | Retrollamada de clic en la tarjeta (la tarjeta se presenta con semántica de botón) | `() => void` | — |
| onClose | Retrollamada tras cerrar (automática o manual) | `() => void` | — |

::: tip El tipo error
`error` es una semántica alias de `danger` (el `LhNotificationType` de share core lo incluye). Los métodos del servicio exponen solo success / info / warning / danger, igual que plus; para error llame directamente a `notification({ title: '...', type: 'error' })`.
:::

## Configuración global

```ts
const notification = useLhNotification()
notification.config({ duration: 3000, offset: 24 })
```

| Configuración | Descripción | Predeterminado |
| --- | --- | --- |
| duration | Duración predeterminada del cierre automático en milisegundos; 0 significa sin cierre automático | `4500` |
| offset | Desplazamiento desde el borde del viewport (px) | `20` |

## Comportamiento

- **Cuatro contenedores independientes por esquina**: los registros se agrupan por `position` y se apilan en orden cronológico dentro de cada esquina (las dos esquinas inferiores usan `column-reverse`, las notificaciones nuevas se pegan al borde inferior); el espacio de apilamiento lo controla la variable de estilos `--lh-notification-gap` (16 px por defecto).
- **Cierre automático**: se elimina automáticamente tras `duration` milisegundos y dispara `onClose`; `duration: 0` significa persistente.
- **Clic en la tarjeta**: no cierra (igual que plus), solo dispara `onClick`; el cierre ocurre solo mediante el botón de cierre o el temporizador automático.
- **Accesibilidad**: los contenedores de las esquinas llevan `role="region"` + `aria-live="polite"`; las tarjetas con `onClick` se presentan como `role="button"`; el botón de cierre lleva el nombre accesible de la clave de idioma `notification.close` (ya incluida en los paquetes de idioma de share y actualizada al cambiar de idioma).

## Diferencias de plataforma (frente a la versión Vue3)

- **Patrón de punto de montaje**: plus monta un host en `document.body` mediante `createApp`; el Mini Programa no tiene `document`, por lo que se usa un "store singleton a nivel de módulo + componente de punto de montaje `<lh-notification />` en la página", con la API expuesta a través de `useLhNotification()` (plus es la llamada directa `LhNotification` + registro vía install).
- **Sin `appendTo`**: la versión web puede elegir el contenedor de montaje; el Mini Programa no tiene ese concepto, la posición la deciden los contenedores fijos de las esquinas renderizados por el componente de punto de montaje.
- **Animaciones de entrada/salida degradadas**: plus usa `TransitionGroup` para la entrada deslizante / reflujo FLIP; `transitionend` no es fiable en el Mini Programa, por lo que en la primera versión los nodos se añaden y eliminan sin animación (los nombres de clase de transición permanecen en la fuente de estilos y pueden reutilizarse en H5 envolviendo un Transition propio).
- **La semántica de teclado de las tarjetas clicables no se traslada**: plus añade `tabindex` y activación con Enter / Espacio a las tarjetas con `onClick`; el Mini Programa no tiene modelo de foco DOM, por lo que solo se conservan el clic y la semántica `role="button"`.
