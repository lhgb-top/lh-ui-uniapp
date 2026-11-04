# DatePicker (sélecteur de date)

Sélecteur de date : tapez la boîte déclencheuse pour ouvrir un panneau calendrier qui prend en charge trois modes de sélection (date / mois / année), un format d’affichage personnalisé et l’écho des valeurs de plage. La génération de la grille du calendrier, le formatage des dates et la vérification de désactivation consomment toutes des fonctions pures de `@lh-ui/share` core, et le panneau est une grille `view` dessinée à la main, donc le rendu est identique sur H5 et le Mini Programme WeChat.

## Contrat de type de valeur

La valeur liée est **toujours un objet `Date`** (une plage est un tuple `[Date, Date]`) ; le composant n’accepte ni n’émet de chaînes de date ISO :

```vue
<template>
  <lh-date-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
// ✅ Correct : un objet Date
const value = ref<Date | null>(new Date(2026, 10, 3))
// ❌ Incorrect : '2026-11-03' n’est ni affiché ni analysé
</script>
```

La prop `format` n’affecte que **l’affichage dans le déclencheur et le panneau** (jetons à largeur fixe `yyyy` / `MM` / `dd` / `HH` / `mm` / `ss`) ; elle ne change jamais la forme de la valeur liée. Ce que vous recevez est un `Date` ; appelez vous-même `formatDate` ou `toISOString()` pour obtenir une chaîne ISO destinée au stockage.

## Utilisation de base

```vue
<template>
  <lh-date-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3))
</script>
```

En mode date, taper un jour ne fait que le **mettre en attente** ; tappez「OK」en bas du panneau pour valider (soumission en deux étapes, comme la version Vue3). Le bouton「Aujourd’hui」ramène le panneau au mois en cours et met en attente le jour actuel.

## Modes mois et année

Avec `mode="month"` / `mode="year"`, le panneau s’ouvre directement sur la grille correspondante et taper une cellule sélectionne et ferme immédiatement (sans boutons en bas). En mode date, taper le titre du panneau permet de descendre niveau par niveau : date → mois → année ; dans la vue année, taper le titre revient aux mois.

```vue
<template>
  <lh-date-picker v-model="month" mode="month" />
  <lh-date-picker v-model="year" mode="year" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const month = ref<Date | null>(new Date(2026, 5, 1))
const year = ref<Date | null>(new Date(2024, 0, 1))
</script>
```

## Formatage des dates

```vue
<template>
  <lh-date-picker v-model="value" format="MM/dd/yyyy" />
  <lh-date-picker v-model="value" format="yyyy-MM-dd" />
</template>
```

Si `placeholder` est omis, le texte de remplacement est généré à partir de `format` (`yyyy` →「année」du pack de langue, `MM` →「mois」, `dd` →「jour」).

## Désactivé et en lecture seule

```vue
<template>
  <lh-date-picker v-model="value" disabled />
  <lh-date-picker :model-value="value" readonly />
</template>
```

`disabled` désactive tout le sélecteur (le panneau ne s’ouvre pas au tap) ; `readonly` est en lecture seule (accepte des valeurs programmatiques mais n’ouvre jamais le panneau).

## Tailles et effacement

```vue
<template>
  <lh-date-picker v-model="value" size="small" />
  <lh-date-picker v-model="value" size="medium" />
  <lh-date-picker v-model="value" size="large" />
  <lh-date-picker v-model="value" :clearable="false" />
</template>
```

`size` retombe sur la taille globale du ConfigProvider, puis en dernier ressort sur `medium`. `clearable` est activé par défaut et affiche une icône d’effacement à droite du déclencheur.

## Écho des valeurs de plage

Lorsque la valeur liée est `[Date, Date]`, le déclencheur affiche les deux extrémités jointes par `range-separator` (`~` par défaut) :

```vue
<template>
  <lh-date-picker v-model="span" range-separator=" au " />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const span = ref<[Date, Date]>([new Date(2026, 10, 1), new Date(2026, 10, 7)])
</script>
```

::: warning L’UI de sélection de plage / date-heure n’est pas encore implémentée
Comme la version Vue3, `mode="datetime"` et la sélection de plage ne sont **qu’une réservation de type, sans UI de sélection** (les colonnes d’heure et le panneau de plage ne sont pas implémentés, backlog familial P-08). Une valeur de plage peut être affichée, mais taper「OK」dans le panneau ne remplace jamais une plage déjà liée par un `Date` unique.
:::

## Personnalisation des cellules et du panneau

```vue
<template>
  <lh-date-picker v-model="value" :cell-class-name="cellClassName" popper-class="my-popper" />
</template>

<script setup lang="ts">
const cellClassName = (date: Date) => (date.getDay() === 0 || date.getDay() === 6 ? 'my-weekend' : '')
</script>
```

`cell-class-name` ajoute une classe personnalisée par jour (les valeurs vides sont ignorées) ; `popper-class` est transféré à la racine du panneau pour un style au niveau du panneau.

## DatePicker API

### Props

