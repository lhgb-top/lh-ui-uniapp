# Bouton radio

::: tip Côté Mini Programme, dessiné en view
Afin de ne pas utiliser le composant radio natif (le style du MP est incontrôlable), le point est dessiné en view.
:::

## Utilisation de base

```vue
<template>
  <lh-radio-group v-model="value">
    <lh-radio value="a" label="Option 1" />
    <lh-radio value="b" label="Option 2" />
    <lh-radio value="c" label="Option 3" disabled />
  </lh-radio-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref('a')
</script>
```

## Radio Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| modelValue (v-model) | Coché ou non | `unknown` | — |
| value | Valeur de cet élément | `unknown` | — |
| label | Texte | `string` | — |
| disabled | Désactivé | `boolean` | `false` |
| name | name natif | `string` | — |
| size | Taille | `'small' \| 'medium' \| 'large'` | — |
| customClass | Nom de classe personnalisé | `string` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## RadioGroup Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| modelValue (v-model) | Valeur sélectionnée | `unknown` | — |
| disabled | Désactiver tous les éléments enfants | `boolean` | `false` |
| name | name natif | `string` | — |
| size | Taille (transmise aux éléments enfants) | `'small' \| 'medium' \| 'large'` | — |

## Events

| Événement | Description | Paramètre de callback |
| --- | --- | --- |
| update:modelValue | Changement de valeur | `(value)` |
| change | Changement de valeur | `(value)` |
