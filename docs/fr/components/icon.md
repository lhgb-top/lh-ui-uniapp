# Icône

::: tip Côté Mini Programme, rendu en police
Le web (plus) utilise du `<svg><path>` en ligne, mais le Mini Programme **ne supporte pas la balise `<svg>`**. À la compilation, cette bibliothèque transforme l'ensemble de paths SVG de share en une police iconfont (base64 intégrée dans `iconfont.css`) ; le composant rend `<text class="lh-iconfont lh-iconfont--<name>">`. La couleur est gérée par `color` en CSS (**pas `fill` / `stroke`**), en remplacement complet de la sémantique `currentColor` du web.
:::

## Utilisation de base

```vue
<template>
  <lh-icon name="search" />
  <lh-icon name="loading" size="24" color="#1677ff" />
  <lh-icon name="star" size="1.5em" />
</template>
```

## Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| name | Nom de l'icône (clé de `LH_ICON_SVGS_CONST` de share) | `LhIconName` | — |
| size | Taille (un nombre est en px ; une chaîne est transmise telle quelle, par ex. `'1.5em'`) | `string \| number` | — |
| color | Couleur (remplace le `currentColor` du web) | `string` | — |
| customClass | Nom de classe personnalisé (transmis au nœud racine) | `string` | — |
| themeVars | Variables de thème de niveau composant | `Record<string, string>` | — |
| bgPattern | Motif d'arrière-plan de niveau composant | `string` | — |

## Liste des icônes

37 icônes au total (24x24, monochromes, un seul path), toutes issues de `LH_ICON_SVGS_CONST` de `@lh-ui/share`. La commande `pnpm build:iconfont` régénère la police et le mapping des points de code (`src/icon/icon-map.ts`).

::: warning N'oubliez pas d'importer le style de la police
L'utilisateur doit importer `@lh-ui/uniapp/src/icon/iconfont.css`, sinon les icônes s'affichent en carrés vides.
:::
