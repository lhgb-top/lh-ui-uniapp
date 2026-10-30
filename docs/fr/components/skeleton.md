# Squelette

Espace réservé utilisé tant que les données ne sont pas chargées ; lorsque `loading` vaut false, le contenu réel est rendu.

## Utilisation de base

```vue
<template>
  <lh-skeleton :loading="loading">
    <view>Contenu réel</view>
  </lh-skeleton>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(true)
</script>
```

## Nombre de lignes et avatar

```vue
<template>
  <lh-skeleton :loading="true" :rows="4" avatar />
</template>
```

## Désactiver l'animation

```vue
<template>
  <lh-skeleton :loading="true" :animated="false" :rows="3" />
</template>
```

## Blocs d'espace réservé indépendants

`lh-skeleton-item` peut s'utiliser seul pour assembler une mise en page d'espace réservé personnalisée ; `variant` prend les valeurs `text` / `rect` / `circle`.

```vue
<template>
  <view class="custom-skeleton">
    <lh-skeleton-item variant="circle" class="avatar" />
    <lh-skeleton-item variant="text" class="line" />
  </view>
</template>
```

## Props (lh-skeleton)

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| loading | État de chargement (lorsque false, le contenu réel du slot default est rendu) | `boolean` | `true` |
| rows | Nombre de lignes de texte | `number` | `3` |
| avatar | Inclure un espace réservé d'avatar circulaire | `boolean` | `false` |
| animated | Activer l'animation | `boolean` | `true` |
| customClass | Nom de classe personnalisé | `string` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## Props (lh-skeleton-item)

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| variant | Forme du bloc d'espace réservé | `'text' \| 'rect' \| 'circle'` | `'text'` |
| animated | Activer l'animation | `boolean` | `true` |
| customClass | Nom de classe personnalisé | `string` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## Slots (lh-skeleton)

| Slot | Description |
| --- | --- |
| default | Le contenu réel rendu lorsque `loading` vaut false |

::: tip Accessibilité
Le conteneur est marqué `aria-busy="true"` et `aria-live="polite"` ; les blocs d'espace réservé sont eux-mêmes masqués des technologies d'assistance ; une fois les données prêtes, le lecteur d'écran annonce automatiquement le contenu réel.
:::
