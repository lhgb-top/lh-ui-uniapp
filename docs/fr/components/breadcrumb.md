# Fil d'Ariane (Breadcrumb)

Affiche le chemin de la page courante afin de revenir rapidement à n'importe quel niveau précédent.

## Utilisation de base

```vue
<template>
  <lh-breadcrumb separator="/">
    <lh-breadcrumb-item>Accueil</lh-breadcrumb-item>
    <lh-breadcrumb-item>Composants</lh-breadcrumb-item>
    <lh-breadcrumb-item>Fil d'Ariane</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## Éléments cliquables

Les éléments autres que le dernier, munis de la prop `to`, sont rendus sous forme de lien et naviguent via `uni.navigateTo` au clic (l'url doit être un chemin de page commençant par `/`).

```vue
<template>
  <lh-breadcrumb>
    <lh-breadcrumb-item to="/pages/index/index">Accueil</lh-breadcrumb-item>
    <lh-breadcrumb-item to="/pages/component/index">Composants</lh-breadcrumb-item>
    <lh-breadcrumb-item>Fil d'Ariane</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## Réduction

`maxItems` plafonne le nombre d'éléments visibles (points de suspension inclus) : au-delà, on conserve le premier élément, des points de suspension et les derniers éléments ; cliquez sur les points de suspension pour tout développer.

```vue
<template>
  <lh-breadcrumb :max-items="3">
    <lh-breadcrumb-item>Accueil</lh-breadcrumb-item>
    <lh-breadcrumb-item>Événements</lh-breadcrumb-item>
    <lh-breadcrumb-item>Liste</lh-breadcrumb-item>
    <lh-breadcrumb-item>Détail</lh-breadcrumb-item>
    <lh-breadcrumb-item>Avis</lh-breadcrumb-item>
  </lh-breadcrumb>
</template>
```

## Breadcrumb Props

| Prop | Description | Type | Par défaut |
| --- | --- | --- | --- |
| separator | Caractère séparateur | `string` | `'/'` |
| maxItems | Nombre maximum d'éléments visibles (premier élément + points de suspension + derniers éléments) ; au-delà, réduction ; `0` désactive la réduction | `number` | `0` |
| customClass | Nom de classe personnalisé | `string` | — |
| sx | Raccourcis de mise en page | `LhSxProps` | — |

## BreadcrumbItem Props

| Prop | Description | Type | Par défaut |
| --- | --- | --- | --- |
| to | Adresse cible ; si définie et non dernier élément, rendu en lien et navigation via `uni.navigateTo` au clic | `string` | — |
| customClass | Nom de classe personnalisé | `string` | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Contenu textuel de l'élément du fil d'Ariane |

::: tip Différences avec la version Vue 3
- `to` n'utilise pas vue-router (un projet uni-app n'a pas de routeur) : la navigation passe toujours par `uni.navigateTo` ; sur H5, elle suit la stratégie de routage H5 d'uni.
- `<nav>/<ol>/<li>` sont remplacés par `<view>` (WXSS interdit les sélecteurs de balises) ; `aria-current="page"` et `aria-label` sont conservés.
- La logique de réduction / points de suspension réutilise les mêmes fonctions pures de share core, identique à plus.
:::
