# Cascader Sélecteur en cascade

Sélecteur en cascade pour les données à plusieurs niveaux, par exemple le choix province / ville / district. Le clic sur le déclencheur ouvre un panneau multi-colonnes ; on descend niveau par niveau et la sélection s'achève en choisissant un nœud feuille (ou n'importe quel niveau avec `check-strictly`).

## Utilisation de base

```vue
<template>
  <lh-cascader v-model="value" :options="options" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const options = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      {
        value: 'sheji',
        label: '设计指南',
        children: [
          { value: 'yuansze', label: '颜色' },
          { value: 'fuziyuanze', label: '字体' },
        ],
      },
      { value: 'shejiguize', label: '设计规则' },
    ],
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      { value: 'jiben', label: '基础' },
      { value: 'fankui', label: '反馈' },
    ],
  },
]
</script>
```

Cliquer sur un élément ayant des enfants déploie d'abord la colonne suivante ; cliquer ensuite sur un nœud feuille le sélectionne (en sélection simple, le panneau se ferme de lui-même).

## Sélection multiple

```vue
<template>
  <lh-cascader v-model="value" :options="options" multiple />
  <!-- Étiquettes repliées : seulement le premier élément choisi + un compteur -->
  <lh-cascader v-model="value2" :options="options" multiple collapse-tags />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const value2 = ref<(string | number)[]>(['yuansze', 'fuziyuanze'])
const options = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      { value: 'sheji', label: '设计指南' },
      { value: 'shejiguize', label: '设计规则' },
    ],
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      { value: 'jiben', label: '基础组件' },
      { value: 'fankui', label: '反馈组件' },
    ],
  },
]
</script>
```

En mode multiple, `v-model` est lié au tableau des **valeurs du dernier niveau** de chaque chemin sélectionné ; les éléments choisis s'affichent sous forme d'étiquettes à l'intérieur du déclencheur.

## Options désactivées

`disabled: true` dans les données d'un nœud désactive ce nœud (le cliquer ne le déploie ni ne le sélectionne) ; la prop `disabled` désactive l'ensemble du sélecteur ; `readonly` affiche la valeur sans ouvrir le panneau.

```vue
<template>
  <lh-cascader v-model="value" :options="disabledOptions" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>([])
const disabledOptions = [
  {
    value: 'zhinan',
    label: '指南',
    disabled: true,
    children: [{ value: 'sheji', label: '设计指南' }],
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      { value: 'jiben', label: '基础组件' },
      { value: 'fankui', label: '反馈组件', disabled: true },
    ],
  },
]
</script>
```

## Affichage du chemin et valeur de retour

```vue
<template>
  <!-- Chemin complet (par défaut) -->
  <lh-cascader v-model="value" :options="options" placeholder="Chemin complet (par défaut)" />
  <!-- Dernier niveau seulement -->
  <lh-cascader v-model="value" :options="options" :show-all-levels="false" placeholder="Dernier niveau seulement" />
  <!-- Séparateur personnalisé -->
  <lh-cascader v-model="value" :options="options" separator=" > " placeholder="Séparateur >" />
  <!-- v-model ne lie que la valeur du dernier niveau (l'écho reste le chemin complet) -->
  <lh-cascader v-model="leafValue" :options="options" :emit-path="false" placeholder="Valeur du dernier niveau seulement" />
  <!-- N'importe quel niveau sélectionnable (cliquer un nœud non feuille le sélectionne) -->
  <lh-cascader v-model="anyValue" :options="options" check-strictly placeholder="N'importe quel niveau sélectionnable" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>(['zhinan', 'sheji', 'yuansze'])
const leafValue = ref<(string | number)[]>(['yuansze'])
const anyValue = ref<(string | number)[]>(['zhinan', 'sheji'])
const options = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      { value: 'sheji', label: '设计指南', children: [{ value: 'yuansze', label: '颜色' }] },
    ],
  },
]
</script>
```

> L'espace réservé par défaut provient de la clé de locale `cascader.placeholder` (« 请选择 » en chinois) et peut être surchargé par `placeholder`.

## Filtrable

`filterable` active la recherche : le champ de filtrage se trouve dans le panneau (le Mini Programme n'a pas de sémantique de focus d'entrée dans le déclencheur) ; après avoir saisi un mot-clé, les résultats s'affichent en chemin complet et cliquer un résultat le sélectionne directement.

```vue
<template>
  <lh-cascader v-model="value" :options="options" filterable placeholder="Saisissez un mot-clé" />
</template>
```

En l'absence de correspondance, la clé de locale `cascader.noMatch` est affichée (« 无匹配数据 » en chinois), personnalisable via le slot `no-match`.

## Alias de champs

`item-config` déclare les alias des champs du nœud (`value` / `label` / `children` / `disabled` / `leaf`), de sorte que les données asynchrones ou les structures backend n'exigent aucune conversion manuelle :

```vue
<template>
  <lh-cascader
    v-model="value"
    :options="aliasedOptions"
    :item-config="{ value: 'id', label: 'name', children: 'sub' }"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<(string | number)[]>(['zhejiang', 'hangzhou', 'xihu'])
const aliasedOptions = [
  {
    id: 'zhejiang',
    name: '浙江省',
    sub: [{ id: 'hangzhou', name: '杭州市', sub: [{ id: 'xihu', name: '西湖区' }] }],
  },
]
</script>
```

## Cascader API

### Props

