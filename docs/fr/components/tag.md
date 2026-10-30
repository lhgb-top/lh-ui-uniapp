# Étiquette

## Utilisation de base

```vue
<template>
  <lh-tag>Par défaut</lh-tag>
  <lh-tag type="primary">Principal</lh-tag>
  <lh-tag type="success">Succès</lh-tag>
  <lh-tag type="warning">Avertissement</lh-tag>
  <lh-tag type="danger">Danger</lh-tag>
</template>
```

## Styles et fermeture

```vue
<template>
  <lh-tag round>Arrondi</lh-tag>
  <lh-tag hit>Contour</lh-tag>
  <lh-tag closable @close="onClose">Fermable</lh-tag>
</template>

<script setup lang="ts">
const onClose = () => console.log('Fermé')
</script>
```

## Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| type | Type | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| size | Taille | `'small' \| 'medium' \| 'large'` | — |
| closable | Fermable | `boolean` | `false` |
| disabled | Désactivé | `boolean` | `false` |
| round | Coins arrondis | `boolean` | `false` |
| hit | Contour (sans remplissage) | `boolean` | `false` |
| customClass | Nom de classe personnalisé | `string` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## Events

| Événement | Description | Paramètre de callback |
| --- | --- | --- |
| close | Clic sur le bouton de fermeture | — |

::: tip Différences avec la version Vue3
Le SVG en ligne du bouton de fermeture est remplacé dans cette bibliothèque par lh-icon (solution iconfont).
:::
