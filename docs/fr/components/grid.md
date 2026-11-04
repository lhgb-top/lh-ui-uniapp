# Grid (grille)

Grille de 24 colonnes : `lh-row` associé à `lh-col` (avec easycom vous pouvez écrire les balises directement ; lors d'un import à la demande, les noms des composants sont `LhRow` / `LhCol`). Elle repose sur CSS Grid : `span` / `offset` / `push` / `pull` sont mappés directement sur le positionnement `grid-column`, et les noms de classes comme l'algorithme de placement sont produits par des fonctions pures du core de `@lh-ui/share`.

## Mise en page de base

```vue
<template>
  <lh-row>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
  </lh-row>
</template>
```

## Espacement des colonnes (gutter)

`gutter` accepte un `number` (horizontal uniquement) ou un tableau `[horizontal, vertical]` ; Row utilise une marge négative pour compenser le padding des colonnes.

```vue
<template>
  <lh-row :gutter="16">
    <lh-col :span="8"><view class="cell">8</view></lh-col>
    <lh-col :span="8"><view class="cell">8</view></lh-col>
    <lh-col :span="8"><view class="cell">8</view></lh-col>
  </lh-row>
  <lh-row :gutter="[16, 24]">
    <lh-col :span="12"><view class="cell">12</view></lh-col>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
  </lh-row>
</template>
```

## justify / align

Le `center` de `justify` et le `middle` de `align` sont mappés à des classes modificateurs indépendantes (les deux axes n'entrent jamais en collision) ; `align='center'` est un alias de compatibilité de `middle`.

```vue
<template>
  <lh-row justify="center" align="middle">
    <lh-col :span="6"><view class="cell">6</view></lh-col>
    <lh-col :span="6"><view class="cell">6</view></lh-col>
  </lh-row>
</template>
```

## Décalage et translation

- `offset` : décale le départ de N colonnes vers la droite (départ explicite `offset + 1`)
- `push` / `pull` : déplace le départ vers la droite / la gauche à partir de l'offset

```vue
<template>
  <lh-row>
    <lh-col :span="6" :offset="6"><view class="cell">6 / offset 6</view></lh-col>
    <lh-col :span="9" :push="6"><view class="cell">9 / push 6</view></lh-col>
  </lh-row>
</template>
```

## Points de rupture responsive

`xs` / `sm` / `md` / `lg` / `xl` s'appliquent respectivement en `<640 / ≥640 / ≥768 / ≥1024 / ≥1280px` et, lorsqu'ils ne sont pas déclarés, basculent sur le point défini le plus proche (`xs` servant toujours de recours final). Vous pouvez aussi les déclarer en bloc avec `sizes`.

```vue
<template>
  <lh-row>
    <lh-col :xs="24" :sm="12" :md="8" :lg="6">
      <view class="cell">xs=24 sm=12 md=8 lg=6</view>
    </lh-col>
  </lh-row>
</template>
```

## Props de Row

| Prop | Description | Type | Par défaut |
| --- | --- | --- | --- |
| gutter | Espacement des colonnes (px, ou `[horizontal, vertical]`) | `number \| [number, number]` | `0` |
| justify | Disposition sur l'axe principal | `'start' \| 'center' \| 'end' \| 'space-between' \| 'space-around'` | `'start'` |
| align | Alignement sur l'axe transversal | `'top' \| 'middle' \| 'bottom'` | `'top'` |
| wrap | Retour à la ligne autorisé | `boolean` | `true` |
| customClass | Classe personnalisée (transmise au nœud racine) | `string` | — |
| sx | Propriétés de disposition abrégées sx | `LhSxProps` | — |

## Props de Col

| Prop | Description | Type | Par défaut |
| --- | --- | --- | --- |
| span | Colonnes occupées (grille de 24) | `number` | — |
| offset | Colonnes de décalage initial | `number` | — |
| push | Colonnes de décalage vers la droite | `number` | — |
| pull | Colonnes de décalage vers la gauche | `number` | — |
| xs / sm / md / lg / xl | Taille par point de rupture (`number` ou `{ span, offset }`) | `LhColSize` | — |
| sizes | Déclaration en bloc par point de rupture (équivalent à xs–xl, au choix) | `LhBreakpointSizes` | — |
| customClass | Classe personnalisée (transmise au nœud racine) | `string` | — |
| sx | Propriétés de disposition abrégées sx | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Contenu de la grille (Row et Col exposent tous deux le slot par défaut) |

## Différences entre plateformes

- **Composant de pure mise en page** : aucune surcouche flottante, aucune mesure, aucune dépendance au document ; comportement identique sur H5 et le Mini Programme WeChat.
- **Source des points de rupture** : H5 écoute `matchMedia`, mais **le Mini Programme n'a pas de matchMedia** : il dégrade toujours vers le point `xs` (les règles de repli restent celles de `resolveResponsiveSize` du core de share ; seul le point courant est fixé à `xs`). Si vous avez besoin d'une segmentation par largeur d'écran dans le Mini Programme, branchez `uni.getSystemInfoSync().windowWidth` sur l'interface d'injection de `useLhBreakpoint`, ou définissez une mise en page fixée pour le Mini Programme.
- **Remplacement des balises** : le `<div>` de plus devient `<view>` (WXSS interdit les sélecteurs de balises ; les styles s'appliquent via les classes `lh-row*` / `lh-col*`).
- **Positionnement `grid-column`** : un `span` simple utilise l'auto-placement (`span N`) ; lorsque `offset` / `push` / `pull` sont présents, le départ est positionné explicitement et bridé dans le système de 24 colonnes afin que les combinaisons hors plage ne cassent pas le conteneur.

::: tip Différences avec la version Vue 3
- La structure des composants, la surface des props, les noms de classes et l'algorithme de placement correspondent exactement à plus (même core de share).
- Les balises des sous-composants suivent la convention easycom `lh-row` / `lh-col` (`LhRow` / `LhCol` en import à la demande).
- Une prop `customClass` est ajoutée : les classes personnalisées ne traversent pas `styleIsolation` sous uni-app, elles sont donc transmises via une prop (plus passe les classes directement).
:::
