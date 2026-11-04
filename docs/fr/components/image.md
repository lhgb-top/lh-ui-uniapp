# Image

Image avec un substitut en cas d'échec de chargement et prévisualisation facultative à l'appui
(via l'API native `uni.previewImage`, disponible sur toutes les plateformes). Le mode de
recadrage est mappé sur le `mode` du `<image>` d'uni et le chargement différé utilise la
propriété `lazy-load` intégrée au composant. La normalisation de la liste de prévisualisation
et les noms de classes d'état proviennent des fonctions pures du cœur `@lh-ui/share`.

## Utilisation de base

```vue
<template>
  <lh-image src="https://picsum.photos/240/140" alt="Image d'exemple" :sx="{ w: '240px', h: '140px' }" />
</template>
```

`alt` est obligatoire au niveau TS : aucune image ne peut arriver sans texte alternatif.
Le `<image>` d'uni mesure 320×240 par défaut — précisez les dimensions explicitement via le
`w` / `h` de `sx` (ou un style) ; l'arrondi des coins est intégré par la source de styles de
share (`--lh-border-radius-small`), sans aucune configuration.

## Modes de remplissage

`fit` décrit la sémantique de object-fit en CSS et se mappe sur le `mode` du `<image>` d'uni :
`contain` → `aspectFit`, `cover` → `aspectFill`, `fill` → `scaleToFill`.

```vue
<template>
  <lh-image src="https://picsum.photos/240/140" alt="Rogner pour couvrir" fit="cover" :sx="{ w: '110px', h: '80px' }" />
  <lh-image src="https://picsum.photos/240/140" alt="Affichage complet" fit="contain" :sx="{ w: '110px', h: '80px' }" />
  <lh-image src="https://picsum.photos/240/140" alt="Étirement" fit="fill" :sx="{ w: '110px', h: '80px' }" />
</template>
```

::: tip none / scale-down sont des mappages approximatifs
`none` se mappe sur `center` (pas de mise à l'échelle, seule la zone centrale est affichée —
même sémantique que object-fit: none) ; uni n'a pas de `mode` équivalent à `scale-down`, le
`aspectFit` sémantiquement le plus proche est donc utilisé (même écart enregistré que lh-avatar).
:::

## Chargement différé

`lazy` active la `lazy-load` intégrée au `<image>` d'uni (chargement à l'entrée dans le viewport).

```vue
<template>
  <scroll-view scroll-y style="height: 140px; width: 100%">
    <lh-image
      v-for="i in 4"
      :key="i"
      :src="`https://picsum.photos/240/120?random=${i}`"
      :alt="`Image différée ${i}`"
      lazy
      :sx="{ w: '240px', h: '120px', mb: 1 }"
    />
  </scroll-view>
</template>
```

Sur WeChat, `lazy-load` ne fonctionne que pour les images situées sous page et scroll-view.

## Échec de chargement

En cas d'échec, le composant bascule vers le substitut (la classe `lh-image--error` est
ajoutée au nœud racine). Le texte par défaut vient de la clé de locale `image.error`
(neuf langues disponibles) et peut être personnalisé via le slot `error` ; l'événement
`error` est émis dans la foulée.

```vue
<template>
  <lh-image src="https://invalid.example.com/not-found.png" alt="Substitut par défaut" :sx="{ w: '240px', h: '140px' }" />
  <lh-image src="https://invalid.example.com/not-found.png" alt="Substitut personnalisé" :sx="{ w: '240px', h: '140px' }">
    <template #error>Substitut personnalisé</template>
  </lh-image>
</template>
```

## Appui pour prévisualiser

Avec `preview` activé, appuyer sur l'image ouvre la prévisualisation native
`uni.previewImage` (disponible sur toutes les plateformes) ; la liste multi-images passe par
`preview-src-list`, et en son absence elle retombe sur `[src]` (même normalisation que plus,
indice initial fixé à 0).

```vue
<template>
  <lh-image
    src="https://picsum.photos/240/140"
    alt="Prévisualisation multi-images"
    preview
    :preview-src-list="[
      'https://picsum.photos/600/400?random=1',
      'https://picsum.photos/600/400?random=2',
      'https://picsum.photos/600/400?random=3',
    ]"
    :sx="{ w: '240px', h: '140px' }"
  />
  <lh-image src="https://picsum.photos/240/140" alt="Prévisualisation d'une seule image" preview :sx="{ w: '140px', h: '140px' }" />
