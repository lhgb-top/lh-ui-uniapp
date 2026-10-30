# Espacement

Sert à espacer des éléments adjacents, en remplacement de marges écrites à la main. L'espacement repose entièrement sur `gap` CSS, supporté nativement sur les deux plateformes.

## Utilisation de base

```vue
<template>
  <lh-space>
    <lh-tag>Encre de Chine</lh-tag>
    <lh-tag>Espace blanc</lh-tag>
    <lh-tag>Style chinois</lh-tag>
  </lh-space>
</template>
```

## Direction

```vue
<template>
  <lh-space direction="vertical">
    <lh-tag>Encre de Chine</lh-tag>
    <lh-tag>Espace blanc</lh-tag>
  </lh-space>
</template>
```

## Échelons d'espacement

Les échelons prédéfinis référencent les jetons d'espacement (personnalisables via `--lh-spacing-*`) ; un nombre est traité en px ; un tableau contrôle séparément les espacements horizontal et vertical.

```vue
<template>
  <lh-space size="small">
    <lh-tag>Petit</lh-tag>
    <lh-tag>Petit</lh-tag>
  </lh-space>
  <lh-space size="medium">
    <lh-tag>Moyen</lh-tag>
    <lh-tag>Moyen</lh-tag>
  </lh-space>
  <lh-space size="large">
    <lh-tag>Grand</lh-tag>
    <lh-tag>Grand</lh-tag>
  </lh-space>
  <lh-space :size="24">
    <lh-tag>24px</lh-tag>
    <lh-tag>24px</lh-tag>
  </lh-space>
  <lh-space :size="[8, 16]">
    <lh-tag>Horizontal 8</lh-tag>
    <lh-tag>Vertical 16</lh-tag>
  </lh-space>
</template>
```

## Alignement et retour à la ligne

```vue
<template>
  <lh-space alignment="center">
    <lh-tag>Centré</lh-tag>
    <lh-button type="primary" size="small">Bouton</lh-button>
  </lh-space>
  <lh-space :wrap="true">
    <lh-tag v-for="i in 20" :key="i">Étiquette {{ i }}</lh-tag>
  </lh-space>
</template>
```

::: tip Le retour à la ligne ne s'applique qu'en direction horizontale
`wrap` n'a de sens que pour `direction="horizontal"` ; en direction verticale, la valeur transmise est ignorée.
:::

## Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| direction | Direction de l'agencement | `'horizontal' \| 'vertical'` | `'horizontal'` |
| size | Espacement : échelon prédéfini / nombre de pixels / [horizontal, vertical] | `'small' \| 'medium' \| 'large' \| number \| [number, number]` | `'medium'` |
| wrap | Autoriser le retour à la ligne (uniquement en horizontal) | `boolean` | `true` |
| alignment | Alignement | `'start' \| 'center' \| 'end' \| 'baseline'` | `'start'` |
| customClass | Nom de classe personnalisé | `string` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Les éléments enfants auxquels donner de l'espacement |
