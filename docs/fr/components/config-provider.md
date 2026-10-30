# ConfigProvider (configuration globale)

Composant de configuration globale : fournit la taille, la langue, le mode de thème et les variables de thème aux composants descendants.

::: tip Implémentation du mode sombre côté Mini Programme
Sur le web (plus), le basculement du mode sombre agit sur `document.documentElement` ; le Mini Programme n'a pas de document. Dans cette bibliothèque, le mode sombre est réalisé en **ajoutant la classe `dark` au nœud enveloppant** — dans les styles sanitisés, le sélecteur du bloc sombre est `page.dark, .dark`, donc la portée du mode sombre suit la zone enveloppée par ConfigProvider.
:::

## Utilisation de base

```vue
<template>
  <lh-config-provider :size="size" :locale="locale" :theme="theme" :theme-vars="themeVars">
    <view class="app">
      <lh-button type="primary">Bouton</lh-button>
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

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| size | Taille globale | `'small' \| 'medium' \| 'large'` | — |
| locale | Langue globale | `'zh-CN' \| 'en-US'` | — |
| theme | Mode de thème (spécifique au côté uni-app) | `'light' \| 'dark'` | `'light'` |
| themeVars | Variables de thème globales (le préfixe `--lh-` est ajouté automatiquement aux clés) | `Record<string, string>` | — |
| componentTheme | Variables de thème configurées par composant, prioritaires sur les themeVars globaux | `Partial<Record<LhThemeableComponent, Record<string, string>>>` | — |

### Clés prises en charge par themeVars

- Couleurs de thème : `primary-color` / `success-color` / `warning-color` / `danger-color` / `info-color`
- Couleurs style chinois (国风) : `gold-color` / `vermilion-color` / `jade-color`
- Couleurs neutres : `bg-color` / `text-color` / `border-color`
- Motifs : `bg-pattern` (par ex. `var(--lh-pattern-willow)`) / `bg-pattern-opacity` / `bg-pattern-color`
- Ornement : `decoration-color`

### Priorité

Les props du composant lui-même > `componentTheme[nom du composant]` > `themeVars` globaux.
