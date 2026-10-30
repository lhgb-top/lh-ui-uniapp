# Campo de entrada

## Uso básico

```vue
<template>
  <lh-input v-model="text" placeholder="Escribe..." />
  <lh-input v-model="text" type="textarea" :rows="3" autosize placeholder="Multilínea" />
  <lh-input v-model="text" type="password" placeholder="Contraseña" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
```

## Estilo del marcador de posición (imprescindible en MP)

::: warning El Mini Programa no admite `::placeholder`
El WXSS del Mini Programa de WeChat no admite el pseudoelemento `::placeholder`. El estilo del marcador de posición se pasa mediante props: **no** escribas `::placeholder` en CSS (la salvaguarda de compilación también lo bloquea).
:::

```vue
<lh-input placeholder="Escribe..." placeholder-style="color: #999; font-size: 13px" />
<!-- o usar una clase -->
<lh-input placeholder="Escribe..." placeholder-class="my-placeholder" />
```

## Con icono y estados

```vue
<template>
  <lh-input v-model="text" prefix-icon="search" placeholder="Buscar" clearable />
  <lh-input v-model="text" suffix-icon="close" placeholder="Icono de sufijo" />
  <lh-input v-model="text" state="error" placeholder="Estado de validación fallida" />
  <lh-input v-model="text" :maxlength="20" show-word-limit placeholder="Conteo de caracteres" />
</template>
```

## Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| modelValue (v-model) | Valor enlazado | `string` | — |
| type | Tipo | `'text' \| 'textarea' \| 'password' \| 'number' \| 'email' \| 'url' \| 'tel' \| 'date' \| 'time'` | `'text'` |
| size | Tamaño | `'small' \| 'medium' \| 'large'` | — |
| disabled | Desactivado | `boolean` | `false` |
| readonly | Solo lectura | `boolean` | `false` |
| placeholder | Texto del marcador de posición | `string` | — |
| placeholderStyle | Estilos en línea del marcador de posición (sustituye a `::placeholder`) | `string` | — |
| placeholderClass | Clase del marcador de posición (mutuamente excluyente con placeholderStyle) | `string` | — |
| maxlength | Longitud máxima | `number` | — |
| minlength | Longitud mínima | `number` | — |
| showWordLimit | Mostrar el conteo de caracteres | `boolean` | `false` |
| clearable | Se puede vaciar | `boolean` | `false` |
| prefixIcon | Icono de prefijo | `LhIconName` | — |
| suffixIcon | Icono de sufijo | `LhIconName` | — |
| state | Estado de validación | `'error' \| 'success' \| 'warning'` | — |
| name | name nativo (para la recolección del formulario) | `string` | — |
| password | Modo contraseña | `boolean` | `false` |
| rows | Número de líneas del textarea | `number` | — |
| autosize | Autoajuste de altura del textarea (el `auto-height` de MP) | `boolean` | `false` |
| label | Texto de la etiqueta | `string` | — |
| customClass | Clase personalizada | `string` | — |
| themeVars | Variables de tema a nivel de componente | `Record<string, string>` | — |
| sx | Props rápidas de disposición | `LhSxProps` | — |

## Events

| Evento | Descripción | Parámetros de la retrollamada |
| --- | --- | --- |
| update:modelValue | Cambio de valor | `(value: string)` |
| input | Entrada (toma `event.detail.value`) | `(value: string)` |
| blur | Pérdida de foco | — |
| focus | Obtención de foco | — |
| clear | Vaciado | — |

::: tip Diferencias frente a la versión Vue3
`autocomplete` / `autofocus` / `resize` / `form` / `tabindex` / `nativeType` / `inputStyle` no tienen una capacidad equivalente en el Mini Programa, de modo que **no se implementan** en esta biblioteca. `autosize` se apoya en la propiedad `auto-height` del textarea del Mini Programa.
:::
