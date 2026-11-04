# Pasos (Steps)

Guía al usuario a través de un flujo de tareas. Soporta disposición horizontal / vertical, iconos, descripciones y navegación por clic. Es un componente puramente visual y de estado, totalmente utilizable tanto en H5 como en el Mini Programa de WeChat.

## Uso básico

`current` indica el índice del paso actual (base 0, con vínculo bidireccional mediante `v-model:current`). Los pasos anteriores son `finish`, el paso en sí es `process` y los posteriores son `wait`.

```vue
<template>
  <lh-steps :current="current">
    <lh-step
      title="Moler la tinta"
      description="La tinta en cinco tonos"
    />
    <lh-step
      title="Boceto"
      description="Componer el diseño"
    />
    <lh-step
      title="Aplicar la tinta"
      description="El trazo como hueso"
    />
    <lh-step
      title="Inscripción"
      description="El toque final"
    />
  </lh-steps>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const current = ref(1)
</script>
```

## Pasos verticales

`direction="vertical"` cambia a una disposición vertical (controlada por CSS, sin diferencias de plataforma).

```vue
<template>
  <lh-steps
    :current="1"
    direction="vertical"
  >
    <lh-step
      title="Pedido realizado"
      description="2026-10-01 10:00"
    />
    <lh-step
      title="Pago recibido"
      description="2026-10-01 10:05"
    />
    <lh-step
      title="Enviado"
      description="Entrega estimada 10-03"
    />
    <lh-step title="Confirmar recepción" />
  </lh-steps>
</template>
```

## Con iconos

Pasa `icon` a `lh-step` para usar la fuente de iconos integrada (consulta la documentación de Icon para los nombres). Si no se pasa, `finish` muestra una marca, `error` una cruz y los demás muestran su número ordinal.

```vue
<template>
  <lh-steps :current="1">
    <lh-step
      title="Registro"
      icon="user"
    />
    <lh-step
      title="Verificación"
      icon="email"
    />
    <lh-step
      title="Listo"
      icon="check"
    />
  </lh-steps>
</template>
```

El slot `icon` reemplaza por completo el valor por defecto (admite gráficos o texto personalizados):

```vue
<template>
  <lh-steps :current="2">
    <lh-step title="Paso uno">
      <template #icon>
        <text class="step-badge">I</text>
      </template>
    </lh-step>
    <lh-step title="Paso dos">
      <template #icon>
        <text class="step-badge">II</text>
      </template>
    </lh-step>
    <lh-step title="Paso tres">
      <template #icon>
        <text class="step-badge">III</text>
      </template>
    </lh-step>
  </lh-steps>
</template>
```

## Navegación por clic

Con `clickable`, los pasos con estado `finish` o `process` muestran una cabeza clicable; al hacer clic emiten `update:current` (v-model) y `change`. Los pasos posteriores en estado `wait` no son navegables.

```vue
<template>
  <lh-steps
    v-model:current="active"
    clickable
  >
    <lh-step title="Paso uno" />
    <lh-step title="Paso dos" />
    <lh-step title="Paso tres" />
  </lh-steps>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref(1)
</script>
```

## Invalidación global del estado

`status` sobrescribe el estado derivado de todos los pasos (`wait` / `process` / `finish` / `error`) para presentaciones personalizadas.

```vue
<template>
  <lh-steps
    :current="2"
    status="error"
  >
    <lh-step title="Paso uno" />
    <lh-step title="Paso dos" />
    <lh-step title="Paso tres" />
  </lh-steps>
</template>
```

## Props de Steps

| Prop | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| current | Índice del paso actual (v-model:current, base 0) | `number` | `0` |
| direction | Dirección: `'horizontal'` / `'vertical'` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| clickable | Si los pasos son clicables (solo los finalizados / en curso) | `boolean` | `false` |
| status | Sobrescribe el estado de todos los pasos (presentaciones personalizadas) | `'wait' \| 'process' \| 'finish' \| 'error'` | — |
| customClass | Clase personalizada (se reenvía al nodo raíz) | `string` | — |
| sx | Props rápidas de layout | `LhSxProps` | — |

## Props de Step

| Prop | Descripción | Tipo | Por defecto |
| --- | --- | --- | --- |
| title | Título del paso (también admite el slot title) | `string` | `''` |
| description | Descripción del paso (también admite el slot description) | `string` | `''` |
| icon | Nombre del icono personalizado (sin él, finish/error usan marca/cruz y los demás muestran el ordinal) | `LhIconName` | — |
| customClass | Clase personalizada (se reenvía al nodo raíz del elemento) | `string` | — |

## Eventos

| Evento | Descripción | Argumentos |
| --- | --- | --- |
| update:current | Cambió el paso actual (v-model:current) | `(index: number)` |
| change | Navegación al hacer clic en un paso clicable | `(index: number)` |

## Slots

| Slot | Descripción |
| --- | --- |
| Steps default | Nodos de pasos (solo se recoge `lh-step`) |
| Step icon | Contenido del círculo (sobrescribe la prop icon y el ordinal por defecto) |
| Step title | Título (sobrescribe la prop title) |
| Step description | Descripción (sobrescribe la prop description) |

## Diferencias de plataforma

- **Componente puramente visual y de estado, totalmente utilizable en H5 y en el Mini Programa de WeChat**; la disposición horizontal / vertical la controla el CSS y es idéntica en ambas plataformas.
- `<ol>/<li>` se sustituyen por `<view>` (WXSS prohíbe selectores de etiqueta); las cabezas clicables usan `view` + `role="button"` (el `<button>` del Mini Programa trae estilos nativos que no se pueden reiniciar). Los nombres accesibles provienen de las claves `steps.step` / `steps.finish` / `steps.error` de los locales de share (nueve idiomas incluidos, sin copias en este repositorio).
- **El mecanismo de "el último paso no dibuja conector" difiere por plataforma**: en la fuente de share los conectores (horizontal `::after` / vertical `::before`) dependen del selector estructural `:not(:last-child)` para omitir el último elemento; WXSS no soporta `:not()`, por lo que la compilación lo elimina (todos los elementos dibujan conector) y ocultar el último / el final de línea se delega a la clase `--line-last`:
  - Horizontal: la lógica de medición de ajuste de línea es la misma que en la versión Vue 3 (`getStepsLineLastIndices`), pero la medición pasa por el adaptador `getLhRect` (H5 usa consultas al document, MP usa el asíncrono `createSelectorQuery`, que debe ejecutarse después de onMounted).
  - Vertical: no hay ajuste de línea, por lo que se marca directamente el último global, y el SFC del componente añade una regla adaptadora de uni-app para ocultar `--line-last::before` (la fuente de share no tiene esa regla).
- **Recalcular el ajuste al cambiar el ancho del contenedor es solo para H5**: H5 usa `ResizeObserver`; MP no tiene esa API, y la inserción/eliminación de pasos y el cambio de dirección sí recalculan, pero los cambios de tamaño dinámicos requieren volver a entrar en la página (una degradación aceptada que mantiene el bundle de MP libre de código muerto).
- **Decisión de portado (alineada con la versión Vue 3, sin APIs inventadas)**: en el momento del portado la fuente de verdad de plus no ofrecía el modo `simple`, los estados personalizados `process-status` / `finish-status`, el espaciado `space` ni APIs similares (las props de la fuente son `current` / `direction` / `clickable` / `status` / `themeVars` / `sx`), por lo que esta biblioteca tampoco las ofrece. Tampoco se incluye `themeVars` (la lista `componentTheme` del ConfigProvider de este repositorio aún no incluye steps). Se añadirán cuando la fuente de verdad las incorpore.