| Prop | Description | Type | Par défaut |
| --- | --- | --- | --- |
| modelValue | Valeur liée (Date / tuple de plage / null, **pas de chaînes ISO**) | `Date \| [Date, Date] \| null` | `null` |
| mode | Mode de sélection | `'date' \| 'month' \| 'year' \| 'datetime' \| 'range'` | `'date'` |
| size | Taille (retombe à la taille globale du ConfigProvider, puis medium) | `'small' \| 'medium' \| 'large' \| 'mini' \| 'x-large'` | `'medium'` |
| disabled | Désactiver tout le sélecteur | `boolean` | `false` |
| clearable | Afficher le bouton d’effacement | `boolean` | `true` |
| placeholder | Texte de remplacement (généré depuis format si omis) | `string` | `''` |
| format | Format d’affichage (jetons à largeur fixe, affichage uniquement) | `string` | `'yyyy-MM-dd'` |
| readonly | Lecture seule (n’ouvre jamais le panneau) | `boolean` | `true` |
| rangeSeparator | Séparateur de plage (joint l’écho de plage) | `string` | `'~'` |
| cellClassName | Rappel de classe personnalisée par cellule de jour | `(date: Date) => string` | — |
| popperClass | Classe personnalisée du panneau | `string` | — |
| customClass | Classe personnalisée du nœud racine | `string` | — |
| themeVars | Variables de thème au niveau du composant, surchargeant le ConfigProvider | `Record<string, string>` | — |
| sx | Props de mise en page rapide (nœud racine ; le panneau flottant n’est pas affecté) | `LhSxProps` | — |

::: tip Valeurs de mode
`'datetime'` et `'range'` sont des **réservations de type** : `LhDatePickerMode` (share core) les inclut, mais les colonnes d’heure et le panneau de plage ne sont pas implémentés (backlog P-08) ; utilisez pour l’instant uniquement `'date'` / `'month'` / `'year'`.
:::

### Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| update:modelValue | Valeur modifiée (v-model) | `(value: Date \| [Date, Date] \| null)` |
| change | Valeur confirmée (même charge utile qu’update:modelValue) | `(value: Date \| [Date, Date] \| null)` |

### Accessibilité

- Le déclencheur est `role="combobox"` (`aria-expanded` / `aria-haspopup="dialog"` / `aria-controls` pointant vers le panneau) ; le paquet d’attributs est produit par `getDatePickerTriggerAria` de share
- Le panneau est `role="dialog"` ; le calendrier est `role="grid"` avec des cellules `role="gridcell"` portant `aria-selected` / `aria-current="date"` (aujourd’hui) / `aria-disabled` (désactivé)
- Le `aria-label` de chaque cellule est le texte complet「AAAA, mois M, jour D, jour de la semaine X」destiné aux lecteurs d’écran
- Les boutons de navigation entre mois sont `role="button"` + `aria-label` (clés de langue `datepicker.prevMonth` / `datepicker.nextMonth`)
- La navigation clavier dans la grille et le comportement clavier du déclencheur sont réservés à H5 — voir les différences de plateforme ci-dessous

::: tip Différences de plateforme (différences avec la version Vue3)
- **Sélection en panneau** : le panneau calendrier de plus est déjà de type panneau (et non un sélecteur à molette) et ce port conserve cette interaction ; la couche flottante est portée par `lh-root-portal` au lieu de `Teleport to="body"` (avec un repli `fixed` dans la page pour les anciennes versions), le positionnement passe par une mesure asynchrone en deux images (rendu caché pour mesurer → `computePosition` pour placer → affichage, sans clignotement), et aucune transition d’entrée/sortie n’est branchée.
- **Correspondance des éléments** : les `<div>` / `<button>` / `<input>` de plus sont tous remplacés par `<view>` ; l’écho et le texte de remplacement du déclencheur sont des `<text>` dessinés à la main (MP ne gère pas `::placeholder`, la couleur de remplacement est apportée par une classe modificateur inline du SFC avec le même jeton), et les états désactivés des boutons de mois / aujourd’hui / OK sont portés par des classes (un `view` n’a pas de pseudo-classe `:disabled`).
- **Fermeture au clic extérieur** : plus écoute un clic au niveau du document ; ce port ferme au tap sur un masque transparent dans la page (sémantique équivalente, MP n’a pas de document), et le tap sur le masque ne fait que fermer, sans émettre change.
- **La navigation clavier est réservée à H5** : Enter / Space sur le déclencheur, déplacements par flèches dans la grille (y compris changement de mois) / Home / End / PageUp / PageDown, le roving tabindex et Escape fermant la superposition la plus haute n’ont pas d’événements clavier sur MP ; le code protégé par compilation conditionnelle n’est jamais appelé et le bundle MP ne contient aucun code mort.
- **Les attributs aria sont liés un par un** : le paquet `LhAriaAttrs` de share ne peut pas être diffusé via `v-bind` (le compilateur de templates MP ne le gère pas), la couche de colle expande donc les clés `aria-*` en liaisons explicites ; le contrat reste décidé par les fonctions pures de share.
- **Contrat de type de valeur** : identique à plus — la valeur liée est `Date` / `[Date, Date]`, jamais une chaîne de date ISO dans un sens comme dans l’autre ; `format` n’affecte que la couche d’affichage.
:::
