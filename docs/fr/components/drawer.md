# Drawer (panneau coulissant)

Un panneau qui glisse depuis le bord de l'écran, adapté aux tâches temporaires nécessitant plus d'espace qu'un Dialog (détails, filtres, étapes d'un assistant). Comme Dialog il utilise `role="dialog"` + `aria-modal="true"` ; un clic sur le masque ou sur Échap (H5) le ferme.

## Utilisation de base

```vue
<template>
  <lh-button @click="visible = true">Ouvrir le drawer</lh-button>

  <lh-drawer v-model="visible" title="Détails de la commande">
    <view>Placez ici le contenu principal du drawer.</view>
    <view>La largeur du panneau est contrôlée par size, 30 % de la largeur du viewport par défaut.</view>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
</script>
```

## Quatre directions

`direction` accepte `right` (défaut) / `left` / `top` / `bottom` ; le panneau glisse depuis le bord correspondant.

```vue
<template>
  <!-- Ouvrir le drawer droit -->
  <lh-button @click="openDir('right')">right</lh-button>
  <!-- Ouvrir le drawer gauche -->
  <lh-button @click="openDir('left')">left</lh-button>
  <!-- Ouvrir le drawer supérieur -->
  <lh-button @click="openDir('top')">top</lh-button>
  <!-- Ouvrir le drawer inférieur -->
  <lh-button @click="openDir('bottom')">bottom</lh-button>

  <!-- Glisse dans la direction indiquée -->
  <lh-drawer v-model="dirVisible" :title="`Drawer ${direction}`" :direction="direction" size="40%">
    <view>Direction actuelle : {{ direction }}</view>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhDrawerDirection } from '@lh-ui/uniapp'

const dirVisible = ref(false)
const direction = ref<LhDrawerDirection>('right')
function openDir(d: LhDrawerDirection) {
  direction.value = d
  dirVisible.value = true
}
</script>
```

## Taille personnalisée

Un `size` numérique est en px ; les chaînes acceptent les pourcentages (ex. `'40%'`). Les directions horizontales l'appliquent à la largeur, les verticales à la hauteur.

```vue
<template>
  <!-- Ouvrir un drawer de 480 px de large -->
  <lh-button @click="sized = true">Drawer de 480 px</lh-button>

  <!-- Drawer de taille fixe avec une barre d'actions en bas -->
  <lh-drawer v-model="sized" title="Filtres" :size="480">
    <view>Filtrez les données par nom ou par étiquette.</view>
    <template #footer>
      <lh-button @click="sized = false">Annuler</lh-button>
      <lh-button type="primary" @click="sized = false">Appliquer les filtres</lh-button>
    </template>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const sized = ref(false)
</script>
```

## Commutateurs de comportement

`mask-closable` contrôle la fermeture au clic sur le masque, `show-close` le bouton de fermeture en haut à droite, `close-on-esc` la fermeture par Échap (H5 uniquement) et `lock-scroll` le verrouillage du défilement pendant l'ouverture (H5 uniquement).

```vue
<template>
  <!-- Ouvrir le drawer « fermeture par bouton uniquement » -->
  <lh-button @click="locked = true">Fermeture par bouton uniquement</lh-button>

  <!-- Les clics sur le masque et Échap ne le ferment pas ; seul le bouton le fait -->
  <lh-drawer
    v-model="locked"
    title="Fermeture par bouton uniquement"
    :mask-closable="false"
    :show-close="false"
    :close-on-esc="false"
  >
    <view>Ni les clics sur le masque ni Échap (H5) ne le ferment.</view>
    <template #footer>
      <lh-button type="primary" @click="locked = false">Fermer</lh-button>
    </template>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const locked = ref(false)
</script>
```

## Drawer API

### Props

