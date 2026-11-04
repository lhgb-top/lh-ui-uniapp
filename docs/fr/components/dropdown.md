# Dropdown (menu déroulant)

Menu de commandes qui s'ouvre vers le bas. Le déclencheur peut être n'importe quel élément ; les entrées du menu sont identifiées par `command` et signalées via l'événement `command` au clic.

## Utilisation de base

```vue
<template>
  <lh-dropdown @command="onCommand">
    <lh-button>{{ selectedLabel || 'Plus d\'actions' }} ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="new">Nouveau</lh-dropdown-item>
      <lh-dropdown-item command="edit">Modifier</lh-dropdown-item>
      <lh-dropdown-item command="delete">Supprimer</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const lastCommand = ref('')
// Le texte du déclencheur est géré par le consommateur : l'événement command ne
// livre que la valeur de la commande ; le libellé à afficher est laissé à l'extérieur
const labelMap: Record<string, string> = { new: 'Nouveau', edit: 'Modifier', delete: 'Supprimer' }
const selectedLabel = ref('')
function onCommand(command: string | number | undefined) {
  lastCommand.value = String(command)
  selectedLabel.value = labelMap[String(command)] ?? String(command)
}
</script>
```

## Méthodes de déclenchement

Par défaut `click` ; le survol et l'appui long sont également disponibles.

```vue
<template>
  <!-- Déclenchement au survol (H5 uniquement ; redevient un basculement au toucher sur le Mini Programme) -->
  <lh-dropdown trigger="hover" @command="onHoverCommand">
    <lh-button>Déclencheur au survol ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="ink">Encre</lh-dropdown-item>
      <lh-dropdown-item command="danqing">Peinture</lh-dropdown-item>
    </template>
  </lh-dropdown>

  <!-- Déclenchement au clic droit / appui long -->
  <lh-dropdown trigger="contextmenu" @command="onContextCommand">
    <lh-button>Déclencheur à l'appui long ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="refresh">Rafraîchir</lh-dropdown-item>
      <lh-dropdown-item command="copy">Copier</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

## Entrées désactivées et séparateurs

```vue
<template>
  <!-- Menu d'actions avec entrées désactivées et séparateurs -->
  <lh-dropdown @command="onActionCommand">
    <lh-button>Actions ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="export">Exporter</lh-dropdown-item>
      <lh-dropdown-item command="import">Importer</lh-dropdown-item>
      <lh-dropdown-item divided command="audit">Journal d'audit</lh-dropdown-item>
      <lh-dropdown-item disabled command="purge">Purger les données</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

> Les entrées désactivées portent `aria-disabled="true"` afin que les lecteurs d'écran puissent les annoncer ; les flèches les ignorent, et les clics ou Entrée/Espace ne déclenchent pas `command`.

## Position et hauteur maximale

```vue
<template>
  <!-- Aligné en bas à droite avec hauteur maximale limitée (défilement au-delà) -->
  <lh-dropdown placement="bottom-end" :max-height="160" @command="onItemCommand">
    <lh-button>Bas à droite ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item v-for="i in 12" :key="i" :command="i">Élément {{ i }}</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>
```

## Visibilité contrôlée et comportement du clic

`v-model:visible` contrôle la visibilité manuellement ; `hide-on-click` décide si le menu se ferme après une sélection ; `popper-class` ajoute une classe personnalisée à la couche.

```vue
<template>
  <!-- Visibilité contrôlée : ne se ferme pas après une sélection -->
  <lh-dropdown v-model:visible="menuVisible" :hide-on-click="false" popper-class="demo-menu">
    <lh-button>{{ menuVisible ? 'Réduire' : 'Déployer' }} ▾</lh-button>
    <template #dropdown>
      <lh-dropdown-item command="copy">Copier (ne se ferme pas)</lh-dropdown-item>
      <lh-dropdown-item command="paste">Coller</lh-dropdown-item>
    </template>
  </lh-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const menuVisible = ref(false)
</script>
```

## Dropdown API

### Props

