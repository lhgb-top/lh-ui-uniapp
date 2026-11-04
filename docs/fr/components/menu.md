# Menu Menu de navigation

Menu de navigation pour les pages et les fonctionnalités. Prise en charge de deux modes de disposition — vertical (par défaut) et horizontal — avec des sous-menus imbriqués de manière récursive ; l'élément actif est porté par `v-model`, et l'ensemble déployé peut être contrôlé (`openeds`) ou laissé comme état interne (`default-openeds`).

## Utilisation de base

```vue
<template>
  <lh-menu v-model="active">
    <lh-menu-item index="1">Accueil</lh-menu-item>
    <lh-menu-item index="2">Œuvres</lh-menu-item>
    <lh-menu-item index="3">À propos</lh-menu-item>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('1')
</script>
```

`index` est l'identifiant unique de l'élément ; il est émis avec l'événement `select` lorsque l'on clique sur un élément feuille (`update:modelValue` est émis en même temps, il peut donc être reçu via `v-model`).

## Sous-menus et déploiement par défaut

```vue
<template>
  <lh-menu v-model="active" :default-openeds="['2']" @select="onSelect">
    <lh-menu-item index="1">Accueil</lh-menu-item>
    <lh-sub-menu index="2" title="Mes œuvres">
      <lh-menu-item index="2-1">Peinture à l'encre</lh-menu-item>
      <lh-menu-item index="2-2">Peinture Gongbi</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('')
function onSelect(index: string, indexPath: string[]) {
  console.log(index, indexPath)
}
</script>
```

Les sous-menus peuvent s'imbriquer sur plusieurs niveaux : l'`indexPath` de l'événement `select` est le chemin complet depuis le sous-menu le plus externe jusqu'à l'élément choisi (par ex. `['2', '2-1', '2-1-1']`).

## Accordéon

`unique-opened` garde au plus un sous-menu déployé à la fois (cliquer de nouveau sur un titre déjà déployé le replie ; tout replier est autorisé).

```vue
<template>
  <lh-menu v-model="active" unique-opened>
    <lh-sub-menu index="1" title="Premier groupe">
      <lh-menu-item index="1-1">Option 1-1</lh-menu-item>
    </lh-sub-menu>
    <lh-sub-menu index="2" title="Deuxième groupe">
      <lh-menu-item index="2-1">Option 2-1</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>
```

## Déploiement contrôlé

Passer `openeds` fait passer en mode contrôlé : le composant ne maintient plus l'ensemble déployé en interne, il est piloté par la fonction de rappel `update:openeds`.

```vue
<template>
  <lh-menu v-model="active" :openeds="openeds" @update:openeds="openeds = $event">
    <lh-sub-menu index="1" title="Sous-menu contrôlé">
      <lh-menu-item index="1-1">Option 1-1</lh-menu-item>
    </lh-sub-menu>
  </lh-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('')
const openeds = ref<string[]>(['1'])
</script>
```

## Regroupement

`lh-menu-item-group` regroupe les éléments de même nature (regroupement purement visuel ; il ne participe pas à la logique de déploiement).

```vue
<template>
  <lh-menu v-model="active">
    <lh-menu-item-group title="Contenu de base">
      <lh-menu-item index="1">Articles</lh-menu-item>
      <lh-menu-item index="2">Images</lh-menu-item>
    </lh-menu-item-group>
    <lh-menu-item-group title="Fonctionnalités avancées">
      <lh-menu-item index="3">Analyse des données</lh-menu-item>
    </lh-menu-item-group>
  </lh-menu>
</template>
```

## Mode horizontal

```vue
<template>
  <lh-menu v-model="active" mode="horizontal">
    <lh-menu-item index="1">Accueil</lh-menu-item>
    <lh-sub-menu index="2" title="Portfolio">
      <lh-menu-item index="2-1">Peinture à l'encre</lh-menu-item>
      <lh-menu-item index="2-2">Peinture Gongbi</lh-menu-item>
    </lh-sub-menu>
    <lh-menu-item index="3">À propos</lh-menu-item>
  </lh-menu>
</template>
```

En mode horizontal, les sous-menus s'envolent sous leur titre (`bottom-start`) ; les niveaux imbriqués s'envolent sur la droite (`right-start`).

## Mode replié

Le mode vertical combiné avec `collapse` réduit le menu à une bande étroite ; les sous-menus deviennent alors des panneaux volants sur la droite.

```vue
<template>
  <lh-menu v-model="active" collapse>
    <lh-sub-menu index="1" title="Courriel">
      <lh-menu-item index="1-1">Boîte de réception</lh-menu-item>
      <lh-menu-item index="1-2">Envoyés</lh-menu-item>
    </lh-sub-menu>
    <lh-menu-item index="2">Brouillons</lh-menu-item>
  </lh-menu>
</template>
```

## Menu API

### Props

| Propriété | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| modelValue | Élément actif (v-model ; maintenu en interne si omis) | `string` | — |
| mode | Mode de disposition | `'horizontal' \| 'vertical'` | `'vertical'` |
| collapse | Replie le menu vertical en bande d'icônes (les sous-menus deviennent des panneaux volants) | `boolean` | `false` |
| defaultOpeneds | Clés des sous-menus déployés par défaut (non contrôlé) | `string[]` | `[]` |
| openeds | Clés des sous-menus déployés (contrôlé) | `string[]` | — |
| uniqueOpened | Accordéon : au plus un sous-menu déployé | `boolean` | `false` |
| sx | Props de mise en page rapide | `LhSxProps` | — |

### Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| select | Émis lors de la sélection d'un élément feuille | `(index: string, indexPath: string[])` |
| open | Émis lorsqu'un sous-menu se déploie | `(index: string, indexPath: string[])` |
| close | Émis lorsqu'un sous-menu se replie | `(index: string, indexPath: string[])` |
| update:modelValue | Changement de l'élément actif (v-model) | `(value: string)` |
| update:openeds | Changement de l'ensemble déployé | `(value: string[])` |

### Slots

| Slot | Description |
| --- | --- |
| default | Contenu du menu (composé de `LhMenuItem` / `LhSubMenu` / `LhMenuItemGroup`) |

## MenuItem API

### Props

| Propriété | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| index | Identifiant unique (requis) | `string` | — |
| disabled | Désactivé (conserve la sémantique aria-disabled ; le clic et l'activation clavier sont tous deux supprimés) | `boolean` | `false` |
| sx | Props de mise en page rapide | `LhSxProps` | — |

### Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| click | Émis lors du clic sur l'élément feuille (pas émis pour les éléments désactivés) | `(index: string)` |

## SubMenu API

### Props

| Propriété | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| index | Identifiant unique (requis) | `string` | — |
| title | Titre (un slot `title` est également disponible) | `string` | — |
| disabled | Désactivé | `boolean` | `false` |
| sx | Props de mise en page rapide | `LhSxProps` | — |

### Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| select | Émis lorsqu'un élément feuille descendant est sélectionné (le chemin inclut l'index de ce niveau) | `(index: string, indexPath: string[])` |

### Slots

| Slot | Description |
| --- | --- |
| default | Contenu du sous-menu (peut imbriquer d'autres `LhMenuItem` / `LhSubMenu`) |
| title | Contenu personnalisé du titre |

## MenuItemGroup API

### Props

| Propriété | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| title | Titre du groupe (un slot `title` est également disponible) | `string` | — |
| sx | Props de mise en page rapide | `LhSxProps` | — |

### Slots

| Slot | Description |
| --- | --- |
| default | Contenu du groupe |
| title | Titre personnalisé du groupe |

### Accessibilité

- Le conteneur est `role="menu"` (`role="menubar"` en mode horizontal) ; les éléments feuille et les titres de sous-menus sont `role="menuitem"`, les éléments désactivés portent `aria-disabled`, et les titres de sous-menus portent en outre `aria-expanded` / `aria-haspopup` / `aria-controls`
- Le clavier suit le modèle de menu APG (H5 uniquement) : en mode vertical, ↑/↓ parcourent en boucle les éléments visibles (en sautant les éléments désactivés et ceux des panneaux repliés), Home/End sautent aux extrémités ; Enter/Space activent l'élément feuille ; sur le titre d'un sous-menu, Enter/Space/→ le déploient et déplacent le focus dans le panneau, ←/Esc le replie
- En mode horizontal, la sémantique de ←/→ est laissée à chaque titre ; le conteneur racine n'intercepte pas les flèches

::: tip Différences de plateforme (différences avec la version Vue3)
- **Le mode vertical et l'accordéon fonctionnent sur toutes les cibles** : le mode vertical (y compris le déploiement en ligne des sous-menus, l'accordéon et le contrôle par v-model / openeds) est implémenté en CSS pur plus provide/inject, et se comporte de façon identique sur H5 et le Mini Programme WeChat.
- **Défilement horizontal** : lorsque la largeur totale des éléments en mode horizontal dépasse le conteneur, le défilement est assuré par le propre `overflow-x` du conteneur (les vues prennent en charge le défilement par débordement en WXSS), sans envelopper le contenu dans un `scroll-view` — celui-ci, sur H5, enveloppe le contenu du slot dans une couche interne `uni-scroll-view-content` et casse la structure flex des enfants directs du scss de share (contrairement à l'en-tête horizontal de lh-tabs, les éléments du menu sont des flex de bloc et ne peuvent pas se rabattre sur inline-flex comme les onglets).
- **Les sous-menus volants passent par root-portal** : les panneaux volants du mode horizontal / replié remplacent le `<teleport to="body">` de plus par `lh-root-portal` (avec un repli `fixed` dans la page sur les anciennes versions de base) ; le positionnement passe par une mesure asynchrone en deux images (rendu caché pour mesurer → `computePosition` positionne → affichage, afin d'éviter le scintillement) ; le calcul du positionnement est asynchrone, il ne faut pas supposer de résultat synchrone ; les niveaux imbriqués s'envolent sur la droite (`right-start`).
- **Le survol est réservé à H5** : le déploiement d'un titre au survol ne fonctionne que sur H5 ; le Mini Programme n'a pas de sémantique de survol, l'ouverture et la fermeture des panneaux volants sont donc portées par les taps sur le titre, et le tap à l'extérieur est capté par un masque transparent dans la page (équivalent de la sémantique de repli au mouseleave de plus).
- **La navigation clavier est réservée à H5** : ↑/↓ / Home / End / Enter / Space / ←/→ / Esc ne fonctionnent que sur H5 ; le Mini Programme n'a pas d'événements clavier et tout le bloc est retiré par la compilation conditionnelle (pas de code mort dans le paquet MP).
- **Aucune transition d'entrée et de sortie** : plus anime avec `Transition`, qui n'est pas fiable sur MP, donc — comme pour tooltip / select — aucune transition n'est liée ; l'animation de déploiement du panneau en ligne est en CSS pur (grid-template-rows 0fr/1fr) et n'écoute pas transitionend (non fiable sur MP) ; même lorsque la transition n'est pas prise en charge par le MP, l'état final reste correct.
:::
