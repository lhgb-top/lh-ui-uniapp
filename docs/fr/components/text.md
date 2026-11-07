# Text texte

Composant typographique tout-en-un pour les titres, le texte courant, l'ellipse et la copie ; tous les modificateurs sémantiques reposent sur des classes modificateurs BEM.

## Niveau

```vue
<template>
  <lh-text level="h1">Titre 1</lh-text>
  <lh-text level="p">Paragraphe</lh-text>
  <lh-text level="caption">Note auxiliaire</lh-text>
</template>
```

`level` accepte `h1` ~ `h6` / `p` (par défaut) / `caption`. Une valeur invalide est dégradée en `p`.

## Sémantique et modificateurs

```vue
<template>
  <lh-text type="success" strong>Succès et gras</lh-text>
  <lh-text mark>Surligné</lh-text>
  <lh-text code>Style code</lh-text>
</template>
```

`type` : `default` (par défaut) / `secondary` / `success` / `warning` / `danger` ; propriétés modificatrices : `strong` / `italic` / `underline` / `mark` / `code` / `disabled`.

## Ellipse

```vue
<template>
  <lh-text :ellipsis="true">Ellipse d'une ligne</lh-text>
  <lh-text :ellipsis="2">Ellipse de deux lignes</lh-text>
</template>
```

`ellipsis` à `true` coupe à une ligne ; un nombre coupe selon le nombre de lignes indiqué (maximum 10 ; l'ellipse multiligne utilise `-webkit-line-clamp` en ligne).

## Copie

```vue
<template>
  <lh-text copyable copy-text="Texte fixe">Copier avec le bouton</lh-text>
</template>
```

`copyable` ajoute un bouton de copie : le clic écrit dans le presse-papiers, bascule brièvement sur « Copié » et émet l'événement `copy` (l'argument est le texte réellement écrit).

::: tip Copie sur le Mini Programme
Sur H5, lorsque `copy-text` n'est pas fourni, le texte du slot est utilisé automatiquement ; **le Mini Programme ne peut pas lire le texte du slot, `copy-text` est donc obligatoire**, sinon le bouton n'écrit rien (le clic émet tout de même l'événement `copy`). Les libellés proviennent du paquet de langue `text.copy` / `text.copied` et peuvent être remplacés via `copy-label`.
:::

## Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| level | Niveau de titre et forme de paragraphe | `'h1' \| ... \| 'h6' \| 'p' \| 'caption'` | `'p'` |
| type | Couleur sémantique | `'default' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'default'` |
| strong / italic / underline / mark / code / disabled | Modificateurs booléens | `boolean` | `false` |
| ellipsis | Ellipse : `true` pour une ligne, un nombre pour le nombre de lignes | `boolean \| number` | `false` |
| copyable | Ajoute le bouton de copie | `boolean` | `false` |
| copyLabel | Nom accessible du bouton de copie | `string` | — |
| copyText | Texte à copier (obligatoire sur le Mini Programme) | `string` | — |
| customClass | Nom de classe personnalisé | `string` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| copy | Clic sur le bouton de copie | `(text: string)` |

## Différences de plateforme

| Capacité | H5 | Mini Programme |
| --- | --- | --- |
| Support de rendu | view (la typographie repose sur les classes `lh-text--<level>`) | Identique à H5 |
| Copie | Prend le texte du slot automatiquement sans `copy-text` (`navigator.clipboard`) | `copy-text` obligatoire ; passe par `uni.setClipboardData` (avec une notification système) |
