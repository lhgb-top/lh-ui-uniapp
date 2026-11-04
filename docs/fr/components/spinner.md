# Spinner (Cercle de chargement)

Figure rotative de base indiquant un état en cours. La surcouche de chargement (le service LhLoading) la rend également en interne.

## Utilisation de base

Cinq tailles : `mini` / `small` / `medium` / `large` / `x-large`. Les diamètres proviennent d'une seule constante de correspondance (`LH_SPINNER_SIZE_PX`) du core de `@lh-ui/share` (12 / 16 / 24 / 32 / 40 px).

```vue
<template>
  <lh-spinner />
  <lh-spinner size="mini" />
  <lh-spinner size="small" />
  <lh-spinner size="medium" />
  <lh-spinner size="large" />
  <lh-spinner size="x-large" />
</template>
```

## Couleur personnalisée

`color` accepte n'importe quelle valeur de couleur CSS ; en l'absence de valeur, la figure hérite de la couleur de texte courante (`currentColor`).

```vue
<template>
  <lh-spinner color="#C4A35A" />
  <lh-spinner color="#5B8C5A" />
  <lh-spinner color="#B5462F" />
</template>
```

## Hériter de la couleur du texte

Sans `color`, la figure suit la couleur de texte du conteneur où elle se trouve, ce qui convient aux mises en page mêlées à du texte.

```vue
<template>
  <view class="row">
    <text>Chargement…</text>
    <lh-spinner size="small" />
  </view>
</template>
```

## Props

| Propriété | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| size | Taille | `'mini' \| 'small' \| 'medium' \| 'large' \| 'x-large'` | `'medium'` |
| color | Couleur de rotation (toute valeur de couleur CSS ; par défaut hérite de currentColor) | `string` | — |
| customClass | Nom de classe personnalisé | `string` | — |
| sx | Props de mise en page rapide | `LhSxProps` | — |

## Différences entre plateformes

- **L'animation de rotation est une animation CSS pure** : elle ne s'appuie sur aucune API de plateforme, fonctionne partout et se comporte de manière identique sur H5 et sur le Mini Program WeChat.
- **Le rendu de la figure dépend de la plateforme** : sur H5, il s'agit d'un anneau svg tracé (double animation `stroke-dasharray`, identique au pixel près à la version Vue 3) ; le Mini Program ne prend pas en charge les balises de template svg, l'anneau est donc remplacé par un anneau `view` + `border` — trois côtés colorés forment un arc d'environ les trois quarts du cercle (visuellement isomorphe à l'arc de 72 % de la version Vue 3) et l'épaisseur du trait est calculée en ligne à 10 % du diamètre (avec un minimum de 1 px). Sur les deux plateformes, la rotation est une animation CSS, donc aucune capacité peu fiable en Mini Program telle que `transitionend` n'est sollicitée.
- **La couleur passe par currentColor** : la prop `color` est écrite dans le style `color` inline du nœud racine et la figure en hérite, exactement comme dans la version Vue 3.
- **Accessibilité** : la figure est purement décorative et est retirée de l'arbre d'accessibilité via `aria-hidden="true"` ; l'état « en cours » doit être porté par le conteneur parent (par exemple `role="status"`).
- **Réduction du mouvement** : la dégradation en demi-anneau statique sous `prefers-reduced-motion` est fournie par les sources scss de `@lh-ui/share` ; ce bloc de media query est entièrement supprimé lors de la compilation du Mini Program (WXSS ne le prend pas en charge), donc la dégradation ne s'applique qu'au H5.
- **Conclusion du portage** : Spinner est un composant purement d'affichage (ni mesure, ni superposition, ni dépendance au document) ; la correspondance des tailles et les noms de classes sont produits par les fonctions pures du core de `@lh-ui/share` (`getSpinnerClassNames` / `LH_SPINNER_SIZE_PX`), et ce dépôt n'écrit que la colle réactive.
