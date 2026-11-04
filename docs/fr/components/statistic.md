# Statistic statistique

Affiche des valeurs statistiques, avec la précision, le regroupement des milliers, les préfixes/suffixes et les grands nombres sous forme de chaînes.

## Utilisation de base

```vue
<template>
  <lh-statistic
    title="Visites annuelles"
    :value="2384712"
  />
</template>
```

## Précision et séparateur

`precision` contrôle les décimales (avec arrondi), et `separator` contrôle le regroupement des milliers (passez une chaîne vide pour le désactiver).

```vue
<template>
  <lh-statistic
    title="Note"
    :value="4.8471"
    :precision="2"
  />
  <lh-statistic
    title="Numéro"
    :value="8899001"
    separator=""
  />
</template>
```

## Préfixe et suffixe

```vue
<template>
  <lh-statistic
    title="Volume d'affaires"
    :value="128600"
    prefix="¥"
    suffix="CNY"
  />
  <lh-statistic
    title="Taux de croissance"
    :value="12.6"
    :precision="1"
    suffix="%"
  />
</template>
```

## Grands nombres et texte non numérique

Une `value` sous forme de chaîne peut porter des nombres très grands : les chaînes d'entiers dépassant `Number.MAX_SAFE_INTEGER` passent par un chemin de formatage de chaîne, sans conversion en Number et sans perte de précision ; les chaînes non analysables comme des nombres sont affichées telles quelles.

```vue
<template>
  <lh-statistic
    title="Étoiles"
    value="Innombrables"
  />
  <lh-statistic
    title="Distance interstellaire"
    value="9007199254740993"
  />
</template>
```

## Slots

Les slots `title` / `prefix` / `suffix` remplacent les props du même nom.

```vue
<template>
  <lh-statistic :value="1024">
    <template #title>
      <text>Titre personnalisé</text>
    </template>
    <template #prefix>
      <text>¥</text>
    </template>
    <template #suffix>
      <text>CNY</text>
    </template>
  </lh-statistic>
</template>
```

## Props

| Propriété | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| title | Titre de la valeur (affiché au-dessus de la valeur) | `string` | — |
| value | Valeur statistique ; une chaîne peut porter des nombres très grands ou du texte signé | `string \| number` | `0` |
| precision | Décimales | `number` | `0` |
| separator | Séparateur de milliers ; une chaîne vide le désactive | `string` | `','` |
| prefix | Préfixe de la valeur, p. ex. un symbole monétaire | `string` | — |
| suffix | Suffixe de la valeur, p. ex. une unité | `string` | — |
| customClass | Nom de classe personnalisé | `string` | — |
| sx | Props de mise en page rapide | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| title | Titre personnalisé |
| prefix | Préfixe personnalisé |
| suffix | Suffixe personnalisé |

## Différences entre plateformes

- Composant purement d'affichage, sans aucun appel à une API de plateforme ; il se comporte de manière identique sur H5 et sur le Mini Program WeChat.
- Toute la logique de formatage (précision, regroupement des milliers, le chemin des chaînes pour les grands nombres) est produite par la fonction pure `formatStatisticValue` de `@lh-ui/share` ; ce dépôt n'écrit que la colle réactive et ne copie jamais l'implémentation du core.
- La zone de valeur porte `aria-live="polite"` : sur H5, les lecteurs d'écran annoncent poliment la nouvelle valeur lorsque `value` change ; la prise en charge de la lecture sur Mini Program dépend des capacités de la plateforme.
- Ce composant n'inclut pas d'animation de comptage (count-up). Si une animation est ajoutée par la suite : `setInterval` et `requestAnimationFrame` sont tous deux disponibles sur le Mini Program, mais `transitionend` n'y est pas fiable, donc la fin de l'animation doit être alignée avec `setTimeout` (même approche que les transitions de message / loading).
