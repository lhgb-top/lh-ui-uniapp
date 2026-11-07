# Result resultado

Página de resultado para el final de un flujo de retroalimentación, con icono de estado y colores integrados.

## Uso básico

```vue
<template>
  <lh-result
    status="success"
    title="Enviado con éxito"
    sub-title="La orden de trabajo pasó a la siguiente etapa"
  />
</template>
```

Cuatro estados: `success` / `warning` / `error` / `info` (`info` por defecto), cada uno con su icono y colores predeterminados; un valor de estado no válido cae a `info`.

## Icono personalizado

```vue
<template>
  <lh-result
    icon="like"
    :icon-size="48"
    title="Me gusta y favorito"
  />
</template>
```

Si `icon` recibe una cadena vacía `""` no se renderiza ningún icono; si no se pasa, se usa el icono predeterminado del estado.

## Slots

```vue
<template>
  <lh-result status="success">
    <template #subTitle> Subtítulo personalizado </template>
    <template #extra>
      <lh-button type="primary" size="small">Volver al inicio</lh-button>
    </template>
  </lh-result>
</template>
```

Los tres slots `title` / `subTitle` / `extra` sobrescriben la prop del mismo nombre.

## Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| status | Estado del resultado | `'success' \| 'warning' \| 'info' \| 'error'` | `'info'` |
| icon | Nombre del icono personalizado (sobrescribe el icono predeterminado del estado; la cadena vacía no se renderiza) | `string` | — |
| iconSize | Tamaño del icono | `string \| number` | `64` |
| title | Título | `string` | — |
| subTitle | Subtítulo | `string` | — |
| customClass | Clase personalizada | `string` | — |
| sx | Props de maquetación rápida | `LhSxProps` | — |

## Slots

| Ranura | Descripción |
| --- | --- |
| title | Título (sobrescribe la prop title) |
| subTitle | Subtítulo (sobrescribe la prop subTitle) |
| extra | Área de acciones inferior |
