# TreeSelect

Un sélecteur en arbre pour les données hiérarchiques, comme les organigrammes ou les arbres de catégories. Le clic sur le déclencheur ouvre un panneau en arbre ; en sélection unique, cliquer sur un nœud le sélectionne et ferme le panneau ; en sélection multiple, la sélection se fait via des cases à cocher (cascade parent-enfant).

## Utilisation de base

```vue
<template>
  <lh-tree-select v-model="value" :data="data" placeholder="请选择节点" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<string | undefined>(undefined)
const data = [
  {
    key: 'zhinan',
    label: '指南',
    children: [
      {
        key: 'sheji',
        label: '设计指南',
        children: [
          { key: 'yuansze', label: '颜色' },
          { key: 'fuziyuanze', label: '字体' },
        ],
      },
      { key: 'shejiguize', label: '设计规则' },
    ],
  },
  {
    key: 'zujian',
    label: '组件',
    children: [
      { key: 'jiben', label: '基础' },
      { key: 'fankui', label: '反馈' },
    ],
  },
]
</script>
```

Cliquer sur un nœud le sélectionne (y compris les nœuds non feuilles) et ferme le panneau ; cliquer sur la flèche d'expansion à gauche du nœud ne fait que l'ouvrir / le replier sans changer la sélection. Le déclencheur affiche le `label` du nœud sélectionné.

## Sélection multiple

```vue
<template>
  <lh-tree-select v-model="value" :data="data" multiple placeholder="请选择多个节点" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<string[]>(['jiben', 'fankui'])
const data = [
  {
    key: 'zujian',
    label: '组件',
    children: [
      { key: 'jiben', label: '基础' },
      { key: 'fankui', label: '反馈' },
    ],
  },
]
</script>
```

En sélection multiple, `v-model` est lié au tableau des clés cochées (`string[]`) avec cascade parent-enfant : cocher un parent coche automatiquement tous les descendants cochables, un parent devient entièrement coché lorsque tous ses descendants le sont et partiellement coché (indéterminé) quand certains le sont. Cliquer sur le label d'un nœud ne fait que l'ouvrir, la coche se fait via la case à cocher (comme pour la version Vue3). Le déclencheur affiche les labels de toutes les clés cochées, séparés par「、」.

## Désactivation

`disabled: true` dans les données du nœud désactive ce nœud (le clic ne l'ouvre ni ne le sélectionne, et sa case à cocher n'est pas cliquable) ; la prop `disabled` désactive l'ensemble du sélecteur.

```vue
<template>
  <lh-tree-select v-model="value" :data="disabledData" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<string | undefined>(undefined)
const disabledData = [
  {
    key: 'zhinan',
    label: '指南',
    children: [
      {
        key: 'sheji',
        label: '设计指南',
        disabled: true,
        children: [{ key: 'yuansze', label: '颜色' }],
      },
      { key: 'shejiguize', label: '设计规则' },
    ],
  },
]
</script>
```

## API TreeSelect

### Props

