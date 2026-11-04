# Upload

Sélection de fichiers et envoi. La validation de la sélection (accept / maxSize /
maxCount), la machine d'états des fichiers (ready → uploading → success / fail) et
la logique de mise à jour de la liste sont entièrement consommées depuis les
fonctions pures du core de `@lh-ui/share` (`normalizeUploadAccept` /
`isFileRejected` / `exceedsMaxSize` / `exceedsMaxCount` / `patchUploadFile`, entre
autres) ; la couche composant ne gère que le rendu, les événements et l'adaptation
de la sélection à la plateforme. L'envoi n'embarque pas de client HTTP : la prop
`request` appartient au consommateur et peut être générée via le
`createLhUploadRequest` de l'adaptateur.

## Utilisation de base

```vue
<template>
  <lh-upload :request="request" accept="image/*" @success="onSuccess" />
</template>

<script setup lang="ts">
import { createLhUploadRequest } from '@lh-ui/uniapp/src/adapter/upload'

// Mini Program : uni.uploadFile ; H5 : XHR + FormData ; le nom du champ vaut
// file par défaut. Sur un appareil réel, le domaine cible doit être déclaré
// dans « Domaines serveur - uploadFile » des réglages WeChat.
const request = createLhUploadRequest('https://upload.example.com/file')

function onSuccess(file: { uid: string; name: string; url?: string }) {
  console.log(file.url)
}
</script>
```

Au clic sur la zone de déclenchement, le sélecteur natif s'ouvre (chooseMedia /
chooseImage / chooseVideo). Dès qu'un fichier entre dans la liste, `request` est
appelé : une barre de progression s'affiche pendant l'envoi, un ✓ et l'URL du
serveur apparaissent en cas de succès, et le motif s'affiche en cas d'échec
(l'événement `error` transporte le fichier concerné et le texte du motif). Sans
prop `request`, le composant se contente de sélectionner et de valider localement :
la liste reste à l'état `ready` et le consommateur gère lui-même le canal d'envoi.

La zone de déclenchement affiche un texte d'aide par défaut (« Sélectionner un
fichier », ou « Déposez les fichiers ici ou cliquez pour envoyer » en mode drag ;
les textes proviennent des clés `upload.*` de share locales, disponibles en dix
langues). Passez le slot par défaut pour personnaliser le contenu du déclencheur.

## Sélection multiple et limites de nombre / taille

```vue
<template>
  <lh-upload
    :request="request"
    accept="image/*"
    multiple
    :max-count="3"
    :max-size="2 * 1024 * 1024"
  />
</template>
```

`multiple` active la sélection multiple du sélecteur natif ; une fois `maxCount`
atteint, les sélections suivantes affichent « La limite de nombre est dépassée » et
stoppent l'ajout ; les fichiers au-delà de `maxSize` sont ignorés avec « Le fichier
dépasse la limite de taille » (5 Mo par défaut). Les deux messages s'affichent dans
le nœud de texte d'erreur sous la liste (`role="alert"`).

## Filtrage de type par accept

```vue
<template>
  <lh-upload :request="request" accept=".png,.jpg" />
</template>
```

`accept` accepte un tableau `['.png', 'image/*']` ou une chaîne séparée par des
virgules `'.png,.jpg'`. Reportez-vous à « Différences de plateforme » ci-dessous
pour le mapping des règles côté uni : le panneau du sélecteur natif ne sait filtrer
que par type de média, les règles d'extension n'atteignent donc pas le panneau et
sont appliquées a posteriori par `isFileRejected` comme filet de sécurité.

## Glisser-déposer (H5 uniquement)

```vue
<template>
  <lh-upload :request="request" accept="image/*" drag multiple />
</template>
```

`drag` transforme la zone de déclenchement en zone de dépôt (`dragover` /
`dragleave` / `drop` fonctionnent sur H5 ; les fichiers déposés sont enveloppés
dans un `LhUniFile` et suivent le même flux). Le Mini Program n'a pas de
glisser-déposer HTML5, donc `drag` est sans effet sur MP et la zone de
déclenchement se réduit à un envoi par clic.

## Désactivation

```vue
<template>
  <lh-upload :request="request" accept="image/*" disabled />
</template>
```

`disabled` désactive l'envoi entier : les clics sur la zone de déclenchement et
l'activation clavier (Enter / Space, H5 uniquement) sont tous deux supprimés, et la
zone expose `aria-disabled`.

## API

### Props

| Prop | Description | Type | Par défaut |
| --- | --- | --- | --- |
| multiple | Autoriser la sélection multiple | `boolean` | `false` |
| drag | Zone de dépôt (H5 uniquement : pas de drag and drop HTML5 sur MP) | `boolean` | `false` |
| disabled | Désactiver | `boolean` | `false` |
| accept | Extensions / MIME autorisés : tableau `['.png', 'image/*']` ou chaîne à virgules `'.png,.jpg'` | `string[] \| string` | `[]` |
| maxSize | Limite de taille par fichier (octets) | `number` | `5242880` (5 Mo) |
| maxCount | Limite de nombre (0 = illimité) | `number` | `0` |
| request | Fonction de requête d'envoi (omettre pour ne sélectionner et valider que localement) | `LhUniUploadRequest` | — |
| customClass | Classe personnalisée (transmise au nœud racine) | `string` | — |
| sx | props de mise en page rapide sx | `LhSxProps` | — |

### Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| change | La liste de fichiers a changé (après sélection / envoi terminé / suppression) | `(files: LhUploadFile[])` |
| success | Un fichier a été envoyé avec succès | `(file: LhUploadFile)` |
| error | Un fichier a échoué à l'envoi | `(file: LhUploadFile, reason: string)` |
| remove | Un fichier a été supprimé | `(uid: string)` |

