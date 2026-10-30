# Instalación

## Dependencias

- `@lh-ui/share` se instala automáticamente (la única dependencia en tiempo de ejecución de esta biblioteca).
- Un proyecto uni-app con Vue3 (`@dcloudio/uni-app` 3.x).
- El Mini Programa de WeChat requiere **base library ≥ 2.25.2** (root-portal); las versiones anteriores degradan a una alternativa `fixed` dentro de la página.

## Opción 1: importación bajo demanda con easycom (recomendada)

Tras la instalación, añade una regla easycom a `pages.json`:

```json
{
  "easycom": {
    "autoscan": false,
    "custom": {
      "^lh-(.*)": "@lh-ui/uniapp/src/components/lh-$1/lh-$1.vue"
    }
  }
}
```

Después basta con escribir las etiquetas directamente en las plantillas, **sin necesidad de import ni de registro**:

```vue
<template>
  <lh-button type="primary" @click="onTap">Botón</lh-button>
</template>
```

::: warning La configuración easycom no se aplica de inmediato
Por motivos de rendimiento de compilación, uni-app **no recompila al cambiar la configuración easycom de `pages.json`**. Tras editar la regla, modifica cualquier página (o reinicia el dev server) para que surta efecto. Es el comportamiento existente de uni-app, no un problema de esta biblioteca.
:::

## Opción 2: registro completo

Cuando no se usa easycom (por ejemplo, en un proyecto H5 que quiere importarlo todo), se emplea `app.use`:

```ts
// main.ts
import { createSSRApp } from 'vue'
import lhUiUniapp from '@lh-ui/uniapp'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.use(lhUiUniapp)
  return { app }
}
```

## Importar los estilos

**En ambos enfoques hay que importar dos artefactos CSS** (sin dependencias de sass por parte de quien la usa; los estilos ya se sanitizan en tiempo de compilación a un CSS autónomo):

```ts
// main.ts
import '@lh-ui/uniapp/src/theme/index.css' // Variables de tema (page { --lh-* } + page.dark para el modo oscuro)
import '@lh-ui/uniapp/src/icon/iconfont.css' // Fuente de iconos (dependencia del componente lh-icon)
```

::: tip Por qué artefactos en tiempo de compilación y no fuentes scss
La opción `sass loadPaths` de un proyecto uni-app no incluye `node_modules`, por lo que los bare specifiers como `@use '@lh-ui/share/...'` no se pueden resolver y una importación directa fallaría al compilar. Por eso esta biblioteca genera un CSS autónomo en tiempo de compilación y los SFC de los componentes lo importan mediante `<style src="./style.css">`. Esto también significa que **quien la usa no necesita instalar sass**.
:::

## Los servicios imperativos necesitan un punto de montaje

Message / Loading no pueden crear DOM mediante JS en el Mini Programa, así que emplean el **patrón de punto de montaje**. Coloca un componente de punto de montaje en la página (o en el componente raíz) donde los vayas a usar:

```vue
<template>
  <lh-config-provider :theme="theme">
    <view class="content"><!-- contenido de la página --></view>

    <!-- punto de montaje de los servicios imperativos -->
    <lh-message />
    <lh-loading />
  </lh-config-provider>
</template>

<script setup lang="ts">
import { useLhMessage } from '@lh-ui/uniapp'

const { success } = useLhMessage()
const onTap = () => success('Operación completada')
</script>
```

::: danger La ausencia de punto de montaje genera una advertencia
Si se llama a `useLhMessage()` pero la página no tiene `<lh-message />`, en desarrollo se emite una advertencia mediante `console.error` y **no se degrada silenciosamente**. Es una decisión deliberada: la degradación silenciosa convertiría «la llamada parece funcionar pero no ocurre nada» en un bug oculto.
:::

## TypeScript

Esta biblioteca incluye sus propios tipos; las Props y los eventos de los componentes tienen inferencia de tipos completa. Con la forma easycom, los tipos de las etiquetas dentro de la plantilla los proporciona el sistema de tipos de componentes de `uni-app` (si el proyecto no tiene configurados tipos globales de componentes, basta con anotar explícitamente con `LhXxxProps`).
