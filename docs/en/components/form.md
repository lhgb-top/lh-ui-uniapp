# Form

Data collection and validation. The validation logic is entirely pure functions of `@lh-ui/share`, with zero platform dependencies, so behavior is identical on both targets.

## Basic usage

```vue
<template>
  <lh-form :model="form" :rules="rules" ref="formRef" label-width="80">
    <lh-form-item label="Username" prop="name">
      <lh-input v-model="form.name" placeholder="Enter your username" />
    </lh-form-item>
    <lh-form-item label="Email" prop="email">
      <lh-input v-model="form.email" placeholder="Enter your email" />
    </lh-form-item>
    <lh-button type="primary" @click="onSubmit">Submit</lh-button>
  </lh-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({ name: '', email: '' })
const formRef = ref()

const rules = {
  name: [{ required: true, message: 'Please enter your username', trigger: 'blur' }],
  email: [{ required: true, message: 'Please enter your email', trigger: 'blur' }],
}

const onSubmit = async () => {
  const ok = await formRef.value.validate()
  if (ok) {
    // validation passed, submit
  }
}
</script>
```

## Form Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| model | Form data object (required) | `Record<string, unknown>` | — |
| rules | Validation rules (keys are prop names) | `Record<string, LhFormRule[]>` | — |
| labelPosition | Label position | `'left' \| 'right' \| 'top'` | `'right'` |
| labelWidth | Label width | `string \| number` | — |
| inline | Inline layout | `boolean` | `false` |
| customClass | Custom class name | `string` | — |
| sx | Quick layout props | `LhSxProps` | — |

## Form Methods (called via ref)

::: warning ref calls must happen after onReady
At the `onLoad` stage the child components are not fully created yet, so `formRef.value` is undefined. The click event of the submit button naturally happens after `onReady`, so using it directly is fine; if you need to call it during page initialization, put it inside `onReady`.
:::

| Method | Description | Returns |
| --- | --- | --- |
| validate | Validate all fields | `Promise<boolean>` (true when all pass) |
| validateField | Validate a single field | `Promise<boolean>` |

## FormItem Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| prop | Field key (corresponding to the key of model and of rules) | `string` | — |
| label | Label text | `string` | — |
| required | Required marker (shows an asterisk; the actual validation is decided by rules) | `boolean` | `false` |
| rules | Rules specific to this field (merged with the Form's rules) | `LhFormRule[]>` | — |
| customClass | Custom class name | `string` | — |

::: tip Differences from the Vue3 version
- Validation triggers: the Mini Program controls have no change semantics, so each form control maps its blur / input events to validation triggers.
- Form submission: form semantics differ on the Mini Program, so `validate` returns a `Promise<boolean>` for manual submission; there is no `submit` event interception like on the web.
:::
