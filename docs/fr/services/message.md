# Message (notification)

Service global de messages. **Adopte le motif de point de montage** — le Mini Programme ne pouvant pas créer de DOM en JS, la page doit d'abord contenir le composant point de montage.

## Placer le point de montage

À placer une fois dans les pages nécessitant des messages (ou dans un composant racine enveloppant permanent) :

```vue
<template>
  <lh-config-provider>
    <view><!-- Contenu de la page --></view>
    <lh-message />
  </lh-config-provider>
</template>
```

## Appels

```ts
import { useLhMessage } from '@lh-ui/uniapp'

const message = useLhMessage()

message.success('Enregistré avec succès')
message.info("Message d'information")
message.warning('Avertissement')
message.danger('Erreur')
message.error('Erreur (alias de danger)')

// Message de chargement sans fermeture automatique (duration: 0), à fermer manuellement
const handle = message.loading('Chargement...')
// ... une fois l'opération asynchrone terminée
handle.close()

// Tout fermer
message.closeAll()
```

::: danger Avertissement en l'absence de point de montage
Si vous appelez `useLhMessage()` alors que la page ne contient pas `<lh-message />`, un `console.error` explicite est émis en développement, **sans dégradation silencieuse**. C'est un choix délibéré : la dégradation silencieuse transformerait « l'appel semble réussir, mais rien ne se passe » en bug invisible.
:::

## Méthodes

| Méthode | Description | Paramètres |
| --- | --- | --- |
| (Appel direct) | `message('xxx')` équivaut à `message.info('xxx')` | `(options: LhMessageOptions \| string)` |
| success / info / warning / danger / error | Affiche le message du type correspondant | `(content: string, options?: Partial<LhMessageOptions>)` |
| loading | Affiche un message de chargement qui ne se ferme pas automatiquement (`duration: 0`), et renvoie un handle à fermer manuellement | Identique |
| close | Ferme le message d'identifiant id | `(id: number)` |
| closeAll | Ferme tous les messages | — |

## LhMessageOptions

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| content | Texte (requis) | `string` | — |
| type | Type | `'success' \| 'info' \| 'warning' \| 'danger' \| 'loading'` | `'info'` |
| duration | Durée d'affichage (ms) ; 0 = pas de fermeture automatique | `number` | `3000` |
| showClose | Afficher le bouton de fermeture | `boolean` | `false` |
| offset | Décalage par rapport au haut (px) | `number` | — |
| onClose | Callback de fermeture | `() => void` | — |

## Configuration globale

```ts
const message = useLhMessage()
message.config({ duration: 2000, max: 5, offset: 20 })
```

| Configuration | Description | Valeur par défaut |
| --- | --- | --- |
| duration | Durée d'affichage par défaut (ms) | `3000` |
| max | Nombre maximal de messages à l'écran | — |
| offset | Décalage par rapport au haut | — |

::: tip Différences avec la version Vue3
- **Pas d'`appendTo`** : le web accroche le contenu à `document.body`, notion qui n'existe pas dans le Mini Programme ; l'emplacement du montage est déterminé par la position de `<lh-message />` dans la page.
- Les animations d'entrée / sortie utilisent CSS transition + setTimeout pour aligner les durées (`transitionend` est peu fiable dans le Mini Programme).
- Pour les besoins de notification, utilisez le service Notification (voir le groupe « Services »).
:::
