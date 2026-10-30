# Badge

Badge en haut à droite d'une icône, utilisé pour un nombre de notifications, un point de statut ou du texte personnalisé.

## Utilisation de base

```vue
<template>
  <lh-badge :value="8">
    <lh-button size="small">Messages</lh-button>
  </lh-badge>
  <lh-badge :value="8" type="primary">
    <lh-button size="small">Principal</lh-button>
  </lh-badge>
</template>
```

## Traitement des valeurs

```vue
<template>
  <lh-badge :value="200" :max="99">
    <lh-button size="small">Au-delà de max, affiche 99+</lh-button>
  </lh-badge>
  <lh-badge :value="0" show-zero>
    <lh-button size="small">Affiche 0</lh-button>
  </lh-badge>
  <lh-badge :value="0">
    <lh-button size="small">Masque 0</lh-button>
  </lh-badge>
  <lh-badge content="Nouveau">
    <lh-button size="small">Texte personnalisé</lh-button>
  </lh-badge>
</template>
```

## Point rouge

```vue
<template>
  <lh-badge is-dot>
    <lh-button size="small">Nouveaux messages</lh-button>
  </lh-badge>
</template>
```

## Décalage et taille

```vue
<template>
  <lh-badge :value="8" :offset="[6, 4]">
    <lh-button size="small">Décalage</lh-button>
  </lh-badge>
  <lh-badge :value="8" size="small">
    <lh-button size="small">Petite taille</lh-button>
  </lh-badge>
</template>
```

## Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| type | Type | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'default'` | `'danger'` |
| value | Valeur numérique affichée | `string \| number` | — |
| size | Taille | `'small' \| 'medium' \| 'large'` | `'medium'` |
| max | Valeur maximale, au-delà affiche `${max}+` | `number` | `99` |
| isDot | S'il s'agit d'un point rouge (la valeur n'est pas affichée) | `boolean` | `false` |
| hidden | Masquer | `boolean` | `false` |
| offset | Décalage par rapport à la position par défaut `[x, y]`, implémenté en marges négatives | `[number, number]` | — |
| showZero | Afficher lorsque la valeur est 0 | `boolean` | `false` |
| content | Texte personnalisé (prioritaire sur value) | `string` | — |
| customClass | Nom de classe personnalisé | `string` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Le contenu sur lequel le badge s'appuie |

::: tip Différences avec la version Vue3
Les animations d'entrée / sortie ne s'appuient pas sur le composant intégré `<transition>` de Vue (l'événement de fin de transition du Mini Programme est peu fiable) : elles utilisent un changement de classe + un minuteur pour aligner la durée de l'animation sur 0.15s, pour un rendu visuel identique à plus.
:::
