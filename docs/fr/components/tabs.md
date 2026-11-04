# Tabs

Bascule entre les volets d'une même zone. L'en-tête des onglets défile horizontalement et prend en charge le style carte ainsi que les onglets fermables / ajoutables.

## Utilisation de base

Bind le `name` du volet actif avec `v-model` ; en l'absence de valeur, le premier volet activable est activé.

```vue
<template>
  <lh-tabs v-model="active">
    <lh-tab-pane
      name="ink"
      label="Encre"
    >
      Encre : brûlée, épaisse, lourde, claire, légère.
    </lh-tab-pane>
    <lh-tab-pane
      name="danqing"
      label="Peinture"
    >
      Danqing : cinabre et azurite, terme classique désignant la peinture.
    </lh-tab-pane>
    <lh-tab-pane
      name="liubai"
      label="Espace blanc"
    >
      Espace blanc : traiter le blanc comme l'encre, laisser respirer l'esprit.
    </lh-tab-pane>
  </lh-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref('ink')
</script>
```

## Style carte

`type="card"` passe à une apparence carte.

```vue
<template>
  <lh-tabs
    v-model="active"
    type="card"
  >
    <lh-tab-pane
      name="spring"
      label="Printemps"
    >
      Printemps : les plantes bourgeonnent.
    </lh-tab-pane>
    <lh-tab-pane
      name="summer"
      label="Été"
    >
      Été : tout fleurit.
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## Position des onglets

`tab-position="bottom"` place l'en-tête des onglets sous le contenu.

```vue
<template>
  <lh-tabs
    v-model="active"
    tab-position="bottom"
  >
    <lh-tab-pane
      name="poem"
      label="Poésie"
    >
      Poésie : exprimer l'aspiration.
    </lh-tab-pane>
    <lh-tab-pane
      name="painting"
      label="Peinture"
    >
      Peinture : transmettre l'idée.
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## Onglets désactivés

Un `lh-tab-pane` avec `disabled` ne peut pas être activé (les clics sont ignorés et un `modelValue` pointant dessus revient au premier volet activable).

```vue
<template>
  <lh-tabs v-model="active">
    <lh-tab-pane
      name="first"
      label="Activé"
    >
      Le premier volet est activé.
    </lh-tab-pane>
    <lh-tab-pane
      name="second"
      label="Désactivé"
      disabled
    >
      Ce volet est désactivé et ne peut pas être activé.
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## Fermable et ajoutable

`closable` affiche un bouton de fermeture sur chaque onglet (émet `tab-remove` au clic) ; `addable` affiche un bouton d'ajout (émet `tab-add`). Le composant se contente d'émettre des événements : l'ajout et le retrait des nœuds de volet incombent à la couche métier, comme dans la version Vue 3.

```vue
<template>
  <lh-tabs
    v-model="active"
    closable
    addable
    @tab-remove="handleRemove"
    @tab-add="handleAdd"
  >
    <lh-tab-pane
      v-for="pane in panes"
      :key="pane.name"
      :name="pane.name"
      :label="pane.label"
    >
      {{ pane.label }} : contenu du volet.
    </lh-tab-pane>
  </lh-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref('one')
const panes = ref([
  { name: 'one', label: 'Onglet un' },
  { name: 'two', label: 'Onglet deux' },
])

function handleRemove(name: string) {
  panes.value = panes.value.filter((pane) => pane.name !== name)
}

function handleAdd() {
  panes.value.push({ name: `new-${panes.value.length + 1}`, label: 'Nouvel onglet' })
}
</script>
```

## Tabs Props

| Prop | Description | Type | Par défaut |
| --- | --- | --- | --- |
| modelValue | `name` du volet actif (v-model) | `string` | — |
| type | Apparence : `'line'` souligné / `'card'` carte | `'line' \| 'card'` | `'line'` |
| closable | Si les onglets sont fermables | `boolean` | `false` |
| addable | Si le bouton d'ajout est affiché | `boolean` | `false` |
| tabPosition | Position des onglets : `'top'` / `'bottom'` | `'top' \| 'bottom'` | `'top'` |
| customClass | Classe personnalisée | `string` | — |
| sx | Props de mise en page rapide | `LhSxProps` | — |

## TabPane Props

| Prop | Description | Type | Par défaut |
| --- | --- | --- | --- |
| name | Identifiant unique du volet (clé stable, à ne pas modifier dynamiquement) | `string` | — |
| label | Libellé de l'onglet | `string` | `''` |
| disabled | Si le volet est désactivé | `boolean` | `false` |
| customClass | Classe personnalisée (appliquée au nœud racine du volet) | `string` | — |

## Events

| Événement | Description | Args du callback |
| --- | --- | --- |
| update:modelValue | Le volet actif a changé (v-model) | `(name: string)` |
| tab-change | Le volet actif a changé par interaction utilisateur | `(name: string)` |
| tab-remove | Le bouton de fermeture a été cliqué ; le composant ne retire pas lui-même les nœuds enfants, c'est la couche métier qui les gère | `(name: string)` |
| tab-add | Le bouton d'ajout a été cliqué ; le composant n'ajoute pas lui-même les nœuds enfants, c'est la couche métier qui les gère | — |

## Slots

| Slot | Description |
| --- | --- |
| Tabs default | Nœuds de volet (seuls les `lh-tab-pane` sont collectés ; peuvent être enveloppés dans `v-for` / `template`) |
| TabPane default | Contenu du volet |

## Différences entre plateformes

- L'en-tête des onglets est un `scroll-view` (barre de navigation à défilement horizontal) : sur WeChat Mini Program, `enable-flex` fait du conteneur de défilement un layout flex afin que les onglets ne rétrécissent ni ne passent à la ligne ; sur H5, la classe `display: flex` s'applique.
- **Le soulignement de l'onglet actif est une transition CSS pure** (le trait d'encre `::after` de l'onglet actif) et ne dépend pas de `transitionend`. Si un indicateur glissant piloté par JS est ajouté ultérieurement : `transitionend` n'est pas fiable sur Mini Program, la fin de l'animation doit donc être alignée avec `setTimeout` (même approche que les transitions de message / loading).
- **La navigation au clavier (flèches / Home / End / Delete pour fermer) est réservée à H5** : Mini Program n'a pas d'événements clavier et une constante de compilation empêche la branche de navigation d'entrer dans le bundle MP (pas de code mort). L'attribut `tabindex` du roving tabindex est conservé sur MP mais n'y a aucune sémantique clavier.
- Les rôles d'accessibilité `role="tablist" / "tab" / "tabpanel"` ainsi que `aria-selected` / `aria-controls` / `aria-labelledby` sont émis sur les deux plateformes ; la prise en charge du lecteur d'écran sur Mini Program dépend de la plateforme.
- Les `id` des onglets et des volets sont générés avec un préfixe unique par instance (`generateId`), afin que plusieurs tabs sur une page n'entrent jamais en conflit.
- **Décision de portage (alignée sur la version Vue 3, aucune API inventée)** : au moment du portage, la source de vérité de plus et le core de `@lh-ui/share` ne proposaient pas encore `lazy`, `before-leave`, `editable` (= sucre de closable + addable) ni l'apparence `border-card` ; cette bibliothèque ne les propose donc pas non plus. Le contenu des volets est toujours rendu et basculé via `v-show`. Ils suivront dès que la source de vérité les ajoutera.
