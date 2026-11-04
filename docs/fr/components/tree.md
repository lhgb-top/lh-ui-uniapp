# Tree (arborescence)

Affichage et interaction de données hiérarchiques. Toute la logique pure — dépliage / repliage,
cascade des cases à cocher, fusion du chargement différé — est consommée directement depuis les
fonctions pures du core de `@lh-ui/share` (`flattenTree` / `toggleCheckKeys` /
`mergeLoadedChildren`, etc.) ; la couche composant ne gère que le rendu, les événements et la
navigation clavier.

## Utilisation de base

```vue
<template>
  <lh-tree :data="treeData" :default-expanded-keys="['a']" />
</template>

<script setup lang="ts">
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const treeData: LhTreeNode[] = [
  {
    key: 'a',
    label: 'Frontend',
    children: [
      { key: 'a-1', label: 'Vue' },
      { key: 'a-2', label: 'React' },
    ],
  },
  { key: 'b', label: 'Backend', children: [{ key: 'b-1', label: 'Node' }] },
  { key: 'c', label: 'DevOps', disabled: true },
]
</script>
```

`data` est un `LhTreeNode[]` : `key` est unique, `label` le texte affiché, `children` les
sous-nœuds, `disabled` désactive le nœud et `isLeaf` indique une feuille (déduit de `children`
en cas d'omission). L'indentation de niveau est portée par le style en ligne `level * 18 + 8` px.
Cliquer sur la ligne entière sélectionne le nœud (`update:selectedKeys` / `select`) ; avec
`expandOnClickNode` activé (par défaut), cliquer sur un nœud non-feuille le déplie / le replie
également ; le clic sur la flèche ne bascule que le dépliage.

## Cases à cocher (cascade)

`show-checkbox` affiche les cases à cocher. Cocher un parent se propage en cascade à tous les
descendants ; lorsque tous les enfants sont cochés, le parent est automatiquement coché, et une
sélection partielle affiche l'état indéterminé.

```vue
<template>
  <lh-tree :data="treeData" show-checkbox :default-expanded-keys="['a', 'b']" />
</template>
```

L'ensemble coché est porté par `default-checked-keys` (non contrôlé) ou
`v-model:checked-keys` (contrôlé), et les changements sont émis via `update:checkedKeys` /
`check`. Avec `checkStrictly`, la case n'affecte que le nœud lui-même : aucune cascade vers les
descendants, aucun retour vers les ancêtres, pas d'état indéterminé.

## Chargement différé

Avec `lazy` activé, déplier un nœud non chargé invoque le callback `load` (`resolve` fournit les
sous-nœuds et déplie, `reject` ou une exception annule) ; pendant le chargement, la flèche
tourne.

```vue
<template>
  <lh-tree :data="lazyData" lazy :load="loadNodes" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const lazyData = ref<LhTreeNode[]>([{ key: 'lazy', label: 'Toucher pour charger', isLeaf: false }])

function loadNodes(
  node: LhTreeNode,
  resolve: (children: LhTreeNode[]) => void,
  reject: (reason?: unknown) => void,
) {
  // simule une requête asynchrone
  setTimeout(() => {
    if (node.key === 'lazy') {
      resolve([
        { key: 'lazy-1', label: 'Sous-nœud un', isLeaf: true },
        { key: 'lazy-2', label: 'Sous-nœud deux', isLeaf: true },
      ])
    } else {
      reject(new Error('nothing to load'))
    }
  }, 600)
}
</script>
```

Un nœud chargeable doit déclarer explicitement `isLeaf: false` (sinon un nœud sans `children`
est déduit comme feuille et n'affiche pas de flèche de dépliage) ; si les sous-nœuds chargés sont
eux-mêmes des branches en attente de chargement, déclarez-y également `isLeaf: false`, et
`isLeaf: true` pour les vraies feuilles. Les résultats sont fusionnés de manière immuable sur
`props.data` par `mergeLoadedChildren` de share — les données de l'utilisateur ne sont jamais
mutées ; l'arrivée des sous-nœuds s'accompagne de l'événement `nodeLoad`.

## Sélection et clés contrôlées

`multiple` permet la sélection multiple (le clic bascule la sélection au lieu de la remplacer) ;
`default-selected-keys` / `v-model:selected-keys` contrôlent la sélection ;
`default-expanded-keys` / `v-model:expanded-keys` contrôlent le dépliage ; `disabled` désactive
toute l'arborescence (clics et touches ne répondent plus).

```vue
<template>
  <lh-tree
    v-model:selected-keys="selKeys"
    v-model:checked-keys="chkKeys"
    :data="ctrlData"
    multiple
    :default-expanded-keys="['x']"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTreeNode } from '@lh-ui/share/core/tree'

const selKeys = ref(['x'])
const chkKeys = ref(['x-1'])
const ctrlData: LhTreeNode[] = [
  {
    key: 'x',
    label: 'Design',
    children: [{ key: 'x-1', label: 'Couleur' }, { key: 'x-2', label: 'Typographie' }],
  },
  { key: 'y', label: 'Ingénierie' },
]
</script>
```

## Virtualisation des gros volumes (spécifique à uni-app)

Pour des centaines ou des milliers de nœuds, activez `virtual` : la liste des nœuds est portée par
un `scroll-view` et rendue par fenêtres selon la hauteur de ligne fixe de 34 px (la valeur par
défaut de `--lh-tree-node-height`), en ne dessinant que la zone visible plus une marge haute et
basse ; `virtualHeight` définit la hauteur du scroll-view (les nombres sont en px, les chaînes
sont utilisées telles quelles, 300 px par défaut).

```vue
<template>
  <lh-tree :data="bigData" virtual :virtual-height="320" />
</template>
```

Le contenu du nœud doit tenir sur une seule ligne (le scss de share `.lh-tree-node__label` force
déjà `nowrap` + points de suspension). Sans `virtual`, les nœuds sont rendus directement sous le
conteneur racine, identique à la version Vue3.

## Slots

Le slot délimité `node` reçoit `{ node, level, expanded, selected }` pour personnaliser le contenu
du nœud ; le slot `empty` personnalise l'état vide (par défaut la clé de langue `tree.empty`,
français « Aucune donnée »).

```vue
<template>
  <lh-tree :data="treeData">
    <template #node="{ node, level }">
      <text>{{ level > 0 ? '· ' : '' }}{{ node.label }}</text>
    </template>
  </lh-tree>
</template>
```

## API

### Props

| Propriété | Description | Type | Par défaut |
| --- | --- | --- | --- |
| data | Données de l'arborescence | `LhTreeNode[]` | — |
| showCheckbox | Afficher les cases à cocher | `boolean` | `false` |
| multiple | Sélection multiple (bascule au lieu de remplacer) | `boolean` | `false` |
| expandOnClickNode | Déplier / replier les nœuds non-feuilles au clic sur la ligne | `boolean` | `true` |
| defaultExpandedKeys | Clés dépliées par défaut (non contrôlé) | `string[]` | `[]` |
| expandedKeys | Clés dépliées contrôlées | `string[]` | — |
| defaultSelectedKeys | Clés sélectionnées par défaut (non contrôlé) | `string[]` | `[]` |
| selectedKeys | Clés sélectionnées contrôlées | `string[]` | — |
| defaultCheckedKeys | Clés cochées par défaut (non contrôlé) | `string[]` | `[]` |
| checkedKeys | Clés cochées contrôlées | `string[]` | — |
| checkStrictly | Parent et enfant indépendants (le nœud seul, sans cascade ni indéterminé) | `boolean` | `false` |
| lazy | Mode différé (appelle load au dépliage d'un nœud non chargé) | `boolean` | `false` |
| load | Callback différé (resolve fournit les enfants et déplie, reject annule) | `(node: LhTreeNode, resolve: (children: LhTreeNode[]) => void, reject: (reason?: unknown) => void) => void` | — |
| disabled | Désactiver toute l'arborescence | `boolean` | `false` |
| virtual | Virtualisation des gros volumes (spécifique à uni-app) | `boolean` | `false` |
| virtualHeight | Hauteur du scroll-view virtuel (nombre en px / chaîne telle quelle) | `number \| string` | `300` |
| sx | Props de mise en page rapide sx | `LhSxProps` | — |

### Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| update:expandedKeys | Liste des clés dépliées modifiée (pour v-model:expanded-keys) | `(keys: string[])` |
| update:selectedKeys | Liste des clés sélectionnées modifiée (pour v-model:selected-keys) | `(keys: string[])` |
| update:checkedKeys | Liste des clés cochées modifiée (pour v-model:checked-keys) | `(keys: string[])` |
| select | Émis à la sélection / bascule d'un nœud au clic | `(key: string, node: LhTreeNode)` |
| check | Émis après modification de l'ensemble coché | `(keys: string[], node: LhTreeNode)` |
| expand | Émis après dépliage / repliage d'un nœud | `(key: string, expanded: boolean)` |
| nodeLoad | Émis à l'arrivée des sous-nœuds en chargement différé | `(node: LhTreeNode, children: LhTreeNode[])` |

### Slots

| Slot | Description |
| --- | --- |
| node | Contenu du nœud (délimité `{ node, level, expanded, selected }`) |
| empty | État vide (par défaut la clé de langue `tree.empty`) |

### LhTreeNode

| Champ | Description | Type |
| --- | --- | --- |
| key | Clé unique | `string` |
| label | Texte affiché | `string` |
| children | Sous-nœuds | `LhTreeNode[]` |
| disabled | Désactivé | `boolean` |
| isLeaf | Si c'est une feuille (déduit de children en cas d'omission) | `boolean` |

### Accessibilité

- `role="tree"` + `role="treeitem"`, avec `aria-level` / `aria-expanded` / `aria-selected` / `aria-disabled` entièrement exposés
- Les cases à cocher portent `role="checkbox"` + `aria-checked` (`mixed` pour l'indéterminé)

::: tip Différences de plateforme (différences avec la version Vue3)
- **La virtualisation est propre à ce paquet** : pour les gros volumes (centaines ou milliers de
  nœuds), `virtual` est recommandé ; la liste des nœuds est portée par un `scroll-view` et rendue
  par fenêtres à hauteur de ligne fixe de 34 px (zone visible + marges), `virtualHeight` contrôlant
  la hauteur de la fenêtre. Le contenu du nœud doit rester sur une seule ligne ; sans `virtual`,
  les nœuds sont rendus directement sous le conteneur racine.
- **La navigation clavier est réservée à H5** : les touches du motif APG tree — ↑/↓ entre les
  éléments (en sautant les désactivés, en boucle), → pour déplier ou aller au premier enfant,
  ← pour replier ou remonter au parent, Home/End aux extrémités, Enter/Space pour activer — ne
  fonctionnent qu'en H5 ; le Mini Programme n'a pas d'événements clavier et tout le bloc est
  retiré par compilation conditionnelle (aucun code mort dans le paquet MP), et le roving
  tabindex n'est également produit qu'en H5.
- **Indentation RTL** : l'indentation de niveau utilise le style physique `padding-left` sur les
  deux cibles (en cohérence avec la décision existante du dépôt « RTL fixe en MP ») ; si un miroir
  RTL est nécessaire en H5, surchargez-le côté consommateur.
- **La flèche est auto-dessinée** : la flèche de dépliage est le glyphe `▸` porté par un `view`
  (la rotation et l'animation de chargement sont de pures transformations CSS), sans dépendre
  d'une police d'icônes.
:::
