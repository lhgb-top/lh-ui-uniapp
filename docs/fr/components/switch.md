# Interrupteur

::: tip Côté Mini Programme, dessiné en view
Le composant switch natif a un style incontrôlable dans le Mini Programme : le curseur est dessiné en view pour garantir la cohérence visuelle.
:::

## Utilisation de base

```vue
<template>
  <lh-switch v-model="on" />
  <lh-switch v-model="on" active-text="Marche" inactive-text="Arrêt" />
  <lh-switch v-model="on" loading />
  <lh-switch v-model="on" disabled />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const on = ref(true)
</script>
```

## Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| modelValue (v-model) | Activé ou non | `boolean` | `false` |
| disabled | Désactivé | `boolean` | `false` |
| loading | Chargement | `boolean` | `false` |
| name | name natif | `string` | — |
| size | Taille | `'small' \| 'medium' \| 'large'` | — |
| activeText | Texte à l'activation | `string` | — |
| inactiveText | Texte à la désactivation | `string` | — |
| customClass | Nom de classe personnalisé | `string` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## Events

| Événement | Description | Paramètre de callback |
| --- | --- | --- |
| update:modelValue | Changement de valeur | `(value: boolean)` |
| change | Changement de valeur | `(value: boolean)` |