</template>
```

## Props

| Prop | Description | Type | Défaut |
| --- | --- | --- | --- |
| src | URL de l'image | `string` | — |
| alt | Texte alternatif (exigence a11y stricte, obligatoire au niveau TS) | `string` | — |
| fit | Mode de recadrage (mappé sur le mode de l'image uni) | `'contain' \| 'cover' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` |
| preview | Si l'appui ouvre la prévisualisation | `boolean` | `false` |
| preview-src-list | Liste de prévisualisation (retombe sur [src] en son absence) | `string[]` | — |
| lazy | Chargement différé (lazy-load natif de l'image uni) | `boolean` | `false` |
| customClass | Nom de classe personnalisé (transmis au nœud racine) | `string` | — |
| sx | Propriétés rapides de mise en page | `LhSxProps` | — |

## Events

| Événement | Description | Paramètres du callback |
| --- | --- | --- |
| load | Émis quand l'image se charge avec succès | `(event: Event)` |
| error | Émis quand l'image échoue (bascule vers le substitut) | `(event: Event)` |

## Slots

| Slot | Description |
| --- | --- |
| error | Contenu du substitut d'échec (par défaut la clé de locale image.error) |

## Différences de plateforme

- **La prévisualisation passe par l'API native `uni.previewImage`** (disponible sur toutes les
  plateformes) : la prévisualisation de plus est une superposition visionneuse dessinée à la
  main (teleport vers le body, zoom / rotation / navigation multi-images / fermeture par Esc /
  piège à focus), impossible à reproduire sur Mini-Programme faute de document. L'édition
  uniapp appelle à la place `uni.previewImage` — sur H5 la superposition vient de
  l'environnement d'uni, sur WeChat c'est la page de prévisualisation native qui prend le
  relais ; l'interaction est fournie par la plateforme, **sans personnalisation possible**
  (opacité du masque / bouton de fermeture / barre d'outils). Le composant autonome
  `LhImageViewer` de plus n'est pas livré dans ce dépôt.
- **Mapping fit → mode** : `contain` / `cover` / `fill` se mappent sur `aspectFit` /
  `aspectFill` / `scaleToFill` ; `none` se mappe sur `center` ; `scale-down` n'a pas
  d'équivalent et utilise le plus proche `aspectFit` (même écart enregistré que lh-avatar).
  L'implémentation CSS de object-fit ne s'applique qu'à une vraie `<img>` sur H5 ; le
  `<image>` d'uni est piloté par `mode` sur toutes les plateformes.
- **Chargement différé** : le `<image>` d'uni embarque `lazy-load` (en remplacement du
  `loading="lazy"` de plus) ; sur WeChat cela ne vaut que pour les images sous page et
  scroll-view.
- **Dimensions et arrondi** : le `<image>` d'uni mesure 320×240 par défaut, les dimensions se
  règlent via `sx` / style ; l'arrondi est intégré par la source de styles de share
  (`--lh-border-radius-small`). plus n'a pas davantage de prop width / height / radius
  (dimensions via sx, arrondi via la source de styles) — rien n'est ajouté ici de sa propre
  initiative.
- **alt** : le `<image>` des Mini-Programmes n'a pas de notion d'alt (transmis comme attribut
  sur H5), le repli d'accessibilité reste plus faible que le `<img alt>` du Web ;
  l'exigence d'obligation au niveau TS est conservée.
- **Résidus de styles de la visionneuse** : la source de styles de share contient des règles
  `.lh-image-viewer*` (styles de la visionneuse dessinée de plus) ; conformément à la
  contrainte de source de styles unique, elles entrent dans le produit style.css de ce
  composant, sans nœud correspondant sur l'une ou l'autre plateforme (redondance inoffensive,
  toujours conforme à la liste blanche WXSS : la famille `:hover` / `:focus` est enveloppée
  en H5-only par compilation conditionnelle).

::: tip Différences avec la version Vue 3
- La sémantique logique (normalisation de la liste de prévisualisation, état de chargement,
  noms de classes) est identique à plus (même cœur share).
- La prévisualisation passe de la superposition visionneuse dessinée à la main à l'API native
  `uni.previewImage` (voir « Différences de plateforme »).
- Ajout de la prop `customClass` : les noms de classes personnalisés ne peuvent pas traverser
  styleIsolation sur uni-app, ils passent donc par une prop dédiée.
- `none` / `scale-down` sont des mappages approximatifs sur Mini-Programme (voir
  « Différences de plateforme »).
:::
