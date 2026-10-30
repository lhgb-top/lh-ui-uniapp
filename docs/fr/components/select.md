# Sélecteur

## Utilisation de base

```vue
<template>
  <lh-select v-model="value" :options="options" placeholder="Sélectionner" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref()
const options = [
  { label: 'Option 1', value: 'a' },
  { label: 'Option 2', value: 'b' },
  { label: 'Option désactivée', value: 'c', disabled: true },
]
</script>
```

## Vidable et filtrable

```vue
<template>
  <lh-select v-model="value" :options="options" clearable />
  <lh-select v-model="value" :options="options" filterable placement="bottom" />
</template>
```

## Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| modelValue (v-model) | Valeur liée | `unknown` | — |
| options | Liste des options | `LhSelectOption[]` | — |
| size | Taille | `'small' \| 'medium' \| 'large'` | — |
| disabled | Désactivé | `boolean` | `false` |
| clearable | Vidable | `boolean` | `false` |
| placeholder | Texte de l'espace réservé | `string` | — |
| filterable | Filtrable (côté MP, un champ de saisie est fourni dans le calque) | `boolean` | `false` |
| placement | Position du calque (12 positions) | `LhPlacement` | `'bottom'` |
| customClass | Nom de classe personnalisé | `string` | — |
| themeVars | Variables de thème de niveau composant | `Record<string, string>` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

### LhSelectOption

| Prop | Description | Type |
| --- | --- | --- |
| label | Texte affiché | `string` |
| value | Valeur | `unknown` |
| disabled | Désactivé | `boolean` |

## Events

| Événement | Description | Paramètre de callback |
| --- | --- | --- |
| update:modelValue | Changement de valeur | `(value)` |
| change | Changement de valeur (y compris le vidage vers `undefined`) | `(value)` |
| visible-change | Affichage / masquage du calque | `(visible: boolean)` |

::: tip Différences avec la version Vue3
- Le calque passe par `root-portal` + mesure asynchrone sur deux images (et non par un positionnement absolute).
- **La navigation clavier (haut / bas / Home / End) est uniquement disponible sur H5** : le Mini Programme n'a pas d'événements clavier, elle est supprimée à la compilation — côté MP, seuls les clics sur les options sont possibles.
- Le champ de saisie du filtrage `filterable` est, côté MP, rendu à l'intérieur du calque.
:::
