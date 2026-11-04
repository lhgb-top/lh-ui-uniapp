# Input

## Basic usage

```vue
<template>
  <lh-input v-model="text" placeholder="Type here" />
  <lh-input v-model="text" type="textarea" :rows="3" autosize placeholder="Multi-line" />
  <lh-input v-model="text" type="password" placeholder="Password" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
```

## Placeholder styling (required on MP)

::: warning The Mini Program does not support `::placeholder`
The WXSS of the WeChat Mini Program does not support the `::placeholder` pseudo-element. Pass placeholder styling in via props and **do not** write `::placeholder` in CSS (the build-time guard also blocks it).
:::

```vue
<lh-input placeholder="Type here" placeholder-style="color: #999; font-size: 13px" />
<!-- or use a class name -->
<lh-input placeholder="Type here" placeholder-class="my-placeholder" />
```

## With icons and states

```vue
<template>
  <lh-input v-model="text" prefix-icon="search" placeholder="Search" clearable />
  <lh-input v-model="text" suffix-icon="close" placeholder="Suffix icon" />
  <lh-input v-model="text" state="error" placeholder="Failed validation state" />
  <lh-input v-model="text" :maxlength="20" show-word-limit placeholder="Word counter" />
</template>
```

## Label position

`label` is now actually rendered (previously the prop was declared but not wired up). The default `float` is a floating label — it floats up to the top-left notch when focused or filled; `labelPosition` switches to the static positions `top` / `bottom` / `left` / `right`:

```vue
<template>
  <!-- Default: floating label (floats to the top-left notch on focus/when filled) -->
  <lh-input v-model="text" label="Username" />
  <!-- Top -->
  <lh-input v-model="text" label="Username" label-position="top" />
  <!-- Bottom -->
  <lh-input v-model="text" label="Username" label-position="bottom" />
  <!-- Left with fixed width (labelWidth only takes effect on left / right) -->
  <lh-input v-model="text" label="Username" label-position="left" :label-width="80" />
  <!-- Right -->
  <lh-input v-model="text" label="Username" label-position="right" />
</template>
```

::: warning uni-app differences
- The per-size vertical fine-tuning of `float` relies on the `:has` selector (not supported by WXSS); on the Mini Program only the `medium` size is exact, and on other sizes the label's vertical position is slightly off. The static positions (`top` / `left` / `right` / `bottom`) work on all platforms.
- The floated position of `textarea` + `float` is already shimmed with inline styles and works on all platforms.
:::

## Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| modelValue (v-model) | Bound value | `string` | — |
| type | Type | `'text' \| 'textarea' \| 'password' \| 'number' \| 'email' \| 'url' \| 'tel' \| 'date' \| 'time'` | `'text'` |
| size | Size | `'small' \| 'medium' \| 'large'` | — |
| disabled | Disabled | `boolean` | `false` |
| readonly | Read-only | `boolean` | `false` |
| placeholder | Placeholder text | `string` | — |
| placeholderStyle | Placeholder inline style (replaces `::placeholder`) | `string` | — |
| placeholderClass | Placeholder class name (pick one of placeholderStyle or this) | `string` | — |
| maxlength | Maximum length | `number` | — |
| minlength | Minimum length | `number` | — |
| showWordLimit | Show the word counter | `boolean` | `false` |
| clearable | Clearable | `boolean` | `false` |
| prefixIcon | Prefix icon | `LhIconName` | — |
| suffixIcon | Suffix icon | `LhIconName` | — |
| state | Validation state | `'error' \| 'success' \| 'warning'` | — |
| name | Native name (for form collection) | `string` | — |
| password | Password mode | `boolean` | `false` |
| rows | textarea rows | `number` | — |
| autosize | textarea auto-height (the auto-height of the MP textarea) | `boolean` | `false` |
| label | Floating label (default); use labelPosition to switch its position | `string` | — |
| labelPosition | Label position | `'float' \| 'top' \| 'left' \| 'right' \| 'bottom'` | `'float'` |
| labelWidth | Fixed label width (only effective on left / right; numbers are px, strings are used as-is) | `string \| number` | — |
| customClass | Custom class name | `string` | — |
| themeVars | Component-level theme variables | `Record<string, string>` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Events

| Event | Description | Callback parameters |
| --- | --- | --- |
| update:modelValue | Value changed | `(value: string)` |
| input | Input (takes `event.detail.value`) | `(value: string)` |
| blur | Blur | — |
| focus | Focus | — |
| clear | Cleared | — |

::: tip Differences from the Vue3 version
`autocomplete` / `autofocus` / `resize` / `form` / `tabindex` / `nativeType` / `inputStyle` have no counterparts on the Mini Program and are **not implemented** in this library. `autosize` uses the `auto-height` attribute of the MP textarea.
:::
