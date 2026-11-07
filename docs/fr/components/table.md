# Table

Tableau de données : en-têtes multi-niveaux, tri, filtrage, défilement virtuel et
cellules personnalisées. La construction des en-têtes (`buildHeaderCells`), le tri
(`sortTableRows`), le filtrage (`filterTableRows`), l'intervalle virtuel
(`computeVisibleRange`) ainsi que le calcul des noms de classe / décalages sticky
proviennent tous des fonctions pures du core de `@lh-ui/share`.

## Différences de plateforme (important)

- **Défilement horizontal** : sur H5 l'en-tête et le corps sont deux conteneurs de
  défilement indépendants, `scrollLeft` étant synchronisé dans les deux sens ; du
  côté WeChat, un unique `scroll-view` externe (scroll-x) fait défiler l'ensemble
  du tableau horizontalement, l'en-tête et le corps partageant un même axe de
  défilement, sans mécanisme de synchronisation.
- **Colonnes fixes (H5 uniquement)** : les colonnes fixes reposent sur le support
  de `position: sticky` par les cellules de tableau, peu fiable en WXSS ; les
  styles de colonnes fixes en MP sont donc retirés à la construction (l'enveloppe
  `#ifdef H5` de `build-styles`) et dégradent en colonnes de défilement
  horizontal ordinaires.
- **Redimensionnement des colonnes (H5 uniquement)** : `mousedown` et la
  sémantique clavier n'existent pas en MP, les poignées de glissement ne sont
  donc rendues que sur H5.
- **Lignes alternées (stripes)** : la règle `:nth-child(even)` de share est
  réservée à H5 (WXSS ne supporte pas les pseudo-classes nth) ; en MP, le
  modèle ajoute la classe `--alt` en fonction de l'index de la ligne.
- **Défilement virtuel** : H5 utilise `clientHeight` + `ResizeObserver` ; MP
  utilise `detail.scrollTop` du `scroll-view` + `createSelectorQuery`.

## Utilisation de base

```vue
<template>
  <lh-table :data="rows" :columns="columns" />
</template>

<script setup lang="ts">
const rows = [
  { id: 1, name: 'Utilisateur 1', age: 28, city: 'Pékin' },
  { id: 2, name: 'Utilisateur 2', age: 34, city: 'Shanghai' },
]
const columns = [
  { prop: 'name', label: 'Nom', width: 140 },
  { prop: 'age', label: 'Âge', width: 120, align: 'right' },
  { prop: 'city', label: 'Ville', width: 160 },
]
</script>
```

## Lignes alternées et bordures

```vue
<template>
  <lh-table :data="rows" :columns="columns" stripe border />
</template>
```

## Tri et filtrage

```vue
<template>
  <lh-table
    :data="rows"
    :columns="columns"
    @sort-change="onSort"
    @filter-change="onFilter"
  />
</template>

<script setup lang="ts">
const columns = [
  { prop: 'age', label: 'Âge', width: 120, sortable: true },
  {
    prop: 'city',
    label: 'Ville',
    width: 160,
    filters: [
      { text: 'Pékin', value: 'Pékin' },
      { text: 'Shanghai', value: 'Shanghai' },
    ],
  },
]

function onSort(payload: { prop: string; order?: 'asc' | 'desc' }) {}
function onFilter(payload: { prop: string; values: (string | number)[] }) {}
</script>
```

Un clic sur l'en-tête d'une colonne triable cycle `aucun → croissant → décroissant`
(`cycleSortOrder`) ; l'en-tête d'une colonne filtrable porte un déclencheur de
filtre et, après avoir coché les éléments du panneau et confirmé, les lignes sont
filtrées (la logique de filtrage passe par `filterTableRows` de share). L'état du
filtre gère deux modes : contrôlé (`filtered-values`) et non contrôlé
(`default-filtered-values`).

## Colonnes fixes et défilement horizontal (H5 uniquement)

```vue
<template>
  <lh-table :data="rows" :columns="columns" />
</template>

<script setup lang="ts">
const columns = [
  { prop: 'name', label: 'Nom', width: 140, fixed: 'left' },
  { prop: 'age', label: 'Âge', width: 120 },
  { prop: 'city', label: 'Ville', width: 160 },
  { prop: 'status', label: 'Statut', width: 120, fixed: 'right' },
]
</script>
```

`fixed: 'left' / 'right'` requiert une largeur numérique ; pour le côté MP,
reportez-vous aux différences de plateforme ci-dessus.

## Défilement virtuel (dizaines de milliers de lignes)

```vue
<template>
  <lh-table :data="hugeRows" :columns="columns" :height="360" />
</template>
```

