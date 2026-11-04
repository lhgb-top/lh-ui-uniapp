# Collapse (panneau repliable)

Replie et déplie des blocs de contenu. Les panneaux peuvent coexister ou fonctionner en mode accordéon (un seul ouvert à la fois).

## Utilisation de base

Sans `v-model`, le composant est non contrôlé : il gère lui-même l'état déplié. Un clic sur la barre de titre bascule l'état ; l'événement `change` transporte les derniers panneaux dépliés.

```vue
<template>
  <lh-collapse>
    <lh-collapse-item
      name="a"
      title="Cohérence et diversité"
    >
      Conserver une apparence et des interactions cohérentes avec le reste de la page.
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="Retour"
    >
      Fournir un retour clair et opportun après chaque action.
    </lh-collapse-item>
  </lh-collapse>
</template>
```

## Accordéon

En mode `accordion`, un seul panneau au maximum est ouvert à la fois ; un nouveau clic sur un panneau ouvert replie tout.

```vue
<template>
  <lh-collapse accordion>
    <lh-collapse-item
      name="a"
      title="Un seul ouvert"
    >
      Un seul panneau ouvert à la fois au maximum.
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="Recliquer pour replier"
    >
      Tout peut être replié.
    </lh-collapse-item>
  </lh-collapse>
</template>
```

## v-model contrôlé et panneaux désactivés

Limitez les panneaux dépliés avec `v-model` (une valeur unique ou un tableau ; en mode accordéon souvent une valeur unique) ; `disabled` désactive un panneau précis.

```vue
<template>
  <lh-collapse v-model="activeNames">
    <lh-collapse-item
      name="a"
      title="Panneau A"
    >
      Contenu contrôlé A
    </lh-collapse-item>
    <lh-collapse-item
      name="b"
      title="Panneau B (désactivé)"
      disabled
    >
      Contenu désactivé
    </lh-collapse-item>
    <lh-collapse-item
      name="c"
      title="Panneau C"
    >
      Contenu contrôlé C
    </lh-collapse-item>
  </lh-collapse>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const activeNames = ref(['a'])
</script>
```

## Collapse Props

| Prop | Description | Type | Par défaut |
| --- | --- | --- | --- |
| modelValue | Panneaux actifs (v-model contrôlé, valeur unique ou tableau) | `LhCollapseKey \| LhCollapseKey[]` | — |
| accordion | Mode accordéon : un seul panneau ouvert à la fois | `boolean` | `false` |
| customClass | Nom de classe personnalisé (transmis au nœud racine) | `string` | — |
| sx | Props de mise en page rapide | `LhSxProps` | — |

## CollapseItem Props

| Prop | Description | Type | Par défaut |
| --- | --- | --- | --- |
| name | Identifiant unique du panneau (obligatoire) | `string \| number` | — |
| title | Titre (un slot `title` est également disponible) | `string` | — |
| disabled | Si le panneau est désactivé | `boolean` | `false` |
| customClass | Nom de classe personnalisé (transmis au nœud racine de l'élément) | `string` | — |
| sx | Props de mise en page rapide | `LhSxProps` | — |

## Événements

| Événement | Description | Arguments |
| --- | --- | --- |
| update:modelValue | Panneaux dépliés modifiés (v-model contrôlé ; le composant ne conserve pas d'état interne) | `(value: LhCollapseKey \| LhCollapseKey[])` |
| change | Panneaux dépliés modifiés (non contrôlé ; valeur unique en accordéon, `undefined` lorsque tout est replié) | `(value: LhCollapseKey \| LhCollapseKey[])` |

## Slots

| Slot | Description |
| --- | --- |
| Collapse default | Nœuds des panneaux (`lh-collapse-item`) |
| CollapseItem default | Contenu du panneau |
| CollapseItem title | Titre du panneau (remplace la prop `title`) |

## Différences entre plateformes

- **L'animation de repli / dépliement est du CSS pur** : `grid-template-rows` passe de `0fr` à `1fr` et la flèche pivote avec `transform`. Rien n'écoute `transitionend` (l'événement n'est pas fiable sur le Mini Programme WeChat, cette bibliothèque ne dépend donc jamais de lui). Le changement de classe s'applique immédiatement : même si un moteur de rendu MP ne gère pas les transitions grid, l'état déplié final reste correct, seule la transition manque.
- **Le contenu est toujours rendu** (pas de raccourci en `v-if`) : `lh-collapse__wrap` est affiché par la classe `--active`. Si vous avez besoin de ne rendre le contenu qu'à l'ouverture, gérez-le vous-même avec un `v-if` côté contenu.
- `<h3>` / `<button>` sont remplacés par `<view>` / `<text>` (WXSS interdit les sélecteurs de balise) ; l'état désactivé ne repose pas sur un `<button disabled>` natif, mais sur un garde de clic + la classe `--disabled` + `aria-disabled`.
- La sémantique d'accessibilité est émise sur les deux plateformes : l'en-tête porte `role="button"` + `aria-expanded` / `aria-controls`, et la région de contenu `role="region"` + `aria-labelledby`. La prise en charge des lecteurs d'écran en MP dépend de la plateforme. Sur H5, l'en-tête focalisé répond naturellement à Entrée / Espace.
- Les `id` reliant en-tête et contenu sont générés de manière localement unique avec `generateId` (et non le `useId` de Vue 3.5, par compatibilité avec les noyaux Vue d'uni-app), afin que plusieurs groupes de repli sur une page n'entrent jamais en conflit.
- **Décision de portage (alignée sur la version Vue3, aucune API inventée)** : le portage suit strictement la source de vérité plus et fournit uniquement `v-model` (valeur unique / tableau), `accordion`, `name` / `title` / `disabled` du panneau et le slot `title`. Ce qui n'existe pas dans la source (replis imbriqués, slot d'icône, rendu paresseux, etc.) n'est pas ajouté de notre propre chef ; il suivra la source de vérité quand elle l'ajoutera.
- Une correction de lecture de l'état contrôlé se trouve dans la colle de ce dépôt (enregistrée dans le changeset) : en mode contrôlé, l'état déplié est un computed qui s'abonne à `props.modelValue`, de sorte que les panneaux suivent immédiatement une mise à jour asynchrone du v-model. Les fonctions pures de core et le contrat des props sont strictement identiques à plus.
