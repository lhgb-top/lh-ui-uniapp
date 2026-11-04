# Popover (fenêtre contextuelle)

Un popover à contenu riche : il transporte plus d'informations qu'un Tooltip (titre, corps, nœuds interactifs). Le déclencheur est enveloppé dans le slot par défaut et le contenu du popover est passé via le slot `content` ; la couche émergente est `role="dialog"` avec une flèche pointant toujours vers le déclencheur.

## Utilisation de base

```vue
<template>
  <lh-popover title="Conseil encré" placement="top">
    <lh-button>Cliquer pour afficher</lh-button>
    <template #content>
      <text>Ceci est un contenu riche ; n'importe quel nœud peut y être placé.</text>
    </template>
  </lh-popover>
</template>
```

::: warning Le Mini Programme n'a pas de sémantique hover / focus
`trigger` vaut `click` par défaut (disponible sur toutes les cibles). `hover` / `focus` ne sont valables qu'en H5 — sur le Mini Programme ils se dégradent automatiquement en bascule par appui / toucher (le premier appui ouvre, le second ferme).
:::

## Méthodes de déclenchement

```vue
<template>
  <!-- Déclenchement au survol (H5 uniquement ; se dégrade en bascule par appui sur le Mini Programme) -->
  <lh-popover trigger="hover" title="Déclenchement au survol">
    <lh-button>Survolez-moi</lh-button>
    <template #content><text>Déplacer le pointeur dans la couche émergente ne la ferme pas.</text></template>
  </lh-popover>

  <!-- Déclenchement au focus (H5 uniquement) -->
  <lh-popover trigger="focus" title="Déclenchement au focus">
    <lh-input placeholder="Focus sur le champ" />
    <template #content><text>S'affiche lorsque le champ reçoit le focus.</text></template>
  </lh-popover>

  <!-- Manuel : la visibilité est entièrement contrôlée par le v-model:visible externe -->
  <lh-popover v-model:visible="manualVisible" trigger="manual" title="Contrôle manuel">
    <lh-button @click="manualVisible = !manualVisible">Interrupteur externe</lh-button>
    <template #content><text>La visibilité est entièrement contrôlée par l'état externe.</text></template>
  </lh-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const manualVisible = ref(false)
</script>
```

> Les délais `showAfter` / `hideAfter` ne s'appliquent qu'à hover / focus (H5) ; `click` et `manual` répondent immédiatement.

## Douze positions

```vue
<template>
  <lh-popover
    v-for="p in placements"
    :key="p"
    :placement="p"
    :title="p"
  >
    <lh-button size="small">{{ p }}</lh-button>
    <template #content><text>Position : {{ p }}</text></template>
  </lh-popover>
</template>

<script setup lang="ts">
const placements = [
  'top', 'top-start', 'top-end',
  'bottom', 'bottom-start', 'bottom-end',
  'left', 'left-start', 'left-end',
  'right', 'right-start', 'right-end',
] as const
</script>
```

> Lorsque le viewport manque d'espace, la couche émergente se retourne automatiquement (flip) et est ramenée sur l'axe croisé (shift) ; la position de la flèche bascule en conséquence.

## Largeur, flèche et désactivation

```vue
<template>
  <!-- Largeur fixe -->
  <lh-popover title="Largeur fixe" width="240">
    <lh-button>Largeur fixe</lh-button>
    <template #content><text>La largeur de la couche est fixée via width.</text></template>
  </lh-popover>

  <!-- Sans flèche -->
  <lh-popover title="Sans flèche" :arrow="false">
    <lh-button>Sans flèche</lh-button>
    <template #content><text>Lorsque arrow vaut false, aucune flèche n'est rendue.</text></template>
  </lh-popover>

  <!-- Désactivé -->
  <lh-popover title="Désactivé" disabled>
    <lh-button disabled>Déclencheur désactivé</lh-button>
    <template #content><text>Avec disabled, ni le déclencheur ni la couche ne répondent.</text></template>
  </lh-popover>
</template>
```

## Popover API

### Props

