# Rate (notation)

Notation par étoiles : clic pour sélectionner, demi-étoiles et texte de score optionnels ; le mode lecture seule expose la note sous forme de texte pour les lecteurs d'écran. Les niveaux de remplissage, le bridage et l'incrément proviennent de fonctions pures du core de `@lh-ui/share`.

## Utilisation de base

```vue
<template>
  <lh-rate v-model="value" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const value = ref(3)
</script>
```

## Demi-étoiles

`allow-half` active les demi-étoiles : sur H5, cliquer sur la moitié gauche d'une étoile compte 0,5 (d'après le décalage horizontal du clic).

```vue
<template>
  <lh-rate v-model="value" allow-half />
</template>
```

## Lecture seule et texte de score

`readonly` bascule vers une branche d'affichage pur (`role="img"` avec la note dans `aria-label`) ; `show-score` ajoute un texte de score et `score-template` le personnalise (placeholder `{n}`).

```vue
<template>
  <lh-rate :model-value="3.5" readonly allow-half show-score />
  <lh-rate :model-value="4" readonly show-score score-template="{n} pts" />
</template>
```

## Nombre d'étoiles et caractère personnalisés

`max` ajuste la limite d'étoiles (bridée à [0, max]) ; `character` remplace le `★` par défaut.

```vue
<template>
  <lh-rate :model-value="5" :max="8" character="墨" />
</template>
```

## Désactivé

`disabled` désactive tout le groupe : les clics sont ignorés et la racine reçoit `lh-rate--disabled` ainsi que `aria-disabled`.

## Props

| Prop | Description | Type | Par défaut |
| --- | --- | --- | --- |
| modelValue / v-model | Note actuelle | `number` | `0` |
| max | Limite d'étoiles | `number` | `5` |
| allow-half | Autoriser les demi-étoiles | `boolean` | `false` |
| readonly | Lecture seule (affichage pur) | `boolean` | `false` |
| disabled | Désactivé | `boolean` | `false` |
| character | Caractère personnalisé | `string` | — |
| show-score | Afficher le texte de score | `boolean` | `false` |
| score-template | Gabarit de score (placeholder `{n}`) | `string` | — |
| customClass | Classe personnalisée (transmise au nœud racine) | `string` | — |
| sx | Propriétés de disposition abrégées sx | `LhSxProps` | — |

## Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| update:modelValue / change | Note modifiée (une même valeur n'est jamais réémise) | `(value: number)` |

## Différences entre plateformes

- **La détection de demi-étoile est H5 uniquement** : elle repose sur le décalage horizontal de l'événement clic (`offsetX`), que **les événements du Mini Programme ne portent pas** — les clics y dégénèrent en étoiles entières. Si vous avez besoin de la précision demi-étoile sur le Mini Programme, implémentez-la vous-même via les événements touch + le calcul asynchrone de décalage avec `uni.createSelectorQuery` (attention, SelectorQuery est asynchrone).
- **Élément porteur de l'étoile** : les étoiles `<button>` de plus deviennent `<view role="radio">` (les button de MP ne peuvent pas réinitialiser leurs styles par défaut) ; l'état désactivé s'exprime par le garde de clic + la classe modifiée `--disabled` + `aria-disabled`.
- **Incrément clavier H5 uniquement** : flèches ±1 (±0,5 avec demi-étoiles), Home remet à zéro, End au maximum ; les Mini Programmes n'ont pas d'événements clavier, donc aucun écart de comportement.
- **Texte de score** : provient de `rate.stars` dans les locales de share (`{n} 星`, neuf langues complètes) ; `score-template` peut le remplacer.

::: tip Différences avec la version Vue 3
- La sémantique logique (bridage, niveaux de remplissage, incrément, aria) correspond exactement à plus (même core de share).
- Une prop `customClass` est ajoutée : les classes personnalisées ne traversent pas `styleIsolation` sous uni-app, elles sont donc transmises via une prop.
- La détection de demi-étoile degrade en étoiles entières sur le Mini Programme (voir « Différences entre plateformes »).
:::
