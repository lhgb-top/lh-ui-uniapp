# Segmented

Basculement d'options mutuellement exclusives, courant dans les scénarios de changement de vue. Piloté par les données : les options sont fournies directement sous forme de tableau `options`, sans assembler de composants enfants à la main.

## Utilisation de base

`options` accepte la forme abrégée par chaîne ; `modelValue` (`v-model`) est la valeur actuellement sélectionnée.

```vue
<template>
  <lh-segmented v-model="view" :options="['Liste', 'Carte', 'Tableau']" />
</template>

<script setup>
import { ref } from 'vue'
const view = ref('Liste')
</script>
```

## Options sous forme d'objets

La forme objet fournit `label` / `value`, adaptée aux cas où le texte affiché diffère de la valeur.

```vue
<template>
  <lh-segmented
    v-model="mode"
    :options="[
      { label: 'Jour', value: 'day' },
      { label: 'Semaine', value: 'week' },
      { label: 'Mois', value: 'month' },
    ]"
  />
</template>

<script setup>
import { ref } from 'vue'
const mode = ref('day')
</script>
```

## Options désactivées et désactivation du groupe entier

Un objet d'option avec `disabled: true` ne peut pas être sélectionné ; le `disabled` au niveau du composant désactive l'ensemble du contrôle segmenté.

```vue
<template>
  <lh-segmented
    v-model="seg"
    :options="[
      { label: 'Début du printemps', value: 'lichun' },
      { label: 'Eau de pluie', value: 'yushui' },
      { label: 'Éveil des insectes', value: 'jingzhe', disabled: true },
    ]"
  />
  <lh-segmented v-model="all" disabled :options="['A', 'B', 'C']" />
</template>

<script setup>
import { ref } from 'vue'
const seg = ref('lichun')
const all = ref('A')
</script>
```

## Largeur de bloc

`block` fait en sorte que le contrôle segmenté remplisse son conteneur et que les options se partagent la largeur à parts égales (courant pour les barres de changement de vue).

```vue
<template>
  <lh-segmented v-model="block" block :options="['Shi', 'Ci', 'Qu', 'Fu']" />
</template>

<script setup>
import { ref } from 'vue'
const block = ref('Shi')
</script>
```

## Props

| Propriété | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| modelValue (v-model) | Valeur actuelle (contrôlée, à utiliser avec l'événement `update:modelValue`) | `string \| number` | — |
| options | Options (forme abrégée par chaîne ou objets `{ label, value, disabled }`) | `[LhSegmentedInput](#notes-sur-les-types)[]` | — |
| disabled | Désactiver tout le groupe | `boolean` | `false` |
| block | Remplir le conteneur (les options se partagent la largeur) | `boolean` | `false` |
| customClass | Nom de classe personnalisé (transmis au nœud racine) | `string` | — |
| sx | Propriétés rapides de mise en page | `LhSxProps` | — |

### Notes sur les types

```ts
/** Type de la valeur d'une option */
type LhSegmentedValue = string | number

/** Forme de l'objet d'option */
interface LhSegmentedOption {
  label: string
  value: LhSegmentedValue
  disabled?: boolean
}

/** Option en entrée (forme abrégée par chaîne ou objet) */
type LhSegmentedInput = LhSegmentedValue | LhSegmentedOption
```

## Events

| Nom d'événement | Description | Paramètres de rappel |
| --- | --- | --- |
| update:modelValue | Émis lorsque la sélection change, à utiliser avec v-model | `(value: string \| number)` |
| change | Émis lorsque la sélection change (clic et touches fléchées) | `(value: string \| number)` |

## Différences entre plateformes

- **Interaction tactile dessinée avec view, disponible sur toutes les plateformes** : les `<div>` + `<button>` de la version Vue 3 sont remplacés par `<view>` (WXSS interdit les sélecteurs de balise, les styles passent par les classes) ; le changement de sélection est déclenché par `@click` et se comporte de manière identique sur H5 et le Mini Programme WeChat, sans aucune dépendance à une API de plateforme.
- **Le curseur de sélection est une transition CSS pure** : la couleur de fond / l'ombre de l'option sélectionnée est pilotée par le changement de classe, et WXSS prend en charge les `transition` simples, donc les deux plateformes bénéficient du fondu ; **aucune dépendance à `transitionend`** (cet événement n'est pas fiable sur le Mini Programme — les composants animés de ce dépôt, comme message / loading, alignent leurs durées avec setTimeout, tandis que le contrôle segmenté n'a même pas besoin d'orchestration JS : le CSS pur suffit, sans charge de synchronisation).
- **La navigation au clavier (flèches) est réservée à H5** : le roving tabindex (les flèches déplacent la sélection, en bouclant aux extrémités et en sautant les options désactivées, en réutilisant `getNextListIndex` / `getRovingTabIndex` du core de `@lh-ui/share`) n'a pas d'événements clavier sur le Mini Programme ; le gestionnaire `@keydown` du SFC est protégé par compilation conditionnelle et n'est jamais appelé dans le bundle MP — sur MP, seule la sélection tactile est possible.
- **L'apparence des options désactivées s'appuie sur un repli par classe** : les styles de désactivation de la source de share sont écrits sur la pseudo-classe `&:disabled` (qui ne correspond qu'aux éléments button), et view n'a pas cette pseudo-classe ; le composant ajoute donc une règle `lh-segmented__option--disabled` en ligne dans le SFC avec le même jeton (`--lh-disabled-text-color`), suivant le précédent de repli en ligne de lh-spinner / lh-empty (elle ne fait pas partie de la sortie purifiée).
- **Les attributs d'accessibilité sont liés un par un** : le contrat de `role="radiogroup"` / `role="radio"` + `aria-checked` / `aria-disabled` reste décidé par `getSegmentedAria` / `getSegmentedItemAria` de share ; comme le compilateur de templates du Mini Programme ne prend pas en charge `v-bind` d'objet, la couche de colle aplatit le paquet d'attributs en liaisons explicites attribut par attribut.
- **Conclusion du portage** : Segmented est un composant pur de bascule, sans mesure, sans superposition et sans dépendance au document ; la normalisation des options, les noms de classes et les attributs d'accessibilité sont tous produits par les fonctions pures du core de `@lh-ui/share`, et ce dépôt ne fait qu'écrire la colle réactive. L'API est strictement identique à la version Vue 3 (`modelValue` / `options` / `disabled` / `block` / `sx`).
