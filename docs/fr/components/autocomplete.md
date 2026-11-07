# Autocomplete

Un champ de suggestions qui filtre au fur et à mesure de la frappe : une zone de texte (combobox) plus une liste déroulante de suggestions (listbox).

## Utilisation de base

```vue
<script setup>
import { ref } from 'vue'
const value = ref('')
const options = [
  { label: 'Encre' },
  { label: 'Espace blanc' },
  { label: 'Sceau', value: 'seal' },
]
</script>

<template>
  <lh-autocomplete v-model="value" :options="options" />
</template>
```

Lorsqu'une option ne porte qu'un `label`, la valeur soumise est le label lui-même ; ajoutez un `value` lorsqu'un identifiant lisible par machine est nécessaire. Les options désactivées restent dans la liste, grisées et non sélectionnables.

## Filtrage

Par défaut, les suggestions sont filtrées selon que le `label` contient la chaîne de requête (sans distinction de casse, et les espaces de début et de fin ne participent pas à la correspondance) :

```vue
<template>
  <lh-autocomplete v-model="value" :options="options" case-sensitive />
</template>
```

`case-sensitive` active la correspondance sensible à la casse ; passez `trim` à `false` pour conserver les espaces dans la correspondance.

## Callback de sélection

```vue
<template>
  <lh-autocomplete v-model="value" :options="options" @select="onSelect" />
</template>
```

L'événement `select` reçoit la valeur soumise et l'objet d'option d'origine.

## Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| modelValue | Valeur de saisie (v-model) | `string` | `''` |
| options | Options de suggestion | `LhAutocompleteOption[]` | `[]` |
| caseSensitive | Correspondance sensible à la casse | `boolean` | `false` |
| trim | Retirer les espaces en début et fin de la requête avant la correspondance | `boolean` | `true` |
| placeholder | Indicateur de remplissage | `string` | — |
| placeholderStyle | Style de l'indicateur de remplissage (remplace `::placeholder`) | `string` | — |
| disabled | Désactiver le composant | `boolean` | `false` |
| openOnFocus | Ouvrir le panneau de suggestions au focus | `boolean` | `true` |
| ariaLabel | Nom accessible | `string` | — |
| customClass | Classe personnalisée | `string` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| empty | État vide lorsqu'aucune correspondance n'est trouvée (le texte par défaut provient du message de locale autocomplete.noMatch) |

## Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| update:modelValue | Renvoie la valeur après la saisie ou la sélection | `(value: string)` |
| change | La valeur de saisie a changé | `(value: string)` |
| select | Une suggestion a été sélectionnée | `(value: string \| number, option: LhAutocompleteOption)` |

## Méthodes (defineExpose)

| Méthode | Description |
| --- | --- |
| open / close | Ouvrir / fermer le panneau manuellement |
| isOpen | État ouvert/fermé actuel (en lecture seule) |

## Différences de plateforme

| Capacité | H5 | Mini Programme |
| --- | --- | --- |
| Positionnement de la liste déroulante | root-portal + mesure à deux images (même principe que select) | Alipay utilise root-portal ou un fixed intra-page selon la version de la bibliothèque de base ; Douyin utilise un fixed intra-page |
| Navigation au clavier / Esc | Les flèches déplacent le surlignage, Entrée sélectionne, Esc ferme | Aucun événement clavier ; sélection uniquement par clic |
| Surlignage au survol | Oui | Non (le clic sélectionne directement) |
| openOnFocus | S'ouvre au focus | S'ouvre au focus |
