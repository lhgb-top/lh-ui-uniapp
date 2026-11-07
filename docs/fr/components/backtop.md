# BackTop Retour en haut

Bouton de retour en haut qui apparaît une fois le défilement au-delà d'un seuil. La
vérification de visibilité (`isBackTopVisible`) et la commande de défilement
(`backToTop`) proviennent des fonctions pures du core de `@lh-ui/share`.

## Différences entre plateformes (important)

- **H5** : le composant écoute lui-même l'événement `scroll` de `window` (ou du
  conteneur `target`) ; un clic fait défiler le conteneur cible directement.
- **Mini Programme WeChat** : vous devez injecter le `detail.scrollTop` de
  l'événement de défilement du `scroll-view` via la prop `scrollTop` pour piloter
  la visibilité ; au clic, le composant émet `update:scrollTop` (valeur 0), à lier
  à la propriété `scroll-top` du `scroll-view` pour remonter en haut. Sans
  `target`, le défilement est au niveau de la page et le composant appelle
  directement `uni.pageScrollTo`.

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-top="scrollTop"
    @scroll="onScroll"
  >
    <!-- contenu long -->
    <lh-backtop :scroll-top="scrollTop" @update:scroll-top="scrollTop = $event" />
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const scrollTop = ref(0)
function onScroll(event: { detail?: { scrollTop?: number } }) {
  scrollTop.value = event.detail?.scrollTop ?? 0
}
</script>
```

## Utilisation de base

```vue
<template>
  <lh-backtop :visibility-height="200" />
</template>
```

Lorsque la page ou le conteneur défile au-delà de `visibility-height` (200px par
défaut), le bouton apparaît avec une transition en fondu ; un clic remonte en haut
en douceur.

## Contenu et position personnalisés

```vue
<template>
  <lh-backtop :right="24" :bottom="80">
    <view class="my-backtop">Haut</view>
  </lh-backtop>
</template>
```

Par défaut, un bouton circulaire est rendu (avec l'icône `arrow-up` intégrée) ;
`right` / `bottom` contrôlent le décalage par rapport au coin inférieur droit de la
fenêtre ; le slot par défaut personnalise le contenu du bouton.

## API

### Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| target | Sélecteur du conteneur de défilement sur H5 (la fenêtre par défaut ; sur MP, sert uniquement à distinguer le retour en haut au niveau page ou au niveau scroll-view) | `string` | `-` |
| scrollTop | Injection de la position de défilement (MP : `detail.scrollTop` du scroll-view) | `number` | `-` |
| visibility-height | Nombre de pixels de défilement avant l'apparition | `number` | `200` |
| right | Décalage depuis la droite (px) | `number` | `40` |
| bottom | Décalage depuis le bas (px) | `number` | `40` |
| smooth | Défilement fluide | `boolean` | `true` |
| sx | Propriétés de mise en page rapide | `LhSxProps` | `-` |

### Events

| Événement | Description | Paramètre de callback |
| --- | --- | --- |
| click | Émis au clic sur le bouton (avant la commande de défilement) | `(event: Event)` |
| scrollend | Émis à l'arrêt du défilement (anti-rebond de 150ms) | `(scrollTop: number)` |
| update:scrollTop | Contrat de retour en haut sur MP : la valeur est 0, à lier au scroll-top du scroll-view | `(scrollTop: number)` |

### Slots

| Nom | Description |
| --- | --- |
| default | Contenu du bouton (l'icône arrow-up par défaut) |
