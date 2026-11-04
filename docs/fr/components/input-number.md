# InputNumber

Champ de saisie numérique : changez la valeur en saisissant ou via les boutons d'incrémentation/décrémentation, avec bornage de plage, pas, précision et pas stricts. La normalisation des paramètres, l'incrément et le bornage à la validation proviennent tous des fonctions pures du core de `@lh-ui/share`.

## Utilisation de base

```vue
<template>
  <lh-input-number v-model="value" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const value = ref<number | null>(1)
</script>
```

## Limites de plage

`min` / `max` contraignent à la fois l'incrément par boutons et la validation de la saisie (les valeurs hors plage sont ramenées dans les bornes).

```vue
<template>
  <lh-input-number v-model="level" :min="1" :max="10" />
</template>
```

## Pas et précision

`step` ajuste le pas ; `precision` fixe les décimales (appliquée avant le bornage) ; `step-strictly` aligne la valeur saisie sur la grille du pas (arrondi).

```vue
<template>
  <lh-input-number v-model="value" :step="2" />
  <lh-input-number v-model="value" :precision="2" placeholder="2 décimales" />
  <lh-input-number v-model="value" :step="10" step-strictly placeholder="multiples de 10 uniquement" />
</template>
```

## Tailles et boutons de contrôle

`size` bascule entre small / medium / large ; `controls` masque les boutons d'incrémentation/décrémentation (saisie seule).

```vue
<template>
  <lh-input-number v-model="value" size="small" />
  <lh-input-number v-model="value" size="large" />
  <lh-input-number v-model="value" :controls="false" placeholder="sans boutons" />
</template>
```

## Désactivation et nom de formulaire

`disabled` désactive l'ensemble (boutons non cliquables, saisie impossible) ; `name` est le nom de formulaire natif.

```vue
<template>
  <lh-input-number :model-value="5" disabled />
  <lh-input-number v-model="value" name="quantity" />
</template>
```

## Props

| Prop | Description | Type | Défaut |
| --- | --- | --- | --- |
| modelValue / v-model | Valeur actuelle (null pour vide) | `number \| null` | `null` |
| min | Minimum | `number` | `-Infinity` |
| max | Maximum | `number` | `Infinity` |
| step | Pas | `number` | `1` |
| step-strictly | Seuls les multiples du pas sont acceptés | `boolean` | `false` |
| precision | Précision numérique (décimales) | `number` | — |
| disabled | Désactivé | `boolean` | `false` |
| size | Taille | `"small" \| "medium" \| "large" \| "mini" \| "x-large"` | `'medium'` |
| controls | Afficher les boutons de contrôle | `boolean` | `true` |
| placeholder | Texte indicatif | `string` | `''` |
| name | Nom de formulaire natif | `string` | `''` |
| customClass | Nom de classe personnalisé (transmis au nœud racine) | `string` | — |
| sx | Propriétés de mise en page abrégées sx | `LhSxProps` | — |

## Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| update:modelValue / change | Valeur validée (les boutons valident immédiatement ; la valeur saisie est validée au blur / à la confirmation, au même moment que le change natif de plus) | `(value: number \| null)` |

## Différences de plateforme

- **Moment de validation (modèle brouillon)** : le composant input d'uni n'a pas d'événement change natif (les mini-programmes n'ont que input / blur / confirm) ; la saisie ne synchronise qu'un brouillon interne et valide en une fois au blur ou à confirm (Entrée en H5 / le « terminé » du clavier en MP) — équivalent au change natif de plus qui ne se déclenche qu'à la validation (même approche que la version React). La même valeur n'est jamais émise deux fois (en MP, un blur suit le confirm ; la déduplication évite les émissions en double).
- **Boutons en view auto-dessinés** : les `<button>` de plus deviennent `<view role="button">` (les boutons MP ne peuvent pas réinitialiser leurs styles par défaut) ; le clic fonctionne sur toutes les plateformes. Les view n'ont pas de pseudo-classe `:disabled`, l'apparence désactivée est donc fournie par une règle de secours en ligne du composant avec les mêmes tokens.
- **Incrément au clavier (flèches) en H5 uniquement** : ↑ incrémente / ↓ décrémente (la validation par Entrée n'est pas câblée sur keydown — en H5 les événements keydown et confirm se déclenchent ensemble, la validation passe donc uniquement par confirm pour éviter une double soumission) ; les mini-programmes n'ont pas d'événements clavier, donc aucun écart de comportement.
- **Style du placeholder** : la règle `::placeholder` de share ne part que dans le bundle H5 ; côté mini-programme on utilise la prop `placeholder-style` (couleur de secours par token).
- **Liaison avec la validation de formulaire non câblée** : plus émet `aria-invalid` sur l'input via le contexte de formulaire ; la famille input de ce paquet ne câble pas ce passage d'aria, sans effet sur les valeurs ni sur la validation.

::: tip Différences avec la version Vue 3
- La sémantique logique (normalisation des paramètres, incrément, bornage precision / min/max / stepStrictly) correspond exactement à plus (même core share).
- Une prop `customClass` est ajoutée : dans uni-app les classes personnalisées ne traversent pas `styleIsolation`, elles sont donc transmises via une prop.
- Moment de validation de la valeur saisie : voir la première entrée des « Différences de plateforme » (modèle brouillon, équivalent au change de plus).
:::
