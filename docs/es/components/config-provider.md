# ConfigProvider (configuración global)

Componente de configuración global: proporciona a los componentes descendientes el tamaño, el idioma, el modo de tema y las variables de tema.

::: tip La implementación del modo oscuro en el Mini Programa
En la versión web (plus) el cambio a modo oscuro se hace manipulando `document.documentElement`, pero el Mini Programa no tiene document.
En esta biblioteca el modo oscuro se implementa **añadiendo la clase `dark` al nodo contenedor**: en los estilos sanitizados, el bloque selector del modo oscuro es `page.dark, .dark`, de modo que el ámbito del modo oscuro sigue el contorno de lo que envuelve ConfigProvider.
:::

## Uso básico

```vue
<template>
  <lh-config-provider :size="size" :locale="locale" :theme="theme" :theme-vars="themeVars">
    <view class="app">
      <lh-button type="primary">Botón</lh-button>
    </view>
  </lh-config-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const size = ref<'small' | 'medium' | 'large'>('medium')
const locale = ref<'zh-CN' | 'en-US'>('zh-CN')
const theme = ref<'light' | 'dark'>('light')
const themeVars = ref({
  'primary-color': '#1677ff',
  'bg-pattern': 'var(--lh-pattern-willow)',
})
</script>
```

## Props

| Prop | Descripción | Tipo | Predeterminado |
| --- | --- | --- | --- |
| size | Tamaño global | `'small' \| 'medium' \| 'large'` | — |
| locale | Idioma global | `'zh-CN' \| 'en-US'` | — |
| theme | Modo de tema (nuevo en la versión uni-app) | `'light' \| 'dark'` | `'light'` |
| themeVars | Variables de tema globales (las claves reciben el prefijo `--lh-` automáticamente) | `Record<string, string>` | — |
| componentTheme | Variables de tema configuradas por componente; prevalecen sobre las themeVars globales | `Partial<Record<LhThemeableComponent, Record<string, string>>>` | — |

### Claves que admite themeVars

- Colores principales: `primary-color` / `success-color` / `warning-color` / `danger-color` / `info-color`
- Colores de estilo chino: `gold-color` / `vermilion-color` / `jade-color`
- Colores neutros: `bg-color` / `text-color` / `border-color`
- Patrones: `bg-pattern` (p. ej. `var(--lh-pattern-willow)`) / `bg-pattern-opacity` / `bg-pattern-color`
- Decoración: `decoration-color`

### Prioridad

Props del propio componente > `componentTheme[nombre del componente]` > `themeVars` globales.
