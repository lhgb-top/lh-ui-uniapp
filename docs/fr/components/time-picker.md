# TimePicker (sélecteur d'heure)

Sélecteur d'heure, de minutes et de secondes. Au clic sur le déclencheur, un panneau s'ouvre : chaque colonne (heure / minute / seconde) est une liste à défilement vertical indépendante ; cliquer sur un élément de colonne le sélectionne, et les boutons « Maintenant / OK » en pied de panneau valident la sélection.

## Usage de base

```vue
<template>
  <lh-time-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

Le `format` par défaut est `HH:mm:ss` : le panneau affiche trois colonnes (heure / minute / seconde). Cliquer sur un élément de colonne le sélectionne immédiatement (le panneau reste ouvert) ; « OK » valide un `Date` et ferme le panneau ; « Maintenant » remplit les colonnes avec l'heure courante.

## Format heure et minute

Lorsque `format` ne contient pas `ss`, le panneau n'affiche que les colonnes heure et minute, et l'espace réservé est également généré à partir de `format` :

```vue
<template>
  <lh-time-picker v-model="value" format="HH:mm" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## Plage horaire

`start` / `end` limitent la plage sélectionnable de la colonne des heures (intersection avec 0~23). Une heure mémorisée hors plage est ramenée dans l'intervalle, et « Maintenant » également :

```vue
<template>
  <lh-time-picker v-model="value" :start="8" :end="20" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## Pas

`step-hour` / `step-minute` / `step-second` personnalisent le pas des options de chaque colonne :

```vue
<template>
  <lh-time-picker v-model="value" :step-hour="2" :step-minute="5" :step-second="10" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## Désactivé

`disabled` désactive l'ensemble du sélecteur (le panneau ne s'ouvre pas et l'icône d'effacement est masquée) :

```vue
<template>
  <lh-time-picker v-model="value" disabled />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## Espace réservé et effacement

`placeholder` surcharge le texte de l'espace réservé (à défaut, il est généré à partir de `format` via les clés de langue `timepicker.hour/minute/second`). Lorsqu'une valeur est définie, une icône d'effacement apparaît à droite du déclencheur ; un clic la vide (`clearable` vaut `true` par défaut) :

```vue
<template>
  <lh-time-picker v-model="value" placeholder="Choisir l'heure du rappel" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(null)
</script>
```

## API de TimePicker

### Props

| Propriété | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| modelValue | Heure liée | `Date \| null` | `null` |
| size | Taille | `LhTimePickerSize` | `'medium'` |
| disabled | Désactiver tout le sélecteur | `boolean` | `false` |
| clearable | Afficher le bouton d'effacement | `boolean` | `true` |
| placeholder | Espace réservé (à défaut généré depuis format avec les clés de langue `timepicker.hour/minute/second`) | `string` | — |
| format | Format de l'heure (la colonne des secondes n'apparaît qu'avec `ss`) | `string` | `'HH:mm:ss'` |
| readonly | Marqueur de lecture seule (le déclencheur est une view autodessinée sans état de saisie, donc toujours en lecture seule) | `boolean` | `false` |
| arrowControl | Afficher les boutons fléchés (rendu H5 uniquement, associé au pas au clavier) | `boolean` | `false` |
| start | Heure de début (intersection avec 0~23) | `number` | `0` |
| end | Heure de fin (intersection avec 0~23) | `number` | `24` |
| stepHour | Pas de la colonne des heures | `number` | `1` |
| stepMinute | Pas de la colonne des minutes | `number` | `1` |
| stepSecond | Pas de la colonne des secondes | `number` | `1` |
| customClass | Nom de classe personnalisé (transmis au nœud racine) | `string` | — |
| themeVars | Variables de thème au niveau du composant | `Record<string, string>` | — |
| sx | Props de mise en page rapide (appliquées à la racine du déclencheur ; le panneau flottant n'est pas concerné) | `LhSxProps` | — |

### Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| update:modelValue | Émis lorsque la valeur liée change | `(value: Date \| null)` |
| change | Émis au clic sur « OK » ou sur l'icône d'effacement | `(value: Date \| null)` |

### Accessibilité

- Le déclencheur porte `aria-haspopup="dialog"` / `aria-expanded` / `aria-controls` (le paquet d'attributs est produit par `getTimePickerTriggerAria` de share et lié clé par clé)
- Le panneau est `role="dialog"` ; chaque colonne est `role="listbox"` (son `aria-label` vient des clés de langue `timepicker.hourLabel/minuteLabel/secondLabel`), et chaque élément est `role="option"` avec `aria-selected` / `aria-disabled`
- Le moteur de positionnement est une fonction pure écrite à la main (flip / shift anti-débordement), sans aucune dépendance d'exécution tierce

::: tip Différences de plateforme (différences avec la version Vue3)
- **La molette devient un panneau de colonnes scroll-view** : plus utilise des conteneurs `div` en `overflow-y: auto`, intercepte la molette avec `@wheel.prevent` pour avancer par pas et amène l'élément sélectionné dans la vue via `scrollIntoView` ; sur uni-app, chaque colonne est un `scroll-view` vertical indépendant (`scroll-y`) — la `view` du MP n'a pas de débordement fiable — et l'élément sélectionné est ramené dans la vue via `scroll-into-view` (le MP n'a pas d'API `scrollIntoView`). L'interaction de sélection est inchangée : cliquer un élément de colonne pour le sélectionner, puis valider avec les boutons « Maintenant / OK ».
- **Le pas à la molette n'est pas reporté** : le défilement interne de la colonne est délégué au défilement natif de `scroll-view` (sur H5, la molette fait naturellement défiler la longue liste) ; l'événement wheel n'est plus intercepté pour sauter par pas. La génération des options avec pas (`step-hour`, etc.) est identique à plus.
- **La navigation au clavier est réservée à H5** : le déclencheur ouvre le panneau avec Enter/Space/flèche bas et place le focus dans la première colonne ; dans le panneau, ↑↓ avancent selon le pas configuré (l'heure reboucle puis est ramenée dans la plage start/end), ←→ déplacent le focus entre les colonnes, Enter/Space valident et ferment, et Escape ferme via un écouteur au niveau du document (en cas de superposition de plusieurs calques, seul le plus haut est fermé). Tout le bloc de traitement est supprimé par compilation conditionnelle, sans code mort dans le bundle MP.
- **arrowControl est réservé à H5** : les boutons fléchés dépendent de la sémantique du pas au clavier et ne sont pas rendus sur MP (le `v-if` du gabarit est gardé par la constante de compilation `LH_IS_H5`).
- **Fermeture au clic extérieur** : plus écoute les clics du document ; uni-app s'appuie sur un masque transparent dans la page (cliquer le masque ferme sans émettre change).
- **Déclencheur autodessiné** : le déclencheur de plus est un `<input>` éditable ; sur uni-app il est dessiné avec `<view>` + `<text>` (le MP n'a pas de sémantique de focus d'input dans le déclencheur, la couleur de l'espace réservé vient d'une classe modifiée, et `readonly` est donc toujours actif).
- **Icône du déclencheur** : plus utilise l'icône `date` ; cette bibliothèque utilise l'icône `clock`, plus pertinente.
- **Aucune transition d'entrée/sortie** : `Transition` n'est pas fiable sur MP — le panneau s'affiche et se masque directement, conformément à tooltip / dropdown / popover / cascader.
:::
