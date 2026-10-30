# Séparateur

Sépare des contenus différents ; prend en charge la sémantique de groupe avec du texte.

## Utilisation de base

```vue
<template>
  <view>Texte précédent</view>
  <lh-divider />
  <view>Texte suivant</view>
</template>
```

## Avec du texte

```vue
<template>
  <lh-divider>Encre de Chine</lh-divider>
  <lh-divider label-position="left">Aligné à gauche</lh-divider>
  <lh-divider label-position="right">Aligné à droite</lh-divider>
</template>
```

## Tirets et style de bordure

```vue
<template>
  <lh-divider dashed />
  <lh-divider border-style="dotted" />
</template>
```

`borderStyle` est prioritaire sur `dashed` ; seuls `dashed` / `dotted` disposent d'un style correspondant, les autres valeurs sont rendues en trait plein par défaut.

## Direction verticale

```vue
<template>
  <lh-space>
    <span>Encre de Chine</span>
    <lh-divider direction="vertical" />
    <span>Espace blanc</span>
  </lh-space>
</template>
```

::: tip Hauteur du séparateur vertical
Le séparateur vertical est en `inline-block` ; dans une ligne flex, il s'étend sur toute la hauteur du parent grâce à `align-self: stretch` ; placé seul dans un conteneur de bloc, il ne fait que `1em` de haut — il s'utilise de préférence dans une ligne flex.
:::

## Vertical avec du texte

La direction verticale supporte également le texte : les traits sont disposés au-dessus et au-dessous du texte, le rôle est promu à `role="separator"` et `aria-orientation="vertical"` est déclaré.

```vue
<template>
  <view class="vertical-text-row">
    <text>Haut</text>
    <lh-divider direction="vertical">Encre de Chine</lh-divider>
    <text>Bas</text>
  </view>
</template>

<style>
.vertical-text-row {
  display: flex;
  align-items: center;
  height: 120px;
}
</style>
```

::: tip La hauteur du séparateur vertical avec texte provient de la ligne parente
Le séparateur vertical avec texte obtient sa hauteur via `align-self: stretch` de la ligne parente, pour que les traits s'étendent — le conteneur parent doit être une ligne flex à hauteur déterminée (comme le `height: 120px` de l'exemple ci-dessus). Dans un conteneur de bloc, les traits ne conservent qu'une longueur minimale de 12px.
:::

::: tip labelPosition est sans effet en direction verticale
`label-position` est la sémantique d'alignement gauche / droite de la direction horizontale ; en direction verticale, le texte est toujours centré et aucune classe de décoration n'est produite.
:::

## Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| direction | Direction | `'horizontal' \| 'vertical'` | `'horizontal'` |
| dashed | Trait en tirets | `boolean` | `false` |
| labelPosition | Position d'alignement du texte (valable en horizontal, toujours centré en vertical) | `'left' \| 'center' \| 'right'` | `'center'` |
| borderStyle | Style de bordure (prioritaire sur dashed) | `string` | — |
| customClass | Nom de classe personnalisé | `string` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Texte du séparateur (à gauche / à droite en horizontal, au-dessus / au-dessous en vertical) |
