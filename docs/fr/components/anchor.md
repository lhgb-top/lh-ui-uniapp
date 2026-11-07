# Anchor (Navigation d'ancres)

Navigation d'ancres : un clic saute vers la section correspondante et, au défilement, la
section en cours est mise en surbrillance. L'aplatissement (`flattenAnchorItems`) et la
résolution de l'ancre active (`resolveActiveAnchor`) proviennent des fonctions pures du
core de `@lh-ui/share`.

## Différences entre plateformes (important)

- **H5** : le composant écoute lui-même le défilement de `window` (ou du conteneur
  `target`), et le positionnement de l'ancre utilise le `scrollIntoView` natif.
- **Mini Programme WeChat** : la synchronisation du défilement nécessite d'injecter le
  `detail.scrollTop` du `scroll-view` via la prop `scrollTop` ; lors du clic sur une
  ancre, le composant émet `update:scrollIntoView` (l'id de la section cible), à lier à
  l'attribut `scroll-into-view` du `scroll-view` pour effectuer le positionnement. Lorsque
  `target` n'est pas passé, le positionnement se fait au niveau de la page et le composant
  appelle directement `uni.pageScrollTo({ selector })`.

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-into-view="anchorTarget"
    @scroll="onScroll"
  >
    <view id="section-a" class="my-section">区块 A</view>
    <view id="section-b" class="my-section">区块 B</view>
    <lh-anchor
      :items="items"
      :scroll-top="scrollTop"
      @update:scroll-into-view="anchorTarget = $event"
    />
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const items = [
  { id: 'section-a', title: '区块 A' },
  { id: 'section-b', title: '区块 B' },
]
const scrollTop = ref(0)
const anchorTarget = ref('')
function onScroll(event: { detail?: { scrollTop?: number } }) {
  scrollTop.value = event.detail?.scrollTop ?? 0
}
</script>
```

## Utilisation de base

```vue
<template>
  <lh-anchor :items="items" />
</template>

<script setup lang="ts">
const items = [
  { id: 'section-a', title: '区块 A' },
  {
    id: 'group-b',
    title: 'B 组',
    children: [
      { id: 'section-b', title: '区块 B' },
      { id: 'section-c', title: '区块 C' },
    ],
  },
]
</script>
```

`items` accepte des enfants (`children`) ; ils sont aplanis en profondeur lors du rendu et
indentés automatiquement. Règle de résolution de l'ancre active : l'élément actif est la
dernière ancre dont le bord haut de la section a franchi la ligne du seuil `offset` lors
du défilement.

## Disposition horizontale

```vue
<template>
  <lh-anchor :items="items" direction="horizontal" />
</template>
```

## API

### Props

| Prop | Description | Type | Par défaut |
| --- | --- | --- | --- |
| items | Données des ancres (accepte des enfants children) | `LhAnchorItem[]` | `[]` |
| target | Sélecteur du conteneur de défilement sur H5 (window par défaut) | `string` | — |
| scrollTop | Injection de la position de défilement (MP : `detail.scrollTop` du scroll-view) | `number` | — |
| offset | Seuil de la résolution active (distance du bord haut de la section au haut du conteneur) | `number` | `0` |
| direction | Direction de la disposition | `'vertical' \| 'horizontal'` | `'vertical'` |
| smooth | Défilement fluide | `boolean` | `true` |
| sx | Props de mise en page rapides | `LhSxProps` | — |

### Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| change | Émis lorsque l'ancre active change | `(id: string)` |
| click | Émis au clic sur un élément d'ancre (avant le positionnement du défilement) | `(id: string)` |
| update:scrollIntoView | Contrat de positionnement MP : id de la section cible, à lier à scroll-into-view | `(id: string)` |
