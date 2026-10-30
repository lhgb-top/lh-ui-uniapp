# Avatar

Affiche un avatar d'utilisateur ou d'objet, sous trois formes : image, icône ou texte.

## Utilisation de base

```vue
<template>
  <lh-avatar src="https://placeholder.invalid/avatar.png" />
  <lh-avatar icon="user" />
  <lh-avatar text="Encre de Chine" />
</template>
```

## Forme et taille

```vue
<template>
  <lh-avatar text="Encre" shape="circle" />
  <lh-avatar text="Jade" shape="square" />
  <lh-avatar text="Petit" size="small" />
  <lh-avatar text="Grand" size="large" />
</template>
```

## Mode de recadrage

`fit` est mappé au `mode` de `<image>` d'uni : `fill` -> `scaleToFill`, `contain` -> `aspectFit`, `cover` -> `aspectFill`, `none` -> `center`.

```vue
<template>
  <lh-avatar src="https://placeholder.invalid/avatar.png" fit="cover" />
  <lh-avatar src="https://placeholder.invalid/avatar.png" fit="contain" />
</template>
```

::: tip scale-down est une approximation
uni n'a pas de mode équivalent à `scale-down` ; c'est le mode sémantiquement le plus proche qui est retenu : `aspectFit` (affichage complet en conservant les proportions, sans agrandissement).
:::

## Repli en cas d'échec de chargement

En cas d'échec du chargement de l'image, le repli se fait dans l'ordre « icône -> texte -> vide », et l'événement `error` est déclenché.

```vue
<template>
  <lh-avatar
    src="https://placeholder.invalid/broken.png"
    icon="user"
    alt="Avatar"
    @error="onError"
  />
</template>

<script setup lang="ts">
const onError = () => console.log("Échec du chargement de l'image")
</script>
```

## Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| src | Adresse de l'image ; en cas d'absence, repli successif sur l'icône puis le texte | `string` | — |
| alt | Texte alternatif en cas d'échec de chargement de l'image, servant également de nom accessible | `string` | — |
| icon | Nom de l'icône (affichée lorsque src est vide ou que le chargement échoue) | `LhIconName` | — |
| text | Contenu de l'avatar texte (lorsque src et icon sont absents, le premier caractère est affiché) | `string` | — |
| shape | Forme | `'circle' \| 'square'` | `'circle'` |
| size | Taille | `'small' \| 'medium' \| 'large'` | `'medium'` |
| fit | Mode de recadrage de l'image (mappé au mode de l'image d'uni) | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'cover'` |
| customClass | Nom de classe personnalisé | `string` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## Events

| Événement | Description | Paramètre de callback |
| --- | --- | --- |
| error | Échec du chargement de l'image | `(e: Event)` |
