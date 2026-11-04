# Transfer (liste de transfert)

Liste à deux panneaux avec déplacement via cases à cocher. Le partitionnement des données, le
filtrage, la sélection globale et la logique de déplacement sont entièrement consommés depuis
les fonctions pures du core de `@lh-ui/share` (`partitionTransferData` / `filterTransferItems` /
`toggleTransferCheckAll` / `moveTransferKeys`, entre autres) ; la couche composant ne gère que
le rendu, les événements et la navigation clavier. Les deux panneau sont des `role="listbox"`
(patron listbox d'APG).

## Utilisation de base

```vue
<template>
  <lh-transfer v-model="source" :data="items" @change="onChange" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTransferItem } from '@lh-ui/share/core/transfer'

const source = ref<Array<string | number>>(['a'])
const items: LhTransferItem[] = [
  { key: 'a', label: 'A' },
  { key: 'b', label: 'B' },
  { key: 'c', label: 'C', disabled: true },
  { key: 'd', label: 'D' },
]

function onChange(keys: Array<string | number>, direction: 'left-to-right' | 'right-to-left') {
  console.log(keys, direction)
}
</script>
```

`v-model` porte la liste des clés de gauche (source) : les clés présentes dans `modelValue`
sont affichées dans la colonne de gauche, les autres à droite. Cochez un élément, appuyez sur
les boutons › / ‹ du milieu pour le déplacer : `update:modelValue` et `change` (avec la
direction `'left-to-right'` / `'right-to-left'`) se déclenchent alors, et l'ensemble des cases
cochées est videé après chaque déplacement.

Chaque panneau embarque un champ de recherche en haut (toujours actif, comme la version Vue3)
qui filre sans tenir compte de la casse sur le libellé ; l'en-tête du panneau affiche le compteur
« quantité du côté / total » ainsi qu'une case de sélection globale (l'état partiel est porté par
`indeterminate`).

`data` est un `LhTransferItem[]` : `key` est unique, `label` le texte affiché (retombe sur la
`key` s'il manque) et `disabled` désactive l'élément (non cochable, exclu de la sélection
globale, non déplaçable).

## Désactivation

`disabled` désactive l'ensemble du composant : cocher, sélectionner tout, rechercher et déplacer
sont intégralement bloqués.

```vue
<template>
  <lh-transfer v-model="source" :data="items" disabled />
</template>
```

## API

### Props

| Propriété | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| data | Jeu de données complet | `LhTransferItem[]` | — |
| modelValue | Liste des clés de gauche (source, contrôlée via v-model) | `Array<string \| number>` | `[]` |
| disabled | Désactiver | `boolean` | `false` |
| sx | props de mise en page rapide sx | `LhSxProps` | — |

### Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| update:modelValue | La liste des clés de gauche (source) a changé (pour v-model) | `(keys: Array<string \| number>)` |
| change | Déclenché à la fin d'un déplacement | `(keys: Array<string \| number>, direction: 'left-to-right' \| 'right-to-left')` |

### LhTransferItem

| Champ | Description | Type |
| --- | --- | --- |
| key | Clé unique | `string \| number` |
| label | Texte affiché (retombe sur la key s'il manque) | `string` |
| disabled | Désactivé (non cochable / exclu de la sélection globale / non déplaçable) | `boolean` |

### Accessibilité

- Les deux panneaux sont des `role="listbox"` + `aria-multiselectable` ; les éléments sont des
  `role="option"` avec `aria-selected` / `aria-disabled`
- Chaque panneau dispose de son propre champ de recherche avec `aria-label` ; les boutons de
  déplacement portent également un `aria-label` (« Déplacer à droite » / « Déplacer à gauche »)
- La case de sélection globale porte l'état partiel via `indeterminate` ; les éléments
  désactivés sont supprimés partout (coche, sélection globale, déplacement)

::: tip Différences de plateforme (différences avec la version Vue3)
- **L'étendue de l'API reste strictement alignée sur la source Vue3** : seuls ce que la
  version Vue3 propose est fourni ici — `data` / `modelValue` / `disabled` / `sx`. Les
  fonctionnalités que d'autres bibliothèques proposent couramment mais que la source Vue3
  n'a pas — `titles` (titres des panneaux), `filterable` (un interrupteur de recherche),
  `props` (noms de champs personnalisés), `left/right-default-checked` (clés cochées par
  défaut) — n'ont volontairement pas été ajoutées ; les titres des panneaux passent par les
  clés de locale de share `transfer.sourceTitle` / `transfer.targetTitle` (disponibles en
  dix langues) et le champ de recherche conserve la forme toujours active de la version
  Vue3 (sans interrupteur).
- **Les deux listes sont portées par un scroll-view** : les listes `<ul>` / `<li>` de la
  version Vue3 deviennent ici `<scroll-view scroll-y>` + `<view>` (sur le Mini Programme, un
  `view` ne peut pas déborder de façon fiable), avec un comportement identique sur H5 et le
  Mini Programme WeChat ; les styles de liste proviennent toujours de
  `.lh-transfer-panel__list` de share.
- **Le déplacement par boutons fonctionne partout** : les boutons › / ‹ du milieu sont le
  `<button>` intégré d'uni, cliquables aussi bien sur H5 que sur le Mini Programme ; aucune
  différence de plateforme ici, et l'état désactivé est porté par l'attribut `disabled`.
- **La navigation clavier est réservée à H5** : les touches du patron listbox d'APG — ↑/↓ dans
  la liste filtrée (en sautant les désactivés, sans bouclage), Enter / Space pour cocher
  l'élément ayant le focus, ←/→ pour déplacer le focus entre les panneaux, Escape pour le
  réinitialiser — ne fonctionnent que sur H5 ; le Mini Programme n'a pas d'événements clavier
  et tout ce bloc est retiré par compilation conditionnelle (aucun code mort dans le paquet
  MP), et le roving tabindex n'est produit que sur H5.
- **Les cases à cocher sont dessinées à la main** : la case de sélection globale et celles des
  éléments n'utilisent pas de `<input type="checkbox">` natif (son style n'est pas maîtrisable
  sur le Mini Programme) ; elles utilisent le `lh-checkbox` de ce paquet (dessiné en view +
  lh-icon). L'état reste écrit par le composant de manière contrôlée, la sémantique est
  inchangée.
:::