| Propriété | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| modelValue | Valeur liée (avec `emitPath` à `false`, seul le dernier niveau) | `(string \| number)[]` | `() => []` |
| options | Liste des options (structure arborescente) | `LhCascaderNode[]` | `() => []` |
| size | Taille | `LhCascaderSize` | `'medium'` |
| disabled | Désactive tout le sélecteur | `boolean` | `false` |
| clearable | Possibilité d'effacer | `boolean` | `true` |
| placeholder | Espace réservé (si non transmis, clé de locale `cascader.placeholder`) | `string` | — |
| readonly | Lecture seule (n'ouvre pas le panneau) | `boolean` | `false` |
| showAllLevels | Le déclencheur affiche le chemin complet | `boolean` | `true` |
| checkStrictly | N'importe quel niveau de nœud est sélectionnable | `boolean` | `false` |
| emitPath | La valeur de retour contient le chemin complet | `boolean` | `true` |
| multiple | Sélection multiple | `boolean` | `false` |
| cascading | Association en cascade (déploie les enfants au survol, H5 uniquement) | `boolean` | `true` |
| separator | Séparateur de chemin | `string` | `'/'` |
| collapseTags | Replie les étiquettes en mode multiple | `boolean` | `false` |
| filterable | Possibilité de rechercher | `boolean` | `false` |
| itemConfig | Alias des champs du nœud | `LhCascaderItemConfig` | `() => ({})` |
| customClass | Classe personnalisée (transmise au nœud racine) | `string` | — |
| themeVars | Variables de thème au niveau du composant | `Record<string, string>` | — |
| sx | Props de mise en page rapide (appliquées à la racine du déclencheur, le panneau flottant n'est pas concerné) | `LhSxProps` | — |

### Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| update:modelValue | Émis lorsque la valeur liée change | `(value: (string \| number)[])` |
| change | Émis lorsque la valeur sélectionnée change | `(value: (string \| number)[], path: LhCascaderNode[] \| null)` |

### Slots

| Slot | Description |
| --- | --- |
| no-match | Contenu personnalisé lorsque le filtre ne trouve aucune correspondance |

### Structure de données

Définition du type `LhCascaderNode` :

```ts
interface LhCascaderNode {
  value: string | number
  label: string
  disabled?: boolean
  leaf?: boolean
  children?: LhCascaderNode[]
}
```

### Accessibilité

- Le déclencheur porte `aria-haspopup="listbox"` / `aria-expanded` / `aria-controls` (le paquet d'attributs est produit par la fonction pure `getCascaderTriggerAria` de share, liée clé par clé de façon explicite)
- Le panneau flottant est `role="dialog"` et chaque colonne est `role="listbox"` (l'`aria-label` vient de la clé de locale `cascader.columnLabel`, « 第 N 级 ») ; les éléments des colonnes sont `role="option"` et portent `aria-selected` / `aria-disabled` / `aria-expanded`
- Le moteur de positionnement est une implémentation maison de fonctions pures (flip / shift contre le débordement), sans dépendance tierce à l'exécution

::: tip Différences de plateforme (différences avec la version Vue3)
- **Le panneau devient une couche flottante** : dans plus, le panneau est accroché sous un `Teleport to="body"` avec un fondu de `Transition` ; côté uni-app, il est porté par `lh-root-portal` (avec un repli `fixed` dans la page sur les anciennes versions de base) et le positionnement passe par une mesure asynchrone en deux images (rendu caché pour mesurer → `computePosition` positionne → affichage, afin d'éviter le scintillement). Le calcul du positionnement est asynchrone, il ne faut pas supposer de résultat synchrone. Aucune transition d'entrée et de sortie n'est liée (`Transition` n'est pas fiable sur MP, comme tooltip / dropdown / popover).
- **Défilement des colonnes** : chaque colonne est un `scroll-view` (`scroll-y`) à défilement vertical indépendant — le `view` du MP n'offre pas de défilement par débordement fiable, donc le conteneur de colonne en `overflow-y: auto` du scss de share est couvert sur H5 par l'implémentation équivalente de `scroll-view`.
- **Navigation clavier réservée à H5** : Enter/Space sur le déclencheur ouvre et ferme, les flèches envoient le focus dans le panneau ; à l'intérieur, ↑↓ se déplacent dans la colonne (en sautant les désactivés), ←→ changent de colonne, Enter/Space équivalent à un clic ; Escape ferme via une écoute au niveau du document (avec plusieurs couches flottantes, seule la plus haute se ferme). Tout le corps de la fonction de traitement est retiré par la compilation conditionnelle ; le paquet MP ne contient pas de code mort.
- **Le déploiement au survol réservé à H5** : le déploiement des enfants au survol propre à `cascading` dépend de la sémantique hover, absente du Mini Programme ; là-bas, les enfants ne se déploient qu'au clic (`cascading` équivaut sur MP à la désactivation du déploiement au survol).
- **Emplacement du champ de filtrage** : dans plus, le champ de filtrage de `filterable` est le déclencheur lui-même ; le côté uni-app le place dans le panneau flottant (comme select), car le MP n'a pas de sémantique de focus d'entrée dans le déclencheur.
- **La fermeture au clic extérieur** : plus écoute les clics du document avec `useLhClickOutside` ; le côté uni-app s'en remet à un masque transparent dans la page (cliquer le masque ferme).
- **Pas de repli quand le déclencheur sort de la zone d'affichage** : uni-app n'offre pas de canal unifié d'écoute du défilement et des changements de taille, donc cela n'a pas été porté.
- **Anneau de focus et roving tabindex réservés à H5** : le MP n'a pas de sémantique de focus clavier, donc la liaison de `tabindex` ne laisse aucune trace côté MP.
:::
