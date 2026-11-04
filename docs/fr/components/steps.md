# Steps (barre d'étapes)

Guide l'utilisateur dans un flux de tâches. Prise en charge des dispositions horizontale / verticale, des icônes, des descriptions et de la navigation par clic. Composant d'affichage et d'état, entièrement utilisable sur H5 comme sur le Mini Programme WeChat.

## Utilisation de base

`current` définit l'index de l'étape active (à partir de 0, liaison bidirectionnelle possible avec `v-model:current`). Les étapes précédentes sont `finish`, l'étape elle-même est `process`, les suivantes sont `wait`.

```vue
<template>
  <lh-steps :current="current">
    <lh-step
      title="Moudre l'encre"
      description="L'encre en cinq tons"
    />
    <lh-step
      title="Esquisse"
      description="Composer la mise en page"
    />
    <lh-step
      title="Poser l'encre"
      description="Le trait comme ossature"
    />
    <lh-step
      title="Inscription"
      description="La touche finale"
    />
  </lh-steps>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const current = ref(1)
</script>
```

## Étapes verticales

`direction="vertical"` passe à une disposition verticale (gérée par CSS, aucune différence de plateforme).

```vue
<template>
  <lh-steps
    :current="1"
    direction="vertical"
  >
    <lh-step
      title="Commande passée"
      description="2026-10-01 10:00"
    />
    <lh-step
      title="Paiement reçu"
      description="2026-10-01 10:05"
    />
    <lh-step
      title="Expédié"
      description="Livraison estimée 10-03"
    />
    <lh-step title="Confirmer la réception" />
  </lh-steps>
</template>
```

## Avec icônes

Passez `icon` à `lh-step` pour utiliser la police d'icônes intégrée (voir la documentation Icon pour les noms). Sans icône, `finish` affiche une coche, `error` une croix, et les autres affichent leur numéro ordinal.

```vue
<template>
  <lh-steps :current="1">
    <lh-step
      title="Inscription"
      icon="user"
    />
    <lh-step
      title="Vérification"
      icon="email"
    />
    <lh-step
      title="Terminé"
      icon="check"
    />
  </lh-steps>
</template>
```

Le slot `icon` remplace complètement le repli par défaut (graphiques ou texte personnalisés acceptés) :

```vue
<template>
  <lh-steps :current="2">
    <lh-step title="Étape un">
      <template #icon>
        <text class="step-badge">I</text>
      </template>
    </lh-step>
    <lh-step title="Étape deux">
      <template #icon>
        <text class="step-badge">II</text>
      </template>
    </lh-step>
    <lh-step title="Étape trois">
      <template #icon>
        <text class="step-badge">III</text>
      </template>
    </lh-step>
  </lh-steps>
</template>
```

## Navigation par clic

Avec `clickable`, les étapes `finish` ou `process` affichent une tête cliquable ; le clic émet `update:current` (v-model) et `change`. Les étapes suivantes en `wait` ne sont pas navigables.

```vue
<template>
  <lh-steps
    v-model:current="active"
    clickable
  >
    <lh-step title="Étape un" />
    <lh-step title="Étape deux" />
    <lh-step title="Étape trois" />
  </lh-steps>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref(1)
</script>
```

## Surcharge globale du statut

`status` surcharge le statut dérivé de toutes les étapes (`wait` / `process` / `finish` / `error`) pour des présentations personnalisées.

```vue
<template>
  <lh-steps
    :current="2"
    status="error"
  >
    <lh-step title="Étape un" />
    <lh-step title="Étape deux" />
    <lh-step title="Étape trois" />
  </lh-steps>
</template>
```

## Props de Steps

| Prop | Description | Type | Par défaut |
| --- | --- | --- | --- |
| current | Index de l'étape active (v-model:current, à partir de 0) | `number` | `0` |
| direction | Direction : `'horizontal'` / `'vertical'` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| clickable | Active la navigation par clic (étapes terminées / en cours uniquement) | `boolean` | `false` |
| status | Surcharge le statut de toutes les étapes (présentations personnalisées) | `'wait' \| 'process' \| 'finish' \| 'error'` | — |
| customClass | Classe personnalisée (transmise au nœud racine) | `string` | — |
| sx | Props de mise en page rapides | `LhSxProps` | — |

