# Chargement

Service global de masque de chargement. Comme Message, il adopte le **motif de point de montage**.

## Placer le point de montage

```vue
<template>
  <lh-config-provider>
    <view><!-- Contenu de la page --></view>
    <lh-loading />
  </lh-config-provider>
</template>
```

## Appels

```ts
import { useLhLoading } from '@lh-ui/uniapp'

const loading = useLhLoading()

// show reçoit un objet d'options ou une simple chaîne de texte, et renvoie un handle
const handle = loading.show({ text: 'Chargement...' })
handle.close()

// Tout fermer
loading.closeAll()
```

::: danger Avertissement en l'absence de point de montage
Comme pour Message : si vous appelez `useLhLoading()` alors que la page ne contient pas `<lh-loading />`,
un `console.error` explicite est émis en développement, sans dégradation silencieuse.
:::

## LhLoadingOptions

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| target | Nœud cible (**uniquement valable sur H5** ; côté MP, toujours plein écran) | `string` | — |
| text | Texte de chargement | `string` | — |
| background | Couleur de fond du masque | `string` | — |
| lock | Verrouiller le défilement (**uniquement valable sur H5**) | `boolean` | `false` |
| zIndex | Niveau z ; auto-incrémenté si omis | `number` | — |

## Méthodes

| Méthode | Description | Paramètres |
| --- | --- | --- |
| show | Affiche le masque de chargement et renvoie un handle (`{ close }`) | `(options: LhLoadingOptions \| string)` |
| close | Ferme le chargement d'identifiant id | `(id: number)` |
| closeAll | Ferme tous les chargements | — |

## Différences avec la version Vue3

- `target` ne supporte, côté Mini Programme, **que le masque plein écran** — il est impossible de sélectionner un nœud arbitraire pour y accrocher un masque ; la première version ignore `target` côté MP (le champ est conservé et documenté).
- `lock` n'est valable qu'en H5 ; le Mini Programme n'a pas de verrouillage du défilement de body.
- En cas de superposition de plusieurs instances, `useLhZIndex` garantit que le masque ouvert en dernier se trouve au-dessus.
