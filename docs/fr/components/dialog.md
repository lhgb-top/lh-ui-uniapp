# Boîte de dialogue

## Utilisation de base

```vue
<template>
  <lh-button @click="visible = true">Ouvrir la boîte de dialogue</lh-button>

  <lh-dialog v-model="visible" title="Titre" width="80%">
    <view>Ceci est le contenu de la boîte de dialogue</view>
    <template #footer>
      <lh-button @click="visible = false">Annuler</lh-button>
      <lh-button type="primary" @click="visible = false">Confirmer</lh-button>
    </template>
  </lh-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
</script>
```

## Positionnement

```vue
<template>
  <lh-dialog v-model="visible" position="bottom" title="Calque inférieur">
    <view>Contenu inférieur</view>
  </lh-dialog>

  <lh-dialog v-model="visible" fullscreen title="Plein écran">
    <view>Contenu plein écran</view>
  </lh-dialog>
</template>
```

Le calque inférieur intègre automatiquement `env(safe-area-inset-bottom)` pour s'adapter aux écrans tout-tactile.

## Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| modelValue (v-model) | Affiché ou non | `boolean` | `false` |
| title | Titre | `string` | — |
| width | Largeur | `string \| number` | — |
| top | Distance depuis le haut | `string \| number` | — |
| fullscreen | Plein écran | `boolean` | `false` |
| position | Positionnement | `'center' \| 'top' \| 'bottom'` | `'center'` |
| closeOnClickModal | Fermer au clic sur le masque | `boolean` | `true` |
| closeOnPressEscape | Fermer avec Esc (**MP sans événement clavier, sans effet**) | `boolean` | `true` |
| lockScroll | Verrouiller le défilement de l'arrière-plan (**uniquement valable sur H5**) | `boolean` | `true` |
| zIndex | Niveau z ; auto-incrémenté si omis | `number` | — |
| customClass | Nom de classe personnalisé | `string` | — |
| themeVars | Variables de thème de niveau composant | `Record<string, string>` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Contenu |
| footer | Zone des boutons du pied |

## Events

| Événement | Description | Paramètre de callback |
| --- | --- | --- |
| update:modelValue | Changement d'affichage | `(visible: boolean)` |
| open | Ouverture | — |
| close | Fermeture | — |

::: tip Différences avec la version Vue3
- Le montage du calque passe par `root-portal` (en H5, teleport ; en MP, root-portal ou repli fixed dans la page).
- **focus-trap est indisponible côté MP** : le garde de compilation `LH_IS_H5` renvoie directement false, focus-trap n'est pas appelé.
- **lockScroll est sans effet côté MP** : le Mini Programme n'a pas de verrouillage du défilement de body, le repli se fait par interception des clics par le masque.
- `closeOnPressEscape` est sans effet côté MP (pas d'événement clavier).
:::
