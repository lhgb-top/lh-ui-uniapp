# VirtualList Liste virtuelle

N'affiche que la fenêtre visible, même avec des dizaines de milliers de lignes. Le calcul
de la plage à hauteur fixe (`computeVirtualRange`) et la logique de hauteur dynamique
(`buildVirtualItems` / `findVirtualRange`) proviennent entièrement des fonctions pures
du core de `@lh-ui/share` ; la couche composant ne gère que le pilotage du défilement
et la mesure du viewport.

## Différences de plateforme

- **H5** : le conteneur est rendu sous forme de `view` (`overflow: auto`) et la hauteur
  du viewport est mesurée avec `clientHeight` + `ResizeObserver`.
- **Mini-programme WeChat** : le conteneur est rendu sous forme de `scroll-view`
  (`scroll-y`), les événements de défilement lisent `detail.scrollTop`, et la hauteur du
  viewport est mesurée avec `createSelectorQuery` (MP n'a pas de `ResizeObserver`).
- **Hauteur dynamique** : `itemSize` est un contrat de fonction déclarative (l'appelant
  renvoie la hauteur de chaque élément). Il fonctionne à l'identique sur les deux cibles
  et ne repose sur aucune API de mesure absente du MP.

## Utilisation de base (hauteur fixe)

```vue
<template>
  <lh-virtual-list :data="items" :height="360" :item-height="48">
    <template #default="{ item, index }">
      <view class="my-item">Ligne {{ index + 1 }} : {{ item.label }}</view>
    </template>
  </lh-virtual-list>
</template>

<script setup lang="ts">
const items = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  label: `Élément ${i + 1}`,
}))
</script>
```

`height` définit la hauteur du conteneur ; `item-height` est la hauteur des éléments en
mode hauteur fixe (elle doit correspondre à la hauteur réelle des éléments). En dehors
de la fenêtre visible, seuls `overscan` (2 par défaut) écrans d'éléments tampons sont
conservés.

## Hauteur dynamique

```vue
<template>
  <lh-virtual-list :data="items" :height="360" :item-size="sizeOf">
    <template #default="{ item, index }">
      <view class="my-item" :style="{ height: `${sizeOf(index)}px` }">
        Ligne {{ index + 1 }} : {{ item.label }}
      </view>
    </template>
  </lh-virtual-list>
</template>

<script setup lang="ts">
// itemSize est une fonction déclarative : elle renvoie la hauteur de chaque élément,
// à l'identique sur les deux cibles.
function sizeOf(index: number): number {
  return 48 + (index % 5) * 24
}
</script>
```

`item-height` et `item-size` s'excluent mutuellement : fournir `itemSize` active le mode
hauteur dynamique (les décalages de chaque élément sont précalculés et la plage visible
est trouvée par recherche binaire).

## API

### Props

| Prop | Description | Type | Par défaut |
| --- | --- | --- | --- |
| data | Source de données (le rendu des éléments est assuré par le slot default) | `any[]` | `[]` |
| height | Hauteur du conteneur (un nombre est en px) | `number \| string` | `300` |
| itemHeight | Hauteur des éléments en mode hauteur fixe | `number` | `-` |
| itemSize | Mode hauteur dynamique : renvoie la hauteur de chaque élément | `(index: number) => number` | `-` |
| overscan | Nombre d'éléments d'overscan (éléments tampons en dehors de la fenêtre visible) | `number` | `2` |
| sx | Propriétés de mise en page rapide sx | `LhSxProps` | `-` |

### Slots

| Slot | Description | Paramètres de scope |
| --- | --- | --- |
| default | Rendu des éléments | `{ item, index }` |
