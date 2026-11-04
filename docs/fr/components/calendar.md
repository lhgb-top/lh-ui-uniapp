# Calendar Calendrier

Composant calendrier présentant les jours dans une grille mensuelle, avec trois modes de sélection — simple, plage (début et fin) ou multiple — et une contrainte `range` optionnelle. Tous les textes (en-têtes des jours de semaine, noms des mois, titre du panneau) proviennent des clés de locale `datepicker.weeks.*` / `datepicker.month1~12` / `datepicker.panelTitle`. Le calendrier est une grille `view` dessinée à la main, sans aucun contrôle de date natif : il est naturellement adapté au mobile et utilisable sur toutes les cibles.

## Utilisation de base

```vue
<template>
  <lh-calendar v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date>()
</script>
```

Sans `modelValue`, le composant gère sa propre sélection ; en le passant, il devient contrôlé (comme tous les composants de formulaire).

## Sélection de plage

Avec `selection="range"`, le premier clic fixe la date de début (la valeur devient `[début, début]`) et le second fixe la fin, avec normalisation automatique (cliquer en ordre inverse donne aussi `[plus tôt, plus tard]`) :

```vue
<template>
  <lh-calendar v-model="span" selection="range" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const span = ref<Date[]>([])
</script>
```

Les deux extrémités reçoivent `--selected` et les jours intermédiaires la couleur de fond d'intervalle `--in-range` (extrémités exclues).

## Restreindre la plage sélectionnable

`range` prend un tuple `[début, fin]` ; les jours hors de l'intervalle sont désactivés (le test de désactivation est une fonction pure de share, et les plages inversées sont normalisées automatiquement) :

```vue
<template>
  <lh-calendar v-model="value" :range="[start, end]" />
</template>

<script setup lang="ts">
const start = new Date(2026, 10, 1)
const end = new Date(2026, 10, 30)
</script>
```

## Sélection multiple

Avec `selection="multiple"`, recliquer sur un jour déjà sélectionné le désélectionne, et le résultat reste trié dans le temps :

```vue
<template>
  <lh-calendar v-model="dates" selection="multiple" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const dates = ref<Date[]>([])
</script>
```

## Mode de déclencheur input

Avec `mode="input"`, seule une boîte déclencheuse est dessinée ; tapez dessus pour déplier ou replier le panneau, qui se referme après sélection (`close-on-select` actif par défaut ; une plage nécessite deux clics) :

```vue
<template>
  <lh-calendar v-model="value" mode="input" placeholder="Choisir une date" />

  <!-- Plage + sans fermeture automatique -->
  <lh-calendar v-model="span" mode="input" selection="range" :close-on-select="false" />
</template>
```

Le texte de la boîte est par défaut au format `YYYY-MM-DD` (`début ~ fin` pour une plage) ; le texte de remplacement vient de la clé de locale `select.placeholder`.

## Plusieurs panneaux et contenu personnalisé

`panels` contrôle le nombre de panneaux mensuels affichés simultanément (disposés en flex avec retour à la ligne) ; les slots `header` et `cell` personnalisent le titre du panneau et les cellules de jour :

```vue
<template>
  <lh-calendar v-model="value" :panels="2">
    <template #header="{ year, month }">
      <view class="my-title">{{ year }} / {{ month + 1 }}</view>
    </template>
    <template #cell="{ date }">
      <view class="my-cell">{{ date.getDate() }}</view>
    </template>
  </lh-calendar>
</template>
```

::: tip Adapté au mobile
Le panneau du calendrier est une grille `view` pure (sept colonnes de largeur égale), sans sélecteur natif ni mesure DOM ;
H5 et le Mini-Programme WeChat le rendent à l'identique, et sur petits écrans il s'adapte à la largeur du conteneur.
:::

## Calendar API

### Props

| Propriété | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| modelValue | Sélection actuelle (v-model contrôlé ; état interne si omis) | `Date \| Date[]` | — |
| selection | Mode de sélection : simple / plage / multiple | `'single' \| 'range' \| 'multiple'` | `'single'` |
| range | Plage de dates sélectionnables (hors plage = désactivé, plages inversées normalisées) | `[Date, Date]` | — |
| mode | Forme d'affichage : panneau persistant / boîte déclencheuse dépliable | `'panel' \| 'input'` | `'panel'` |
| panels | Nombre de panneaux mensuels affichés simultanément | `number` | `1` |
| placeholder | Texte de remplacement en mode input (par défaut la clé de locale select.placeholder) | `string` | — |
| closeOnSelect | Replier le panneau après une sélection en mode input | `boolean` | `true` |
| customClass | Classe personnalisée transmise au nœud racine | `string` | — |
| sx | Props de mise en page rapides (appliquées au nœud racine) | `LhSxProps` | — |

### Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| update:modelValue | Changement de sélection (v-model) | `(value: Date \| Date[])` |
| change | Changement de sélection (même charge utile qu'update:modelValue) | `(value: Date \| Date[])` |
| select | Lors du clic sur un jour (les jours désactivés sont ignorés) | `(date: Date)` |

### Slots

| Slot | Description | Paramètres de portée |
| --- | --- | --- |
| header | Personnalisation du titre du panneau | `{ year: number, month: number }` (month débute à 0) |
| cell | Personnalisation de la cellule de jour | `{ date: Date }` |

### Accessibilité

- La grille est `role="grid"` avec des lignes `role="row"`, des cellules `role="gridcell"` et des en-têtes `role="columnheader"`, ainsi que `aria-selected` / `aria-current="date"` (aujourd'hui) / `aria-disabled` (désactivé)
- Le `aria-label` de chaque cellule est une chaîne `YYYY-MM-DD` lisible par les lecteurs d'écran
- Les boutons de changement de mois sont `role="button"` + `aria-label` (clés de locale `datepicker.prevMonth` / `datepicker.nextMonth`)
- La navigation au clavier (flèches, Home / End, PageUp / PageDown) est réservée à H5 — voir les différences de plateforme ci-dessous

::: tip Différences de plateforme (différences avec la version Vue3)
- **Support de la grille** : le calendrier est une grille de 7 colonnes dessinée en `view` (WXSS `grid-template-columns: repeat(7, 1fr)`), sans contrôle de date natif ; H5 et le Mini-Programme WeChat le rendent et se comportent à l'identique, et il est naturellement adapté au mobile.
- **Mapping des éléments** : les `<div>` / `<button>` / `<input>` de plus sont remplacés par des `<view>` ; en mode input, la boîte déclencheuse est dessinée en `view` et affiche elle-même le texte de remplacement et la valeur sélectionnée (MP ne gère pas `::placeholder`, et un `<input>` natif nécessiterait en plus `placeholder-style`). Les cellules désactivées portent la classe `--disabled` (une `view` n'a pas de pseudo-classe `:disabled` ; le SFC fournit un repli inline avec le même token).
- **Navigation au clavier réservée à H5** : les flèches / Home / End / PageUp / PageDown et le roving tabindex n'ont pas d'événements clavier en MP, le code gardé n'est donc pas du tout appelé : le bundle MP ne contient pas de code mort.
- **Fermeture au clic extérieur réservée à H5** : plus écoute un mousedown au niveau du document pour replier le panneau ; MP n'a pas de document, le panneau s'ouvre et se ferme donc en tapant la boîte déclencheuse.
- **Attributs aria liés un par un** : le paquet `LhAriaAttrs` de share ne peut pas être déployé via `v-bind` (le compilateur de templates MP ne le gère pas) ; la couche de colle déploie les clés `aria-*` en liaisons explicites, le contrat restant décidé par les fonctions pures de share.
:::