## Props de Step

| Prop | Description | Type | Par défaut |
| --- | --- | --- | --- |
| title | Titre de l'étape (le slot title fonctionne aussi) | `string` | `''` |
| description | Description de l'étape (le slot description fonctionne aussi) | `string` | `''` |
| icon | Nom de l'icône personnalisée (sans lui, finish/error utilisent coche/croix, les autres affichent l'ordinal) | `LhIconName` | — |
| customClass | Classe personnalisée (transmise au nœud racine de l'élément) | `string` | — |

## Événements

| Événement | Description | Arguments |
| --- | --- | --- |
| update:current | L'étape active a changé (v-model:current) | `(index: number)` |
| change | Navigation en cliquant sur une étape cliquable | `(index: number)` |

## Slots

| Slot | Description |
| --- | --- |
| Steps default | Nœuds d'étapes (seul `lh-step` est collecté) |
| Step icon | Contenu du cercle (surcharge la prop icon et le repli ordinal) |
| Step title | Titre (surcharge la prop title) |
| Step description | Description (surcharge la prop description) |

## Différences de plateforme

- **Composant d'affichage et d'état, entièrement utilisable sur H5 et le Mini Programme WeChat** ; la disposition horizontale / verticale est gérée par CSS et identique sur les deux plateformes.
- `<ol>/<li>` sont remplacés par `<view>` (WXSS interdit les sélecteurs de balise) ; les têtes cliquables utilisent `view` + `role="button"` (le `<button>` du Mini Programme a des styles natifs impossibles à réinitialiser). Les noms accessibles proviennent des clés `steps.step` / `steps.finish` / `steps.error` des locales share (neuf langues incluses, aucune copie dans ce dépôt).
- **Le mécanisme « la dernière étape ne trace pas de connecteur » diffère selon la plateforme** : dans la source share, les connecteurs (horizontal `::after` / vertical `::before`) s'appuient sur le sélecteur structurel `:not(:last-child)` pour ignorer le dernier élément ; WXSS ne gère pas `:not()`, la build le supprime donc (chaque élément trace le connecteur) et le masquage du dernier élément / de la fin de ligne est délégué à la classe `--line-last` :
  - Horizontal : la logique de mesure du retour à la ligne est identique à la version Vue 3 (`getStepsLineLastIndices`), mais la mesure passe par l'adaptateur `getLhRect` (H5 interroge le document, MP utilise le `createSelectorQuery` asynchrone, obligatoirement après onMounted).
  - Vertical : aucun retour à la ligne, le dernier élément global est donc marqué directement, et le SFC du composant ajoute une règle d'adaptation uni-app pour masquer `--line-last::before` (la source share n'a pas cette règle).
- **Le recalcul du retour à la ligne lors du redimensionnement du conteneur est réservé à H5** : H5 utilise `ResizeObserver` ; MP n'en dispose pas, l'ajout / le retrait d'étapes et le changement de direction déclenchent toujours un recalcul, mais les changements de taille dynamiques nécessitent une réentrée de page (dégradation acceptée qui garde le bundle MP sans code mort).
- **Décision de portage (alignée sur la version Vue 3, aucune API inventée)** : au moment du portage, la source de vérité plus n'offrait pas le mode `simple`, les statuts personnalisés `process-status` / `finish-status`, l'espacement `space` ni des APIs similaires (les props de la source sont `current` / `direction` / `clickable` / `status` / `themeVars` / `sx`), cette bibliothèque ne les fournit donc pas non plus. `themeVars` est également absent (la liste `componentTheme` du ConfigProvider de ce dépôt n'inclut pas encore steps). Ils suivront dès que la source de vérité les ajoutera.
