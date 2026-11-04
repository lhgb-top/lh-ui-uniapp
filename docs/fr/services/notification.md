# Notification

Service global de notifications. Affiche des cartes avec titre et contenu dans les coins du viewport, généralement pour des retours de résultat nécessitant l'attention de l'utilisateur. Comme Message / Loading, il utilise le **mode point de montage**——le Mini Programme ne peut pas créer de DOM via JS, la page doit donc d'abord contenir le composant point de montage.

## Placer le point de montage

Placez-le une fois dans les pages qui ont besoin de notifications (ou dans un composant racine persistant) :

```vue
<template>
  <lh-config-provider>
    <view><!-- contenu de la page --></view>
    <lh-notification />
  </lh-config-provider>
</template>
```

::: danger L'absence de point de montage déclenche un avertissement
Si vous appelez `useLhNotification()` mais que la page n'a pas de `<lh-notification />`, un avertissement `console.error` est émis en développement et il **n'y a pas de dégradation silencieuse**. Comme Message : la dégradation silencieuse transformerait « l'appel semble fonctionner mais rien ne se passe » en bug caché.
:::

## Appel

```ts
import { useLhNotification } from '@lh-ui/uniapp'

const notification = useLhNotification()

notification.success({ title: 'Notification de succès', content: 'Le document a été écrit dans le cloud' })
notification.info({ title: 'Notification d\'information' })
notification.warning({ title: 'Notification d\'avertissement' })
notification.danger({ title: 'Notification de danger' })

// Chaque coin est un conteneur indépendant
notification.info({ title: 'Coin supérieur gauche', position: 'top-left' })

// Pas de fermeture automatique, fermeture manuelle
const handle = notification.warning({ title: 'Avertissement persistant', duration: 0 })
handle.close()

// tout fermer
notification.closeAll()
```

## Méthodes

| Méthode | Description | Paramètres |
| --- | --- | --- |
| (appel direct) | `notification(options)` ouvre une notification | `(options: LhNotificationOptions)` |
| success / info / warning / danger | Ouvre une notification du type sémantique correspondant | `(options: LhNotificationOptions)` |
| close | Ferme la notification avec l'id indiqué | `(id: number)` |
| closeAll | Tout fermer | — |
| config | Modifie la configuration globale par défaut | `(config: LhNotificationConfig)` |

## LhNotificationOptions

| Prop | Description | Type | Défaut |
| --- | --- | --- | --- |
| title | Titre (obligatoire) | `string` | — |
| content | Contenu du corps | `string` | — |
| type | Type sémantique | `'success' \| 'info' \| 'warning' \| 'danger' \| 'error'` | `'info'` |
| duration | Millisecondes avant fermeture automatique ; 0 signifie pas de fermeture automatique | `number` | `4500` |
| position | Position d'apparition | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` |
| showClose | Affiche le bouton de fermeture | `boolean` | `true` |
| sx | Propriétés de mise en page rapide sx | `LhSxProps` | — |
| onClick | Callback de clic sur la carte (la carte est présentée avec la sémantique de bouton) | `() => void` | — |
| onClose | Callback après fermeture (automatique ou manuelle) | `() => void` | — |

::: tip Le type error
`error` est une sémantique alias de `danger` (le `LhNotificationType` de share core l'inclut). Les méthodes du service n'exposent que success / info / warning / danger, comme plus ; pour error, appelez directement `notification({ title: '...', type: 'error' })`.
:::

## Configuration globale

```ts
const notification = useLhNotification()
notification.config({ duration: 3000, offset: 24 })
```

| Configuration | Description | Défaut |
| --- | --- | --- |
| duration | Durée par défaut de fermeture automatique en millisecondes ; 0 signifie pas de fermeture automatique | `4500` |
| offset | Décalage par rapport au bord du viewport (px) | `20` |

## Comportement

- **Quatre conteneurs indépendants par coin** : les enregistrements sont groupés par `position` et s'empilent par ordre chronologique dans un même coin (les deux coins du bas utilisent `column-reverse`, les nouvelles notifications se collent au bord inférieur) ; l'espacement d'empilement est contrôlé par la variable de style `--lh-notification-gap` (16 px par défaut).
- **Fermeture automatique** : supprimée automatiquement après `duration` millisecondes et déclenche `onClose` ; `duration: 0` signifie persistante.
- **Clic sur la carte** : ne ferme pas (comme plus), déclenche uniquement `onClick` ; la fermeture passe uniquement par le bouton de fermeture ou le minuteur automatique.
- **Accessibilité** : les conteneurs de coins portent `role="region"` + `aria-live="polite"` ; les cartes avec `onClick` sont présentées en `role="button"` ; le bouton de fermeture porte le nom accessible de la clé de langue `notification.close` (déjà présente dans les packs de langue share, mise à jour au changement de langue).

## Différences de plateforme (par rapport à la version Vue3)

- **Mode point de montage** : plus monte un hôte dans `document.body` via `createApp` ; le Mini Programme n'a pas de `document`, on utilise donc un « store singleton au niveau module + composant point de montage `<lh-notification />` dans la page », avec l'API exposée via `useLhNotification()` (plus est l'appel direct `LhNotification` + enregistrement via install).
- **Pas de `appendTo`** : la version web peut choisir le conteneur de montage ; le Mini Programme n'a pas ce concept, la position est décidée par les conteneurs fixes des coins rendus par le composant point de montage.
- **Animations d'entrée/sortie dégradées** : plus utilise `TransitionGroup` pour l'entrée glissée / le reflux FLIP ; `transitionend` n'est pas fiable sur le Mini Programme, la première version ajoute et supprime donc les nœuds sans animation (les noms de classes de transition restent dans la source de styles et peuvent être réutilisés en H5 avec un Transition enveloppé soi-même).
- **La sémantique clavier des cartes cliquables n'est pas portée** : plus ajoute `tabindex` et le déclenchement Entrée / Espace aux cartes avec `onClick` ; le Mini Programme n'a pas de modèle de focus DOM, seuls le clic et la sémantique `role="button"` sont conservés.
