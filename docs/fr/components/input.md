# Champ de saisie

## Utilisation de base

```vue
<template>
  <lh-input v-model="text" placeholder="Saisir" />
  <lh-input v-model="text" type="textarea" :rows="3" autosize placeholder="Multiligne" />
  <lh-input v-model="text" type="password" placeholder="Mot de passe" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
```

## Style de l'espace réservé (obligatoire en MP)

::: warning Le Mini Programme ne supporte pas `::placeholder`
Le WXSS du Mini Programme WeChat ne supporte pas le pseudo-élément `::placeholder`. Le style de l'espace réservé doit être transmis via des props, **n'écrivez pas** `::placeholder` en CSS (le garde de compilation le bloquera également).
:::

```vue
<lh-input placeholder="Saisir" placeholder-style="color: #999; font-size: 13px" />
<!-- ou avec une classe -->
<lh-input placeholder="Saisir" placeholder-class="my-placeholder" />
```

## Avec icônes et états

```vue
<template>
  <lh-input v-model="text" prefix-icon="search" placeholder="Rechercher" clearable />
  <lh-input v-model="text" suffix-icon="close" placeholder="Icône suffixe" />
  <lh-input v-model="text" state="error" placeholder="État d'erreur de validation" />
  <lh-input v-model="text" :maxlength="20" show-word-limit placeholder="Compteur de caractères" />
</template>
```

## Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| modelValue (v-model) | Valeur liée | `string` | — |
| type | Type | `'text' \| 'textarea' \| 'password' \| 'number' \| 'email' \| 'url' \| 'tel' \| 'date' \| 'time'` | `'text'` |
| size | Taille | `'small' \| 'medium' \| 'large'` | — |
| disabled | Désactivé | `boolean` | `false` |
| readonly | Lecture seule | `boolean` | `false` |
| placeholder | Texte de l'espace réservé | `string` | — |
| placeholderStyle | Style en ligne de l'espace réservé (remplace `::placeholder`) | `string` | — |
| placeholderClass | Classe de l'espace réservé (alternative à placeholderStyle) | `string` | — |
| maxlength | Longueur maximale | `number` | — |
| minlength | Longueur minimale | `number` | — |
| showWordLimit | Afficher le compteur de caractères | `boolean` | `false` |
| clearable | Vidable | `boolean` | `false` |
| prefixIcon | Icône préfixe | `LhIconName` | — |
| suffixIcon | Icône suffixe | `LhIconName` | — |
| state | État de validation | `'error' \| 'success' \| 'warning'` | — |
| name | name natif (pour la collecte de formulaire) | `string` | — |
| password | Mode mot de passe | `boolean` | `false` |
| rows | Nombre de lignes du textarea | `number` | — |
| autosize | Hauteur adaptive du textarea (auto-height du MP) | `boolean` | `false` |
| label | Texte du libellé | `string` | — |
| customClass | Nom de classe personnalisé | `string` | — |
| themeVars | Variables de thème de niveau composant | `Record<string, string>` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## Events

| Événement | Description | Paramètre de callback |
| --- | --- | --- |
| update:modelValue | Changement de valeur | `(value: string)` |
| input | Saisie (via `event.detail.value`) | `(value: string)` |
| blur | Perte de focus | — |
| focus | Prise de focus | — |
| clear | Vidage | — |

::: tip Différences avec la version Vue3
`autocomplete` / `autofocus` / `resize` / `form` / `tabindex` / `nativeType` / `inputStyle` n'ont pas d'équivalent dans le Mini Programme et **ne sont pas implémentés** dans cette bibliothèque. `autosize` s'appuie sur l'attribut `auto-height` du textarea du Mini Programme.
:::