### Slots

| Nom | Description |
| --- | --- |
| default | Contenu de la zone de déclenchement (le texte d'aide par défaut) |

### LhUploadFile

| Champ | Description | Type |
| --- | --- | --- |
| uid | Identifiant unique (généré en interne) | `string` |
| name | Nom du fichier | `string` |
| size | Taille en octets | `number` |
| status | État | `'ready' \| 'uploading' \| 'success' \| 'fail'` |
| percent | Progression de l'envoi 0-100 | `number` |
| url | URL du serveur (en cas de succès) | `string` |
| error | Motif de l'échec | `string` |

### Adaptateur (`@lh-ui/uniapp/src/adapter/upload`)

| Export | Description |
| --- | --- |
| `LhUniFile` | Descripteur de fichier côté uni : `{ path, name, size, type }` (path est un chemin temporaire : blob / data URL sur H5, chemin temporaire wxfile:// sur WeChat) |
| `LhUniUploadRequest` | Signature de la fonction prop request : reçoit `{ file: LhUniFile, onProgress }` et renvoie `Promise<LhUploadResult>` |
| `LhUploadResult` | Résultat de l'envoi : `{ url?, data? }` (quand url manque, data transporte le corps de réponse brut pour votre propre analyse) |
| `LhUploadConfig` | Configuration de `createLhUploadRequest` : `{ name?, header?, formData? }` |
| `createLhUploadRequest(action, config?)` | Construit la fonction request : `uni.uploadFile` sur le Mini Program, XHR + FormData sur H5 |
| `chooseLhFiles(options)` | Sélection de fichiers unifiée (généralement appelée via la zone de déclenchement, rarement par le consommateur) |
| `wrapLhNativeFile(file)` | Enveloppe un véritable File déposé sur H5 dans un `LhUniFile` |

### Accessibilité

- La zone de déclenchement est `role="button"` avec un `tabindex` (-1 en cas de
  désactivation) et expose `aria-disabled` lorsqu'elle est désactivée
- Les fichiers en cours d'envoi comportent une barre de progression intégrée avec
  `role="progressbar"` + `aria-valuenow`
- Les fichiers en échec affichent leur texte d'erreur ; le message d'erreur sous la
  liste est `role="alert"`
- Le bouton de suppression porte un `aria-label` (« Supprimer » + nom du fichier)

::: tip Différences de plateforme (différences avec la version Vue3)
- **La sélection de fichiers passe par des API natives** : la version Vue3 utilise
  `<input type="file">`, mais le Mini Program n'a ni File ni input. La sélection est
  unifiée via le `chooseLhFiles` de l'adaptateur (chooseMedia / chooseImage /
  chooseVideo) et son résultat est un chemin temporaire (`LhUniFile`), pas un File
  du DOM.
- **accept ne peut être mappé qu'à des types de média** : les API de sélection de
  uni ne comprennent que image / video. `image/*` (ou des extensions d'image) →
  sélection d'images, `video/*` (ou des extensions de vidéo) → sélection de vidéos,
  un mélange des deux ou aucune règle → chooseMedia en mode mixte. Les règles
  d'extension (comme `.png`) ne peuvent pas être transmises au panneau du sélecteur
  natif, elles sont donc appliquées a posteriori par `isFileRejected` ; les règles
  non liées aux médias (comme `.txt`) n'ont pas d'équivalent dans le Mini Program :
  elles sont mappées vers la sélection d'images puis rejetées par la vérification de
  secours. chooseMedia n'existe qu'à partir de la bibliothèque de base 2.10+ de
  WeChat ; l'adaptateur dispose d'une garde d'existence et revient à chooseImage /
  chooseVideo lorsqu'il est indisponible.
- **request reçoit un LhUniFile et non un File du DOM** : le `file` de
  `{ file: LhUniFile, onProgress }` est un descripteur de fichier temporaire. Pour
  envoyer directement via `uni.uploadFile`, construisez la requête avec le
  `createLhUploadRequest(action, config)` de l'adaptateur (H5 utilise
  automatiquement XHR + FormData afin d'aligner les deux plateformes).
  **Le domaine cible d'uploadFile doit être déclaré dans les réglages « Domaines
  serveur » de la plateforme WeChat**, sinon les requêtes des appareils réels sont
  bloquées ; H5 n'est pas soumis à cette restriction.
- **Le glisser-déposer est réservé à H5** : le Mini Program n'a pas de drag and
  drop HTML5, donc `drag` est sans effet sur MP (la zone de déclenchement se réduit
  à l'envoi par clic). Les gestionnaires de glisser-déposer sont supprimés par
  compilation conditionnelle (aucun code mort dans le bundle MP).
- **L'activation clavier est réservée à H5** : Enter / Space ouvrent le sélecteur
  uniquement sur H5 ; le Mini Program n'a pas d'événements clavier.
- **L'annulation du sélecteur est silencieuse** : annuler le sélecteur natif (errMsg
  contenant cancel) n'écrit aucun message d'erreur et ne déclenche pas l'événement
  `error`.
- **L'étendue de l'API reste alignée sur la source de plus** : les capacités
  absentes de plus (`action` / `headers` / `fileList` / `before-upload`) n'ont pas
  été ajoutées ; l'adresse d'envoi et configurations similaires appartiennent à la
  fonction request du consommateur. `customClass` (transmission pour l'isolation
  des styles) est ajouté selon les conventions de ce paquet.
:::
