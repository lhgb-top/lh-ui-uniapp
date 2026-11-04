# Pagination

Navigation par pages : page précédente / numéros de page / points de suspension / page suivante /
total / sélecteur de taille / saut de page. L'algorithme de rétrécissement de la fenêtre de pages
(première et dernière pages toujours visibles, pages voisines autour de la page courante, points de
suspension uniquement quand un vrai vide apparaît) est implémenté en fonction pure dans le cœur de
`@lh-ui/share`.

## Utilisation de base

`total` est le nombre d'éléments (obligatoire) ; la taille de page par défaut est 10.

```vue
<template>
  <lh-pagination :total="120" />
</template>
```

## Total et sélecteur de taille

`show-total` affiche le nombre total ; `show-size-changer` affiche le sélecteur d'éléments par page
(porté par le picker intégré côté uni).

```vue
<template>
  <lh-pagination :total="480" show-total show-size-changer />
</template>
```

## Saut de page

`show-jumper` affiche le champ de saut ; après avoir saisi un numéro de page, validez avec Entrée
(confirm) ou en perdant le focus, les valeurs hors limites étant automatiquement bornées.

```vue
<template>
  <lh-pagination :total="480" show-total show-jumper />
</template>
```

## Mode simple

`simple` replie la zone des numéros de page et n'affiche que « page courante / pages totales ».

```vue
<template>
  <lh-pagination :total="480" simple show-jumper />
</template>
```

## Utilisation contrôlée

La page courante est contrôlée avec `v-model:current`.

```vue
<template>
  <lh-pagination v-model:current="page" :total="95" />
  <text>Page courante : {{ page }}</text>
</template>

<script setup>
import { ref } from 'vue'
const page = ref(2)
</script>
```

## Taille de page et désactivation

`v-model:page-size` contrôle la taille de page et `page-sizes` personnalise les options ; si la page
courante sort des limites après un changement de taille, elle est automatiquement bornée ;
`disabled` désactive toute la pagination.

```vue
<template>
  <lh-pagination
    v-model:page-size="pageSize"
    :total="480"
    show-size-changer
    :page-sizes="[10, 20, 50, 100]"
  />
  <text>Éléments par page : {{ pageSize }}</text>
  <lh-pagination :total="480" disabled />
</template>

<script setup>
import { ref } from 'vue'
const pageSize = ref(20)
</script>
```

## Props

