# Barre de progression

Affiche la progression d'une tâche ; prend en charge les couleurs de statut, les couleurs personnalisées et le formatage du texte.

## Utilisation de base

```vue
<template>
  <lh-progress :percentage="42" />
</template>
```

## Statuts

```vue
<template>
  <lh-progress :percentage="70" status="success" />
  <lh-progress :percentage="70" status="warning" />
  <lh-progress :percentage="70" status="exception" />
  <lh-progress :percentage="100" />
</template>
```

Lorsque `status` vaut `normal` et que 100 est atteint, le statut est automatiquement considéré comme `success`.

## Épaisseur du trait et masquage du texte

```vue
<template>
  <lh-progress :percentage="60" :stroke-width="12" />
  <lh-progress :percentage="60" :show-text="false" />
</template>
```

## Couleur personnalisée

Une chaîne est directement utilisée comme couleur de la barre ; une fonction renvoie une couleur en fonction du pourcentage.

```vue
<template>
  <lh-progress :percentage="60" color="#C4A35A" />
  <lh-progress :percentage="60" :color="gradient" />
</template>

<script setup lang="ts">
const gradient = (p: number) => `rgb(${p}, 0, 0)`
</script>
```

## Formatage personnalisé et slot de texte

```vue
<template>
  <lh-progress :percentage="42" :format="format" />
  <lh-progress :percentage="42">
    <template #text="{ percentage }">
      <text>{{ percentage }} / 100</text>
    </template>
  </lh-progress>
</template>

<script setup lang="ts">
const format = (p: number) => `Progression ${p}`
</script>
```

## Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| percentage | Pourcentage de progression 0-100 (les valeurs hors plage sont automatiquement ramenées par clamp) | `number` | `0` |
| type | Type | `'line' \| 'circle'` | `'line'` |
| status | Statut | `'normal' \| 'success' \| 'warning' \| 'exception'` | `'normal'` |
| color | Couleur de la barre : chaîne ou fonction renvoyant une couleur selon le pourcentage | `string \| ((percentage: number) => string)` | — |
| strokeWidth | Épaisseur du trait (px) | `number` | `6` |
| width | Largeur de la zone de dessin en mode circulaire (px) | `number` | `126` |
| showText | Afficher le texte | `boolean` | `true` |
| format | Formatage personnalisé du texte | `(percentage: number) => string` | — |
| customClass | Nom de classe personnalisé | `string` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## Slots

| Slot | Description | Paramètres de scope |
| --- | --- | --- |
| text | Texte de progression personnalisé | `{ percentage: number }` |

::: tip Le type circle n'est pas encore implémenté
Le Mini Programme a un support limité de svg : la première version n'implémente que le type line. Avec `type="circle"`, le rendu se fait en mode line et un avertissement est émis une fois en développement (pas de dégradation silencieuse) ; le type circle est prévu pour la deuxième version.
:::