| Propriété | Description | Type | Défaut |
| --- | --- | --- | --- |
| modelValue (v-model) | Affiché ou non | `boolean` | `false` |
| title | Titre (ou utilisez le slot header) | `string` | — |
| direction | Direction | `'right' \| 'left' \| 'top' \| 'bottom'` | `'right'` |
| size | Taille : les nombres sont en px, les chaînes acceptent les pourcentages | `string \| number` | `'30%'` |
| maskClosable | Fermer au clic sur le masque | `boolean` | `true` |
| showClose | Afficher le bouton de fermeture | `boolean` | `true` |
| lockScroll | Verrouiller le défilement pendant l'ouverture (**H5 uniquement**) | `boolean` | `true` |
| closeOnEsc | Répondre à Échap (**H5 uniquement**) | `boolean` | `true` |
| customClass | Nom de classe personnalisé (transmis au nœud racine) | `string` | — |
| themeVars | Variables de thème au niveau du composant | `Record<string, string>` | — |
| bgPattern | Motif d'arrière-plan au niveau du composant, remplace ConfigProvider | `string` | — |
| sx | Propriétés de mise en page rapide sx (appliquées au panneau) | `LhSxProps` | — |

### Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| update:modelValue | La visibilité a changé (après l'animation) | `(visible: boolean)` |
| open | Ouvert | — |
| close | Fermé (après l'animation) | — |

### Slots

| Slot | Description |
| --- | --- |
| default | Contenu principal |
| header | Zone de titre d'en-tête personnalisée (remplace le texte du titre) |
| footer | Barre d'actions en bas |

### Methods

| Méthode | Description |
| --- | --- |
| open | Ouvrir programmatiquement |
| close | Fermer programmatiquement |

### Accessibilité

- Le nœud racine porte `role="dialog"` + `aria-modal="true"` ; avec un titre, il est lié via `aria-labelledby`, sans titre c'est `drawer.title` du pack de langue qui sert d'`aria-label` de repli
- Le masque est décoratif (`aria-hidden="true"`)
- Le bouton de fermeture porte `role="button"` et un `aria-label` issu du pack de langue `drawer.close`
- Échap ferme (désactivable via `close-on-esc`, H5 uniquement)

::: tip Différences de plateforme (différences avec la version Vue3)
- **Support de l'overlay** : pas de prop `teleportTarget` — le Mini Program n'a pas de DOM teleport, l'overlay est porté par `root-portal` (en H5 c'est teleport). **Sur WeChat, `root-portal` nécessite la bibliothèque de base ≥ 2.25.2** ; les versions antérieures basculent automatiquement en `fixed` dans la page (il reste dans l'arbre de nœuds de la page, mais l'empilement reste garanti par le z-index auto-incrémenté, le comportement n'est pas affecté).
- **Transition d'entrée/sortie** : plus anime le glissement avec `<Transition name="lh-drawer-fade">` ; le Mini Program n'a pas de composant `<Transition>` et son événement `transitionend` n'est pas fiable, ce port rejoue donc manuellement la séquence de classes de Vue Transition (état initial retiré une frame plus tard → état actif → démontage à la fin) et aligne les 300 ms de transition SCSS de share avec `setTimeout` — le masque s'estompe pendant que le panneau glisse selon la direction, à l'identique sur les deux cibles.
- **Pas de piège à focus (la sémantique de focus clavier est propre à H5), non câblé ici** : plus enferme la séquence de Tab dans le panneau pendant l'ouverture ; le Mini Program n'a pas de sémantique de focus clavier (le `shouldDrawerTrapFocus` de share est court-circuité par la garde de compilation `LH_IS_H5`) et, comme Dialog, ce port n'appelle pas le focus-trap de share — seule la fermeture par Échap est conservée.
- **lockScroll H5 uniquement** : le Mini Program ne peut pas verrouiller le défilement du body ; le masque plein écran qui intercepte les clics sert de repli.
- **closeOnEsc H5 uniquement** : Échap passe par un écouteur clavier au niveau du document et seul l'overlay au sommet répond quand plusieurs sont empilés ; le Mini Program n'a pas d'événements clavier et tout le bloc est supprimé par compilation conditionnelle.
- **teleportTarget non implémenté** : conformément au précédent select / tooltip / dropdown (pas de DOM teleport dans les Mini Programs).
- **Zone sécurisée en bas** : avec `direction="bottom"` le panel gagne automatiquement une marge intérieure `env(safe-area-inset-bottom)` pour les appareils plein écran (adaptation propre à uni-app ; la source de styles de share n'a pas cette spécialisation).
:::
