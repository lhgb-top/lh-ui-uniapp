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

## Posición de la etiqueta

`label` ahora sí se renderiza (antes la prop estaba declarada pero sin conectar). El valor por defecto `float` es una etiqueta flotante — sube a la muesca superior izquierda al enfocar o cuando hay valor; `labelPosition` permite cambiar a las posiciones estáticas `top` / `bottom` / `left` / `right`:

```vue
<template>
  <!-- Por defecto: etiqueta flotante (sube a la muesca superior izquierda al enfocar o con valor) -->
  <lh-input v-model="text" label="Nombre de usuario" />
  <!-- Arriba -->
  <lh-input v-model="text" label="Nombre de usuario" label-position="top" />
  <!-- Abajo -->
  <lh-input v-model="text" label="Nombre de usuario" label-position="bottom" />
  <!-- Izquierda con ancho fijo (labelWidth solo surte efecto en left / right) -->
  <lh-input v-model="text" label="Nombre de usuario" label-position="left" :label-width="80" />
  <!-- Derecha -->
  <lh-input v-model="text" label="Nombre de usuario" label-position="right" />
</template>
```

::: warning Diferencias de uni-app
- El ajuste vertical fino por talla de `float` depende del selector `:has` (no soportado por WXSS); en el Mini Programa solo la talla `medium` es exacta y en las demás la posición vertical de la etiqueta queda ligeramente desviada. Las posiciones estáticas (`top` / `left` / `right` / `bottom`) funcionan en todas las plataformas.
- La posición flotante de `textarea` + `float` ya está resuelta con estilos en línea y funciona en todas las plataformas.
:::

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
| label | Etiqueta flotante (por defecto); con labelPosition se puede cambiar de posición | `string` | — |
| labelPosition | Posición de la etiqueta | `'float' \| 'top' \| 'left' \| 'right' \| 'bottom'` | `'float'` |
| labelWidth | Ancho fijo de la etiqueta (solo surte efecto en left / right; los números se interpretan en px, las cadenas se usan tal cual) | `string \| number` | — |
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
