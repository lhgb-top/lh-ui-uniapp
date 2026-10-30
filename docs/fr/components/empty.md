# Vide

Espace réservé en l'absence de données, avec une illustration dans le style encre de Chine (水墨).

## Utilisation de base

```vue
<template>
  <lh-empty />
</template>
```

Lorsque `description` n'est pas fournie, c'est `empty.description` du paquet de langue qui est utilisée (« Aucune donnée » en chinois) ; le changement de langue de ConfigProvider est suivi automatiquement.

## Texte personnalisé

```vue
<template>
  <lh-empty description="L'encre n'a pas encore séché, rien à contempler pour l'instant" />
</template>
```

## Image personnalisée

```vue
<template>
  <lh-empty image="https://placeholder.invalid/empty.png" description="Totalement vide" />
</template>
```

## Slot personnalisé

Le slot par défaut peut remplacer complètement l'illustration par défaut (lorsque `image` est fournie, l'illustration par défaut n'est pas non plus rendue).

```vue
<template>
  <lh-empty description="Aucun favori">
    <view class="my-illustration">🎨</view>
  </lh-empty>
</template>
```

## Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| description | Texte de description de l'état vide (lorsqu'il n'est pas fourni, c'est empty.description du paquet de langue qui est utilisé) | `string` | — |
| image | URL d'image personnalisée (remplace l'illustration par défaut) | `string` | — |
| customClass | Nom de classe personnalisé | `string` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Illustration personnalisée (remplace l'illustration par défaut lorsqu'elle est fournie) |

::: tip L'illustration par défaut côté Mini Programme
En H5, l'illustration `<svg>` en ligne est conservée (coloration thématique intégralement fidèle) ; le Mini Programme ne supportant pas svg, l'illustration par défaut est dessinée en CSS dans une version simplifiée, avec des couleurs issues des variables de thème et une adaptation automatique aux modes clair et sombre.
:::
