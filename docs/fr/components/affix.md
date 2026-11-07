# Affix

Épingle le contenu en haut ou en bas du viewport. La décision d'état épinglé
(`isAffixFixed`) et le style épinglé (`getAffixFixedStyle`) proviennent des
fonctions pures du core de `@lh-ui/share` ; la couche composant ne gère que
l'abonnement au défilement, la mesure de l'espace réservé et la colle réactive.

## Différences de plateforme (important)

La sémantique du défilement diffère entre H5 et le Mini-programme WeChat, ce
composant adopte donc une approche double-cible :

- **H5** : le composant écoute lui-même l'événement `scroll` de `window` (ou du
  conteneur pointé par le sélecteur `target`) et utilise le
  `getBoundingClientRect` du nœud d'espace réservé pour décider de l'état
  épinglé.
- **Mini-programme WeChat** : l'événement `scroll` ne peut être lié qu'à la
  balise `scroll-view`, le composant ne peut donc pas s'abonner lui-même.
  Placez le composant dans un `scroll-view` et injectez le `detail.scrollTop` de
  l'événement de défilement via la prop `scrollTop` :

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-top="scrollTop"
    @scroll="onScroll"
  >
    <lh-affix :scroll-top="scrollTop" :offset-top="20">
      <view class="my-bar">Barre épinglée</view>
    </lh-affix>
    <!-- contenu long -->
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

Sur H5, si `scrollTop` n'est pas transmis, le composant écoute `window`
automatiquement ; si un sélecteur `target` est transmis, il écoute ce conteneur.

## Utilisation de base

```vue
<template>
  <lh-affix :offset-top="20">
    <lh-button type="primary">Bouton épinglé</lh-button>
  </lh-affix>
</template>
```

Une fois le contenu défilé au-delà de `offset-top`, il est épinglé en haut du
viewport ; une fois épinglé, l'espace réservé maintient la position du document
à la hauteur d'origine, si bien que le contenu qui suit ne saute pas.

## Mode épinglage en bas

```vue
<template>
  <lh-affix :offset-bottom="24">
    <view class="my-bar">Barre épinglée en bas</view>
  </lh-affix>
</template>
```

`offset-bottom` prend priorité sur `offset-top` : le bord inférieur de l'espace
réservé est épinglé en bas dès qu'il franchit « hauteur du viewport -
offset-bottom ».

## API

### Props

| Prop | Description | Type | Par défaut |
| --- | --- | --- | --- |
| offset-top | Nombre de pixels depuis le haut du viewport déclenchant l'épinglage en haut | `number` | `0` |
| offset-bottom | Nombre de pixels depuis le bas du viewport déclenchant l'épinglage en bas (prioritaire sur offset-top) | `number` | `0` |
| target | Sélecteur du conteneur de défilement sur H5 (le viewport par défaut ; sans effet sur MP) | `string` | `-` |
| scrollTop | Injection de la position de défilement (MP : `detail.scrollTop` du scroll-view) | `number` | `-` |
| sx | Props de mise en page rapide (espacement / taille / flex) | `LhSxProps` | `-` |

### Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| change | Émis lorsque l'état épinglé change | `(fixed: boolean)` |

### Slots

| Slot | Description |
| --- | --- |
| default | Le contenu à épingler |