| Prop | Description | Type | Défaut |
| --- | --- | --- | --- |
| total | Nombre total d'éléments (obligatoire) | `number` | — |
| pageSize | Éléments par page (contrôlé avec l'événement `update:pageSize`) | `number` | `10` |
| current | Page courante (`v-model:current`) | `number` | — |
| pageSizes | Options d'éléments par page | `number[]` | `[10, 20, 30, 40]` |
| showTotal | Afficher le nombre total | `boolean` | `false` |
| showSizeChanger | Afficher le sélecteur d'éléments par page | `boolean` | `false` |
| showJumper | Afficher le champ de saut de page | `boolean` | `false` |
| simple | Mode compact | `boolean` | `false` |
| disabled | Si désactivé | `boolean` | `false` |
| sx | Propriétés rapides de mise en page | `LhSxProps` | — |

## Events

| Événement | Description | Paramètres du callback |
| --- | --- | --- |
| update:current | Émis quand la page courante change, avec `v-model:current` | `(page: number)` |
| update:pageSize | Émis quand la taille de page change, avec `v-model:page-size` | `(size: number)` |
| change | Émis quand la page courante change (numéros de page, précédente / suivante et saut le déclenchent) | `(page: number)` |
| size-change | Émis quand la taille de page change | `(size: number)` |

## Accessibilité

- Nœud racine `role="navigation"` + `aria-label="pagination"`
- Le bouton de la page courante reçoit automatiquement `aria-current="page"` ; chaque bouton de page
  et les boutons précédente / suivante portent leur propre `aria-label` (clés du pack de langue
  `pagination.page` / `prev` / `next`) ; les simples symboles « ‹ » « › » sont masqués via
  `aria-hidden`
- Les boutons de page et de navigation sont en `role="button"` et émettent `aria-disabled` quand ils
  sont désactivés
- Les points de suspension sont un élément purement décoratif en `aria-hidden`, sans impact sur la
  lecture

## Différences de plateforme

- **Interaction tactile dessinée avec view, disponible sur toutes les plateformes** : les `<nav>` /
  `<button>` / `<ul>` / `<span>` de la version Vue 3 sont remplacés par `<view>` / `<text>`
  (WXSS interdit les sélecteurs de balises, les styles passent par les classes) ; les numéros de
  page et la navigation se déclenchent via `@click` et se comportent à l'identique sur H5 et sur le
  Mini-Programme WeChat, sans dépendance à une API de plateforme.
- **La logique d'ellipse par débordement de pages vit dans le cœur** : l'algorithme de
  rétrécissement de la fenêtre (première / dernière pages toujours visibles, une page voisine de
  chaque côté de la page courante, ancrage vers les bords quand il manque des pages, ellipse
  uniquement en cas de vrai vide) est la fonction pure `getPaginationRange` du cœur de
  `@lh-ui/share` ; le bornage `clampPage` et le décompte `getPageCount` viennent également du cœur —
  ce dépôt n'ajoute que la colle réactive.
- **Le sélecteur de taille est porté par le picker intégré** : uni n'a pas de `<select>`, donc
  `show-size-changer` est porté par le `<picker mode="selector">` intégré d'uni, avec `page-sizes`
  comme options ; la valeur de l'événement change arrive dans `event.detail.value` (l'indice de
  l'option). Sur H5 s'ouvre le panneau sélecteur d'uni, sur Mini-Programme le sélecteur à molette natif.
- **Le saut de page est confirmé à un autre moment** : l'input d'uni n'a pas d'événement change
  natif, la validation se fait donc sur Entrée (confirm — déclenché aussi bien par la touche Entrée
  H5 que par le bouton « OK » du clavier du Mini-Programme) ou à la perte de focus (blur), et la
  valeur de l'événement de saisie se lit dans `event.detail.value` (même précédent que
  lh-input-number) ; les attributs natifs `min` / `max` ne sont pas transmis — le numéro de page est
  toujours borné par le `clampPage` du cœur. La version Vue 3 revient à la page 1 si le champ est
  vidé puis perd le focus ; cette bibliothèque durcit ce comportement en « ne pas sauter » (les
  chaînes vides et les nombres invalides n'émettent aucun événement).
- **Les états désactivés passent par une classe de secours** : les styles désactivés de la source de
  styles de share vivent sur la pseudo-classe `&:disabled` (qui ne cible que les éléments button) et
  view n'a pas cette pseudo-classe ; le composant ajoute donc en ligne une règle
  `lh-pagination__btn--disabled` avec le même token (`--lh-disabled-text-color`), suivant le
  précédent de secours en ligne de lh-segmented / lh-input-number (hors produit purifié).
- **Les attributs d'accessibilité sont liés un par un** : le contrat `aria-current` / `aria-label`
  des boutons de page est décidé par `getPaginationItemAria` de share ; comme le compilateur de
  gabarits du Mini-Programme ne supporte pas `v-bind` avec objet, la couche colle aplatit le
  paquet d'attributs en liaisons explicites par élément.
- **Conclusion de portage** : Pagination est un composant purement commutatif, sans mesure, sans
  superposition et sans dépendance à document ; la plage de pages, le bornage et les attributs
  d'accessibilité sont tous produits par les fonctions pures du cœur de `@lh-ui/share`, et ce dépôt
  n'ajoute que la colle réactive. L'API est identique à la version Vue 3 (`total` / `pageSize` /
  `current` / `pageSizes` / `showTotal` / `showSizeChanger` / `showJumper` / `simple` / `disabled` /
  `sx`).
