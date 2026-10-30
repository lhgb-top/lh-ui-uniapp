# Carte

Conteneur d'agrégation d'informations ; prend en charge la couverture, l'en-tête, le corps, le pied et l'espace réservé de chargement.

## Utilisation de base

```vue
<template>
  <lh-card title="Encre de Chine">
    <view>Contenu de la carte</view>
  </lh-card>
</template>
```

## Couverture et pied

```vue
<template>
  <lh-card title="Album de paysages">
    <template #cover>
      <image class="cover" src="https://placeholder.invalid/cover.png" mode="aspectFill" />
    </template>
    <view>Contenu de la carte</view>
    <template #footer>
      <view>Actions du pied</view>
    </template>
  </lh-card>
</template>
```

::: tip Les éléments enfants de la couverture doivent définir leur propre largeur
La règle de share « l'élément enfant de la couverture remplit la largeur » (`.lh-card__cover > *`) repose sur le sélecteur universel, que WXSS ne supporte pas et que le pipeline de sanitisation rejette. Côté Mini Programme, donnez explicitement une largeur aux éléments enfants de la couverture, comme `<image>` (par ex. `width: 100%`).
:::

## Zone d'actions à droite de l'en-tête

Le slot `extra` est rendu à droite du titre et n'apparaît que si `title` ou le slot `header` est présent.

```vue
<template>
  <lh-card title="Commande">
    <template #extra>
      <lh-button size="small" text>Voir plus</lh-button>
    </template>
    <view>Contenu de la carte</view>
  </lh-card>
</template>
```

## Ombre et cliquabilité

```vue
<template>
  <lh-card shadow="hover" clickable @click="onClick">
    <view>S'élève au survol, déclenche un événement au clic</view>
  </lh-card>
</template>

<script setup lang="ts">
const onClick = () => console.log('Clic sur la carte')
</script>
```

## Espace réservé de chargement

```vue
<template>
  <lh-card title="Encre de Chine" loading>
    <view>Non rendu pendant le chargement du contenu</view>
  </lh-card>
</template>
```

## Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| title | Titre de la carte (le slot header est également possible) | `string` | — |
| shadow | Moment d'affichage de l'ombre | `'always' \| 'hover' \| 'never'` | `'always'` |
| clickable | Toute la carte est cliquable (assume la sémantique clavier d'un button) | `boolean` | `false` |
| loading | État de chargement : la zone de contenu est remplacée par un squelette | `boolean` | `false` |
| themeVars | Variables de thème de niveau composant (le préfixe `--lh-` est ajouté automatiquement aux clés) | `Record<string, string>` | — |
| bgPattern | URL du motif d'arrière-plan (par ex. `var(--lh-pattern-willow)`), non soumise à la liste blanche globale | `string` | — |
| customClass | Nom de classe personnalisé | `string` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## Events

| Événement | Description | Paramètre de callback |
| --- | --- | --- |
| click | Clic sur la carte (uniquement lorsque `clickable` est activé) | `(e: Event)` |

## Slots

| Slot | Description |
| --- | --- |
| cover | Couverture |
| header | En-tête (prioritaire sur title) |
| extra | Zone d'actions à droite de l'en-tête (nécessite la présence de l'en-tête) |
| default | Contenu principal |
| footer | Pied |

::: tip Activation clavier uniquement sur H5
Une carte `clickable` supporte, en H5, l'activation clavier via Entrée / Espace (alignée sur le pattern button du APG) ; le Mini Programme n'a pas d'événements clavier, ce traitement est retiré côté MP par compilation conditionnelle.
:::
