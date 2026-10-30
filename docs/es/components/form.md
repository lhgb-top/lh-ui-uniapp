# Formulario

Recogida y validación de datos. La lógica de validación está íntegramente en funciones puras de `@lh-ui/share`, sin dependencias de plataforma, de modo que el comportamiento es idéntico en ambas plataformas.

## Uso básico

```vue
<template>
  <lh-form :model="form" :rules="rules" ref="formRef" label-width="80">
    <lh-form-item label="Nombre de usuario" prop="name">
      <lh-input v-model="form.name" placeholder="Escribe el nombre de usuario" />
    </lh-form-item>
    <lh-form-item label="Correo electrónico" prop="email">
      <lh-input v-model="form.email" placeholder="Escribe el correo electrónico" />
    </lh-form-item>
    <lh-button type="primary" @click="onSubmit">Enviar</lh-button>
  </lh-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({ name: '', email: '' })
const formRef = ref()

const rules = {
  name: [{ required: true, message: 'Escribe el nombre de usuario', trigger: 'blur' }],
  email: [{ required: true, message: 'Escribe el correo electrónico', trigger: 'blur' }],
}

const onSubmit = async () => {
  const ok = await formRef.value.validate()
  if (ok) {
    // Validación superada: enviar
  }
}
</script>
```

## Form Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| model | Objeto de datos del formulario (obligatorio) | `Record<string, unknown>` | — |
| rules | Reglas de validación (las claves son los nombres de las props) | `Record<string, LhFormRule[]>` | — |
| labelPosition | Posición de la etiqueta | `'left' \| 'right' \| 'top'` | `'right'` |
| labelWidth | Ancho de la etiqueta | `string \| number` | — |
| inline | Disposición en línea | `boolean` | `false` |
| customClass | Clase personalizada | `string` | — |
| sx | Props rápidas de disposición | `LhSxProps` | — |

## Form Methods (se llaman mediante ref)

::: warning Las llamadas a ref deben hacerse después de onReady
En la fase `onLoad` los subcomponentes aún no se han terminado de crear y `formRef.value` es undefined.
El evento de clic del botón de envío se produce, naturalmente, después de `onReady`, de modo que su uso directo no presenta problemas;
si necesitas llamarlo durante la inicialización de la página, colócalo dentro de `onReady`.
:::

| Método | Descripción | Devuelve |
| --- | --- | --- |
| validate | Valida todos los campos | `Promise<boolean>` (true cuando todos superan la validación) |
| validateField | Valida un único campo | `Promise<boolean>` |

## FormItem Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| prop | Nombre clave del campo (corresponde a la clave de model y a la de rules) | `string` | — |
| label | Texto de la etiqueta | `string` | — |
| required | Marca de obligatorio (muestra el asterisco; la validación real la deciden las rules) | `boolean` | `false` |
| rules | Reglas exclusivas de este campo (se fusionan con las rules de Form) | `LhFormRule[]>` | — |
| customClass | Clase personalizada | `string` | — |

::: tip Diferencias frente a la versión Vue3
- Disparo de la validación: los controles del Mini Programa no tienen semántica change, de modo que cada control de formulario mapea los eventos blur / input como disparadores de la validación.
- Envío del formulario: la semántica de formulario del Mini Programa es distinta; `validate` devuelve un `Promise<boolean>` para el envío manual, sin la intercepción del evento `submit` de la versión web.
:::
