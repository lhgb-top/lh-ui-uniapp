# InputTag saisie d'étiquettes

Groupe d'étiquettes validées à la saisie, avec touches de déclenchement, limite, déduplication et suppression au clic.

## Utilisation de base

```vue
<script setup>
import { ref } from 'vue'
const tags = ref(['encre', 'blanc'])
</script>

<template>
  <lh-input-tag v-model="tags" placeholder="Saisir puis appuyer sur Entrée" />
</template>
```

## Touches de déclenchement

`trigger` accepte `enter` (par défaut) / `space` / `comma`. Avec `space` / `comma`, l'espace n'entre pas dans le champ.

```vue
<template>
  <lh-input-tag v-model="tags" trigger="comma" placeholder="Taper une virgule pour valider" />
</template>
```

## Limite et déduplication

```vue
<template>
  <lh-input-tag v-model="tags" :max="3" allow-duplicate />
</template>
```

Lorsque `max` est positif, il fixe la limite (au-delà, la soumission est rejetée et le champ est vidé) ; par défaut, les doublons sont rejetés (un doublon n'est pas validé).

## Lecture seule et désactivé

```vue
<template>
  <lh-input-tag v-model="tags" readonly />
  <lh-input-tag v-model="tags" disabled />
</template>
```

## Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| modelValue | Liste des étiquettes (v-model) | `string[]` | `[]` |
| trigger | Touche de validation (sur le Mini Programme : toujours la touche Terminé) | `'enter' \| 'space' \| 'comma'` | `'enter'` |
| placeholder | Indice de saisie (affiché uniquement sans étiquette) | `string` | `''` |
| placeholderStyle | Style de l'indice (remplace `::placeholder`) | `string` | — |
| max | Limite d'étiquettes (une valeur non positive signifie illimité) | `number` | `0` |
| allowDuplicate | Autorise les étiquettes en double | `boolean` | `false` |
| readonly | Lecture seule | `boolean` | `false` |
| disabled | Désactivé | `boolean` | `false` |
| ariaLabel | Nom accessible | `string` | — |
| customClass | Nom de classe personnalisé | `string` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| update:modelValue | Modification de la liste des étiquettes | `(value: string[])` |
| change | Modification de la liste des étiquettes (identique à modelValue) | `(value: string[])` |
| add | Validation d'une étiquette | `(tag: string)` |
| remove | Suppression d'une étiquette | `(tag: string)` |

## Méthodes (defineExpose)

| Méthode | Description |
| --- | --- |
| focus | Place le focus dans le champ |
| commit | Valide la saisie courante |

## Différences de plateforme

| Capacité | H5 | Mini Programme |
| --- | --- | --- |
| Touche de validation | Toutes les valeurs de `trigger` (événements clavier Entrée / Espace / Virgule) | Toujours la **touche Terminé** (`@confirm`) ; les touches `space` / `comma` sont propres à H5 |
| Suppression avec Backspace | Backspace supprime la dernière étiquette lorsque le champ est vide | Aucun événement clavier ; la suppression se fait via le **bouton ×** de chaque étiquette (disponible sur les deux plateformes) |
| Validation à la perte de focus | Oui | Oui |
| Bordure de focus | Le style de focus avec `:has()` s'applique | Pas de bordure de focus (WXSS ne prend pas en charge `:has()`) ; la saisie fonctionne normalement |
