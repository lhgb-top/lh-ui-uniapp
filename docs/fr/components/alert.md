# Alert (Alerte)

Affiche un retour sémantique important dans la page (succès / avertissement / erreur / information), avec titre, description, icône sémantique et une action de fermeture facultative.

## Utilisation de base

```vue
<template>
  <lh-alert title="Information">
    L'opération actuelle a été enregistrée, vous pouvez reprendre l'édition à tout moment.
  </lh-alert>
</template>
```

Le titre peut être transmis via la prop `title` ou via le slot du même nom ; le slot par défaut contient la description.

## Types sémantiques

```vue
<template>
  <lh-alert type="success" title="Succès">
    Les données ont été synchronisées.
  </lh-alert>
  <lh-alert type="warning" title="Avertissement">
    Solde insuffisant, veuillez recharger rapidement.
  </lh-alert>
  <lh-alert type="danger" title="Erreur">
    Échec de l'envoi, vérifiez le réseau puis réessayez.
  </lh-alert>
  <lh-alert type="info" title="Information">
    Une nouvelle version sera publiée la semaine prochaine.
  </lh-alert>
</template>
```

## Icône sémantique

```vue
<template>
  <lh-alert show-icon type="success" title="Message de succès avec icône">
    La couleur de l'icône suit automatiquement le type sémantique.
  </lh-alert>
</template>
```

## Fermable

```vue
<template>
  <lh-alert closable title="Alerte fermable">
    Cliquez sur la croix à droite pour masquer le composant et déclencher l'événement close.
  </lh-alert>
</template>
```

## Style discret (plain)

```vue
<template>
  <lh-alert plain title="Style discret">
    Fond transparent avec une bordée de couleur sémantique, adapté aux listes compactes.
  </lh-alert>
</template>
```

## Props

| Prop | Description | Type | Par défaut |
| --- | --- | --- | --- |
| type | Type sémantique | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` |
| title | Titre (slot title également possible) | `string` | — |
| closable | Possibilité de fermer | `boolean` | `false` |
| showIcon | Afficher l'icône sémantique | `boolean` | `false` |
| plain | Utiliser le style discret | `boolean` | `false` |
| closeLabel | Nom accessible du bouton de fermeture (sinon message `alert.close` du locale) | `string` | — |
| customClass | Classe personnalisée | `string` | — |
| sx | Props de mise en page rapides | `LhSxProps` | — |

## Événements

| Événement | Description | Paramètres |
| --- | --- | --- |
| close | Émis au clic sur le bouton de fermeture (le composant est masqué juste après) | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Contenu de la description |
| title | Contenu du titre (prioritaire sur la prop title) |

## Différences entre plateformes

- **Rôles d'accessibilité** : `warning` / `danger` sont rendus avec `role="alert"` (annonce immédiate), `info` / `success` avec `role="status"` (annonce polie), conformément à la sémantique APG de la version plus, sans différence entre plateformes.
- **Remplacement des balises** : les `<div>` / `<span>` / `<p>` de la version plus sont remplacés par des `view` (WXSS interdit les sélecteurs de balise, les styles s'appliquent via les classes `lh-alert__*`).
- **Icônes** : le svg en ligne n'est pas pris en charge par le Mini Programme, d'où le recours à des nœuds `lh-icon` (`info` / `check` / `warning` / `error`), partageant la classe `lh-alert__icon` avec le scss de share.
- **Bouton de fermeture** : le `<button type="button">` de la version plus est remplacé par un `view` portant `role="button"` ; le nom accessible provient également de `closeLabel` ou du message `alert.close` (disponible dans les neuf langues).
- **Aucune animation d'entrée/sortie** : la version plus se contente également de retirer le nœud via `v-if` à la fermeture (sans `<transition>`), le comportement est donc ici identique et la fiabilité problématique de l'événement de fin de transition dans le Mini Programme n'entre pas en jeu.
- **Conclusion du portage** : Alert est un composant purement de présentation (aucune mesure, aucune surcouche, aucun piège de focus, aucune dépendance au document) ; il fonctionne sur toutes les plateformes, avec un comportement identique sur H5 et le Mini Programme WeChat.
