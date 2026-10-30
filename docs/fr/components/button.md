# Bouton

Composant de bouton de base. Le support de rendu est le `<button>` intégré d'uni (compilé en bouton natif sur chaque plateforme) ; l'événement de clic est compilé par uni en `bindtap`.

## Utilisation de base

```vue
<template>
  <lh-button>Par défaut</lh-button>
  <lh-button type="primary">Principal</lh-button>
  <lh-button type="success">Succès</lh-button>
  <lh-button type="warning">Avertissement</lh-button>
  <lh-button type="danger">Danger</lh-button>
  <lh-button type="info">Information</lh-button>
</template>
```

## États et formes

```vue
<template>
  <lh-button loading>Chargement</lh-button>
  <lh-button disabled>Désactivé</lh-button>
  <lh-button plain>Simple</lh-button>
  <lh-button round>Arrondi</lh-button>
  <lh-button circle icon="search" />
  <lh-button block>Bloc (pleine largeur)</lh-button>
  <lh-button icon="search" type="primary">Avec icône</lh-button>
</template>
```

## Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| type | Type | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| size | Taille ; si omise, hérite de ConfigProvider | `'small' \| 'medium' \| 'large'` | — |
| loading | État de chargement | `boolean` | `false` |
| disabled | Désactivé | `boolean` | `false` |
| plain | Style simple (contour) | `boolean` | `false` |
| block | Mise en page bloc | `boolean` | `false` |
| round | Coins arrondis | `boolean` | `false` |
| circle | Circulaire | `boolean` | `false` |
| icon | Nom de l'icône | `LhIconName` | — |
| customClass | Nom de classe personnalisé (transmis au nœud racine) | `string` | — |
| themeVars | Variables de thème de niveau composant | `Record<string, string>` | — |
| bgPattern | Motif d'arrière-plan de niveau composant | `string` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## Events

| Événement | Description | Paramètre de callback |
| --- | --- | --- |
| click | Clic | `(event)` |

::: tip Différences avec la version Vue3
Le bouton du Mini Programme n'a pas de sémantique `nativeType` / `href` / `target` : ces trois propriétés **ne sont pas implémentées** dans cette bibliothèque. Le reste de l'API est identique.
:::
