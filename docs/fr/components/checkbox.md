# Case à cocher

::: tip Côté Mini Programme, dessiné en view
Afin de ne pas utiliser le composant checkbox natif (le style du MP est incontrôlable), la case à cocher est dessinée en view + une icône lh-icon, pour garantir une cohérence visuelle avec les autres bibliothèques de la famille.
:::

## Utilisation de base

```vue
<template>
  <lh-checkbox v-model="checked" label="Accepter les conditions" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const checked = ref(false)
</script>
```

## Groupe de cases à cocher

```vue
<template>
  <lh-checkbox-group v-model="values">
    <lh-checkbox value="a" label="Option 1" />
    <lh-checkbox value="b" label="Option 2" />
    <lh-checkbox value="c" label="Option 3" disabled />
  </lh-checkbox-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const values = ref(['a'])
</script>
```

## État partiellement coché

```vue
<lh-checkbox v-model="checked" indeterminate label="Tout sélectionner (partiellement coché)" />
```

## Checkbox Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| modelValue (v-model) | Coché ou non | `boolean` | `false` |
| value | Valeur d'identification dans le groupe | `unknown` | — |
| label | Texte | `string` | — |
| disabled | Désactivé | `boolean` | `false` |
| indeterminate | État partiellement coché | `boolean` | `false` |
| name | name natif | `string` | — |
| size | Taille | `'small' \| 'medium' \| 'large'` | — |
| customClass | Nom de classe personnalisé | `string` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## CheckboxGroup Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| modelValue (v-model) | Tableau des valeurs cochées | `unknown[]` | `[]` |
| disabled | Désactiver tous les éléments enfants | `boolean` | `false` |
| name | name natif | `string` | — |
| size | Taille (transmise aux éléments enfants) | `'small' \| 'medium' \| 'large'` | — |

## Events

| Événement | Description | Paramètre de callback |
| --- | --- | --- |
| update:modelValue | Changement de valeur | `(value)` |
| change | Changement de valeur | `(value)` |
