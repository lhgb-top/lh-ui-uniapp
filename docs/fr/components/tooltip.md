# Tooltip (infobulle)

## Utilisation de base

```vue
<template>
  <lh-tooltip content="Ceci est une infobulle">
    <lh-button>Cliquez pour voir l'infobulle</lh-button>
  </lh-tooltip>
</template>
```

::: warning Le Mini Programme n'a pas de sémantique de survol
La valeur par défaut de `trigger` est `click` (utilisable sur toutes les plateformes). `hover` n'est valable qu'en H5 —
côté Mini Programme, utilisez `trigger="click"`, déclenchement par clic / toucher pour ouvrir et fermer.
:::

## Position et largeur

```vue
<template>
  <lh-tooltip content="Infobulle en bas" placement="bottom">
    <lh-button>bottom</lh-button>
  </lh-tooltip>

  <lh-tooltip content="Les longs textes reviennent à la ligne automatiquement" :max-width="200" placement="top">
    <lh-button>Largeur limitée</lh-button>
  </lh-tooltip>
</template>
```

## Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| content | Texte de l'infobulle | `string` | — |
| placement | Position du calque (12 positions) | `LhTooltipPlacementCore` | `'top'` |
| trigger | Mode de déclenchement : `click` (toutes plateformes) / `hover` (uniquement H5) | `'click' \| 'hover'` | `'click'` |
| showDelay | Délai d'affichage (ms) | `number` | — |
| hideDelay | Délai de masquage (ms) | `number` | — |
| maxWidth | Largeur maximale (le contenu revient à la ligne) | `string \| number` | — |
| disabled | Désactivé | `boolean` | `false` |
| customClass | Nom de classe personnalisé | `string` | — |
| themeVars | Variables de thème de niveau composant | `Record<string, string>` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## Events

| Événement | Description | Paramètre de callback |
| --- | --- | --- |
| update:modelValue | Changement d'affichage (usage contrôlé) | `(visible: boolean)` |
| show | Affichage | — |
| hide | Masquage | — |

::: tip Différences avec la version Vue3
- Le calque passe par `root-portal` + mesure asynchrone sur deux images (rendu transparent pour mesurer -> positionnement -> affichage, pour éviter le clignotement).
- Côté MP, `showDelay` / `hideDelay` ne conservent un comportement immédiat qu'en mode click.
- Le calcul du positionnement est asynchrone (`getLhRect` renvoie une Promise) : ne supposez pas que le résultat est disponible de manière synchrone.
:::
