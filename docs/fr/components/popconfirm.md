# Popconfirm (bulle de confirmation)

Confirmation secondaire légère : affiche une bulle de confirmation à proximité du déclencheur, sans ouvrir de boîte de dialogue. La sémantique est une confirmation bloquante (`role="alertdialog"`) : Échap compte comme une annulation. Le contenu de confirmation est passé via le slot `content` ou la prop `title`, et le déclencheur est enveloppé dans le slot par défaut.

## Utilisation de base

```vue
<template>
  <lh-popconfirm title="Supprimer cet enregistrement ?" @confirm="onConfirm" @cancel="onCancel">
    <lh-button type="danger">Supprimer</lh-button>
  </lh-popconfirm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const action = ref('')
function onConfirm() {
  action.value = 'confirmé'
}
function onCancel() {
  action.value = 'annulé'
}
</script>
```

::: warning Le Mini Program n'a pas de sémantique hover / focus
`trigger` vaut `click` par défaut (disponible sur toutes les cibles). `hover` / `focus` ne sont valables qu'en H5 — sur le Mini Program ils se dégradent automatiquement en bascule par tap (le premier tap ouvre, le second ferme).
:::

## Trois tons

`type` détermine l'icône de ton et la classe modificatrice : `info` (information) / `warning` (avertissement, par défaut) / `danger` (danger).

```vue
<template>
  <lh-popconfirm type="info" title="Consulter le journal d'accès de cet enregistrement ?">
    <lh-button>Information</lh-button>
  </lh-popconfirm>
  <lh-popconfirm type="warning" title="Cette action notifiera tous les membres.">
    <lh-button type="warning">Avertissement</lh-button>
  </lh-popconfirm>
  <lh-popconfirm type="danger" title="Impossible de revenir en arrière après suppression.">
    <lh-button type="danger">Danger</lh-button>
  </lh-popconfirm>
</template>
```

## Textes personnalisés et position

```vue
<template>
  <lh-popconfirm
    title="Vous pourrez le restaurer depuis la corbeille après archivage."
    confirm-text="Archiver"
    cancel-text="Laisser-moi réfléchir"
    placement="right"
  >
    <lh-button>Textes personnalisés</lh-button>
  </lh-popconfirm>

  <!-- Déclencheur au survol (H5 uniquement ; se dégrade en bascule par tap sur le Mini Program) -->
  <lh-popconfirm title="Survolez pour confirmer." trigger="hover" :show-after="0" placement="bottom">
    <lh-button>Déclencheur au survol</lh-button>
  </lh-popconfirm>
</template>
```

> Les textes des boutons prennent par défaut les clés de localisation `popconfirm.confirm` / `popconfirm.cancel` ; ils peuvent être remplacés par `confirm-text` / `cancel-text`.

## Visibilité contrôlée et icône

```vue
<template>
  <!-- Contrôlé : la visibilité est entièrement pilotée par le v-model:visible externe -->
  <lh-popconfirm v-model:visible="pcVisible" trigger="manual" title="Bulle contrôlée">
    <lh-button @click="pcVisible = !pcVisible">{{ pcVisible ? 'Replier' : 'Déplier' }}</lh-button>
  </lh-popconfirm>

  <!-- Interrupteur d'icône et type du bouton de confirmation -->
  <lh-popconfirm title="Supprimer cet enregistrement ?" :show-icon="false" confirm-button-type="primary">
    <lh-button type="danger">Sans icône</lh-button>
  </lh-popconfirm>

  <!-- Désactivé -->
  <lh-popconfirm title="Cette action n'est pas disponible." disabled>
    <lh-button disabled>Désactivé</lh-button>
  </lh-popconfirm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const pcVisible = ref(false)
</script>
```

## Popconfirm API

### Props

