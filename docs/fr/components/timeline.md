# Timeline

Un flux d'événements vertical. L'ordre chronologique est l'ordre du document. Prise en charge des horodatages, des types sémantiques, des points creux et d'une disposition alternée.

> Composant purement visuel : aucun événement, aucun état contrôlé — H5 et le Mini Programme WeChat se comportent à l'identique (voir « Différences de plateforme » à la fin).

## Utilisation de base

`timestamp` définit le texte de l'horodatage ; `type` donne au point du nœud une couleur sémantique (`'primary'` / `'success'` / `'warning'` / `'danger'`).

```vue
<template>
  <lh-timeline>
    <lh-timeline-item timestamp="2026-09-01">
      Revue de lancement du projet
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="2026-09-15"
      type="success"
    >
      Première phase livrée
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="2026-09-25"
      type="warning"
    >
      Réception en cours
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## Disposition alternée

`mode="alternate"` répartit la chronologie autour d'un axe central : les éléments alternent à gauche et à droite selon leur index (index pairs à gauche, impairs à droite).

```vue
<template>
  <lh-timeline mode="alternate">
    <lh-timeline-item timestamp="Q1">
      Planification
    </lh-timeline-item>
    <lh-timeline-item timestamp="Q2">
      Développement
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q3"
      type="danger"
    >
      Test de charge
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q4"
      type="success"
    >
      Mise en ligne
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## Points creux

`hollow` affiche le nœud sous forme de point creux, couramment utilisé pour les états non achevés.

```vue
<template>
  <lh-timeline>
    <lh-timeline-item
      timestamp="Q1"
      hollow
    >
      Non commencé
    </lh-timeline-item>
    <lh-timeline-item timestamp="Q2">
      En cours
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q3"
      type="success"
    >
      Terminé
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## Horodatage et point personnalisés

`timestamp` et `dot` sont tous deux des slots : utilisez le slot `#timestamp` plutôt que la prop pour un contenu arbitraire ; le slot `#dot` remplace le point par défaut (une icône, par exemple).

```vue
<template>
  <lh-timeline>
    <lh-timeline-item type="primary">
      <template #timestamp>
        Septembre 2026
      </template>
      Contenu d'horodatage personnalisé
    </lh-timeline-item>
    <lh-timeline-item type="success">
      <template #dot>
        <lh-icon
          name="check"
          :size="12"
        />
      </template>
      Point personnalisé (lh-icon)
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## Timeline Props

| Prop | Description | Type | Par défaut |
| --- | --- | --- | --- |
| mode | Disposition : `'left'` d'un seul côté / `'alternate'` alternée | `'left' \| 'alternate'` | `'left'` |
| customClass | Nom de classe personnalisé | `string` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## TimelineItem Props

| Prop | Description | Type | Par défaut |
| --- | --- | --- | --- |
| timestamp | Texte de l'horodatage (le slot `#timestamp` est également possible) | `string` | — |
| type | Type sémantique du nœud (la bordure du point est colorée par les jetons) | `'primary' \| 'success' \| 'warning' \| 'danger'` | — |
| hollow | Nœud creux (couramment pour les états non achevés) | `boolean` | `false` |
| customClass | Nom de classe personnalisé (transmis au nœud racine de l'élément) | `string` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| Timeline default | Nœuds des éléments (`lh-timeline-item`) |
| TimelineItem default | Contenu du corps de l'élément |
| TimelineItem timestamp | Contenu de l'horodatage (la ligne n'est pas rendue si ni la prop ni le slot n'est fourni) |
| TimelineItem dot | Point personnalisé (le point par défaut est purement décoratif et reste hors de l'arbre d'accessibilité) |

## Différences de plateforme

- La chronologie est un **composant purement visuel** : aucun événement, aucun état contrôlé, aucune mesure ni aucun appel à une API de plateforme — H5 et le Mini Programme WeChat sont tous deux entièrement pris en charge et rendus à l'identique.
- La liste sémantique `<ol>` / `<li>` est portée par `<view>` sur les deux plateformes (les sélecteurs de balise sont interdits en WXSS, les styles s'appliquent via les classes), et la sémantique de liste est conservée avec `role="list"` / `role="listitem"` ; la prise en charge du lecteur d'écran sur Mini Programme dépend de la plateforme.
- Les lignes de raccordement et l'axe central sont de purs pseudo-éléments CSS (`::before`) sans mesure JS ; l'alternance gauche/droite du mode `alternate` repose sur la parité de l'index et la direction flex, à l'identique sur les deux plateformes.
- **Purification WXSS** : le `.lh-timeline__item:not(.lh-timeline__item--last)` de la source de styles share voit son modificateur `:not()` supprimé à la compilation (`:not()` n'est pas pris en charge par WXSS). L'affichage de la ligne de raccordement des éléments non finals est assuré par la règle `.lh-timeline__item--last::before`, dont la spécificité n'est pas inférieure ; le rendu reste inchangé sur les deux plateformes.
- Accessibilité : les points des nœuds sont purement décoratifs (`aria-hidden="true"`) et le slot de point personnalisé reste également hors de l'arbre d'accessibilité, comme dans la version Vue 3.
- **Décision de portage (alignée sur la version Vue 3, aucune API inventée)** : au moment du portage, la source de vérité de plus et le core de `@lh-ui/share` ne proposaient pas encore `placement` (position de l'horodatage) ni `center` (disposition centrée), donc cette bibliothèque ne les propose pas non plus ; `mode` n'offre actuellement que `'left'` / `'alternate'`. Ils suivront dès que la source de vérité les ajoutera.