| Propriété | Description | Type | Défaut |
| --- | --- | --- | --- |
| trigger | Méthode de déclenchement : `click` (toutes les cibles) / `hover` (H5 uniquement, redevient un appui sur MP) / `contextmenu` (porté par l'appui long) | `'hover' \| 'click' \| 'contextmenu'` | `'click'` |
| placement | Position de la couche (12 positions) | `LhDropdownPlacement` | `'bottom-start'` |
| visible | État de visibilité (v-model:visible) | `boolean` | — |
| disabled | Désactiver le déclencheur | `boolean` | `false` |
| hideOnClick | Fermer après un clic sur une entrée du menu | `boolean` | `true` |
| popperClass | Classe personnalisée de la couche | `string` | — |
| maxHeight | Hauteur maximale du menu (les nombres sont en px) | `string \| number` | — |
| themeVars | Variables de thème au niveau du composant | `Record<string, string>` | — |
| bgPattern | Motif de fond au niveau du composant, remplace ConfigProvider | `string` | — |
| sx | Propriétés de mise en page rapide (appliquées à la racine du déclencheur) | `LhSxProps` | — |

### Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| command | Déclenché au clic sur une entrée du menu | `(command: string \| number \| undefined)` |
| visible-change | Visibilité modifiée | `(value: boolean)` |
| update:visible | Visibilité modifiée (v-model) | `(value: boolean)` |

### Slots

| Slot | Description |
| --- | --- |
| default | Contenu du déclencheur |
| dropdown | Contenu du menu (liste de `LhDropdownItem`) |

### Methods

| Méthode | Description |
| --- | --- |
| show | Ouvrir programmatiquement |
| hide | Fermer programmatiquement |
| toggle | Basculer programmatiquement |

## DropdownItem API

### Props

| Propriété | Description | Type | Défaut |
| --- | --- | --- | --- |
| command | Identifiant de commande, livré avec l'événement `command` au clic | `string \| number` | — |
| disabled | Désactivé | `boolean` | `false` |
| divided | Affiche un séparateur au-dessus de l'entrée | `boolean` | `false` |

### Events

| Événement | Description | Paramètres |
| --- | --- | --- |
| click | Déclenché au clic sur l'entrée (pas pour les désactivées) | `(command: string \| number \| undefined)` |

### Accessibilité

- Le déclencheur porte `aria-haspopup="menu"` ainsi que `aria-expanded` / `aria-controls` ; le menu est `role="menu"` et les entrées `role="menuitem"`
- Le clavier suit le motif de menu APG (H5 uniquement) : ↑/↓ cycle (en ignorant les désactivées), Home/End saute aux extrémités, Entrée/Espace déclenche `command` et ferme, Échap ferme et restitue le focus
- À l'ouverture, le débordement sur l'axe principal se retourne automatiquement et celui sur l'axe croisé est ramené dans le viewport

::: tip Différences de plateforme (différences avec la version Vue3)
- **Méthodes de déclenchement** : le Mini Programme n'a pas de sémantique hover, donc `trigger="hover"` redevient un basculement par appui/toucher sur MP ; pas de clic droit non plus, `trigger="contextmenu"` est porté par l'appui long (`longpress`) sur les deux cibles (H5 compris, sans bloquer le menu contextuel natif — plus appelle `preventDefault`).
- **Porteur et positionnement de la couche** : pas de prop `teleportTarget` — le Mini Programme n'a pas de teleport DOM, la couche est portée par `root-portal` (fallback fixed dans la page sur les anciennes versions) ; le positionnement passe par une mesure asynchrone en deux images (rendu caché pour mesurer → `computePosition` → affichage, anti-scintillement). Le calcul est asynchrone : ne supposez pas un résultat synchrone.
- **Navigation clavier en H5 uniquement** : flèches / Home / End / Entrée / Espace / Échap ne fonctionnent qu'en H5 (Échap passe par un écouteur au niveau du document et ne ferme que la couche au sommet de la pile) ; le Mini Programme n'a pas d'événements clavier et tout le bloc est supprimé par compilation conditionnelle.
- **Fermeture au clic extérieur** portée par un masque transparent dans la page (équivalent de l'écouteur click-outside au niveau document de plus).
- **Pas de transition d'entrée/sortie** : plus anime avec `Transition` ; `Transition` n'est pas fiable sur MP et, comme tooltip / select, aucune transition n'est liée.
- **Pas de fermeture automatique si le déclencheur sort du viewport** : le `useLhPopper` de plus possède un callback scroll-out ; uni-app n'a pas de canal unifié de scroll/resize, il n'a pas été porté.
:::
