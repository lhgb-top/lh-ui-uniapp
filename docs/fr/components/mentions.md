# Mentions

Un champ de mention de membre déclenché par la saisie de `@`, avec prise en charge du filtrage, des lignes multiples et d'un callback de sélection.

## Utilisation de base

```vue
<script setup>
import { ref } from 'vue'
const value = ref('')
const members = [
  { label: 'Encre', value: 'ink' },
  { label: 'Espace blanc', value: 'blank' },
]
</script>

<template>
  <lh-mentions v-model="value" :options="members" />
</template>
```

Après avoir saisi `@`, le panneau de suggestions s'ouvre et toute saisie supplémentaire filtre par label. Ce qui est renvoyé après sélection est le `label` (un `@Encre ` lisible par un humain) ; l'identifiant lisible par machine `value` est transmis à la couche métier via l'événement `select`.

## Lignes multiples

```vue
<template>
  <lh-mentions v-model="value" :options="members" multiline />
</template>
```

`multiline` remplace l'input d'une seule ligne par un textarea.

## Caractère déclencheur

```vue
<template>
  <lh-mentions v-model="value" :options="members" prefix="#" />
</template>
```

`prefix` vaut `'@'` par défaut ; un pseudo-préfixe accolé à un caractère de mot ASCII (comme `user@` dans une adresse e-mail) ne déclenche pas la mention.

## Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| modelValue | Contenu du texte (v-model) | `string` | `''` |
| options | Membres suggérés | `LhMentionOption[]` | `[]` |
| prefix | Caractère déclencheur | `string` | `'@'` |
| placeholder | Indicateur de remplissage (par défaut, message de locale mentions.placeholder) | `string` | — |
| placeholderStyle | Style de l'indicateur de remplissage (remplace `::placeholder`) | `string` | — |
| disabled | Désactiver le composant | `boolean` | `false` |
| multiline | Textarea à lignes multiples | `boolean` | `false` |
| ariaLabel | Nom accessible | `string` | — |
| customClass | Classe personnalisée | `string` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| empty | État vide lorsqu'aucune correspondance n'est trouvée (le texte par défaut provient du message de locale mentions.noMatch) |

## Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| update:modelValue | Renvoie la valeur après la saisie ou la sélection | `(value: string)` |
| change | Le texte a changé | `(value: string)` |
| select | Une mention a été sélectionnée | `(option: LhMentionOption)` |

## Méthodes (defineExpose)

| Méthode | Description |
| --- | --- |
| updateContext | Rafraîchir manuellement le contexte du curseur |
| close | Fermer le panneau de suggestions |

## Différences de plateforme

| Capacité | H5 | Mini Programme |
| --- | --- | --- |
| Positionnement de la liste déroulante | root-portal + mesure à deux images (même principe que select) | Alipay utilise root-portal ou un fixed intra-page selon la version de la bibliothèque de base ; Douyin utilise un fixed intra-page |
| Contexte du curseur | `selectionStart` natif (la mention peut être déclenchée en plein milieu du texte) | **La position du curseur est indisponible et est approchée par la fin du texte** — déclencher une mention au milieu d'un texte déjà saisi ne fonctionne pas et dégrade en une insertion à la fin |
| Navigation au clavier / Esc | Les flèches déplacent le surlignage, Entrée sélectionne, Esc ferme | Aucun événement clavier ; sélection uniquement par clic |
| Position du curseur après sélection | Se place exactement après la mention | Après l'écriture contrôlée, le curseur se trouve à la fin |
