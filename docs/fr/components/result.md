# Result résultat

Affichage du résultat en fin d'un flux de retour, avec une icône d'état et des couleurs associées.

## Utilisation de base

```vue
<template>
  <lh-result
    status="success"
    title="Envoi réussi"
    sub-title="La commande est passée à l'étape suivante"
  />
</template>
```

Quatre états : `success` / `warning` / `error` / `info` (`info` par défaut), chacun avec son icône et ses couleurs par défaut ; une valeur d'état invalide est ramenée à `info`.

## Icône personnalisée

```vue
<template>
  <lh-result
    icon="like"
    :icon-size="48"
    title="J'aime et favori"
  />
</template>
```

Une chaîne vide `""` dans `icon` désactive l'icône ; si aucune valeur n'est passée, l'icône par défaut de l'état est utilisée.

## Slots

```vue
<template>
  <lh-result status="success">
    <template #subTitle> Sous-titre personnalisé </template>
    <template #extra>
      <lh-button type="primary" size="small">Retour à l'accueil</lh-button>
    </template>
  </lh-result>
</template>
```

Les trois slots `title` / `subTitle` / `extra` remplacent la prop du même nom.

## Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| status | État du résultat | `'success' \| 'warning' \| 'info' \| 'error'` | `'info'` |
| icon | Nom de l'icône personnalisée (remplace l'icône par défaut de l'état ; une chaîne vide n'est pas rendue) | `string` | — |
| iconSize | Taille de l'icône | `string \| number` | `64` |
| title | Titre | `string` | — |
| subTitle | Sous-titre | `string` | — |
| customClass | Nom de classe personnalisé | `string` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| title | Titre (remplace la prop title) |
| subTitle | Sous-titre (remplace la prop subTitle) |
| extra | Zone d'actions du bas |