| Prop | Description | Type | Défaut |
| --- | --- | --- | --- |
| placement | Position de la couche (12 positions) | `LhPopoverPlacement` | `'top'` |
| trigger | Méthode de déclenchement : `click` (toutes cibles) / `hover`, `focus` (H5 uniquement, dégradé en appui sur MP) / `manual` (contrôlé) | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'` |
| title | Titre (également disponible via le slot title) | `string` | — |
| visible | Visibilité contrôlée manuellement (v-model:visible) | `boolean` | — |
| disabled | Désactivé | `boolean` | `false` |
| arrow | Afficher la flèche | `boolean` | `true` |
| width | Largeur de la couche (les nombres sont en px) | `string \| number` | — |
| popperClass | Nom de classe personnalisé pour la couche | `string` | — |
| showAfter | Délai d'affichage (ms, hover / focus H5 uniquement) | `number` | — |
| hideAfter | Délai de masquage (ms, hover / focus H5 uniquement) | `number` | — |
| themeVars | Variables de thème au niveau du composant | `Record<string, string>` | — |
| bgPattern | Motif d'arrière-plan au niveau du composant, remplace ConfigProvider | `string` | — |
| sx | Propriétés de mise en page rapide sx (appliquées à l'élément racine du déclencheur) | `LhSxProps` | — |

### Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| update:visible | Visibilité modifiée (v-model) | `(value: boolean)` |
| show | Émis après affichage | — |
| hide | Émis après masquage | — |

### Slots

| Slot | Description |
| --- | --- |
| default | Contenu du déclencheur |
| title | Titre personnalisé |
| content | Contenu émergent |

### Methods

| Méthode | Description |
| --- | --- |
| show | Afficher par programme |
| hide | Masquer par programme |
| toggle | Basculer par programme |

### Accessibilité

- Le déclencheur porte `aria-haspopup="true"` ainsi que `aria-expanded` / `aria-controls` ; la couche est `role="dialog"` et, avec un titre, reliée via `aria-labelledby`
- Échap ferme, un clic hors de la couche (masque transparent en page) ferme ; lorsque plusieurs couches sont empilées, Échap ne ferme que la plus haute (tout cela en H5 uniquement)
- Le moteur de positionnement est une fonction pure maison (protection anti-débordement flip / shift), sans dépendance d'exécution tierce

::: tip Différences de plateforme (différences avec la version Vue3)
- **Méthodes de déclenchement** : le Mini Programme n'a pas de sémantique hover / focus, donc `trigger="hover"` / `trigger="focus"` se dégradent en bascule par appui / toucher sur MP ; les délais (`showAfter` / `hideAfter`) ne s'appliquent qu'aux modes hover / focus en H5, tandis que `click` et `manual` répondent immédiatement.
- **Transport et positionnement de la couche** : pas de prop `teleportTarget` — le Mini Programme n'a pas de teleport DOM, la couche est donc portée par `root-portal` (repli fixe dans la page sur les anciennes versions) ; le positionnement popper passe par une mesure asynchrone en deux images (rendu caché pour mesurer → `computePosition` → affichage, anti-scintillement). Le calcul est asynchrone : ne présumez pas d'un résultat synchrone. Le décalage de flèche est écrit dans `--lh-arrow-offset` par la colle du composant à partir de l'`arrowOffset` du résultat.
- **Comportement clavier en H5 uniquement** : la fermeture par Échap utilise un écouteur au niveau du document (ne ferme que la couche au sommet en cas d'empilement) ; le Mini Programme n'a pas d'événements clavier et tout le bloc est retiré par compilation conditionnelle.
- **Piège à focus non porté** : le déclenchement par clic de plus piège le focus dans la couche (focus-trap) et le restitue à la fermeture ; MP n'a pas de sémantique de focus clavier, comme le Dialog de ce dépôt ce n'est pas porté du tout.
- **Pas de transition d'entrée/sortie** : plus anime avec `Transition` ; `Transition` n'est pas fiable sur MP et, comme tooltip / dropdown, aucune transition n'est liée.
- **Pas de fermeture automatique lorsque le déclencheur sort du viewport** : le `useLhPopper` de plus possède un rappel scroll-out ; uni-app n'a pas de canal unifié d'écoute du défilement / redimensionnement, donc non porté.
:::
