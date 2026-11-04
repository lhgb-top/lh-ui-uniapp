# Slider

Un curseur permettant de choisir une valeur en faisant glisser un curseur le long d'une piste. Prend en charge les modes à un curseur et à plage (deux curseurs), l'aimantation au pas `step` et les étiquettes de graduation `marks`. La piste, les curseurs et la barre de remplissage sont entièrement dessinés en `view` ; le bornage des valeurs, l'aimantation au pas, le tri des graduations et le contrat d'accessibilité viennent directement des fonctions pures de `@lh-ui/share` (aucune copie).

## Utilisation de base

```vue
<template>
  <lh-slider v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref(30)
</script>
```

Sans `modelValue`, le composant s'initialise sur `min` ; le transmettre rend le composant contrôlé (comme tous les composants de formulaire). Pendant le glissement, seul l'état interne est mis à jour — `update:modelValue` / `change` sont émis **une seule fois, au relâchement** (comme pour la version Vue3).

## Sélection d'une plage

`range` active le mode à deux curseurs ; `modelValue` est un tuple `[début, fin]` :

```vue
<template>
  <lh-slider v-model="span" range />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const span = ref<[number, number]>([20, 60])
</script>
```

Lorsqu'un bout est glissé au-delà de l'autre, les deux bouts s'échangent (le curseur sous le doigt est toujours celui que vous déplacez), la valeur reste toujours `[plus tôt, plus tard]`.

## Pas et graduations

`step` aimante le curseur sur la grille du pas ; `marks` affiche des étiquettes de graduation à partir d'une correspondance `valeur → libellé` (triée par valeur) :

```vue
<template>
  <lh-slider v-model="value" :min="0" :max="100" :step="10" :marks="marks" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref(30)
const marks: Record<number, string> = {
  0: '0',
  50: 'Mi-parcours',
  100: 'Max',
}
</script>
```

## Désactivé

`disabled` bloque le glissement et la navigation au clavier, et retire le curseur de l'ordre de tabulation :

```vue
<template>
  <lh-slider v-model="value" disabled />
</template>
```

## Afficher la valeur

`show-input` affiche la valeur courante à droite de la piste (en mode plage, une chaîne `[début, fin]`) :

```vue
<template>
  <lh-slider v-model="value" show-input />
</template>
```

## Slider API

### Props

| Propriété | Description | Type | Par défaut |
| --- | --- | --- | --- |
| modelValue | Valeur courante (v-model contrôlé ; un tuple en mode plage) | `number \| [number, number]` | — |
| min | Valeur minimale | `number` | `0` |
| max | Valeur maximale | `number` | `100` |
| step | Pas (la plus petite unité d'aimantation du curseur) | `number` | `1` |
| disabled | Désactiver tout le composant | `boolean` | `false` |
| range | Mode plage (deux curseurs) | `boolean` | `false` |
| showInput | Afficher la valeur courante à côté de la piste | `boolean` | `false` |
| size | Taille | `'small' \| 'medium' \| 'large'` | `'medium'` |
| marks | Étiquettes de graduation (les clés sont des valeurs, tri croissant) | `Record<number, string>` | — |
| customClass | Classe personnalisée transmise au nœud racine | `string` | — |
| sx | Props de mise en page rapide (appliquées au nœud racine) | `LhSxProps` | — |

### Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| update:modelValue | La valeur a changé (v-model ; émis au relâchement ou au pas clavier) | `(value: number \| [number, number])` |
| change | La valeur a changé (même charge utile qu'update:modelValue) | `(value: number \| [number, number])` |

### Accessibilité

- Le curseur porte `role="slider"` avec `aria-valuemin` / `aria-valuemax` / `aria-valuenow` / `aria-valuetext` (le contrat est décidé par `getSliderThumbAria` de share)
- En mode plage, les deux curseurs portent des `aria-label` distincts (« curseur de début / curseur de fin », clés de locale `slider.thumbStart` / `slider.thumbEnd`, sinon `slider.thumb`)
- La navigation au clavier (flèches déplacent d'un `step`, PageUp / PageDown de plus grands pas, Home / End sautent aux extrêmes) est réservée à H5 — voir les différences de plateforme ci-dessous

::: tip Différences de plateforme (différences avec la version Vue3)
- **Support du glissement** : plus enregistre `mousedown` / `touchstart` sur le curseur puis déplace les écouteurs move / up vers `document` ; un Mini Programme n'a pas de document, donc `touchstart` / `touchmove` / `touchend` restent liés au curseur lui-même (les événements tactiles d'un Mini Programme continuent de se déclencher sur la cible du touchstart — aucun écouteur global nécessaire). H5 conserve les écouteurs souris au niveau document (après le clic, le glissement continue même hors du composant), protégés par la compilation conditionnelle — le bundle MP ne contient pas de code mort.
- **Le calcul de la position est asynchrone** : plus mesure la piste avec un `getBoundingClientRect` synchrone ; un Mini Programme ne dispose que du `createSelectorQuery` asynchrone, ce composant passe donc par le `getSingleLhRect` de l'adaptateur. La mesure est mise en cache par session de glissement (préchauffée au touchstart), un glissement normal est à peine affecté ; mais sémantiquement, la mise à jour de la valeur a une image de retard sur le toucher. **Ne supposez pas, dans un événement move, que la valeur est déjà mise à jour synchrone** ; l'émission n'a lieu qu'au relâchement.
- **Largeur de piste nulle ignorée** : lorsque la mise en page n'est pas encore prête (ou dans un environnement de test), le rectangle de la piste a une largeur nulle, ce qui produirait une division par zéro ; cette mise à jour est ignorée plutôt que de polluer la valeur avec NaN.
- **La navigation au clavier est réservée à H5** : le déplacement avec les flèches / Home / End / PageUp / PageDown n'a pas d'événements clavier sur MP ; le code protégé n'est pas du tout appelé et le bundle MP ne contient pas de code mort.
- **Les attributs aria sont liés un par un** : le paquet `LhAriaAttrs` de share ne peut pas être déployé via `v-bind` (le compilateur de templates MP ne le prend pas en charge) ; la couche de colle développe les clés `aria-*` en liaisons explicites, le contrat reste décidé par les fonctions pures de share.
- **Pas de mode vertical ni de bulle tooltip** : la source de plus n'a ni propriété `vertical` (piste verticale) ni bulle tooltip ; ce port reste strictement aligné et n'ajoute ni l'une ni l'autre. Pour une piste verticale, vous pouvez faire pivoter un conteneur parent (en gérant vous-même les coordonnées tactiles) ; pour afficher la valeur, utilisez `show-input` afin qu'elle reste toujours visible.
:::
