# Alert (Alerta)

Muestra comentarios semánticos importantes en la página (éxito / advertencia / error / información), con título, descripción, icono semántico y una acción de cierre opcional.

## Uso básico

```vue
<template>
  <lh-alert title="Aviso">
    La operación se ha guardado y puedes seguir editándola en cualquier momento.
  </lh-alert>
</template>
```

El título puede pasarse con la prop `title` o con el slot del mismo nombre; el slot por defecto contiene la descripción.

## Tipos semánticos

```vue
<template>
  <lh-alert type="success" title="Éxito">
    Los datos se han sincronizado.
  </lh-alert>
  <lh-alert type="warning" title="Advertencia">
    Saldo insuficiente, recarga cuanto antes.
  </lh-alert>
  <lh-alert type="danger" title="Error">
    El envío falló; comprueba la red e inténtalo de nuevo.
  </lh-alert>
  <lh-alert type="info" title="Información">
    La nueva versión se publicará la próxima semana.
  </lh-alert>
</template>
```

## Icono semántico

```vue
<template>
  <lh-alert show-icon type="success" title="Mensaje de éxito con icono">
    El color del icono sigue automáticamente el tipo semántico.
  </lh-alert>
</template>
```

## Cerrable

```vue
<template>
  <lh-alert closable title="Alerta cerrable">
    Al pulsar el icono de cerrar la derecha, el componente se oculta y se emite el evento close.
  </lh-alert>
</template>
```

## Estilo plano (plain)

```vue
<template>
  <lh-alert plain title="Estilo plano">
    Fondo transparente con borde de color semántico, ideal para listas compactas.
  </lh-alert>
</template>
```

## Props

| Prop | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| type | Tipo semántico | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` |
| title | Título (también admite el slot title) | `string` | — |
| closable | Si se puede cerrar | `boolean` | `false` |
| showIcon | Si se muestra el icono semántico | `boolean` | `false` |
| plain | Si se usa el estilo plano | `boolean` | `false` |
| closeLabel | Nombre accesible del botón de cerrar (si no se pasa, se usa el mensaje `alert.close` del locale) | `string` | — |
| customClass | Clase personalizada | `string` | — |
| sx | Props rápidas de layout | `LhSxProps` | — |

## Eventos

| Evento | Descripción | Argumentos |
| --- | --- | --- |
| close | Se emite al pulsar el botón de cerrar (el componente se oculta justo después) | — |

## Slots

| Slot | Descripción |
| --- | --- |
| default | Contenido de la descripción |
| title | Contenido del título (tiene prioridad sobre la prop title) |

## Diferencias de plataforma

- **Roles de accesibilidad**: `warning` / `danger` se renderizan con `role="alert"` (anuncio inmediato) e `info` / `success` con `role="status"` (anuncio cortés), coincidiendo con la semántica APG de la versión plus, sin diferencias entre plataformas.
- **Sustitución de etiquetas**: los `<div>` / `<span>` / `<p>` de la versión plus se sustituyen por `view` (WXSS prohíbe los selectores de etiqueta, los estilos se aplican mediante las clases `lh-alert__*`).
- **Iconos**: el svg en línea no es compatible con el Mini Programa, por lo que se sustituyen por nodos `lh-icon` (`info` / `check` / `warning` / `error`), compartiendo la clase `lh-alert__icon` con el scss de share.
- **Botón de cerrar**: el `<button type="button">` de la versión plus se sustituye por un `view` con `role="button"`; el nombre accesible también viene de `closeLabel` o del mensaje `alert.close` (disponible en los nueve idiomas).
- **Sin animación de entrada/salida**: la versión plus también simplemente elimina el nodo con `v-if` al cerrar (sin `<transition>`), de modo que el comportamiento aquí es idéntico y no se ve afectado por la poca fiabilidad del evento de fin de transición en el Mini Programa.
- **Conclusión de la adaptación**: Alert es un componente puramente presentacional (sin mediciones, sin superposiciones, sin trampa de foco, sin dependencia de document); funciona en todas las plataformas con un comportamiento idéntico en H5 y el Mini Programa de WeChat.
