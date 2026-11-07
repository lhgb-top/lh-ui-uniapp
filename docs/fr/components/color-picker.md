# ColorPicker Sélecteur de couleurs

Un tap sur le déclencheur ouvre le panneau de sélection de couleurs : plan de saturation / luminosité à faire glisser + curseurs de teinte / transparence + saisie hex / rgb + échantillons prédéfinis. Les conversions de couleur proviennent toutes des fonctions pures de `@lh-ui/share/core/color-picker` (aller-retour entre les deux espaces hex/rgb et HSV, bornage des canaux sur tout le parcours) ; le rendu est identique sur H5 et le Mini Programme WeChat.

## Utilisation de base

```vue
<template>
  <lh-color-picker v-model="color" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const color = ref('#2B4C7C')
</script>
```

## Transparence et échantillons prédéfinis

```vue
<template>
  <lh-color-picker
    v-model="color"
    show-alpha
    :predefine="predefine"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const color = ref('rgba(43, 76, 124, 0.6)')
// Une fois showAlpha activé, la sortie hex fait 8 chiffres (#2b4c7c99) et rgb sort en rgba() — une valeur alpha présente n'est jamais perdue silencieusement
const predefine = ['#2B4C7C', '#5B8C5A', '#C4A35A', '#B23A3A']
</script>
```

## Format de sortie

```vue
<lh-color-picker v-model="color" format="rgb" />
```

`format` n'affecte que la forme de sortie de `v-model` (`hex` ou `rgb`) ; une valeur invalide retombe sur `hex`.

## Taille / effacement / désactivation

```vue
<lh-color-picker v-model="color" size="small" />
<lh-color-picker v-model="color" clearable />
<lh-color-picker v-model="color" disabled />
```

Une fois `clearable` activé, un bouton d'effacement apparaît dans le déclencheur lorsqu'une valeur existe ; un tap le vide et émet l'événement `clear`.

## Ouverture / fermeture impératives

```vue
<template>
  <lh-color-picker ref="pickerRef" v-model="color" />
  <lh-button size="small" @click="pickerRef?.open()">Ouvrir le panneau</lh-button>
</template>
```

Le composant expose `open` / `close` / `isOpen` via ref.

## ColorPicker API

### Props

| Propriété | Description | Type | Par défaut |
| --- | --- | --- | --- |
| model-value | Valeur liée (v-model contrôlé, chaîne hex ou rgb(), sortie selon format) | string | `''` |
| format | Format de sortie (une valeur invalide retombe sur hex) | `'hex' \| 'rgb'` | `hex` |
| show-alpha | Canal de transparence (une fois activé, sortie en hex 8 chiffres / rgba()) | boolean | `false` |
| predefine | Échantillons prédéfinis | string[] | `[]` |
| size | Taille | `'mini' \| 'small' \| 'medium' \| 'large' \| 'x-large'` | `medium` |
| disabled | Désactivé | boolean | `false` |
| clearable | Bouton d'effacement (vidage de la valeur) | boolean | `false` |
| placeholder | Texte de remplacement (valeur vide ; sinon clé de langue colorPicker.placeholder) | string | `''` |
| aria-label | Nom accessible (sinon clé de langue colorPicker.label) | string | — |
| custom-class | Classe personnalisée (transmise au nœud racine) | string | — |
| sx | Props de mise en page rapide | LhSxProps | — |

### Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| update:model-value | Changement de couleur (v-model) | `(value: string)` |
| change | Changement de couleur confirmé (même charge utile qu'update:model-value) | `(value: string)` |
| clear | Clic sur le bouton d'effacement | — |

### Expose

| Méthode | Description |
| --- | --- |
| open | Ouvrir le panneau |
| close | Fermer le panneau |
| isOpen | Le panneau est-il déployé (ref) |

### Accessibilité

- Le déclencheur porte `role="button"` + `aria-expanded` + `aria-label` (clé de langue colorPicker.label)
- Les curseurs de teinte / transparence portent `role="slider"` + `aria-valuenow/min/max`, réglage fin aux flèches directionnelles (Shift accélère)
- Chaque case des échantillons prédéfinis est cliquable ; son nom accessible est la chaîne de la valeur de couleur

::: tip Différences de plateforme (différences avec la version Vue3)
- **Axe de glissement** : sur MP, touchmove / touchend sont dispatchés le long de la cible tactile (aucun écouteur document nécessaire) ; H5 passe en plus par des écouteurs souris au niveau du document (le glissement continue même en sortant du composant) — le paradigme est le même que celui du Slider.
- **Saisie hex / rgb dans le panneau** : elle utilise le `<input>` d'uni ; la soumission par Entrée passe par `@confirm` (touche « Terminé » du clavier) et la soumission à la perte de focus par `@blur` (pas de keydown.enter sur MP).
- **Les interactions clavier** (réglage fin aux flèches, Enter / Space pour ouvrir / fermer, Échap pour fermer) ne fonctionnent qu'en H5 ; MP n'a pas d'événements clavier.
- **Positionnement du panneau** : il passe par root-portal + une mesure en deux images (mesurer → positionner → afficher, sans scintillement).
:::