Définir `height` active le défilement virtuel : le corps du tableau prend une
hauteur fixe et ne rend que la fenêtre visible plus l'overscan
(`LH_TABLE_OVERSCAN = 3`) ; `row-height` doit correspondre à la hauteur réelle
d'une ligne (48 par défaut).

## Cellules personnalisées

```vue
<template>
  <lh-table :data="rows" :columns="columns">
    <template #status="{ row }">
      <lh-tag :type="row.status === 'active' ? 'success' : 'danger'">
        {{ row.status === 'active' ? 'Activé' : 'Désactivé' }}
      </lh-tag>
    </template>
  </lh-table>
</template>

<script setup lang="ts">
const columns = [
  { prop: 'name', label: 'Nom', width: 140 },
  { prop: 'status', label: 'Statut', width: 140, slot: 'status' },
]
</script>
```

Le champ `slot` de la configuration de colonne déclare un slot nommé à portée ;
les paramètres du slot sont `{ row, column, index, value }`.

## En-têtes multi-niveaux

```vue
<script setup lang="ts">
const columns = [
  { prop: 'name', label: 'Nom', width: 140 },
  {
    label: 'Groupe',
    children: [
      { prop: 'age', label: 'Âge', width: 120 },
      { prop: 'city', label: 'Ville', width: 160 },
    ],
  },
]
</script>
```

Le champ `children` de la configuration de colonne déclare les colonnes
enfants ; les lignes d'en-tête sont réparties automatiquement par niveau et
positionnées via une grille (`buildHeaderCells` calcule les colspan / rowspan).

## API

### Props

| Prop | Description | Type | Par défaut |
| --- | --- | --- | --- |
| data | Données des lignes | `LhTableRow[]` | `[]` |
| columns | Configuration des colonnes | `LhTableColumn[]` | `[]` |
| height | Hauteur du corps (active le défilement virtuel lorsqu'il est défini) | `number \| string` | `-` |
| max-height | Hauteur maximale en mode non virtuel | `number \| string` | `-` |
| row-height | Hauteur de ligne du défilement virtuel | `number` | `48` |
| stripe | Lignes alternées | `boolean` | `false` |
| border | Bordures des cellules | `boolean` | `false` |
| size | Taille | `'small' \| 'default' \| 'large'` | `'default'` |
| row-key | Champ servant de clé de ligne | `string` | `'id'` |
| default-sort-prop | Colonne de tri par défaut | `string` | `-` |
| default-sort-order | Direction du tri par défaut | `'asc' \| 'desc'` | `-` |
| sorter | Fonction de tri personnalisée | `(a, b) => number` | `-` |
| resizable | Activer le redimensionnement des colonnes (H5 uniquement) | `boolean` | `false` |
| default-filtered-values | État du filtre par défaut (non contrôlé) | `Record<string, (string \| number)[]>` | `{}` |
| filtered-values | État du filtre contrôlé | `Record<string, (string \| number)[]>` | `-` |
| sx | Props de mise en page rapide | `LhSxProps` | `-` |

### LhTableColumn

| Prop | Description | Type |
| --- | --- | --- |
| prop | Nom du champ | `string` |
| label | Texte de l'en-tête | `string` |
| width | Largeur de colonne (les nombres sont en px) | `number \| string` |
| align | Alignement | `'left' \| 'center' \| 'right'` |
| fixed | Colonne fixe (H5 uniquement) | `'left' \| 'right'` |
| sortable | Triable | `boolean` |
| resizable | Redimensionnable (activation par colonne et `width` numérique requis, H5 uniquement) | `boolean` |
| filters | Options de filtrage | `{ text, value }[]` |
| filter-multiple | Filtrage à sélection multiple (true par défaut) | `boolean` |
| formatter | Formateur de cellule | `(row, value) => string` |
| slot | Nom du slot pour les cellules personnalisées | `string` |
| children | Colonnes enfants (en-têtes multi-niveaux) | `LhTableColumn[]` |

### Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| sort-change | Le tri a changé | `(payload: { prop, order })` |
| row-click | Clic sur une ligne | `(row, index)` |
| filter-change | Le filtrage a changé | `(payload: { prop, values })` |
| update:filtered-values | Mise à jour du filtrage contrôlé | `(values)` |
| column-resize | Ajustement de la largeur de colonne (H5 uniquement) | `(payload: { prop, width })` |

### Slots

| Slot | Description | Paramètres de portée |
| --- | --- | --- |
| [Slot de colonne] | Cellule personnalisée (le nom est donné par le `slot` de la colonne) | `{ row, column, index, value }` |
| empty | Contenu en l'absence de données (« Aucune donnée » par défaut) | `-` |
