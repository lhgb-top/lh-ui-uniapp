# Link lien

Lien hypertexte textuel prenant en charge les types sémantiques, la forme du soulignement et les emplacements d'icônes préfixe/suffixe.

## Utilisation de base

```vue
<template>
  <lh-link>Lien par défaut</lh-link>
  <lh-link type="primary">Lien principal</lh-link>
</template>
```

`type` : `default` (par défaut) / `primary` / `success` / `warning` / `danger` / `info`.

## Soulignement

```vue
<template>
  <lh-link underline="always">Toujours</lh-link>
  <lh-link underline="none">Aucun</lh-link>
</template>
```

`underline` : `always` toujours / `hover` au survol (par défaut) / `none` aucun.

## Désactivé et préfixe/suffixe

```vue
<template>
  <lh-link disabled>Lien désactivé</lh-link>
  <lh-link>
    <template #prefix><lh-icon name="left" /></template>
    Page précédente
  </lh-link>
</template>
```

## Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| href | Adresse du lien (href n'est pas rendu en cas de désactivation) | `string` | — |
| target | Fenêtre cible (H5 uniquement) | `string` | — |
| type | Type sémantique du lien | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` |
| underline | Forme du soulignement | `'always' \| 'hover' \| 'none'` | `'hover'` |
| disabled | Désactivé | `boolean` | `false` |
| current | Marqueur de page courante (émet `aria-current`) | `'page' \| 'location' \| true` | — |
| customClass | Nom de classe personnalisé | `string` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Texte du lien |
| prefix | Emplacement pour l'icône préfixe |
| suffix | Emplacement pour l'icône suffixe |

## Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| click | Clic | `(event: Event)` |

## Différences de plateforme

| Capacité | H5 | Mini Programme |
| --- | --- | --- |
| Support | view + `@click` | Identique à H5 (`href` / `target` n'ont aucune sémantique de navigation ; la navigation est gérée par la couche métier dans l'événement `click`) |
| Soulignement au survol | Oui | Non (`underline="always"` / `"none"` restent visibles ; le soulignement rendu du VIEW dépend du rendu réel) |