| Prop | Description | Type | Défaut |
| --- | --- | --- | --- |
| modelValue | Valeur liée (`string` en sélection unique / `string[]` en sélection multiple, v-model contrôlé) | `string \| string[] \| undefined` | — |
| data | Données de l'arbre | `LhTreeNode[]` | `() => []` |
| multiple | Sélection multiple activée (cases à cocher affichées, la valeur est le tableau des clés cochées, cascade parent-enfant) | `boolean` | `false` |
| disabled | Désactive l'ensemble du sélecteur | `boolean` | `false` |
| placeholder | Placeholder (à défaut, clé de locale `select.placeholder`) | `string` | — |
| customClass | Classe personnalisée (transmise au nœud racine) | `string` | — |
| themeVars | Variables de thème au niveau du composant | `Record<string, string>` | — |
| sx | Propriétés de mise en page rapide sx (appliquées à la racine du déclencheur, le panneau flottant n'est pas affecté) | `LhSxProps` | — |

### Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| update:modelValue | Émis lorsque la valeur liée change | `(value: string \| string[] \| undefined)` |
| change | Émis lorsque la sélection change | `(value: string \| string[] \| undefined)` |

### Structure de données

Définition du type `LhTreeNode` (source de vérité dans `@lh-ui/share/core/tree`) :

```ts
interface LhTreeNode {
  /** Clé unique */
  key: string
  /** Texte affiché */
  label: string
  /** Nœuds enfants */
  children?: LhTreeNode[]
  /** Désactivé */
  disabled?: boolean
  /** Feuille ou non (déduit de children si omis) */
  isLeaf?: boolean
}
```

### Accessibilité

- Le déclencheur porte `aria-haspopup="tree"` / `aria-expanded` / `aria-label` (depuis la clé de locale `treeSelect.triggerLabel`)
- Le panneau est `role="listbox"`, l'arbre intégrée est `role="tree"`, les nœuds sont des `role="treeitem"` avec `aria-level` / `aria-expanded` / `aria-selected` / `aria-disabled` ; en sélection multiple le panneau porte `aria-multiselectable` et les cases à cocher sont `role="checkbox"` avec `aria-checked` (`mixed` pour l'état intermédiaire)
- L'indentation des niveaux, la rotation de la flèche d'expansion et l'apparence tri-état de la case à cocher proviennent toutes de la source de styles share (`@lh-ui/share/styles/tree`), sans duplication de styles côté terminal

::: tip Différences de plateforme (différences avec la version Vue3)
- **Composition glue plutôt qu'un core dédié** : share core n'a pas de module tree-select ; ce côté suit la forme d'implémentation de plus et compose « un déclencheur select + un panneau lh-tree » — le panneau intègre `lh-tree` et toute la logique d'arbre (ouverture / sélection / cascade des cochés) est consommée depuis les fonctions pures de `core/tree` (`flattenTree` / `toggleCheckKeys` / `getNodeCheckState`, etc.), sans rien copier. L'API et les événements sont alignés avec plus, sans ajout de capacité de ce côté.
- **Panneau flottant** : plus monte le panneau sous `Teleport to="body"` ; sur uni-app il est porté par `lh-root-portal` (fallback fixed in-page sur les anciennes bibliothèques de base) et positionné par une mesure asynchrone en deux étapes (rendu caché pour mesurer → `computePosition` pour positionner → affichage, anti-clignotement). Le calcul de positionnement est asynchrone : ne supposez pas un résultat synchrone.
- **Défilement du panneau arbre** : le scss de share `.lh-tree-select__panel` utilise `overflow: auto`, mais le `view` du MP n'a pas de défilement de débordement fiable, le panneau enroule donc l'arbre dans un `scroll-view` (`scroll-y`) pour le défilement vertical, avec une hauteur max alignée sur les 320px de share.
- **Pas de navigation clavier** : la fermeture Escape et l'écoute clavier au niveau document de plus reposent sur des événements clavier absents des Mini Programs ; ce côté ferme le panneau en tapant sur un masque transparent in-page (comme select / cascader), sans dégradation par compilation conditionnelle.
- **Prop `teleported` non portée** : plus l'utilise pour contrôler le montage du panneau sur body ; sur uni-app l'overlay passe toujours par `lh-root-portal`, la sémantique n'existe donc pas.
- **Fermeture au clic extérieur** : plus écoute les clics document avec `useLhClickOutside` ; uni-app utilise un masque transparent in-page (cliquer sur le masque ferme).
- **Correction de l'état coché contrôlé** : plus ne passe pas `checked-keys` à l'arbre intégrée, donc une valeur multiple prédéfinie ne se reflète pas dans les cases à cocher ; ce côté passe aussi `v-model` comme `checked-keys`, de sorte que les cases à cocher et l'écho du déclencheur sont tous deux pilotés par `v-model` (API inchangée).
- **Pas de fermeture automatique lorsque le déclencheur sort de la fenêtre** : uni-app n'a pas de canal unifié d'écoute du défilement / redimensionnement, donc non porté.
:::