| Prop | Description | Type | Défaut |
| --- | --- | --- | --- |
| type | Ton de confirmation : `info` / `warning` / `danger` | `'info' \| 'warning' \| 'danger'` | `'warning'` |
| placement | Position de la couche (12 positions) | `LhPopconfirmPlacement` | `'top'` |
| trigger | Méthode de déclenchement : `click` (toutes les cibles) / `hover`, `focus` (H5 uniquement, se dégrade en tap sur MP) / `manual` (contrôlé) | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'` |
| title | Contenu de confirmation (également disponible via le slot content) | `string` | — |
| confirmText | Texte du bouton de confirmation (clé popconfirm.confirm si absent) | `string` | — |
| cancelText | Texte du bouton d'annulation (clé popconfirm.cancel si absent) | `string` | — |
| confirmButtonType | Type du bouton de confirmation | `'default' \| 'primary'` | `'primary'` |
| visible | Visibilité contrôlée manuellement (v-model:visible) | `boolean` | — |
| disabled | Désactivé | `boolean` | `false` |
| showIcon | Afficher l'icône de ton | `boolean` | `true` |
| popperClass | Nom de classe personnalisé de la couche flottante | `string` | — |
| showAfter | Délai d'affichage (ms, uniquement hover / focus sur H5) | `number` | — |
| hideAfter | Délai de masquage (ms, uniquement hover / focus sur H5) | `number` | — |
| themeVars | Variables de thème au niveau du composant | `Record<string, string>` | — |
| bgPattern | Motif d'arrière-plan au niveau du composant, remplace ConfigProvider | `string` | — |
| sx | Propriétés de mise en page rapide (appliquées à l'élément racine du déclencheur) | `LhSxProps` | — |

### Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| confirm | Déclenché après un clic sur le bouton de confirmation | — |
| cancel | Déclenché après un clic sur le bouton d'annulation ou sur Échap | — |
| update:visible | Visibilité modifiée (v-model) | `(value: boolean)` |
| show | Déclenché après affichage | — |
| hide | Déclenché après masquage | — |

### Slots

| Slot | Description |
| --- | --- |
| default | Contenu du déclencheur |
| content | Contenu de confirmation personnalisé |

### Methods

| Méthode | Description |
| --- | --- |
| show | Afficher par programmation |
| hide | Masquer par programmation |
| toggle | Basculer par programmation |

### Accessibilité

- La couche flottante est `role="alertdialog"` + `aria-modal="true"` ; le contenu de confirmation est lié via `aria-labelledby` ; le déclencheur porte `aria-haspopup` / `aria-expanded` / `aria-controls` (le paquet d'attributs est produit par des fonctions pures de share)
- Échap compte comme une annulation (aligné sur le motif alertdialog de WAI-ARIA : Échap ferme et compte comme un rejet) ; lorsque plusieurs couches sont empilées, Échap ne ferme que la supérieure (H5 uniquement)
- Un clic sur le bouton d'annulation ou sur le masque transparent extérieur aux boutons referme la bulle ; l'icône de ton est décorative (`aria-hidden`)
- Le moteur de positionnement est une fonction pure maison (protection contre le débordement flip / shift), sans dépendance d'exécution tierce

::: tip Différences de plateforme (différences avec la version Vue3)
- **Méthodes de déclenchement** : le Mini Program n'a pas de sémantique hover / focus ; `trigger="hover"` / `trigger="focus"` se dégradent en bascule par tap/toucher sur MP ; les délais `showAfter` / `hideAfter` ne s'appliquent qu'aux modes hover / focus sur H5, tandis que `click` et `manual` répondent immédiatement.
- **Porteur et positionnement de la couche** : pas de prop `teleportTarget` — le Mini Program n'a pas de DOM teleport, la couche est donc portée par `root-portal` (repli fixed dans la page sur les versions anciennes) ; le positionnement popper passe par une mesure asynchrone en deux images (rendu masqué pour mesurer → `computePosition` → affichage, anti-scintillement). Le calcul est asynchrone : ne supposez pas un résultat synchrone. Le décalage de la flèche est écrit dans `--lh-arrow-offset` par la colle du composant à partir de l'`arrowOffset` du résultat.
- **Comportement clavier en H5 uniquement** : Échap = annulation via un écouteur au niveau du document (ne ferme que la couche supérieure en cas d'empilement) ; le Mini Program n'a pas d'événements clavier et tout le bloc est retiré par compilation conditionnelle.
- **Pas de focus-trap** : plus place le focus sur le bouton « Confirmer » à l'ouverture, laisse Tab circuler entre les deux boutons dans une focus-trap et restitue le focus à la fermeture ; MP n'a pas de sémantique de focus clavier, et comme Dialog / Popover de ce dépôt ce mécanisme n'est pas porté du tout.
- **Pas de transition d'entrée/sortie** : plus anime avec `Transition` (`lh-popconfirm-fade`) ; `Transition` n'est pas fiable sur MP et, comme tooltip / dropdown / popover, aucune transition n'est liée.
- **Pas de fermeture automatique lorsque le déclencheur sort du viewport** : le `useLhPopper` de plus dispose d'un callback scroll-out ; uni-app n'a pas de canal unifié d'écoute du défilement/redimensionnement, ce mécanisme n'est donc pas porté.
- **Valeur de aria-haspopup** : plus code en dur `aria-haspopup="dialog"` dans son template ; ce dépôt produit le paquet d'attributs du déclencheur via `getPopconfirmTriggerAria` de share (valeur `'true'`), le contrat suit la fonction pure de share.
:::
