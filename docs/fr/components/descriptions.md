# Descriptions (Liste de descriptions)

Affiche la liste des attributs d'un objet, avec le nombre de colonnes, l'étendue sur plusieurs colonnes et un mode borduré. Les entrées sont passées via `items` (`LhDescriptionsItem` est le type d'entrée fourni par le core de `@lh-ui/share`), et leur contenu peut être surchargé par des slots à portée.

## Utilisation de base

```vue
<template>
  <lh-descriptions
    title="Fiche de la collection"
    :column="2"
    :items="[
      { label: 'Nom', value: 'Vase bleu et blanc' },
      { label: 'Époque', value: 'Yongle, Ming' },
      { label: 'Catégorie', value: 'Porcelaine' },
      { label: 'Grade', value: 'Grade I' },
    ]"
  />
</template>
```

## Colonnes et étendue

`column` contrôle le nombre d'entrées par ligne, et `span` d'une entrée contrôle le nombre de colonnes qu'elle couvre. Un `span` plus large que l'espace restant de la ligne est limité, et la dernière ligne incomplète est complétée par des cellules de remplissage (purement décoratives, marquées `aria-hidden`).

```vue
<template>
  <lh-descriptions
    :column="3"
    :items="[
      { label: 'Nom', value: 'Mille li de rivières et de montagnes', span: 2 },
      { label: 'Époque', value: 'Song du Nord' },
      { label: 'Artiste', value: 'Wang Ximeng' },
      { label: 'Support', value: 'Encre et couleurs sur soie' },
      { label: 'Collection', value: 'Musée du Palais, Pékin' },
    ]"
  />
</template>
```

## Mode borduré

`border` active les bordures du tableau (en mode borduré, l'espacement entre lignes est annulé et les bordures des cellules forment la grille du tableau).

```vue
<template>
  <lh-descriptions
    :column="2"
    border
    :items="[
      { label: 'Nom', value: 'Préface au Pavillon des orchidées' },
      { label: 'Auteur', value: 'Wang Xizhi' },
      { label: 'Époque', value: 'Jin oriental' },
      { label: 'Style', value: 'Style cursif' },
    ]"
  />
</template>
```

## Titre et contenu personnalisés

Le slot `title` surcharge l'en-tête ; le slot à portée `item-<index>` surcharge le contenu de l'entrée correspondante (`index` est le numéro de cellule de l'entrée dans sa ligne ; la portée fournit `{ item }`).

```vue
<template>
  <lh-descriptions :column="2" :items="items">
    <template #title>
      <text>Fiche de la collection (titre en slot)</text>
    </template>
    <template #item-1="{ item }">
      <lh-tag type="success">{{ item.value }}</lh-tag>
    </template>
  </lh-descriptions>
</template>

<script setup lang="ts">
const items = [
  { label: 'Statut', value: 'En cours' },
  { label: 'Étape', value: 'Expertisé' },
]
</script>
```

## Props

| Propriété | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| title | Titre de la liste | `string` | — |
| column | Nombre d'entrées par ligne | `number` | `3` |
| border | Afficher les bordures | `boolean` | `false` |
| items | Liste des entrées ; triplets label / value / span | `[LhDescriptionsItem](#lhdescriptionsitem-type)`[] | `() => []` |
| customClass | Nom de classe personnalisé | `string` | — |
| sx | Props de mise en page rapide | `LhSxProps` | — |

## LhDescriptionsItem (type)

Provient du core de `@lh-ui/share` (`LhDescriptionsItem`) ; n'est pas redéfini dans ce dépôt.

| Propriété | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| label | Étiquette de l'entrée | `string` | — |
| value | Contenu de l'entrée (peut aussi être fourni via un slot à portée) | `string \| number` | — |
| span | Nombre de colonnes à occuper ; limité en cas de dépassement | `number` | `1` |

## Slots

| Slot | Description | Portée |
| --- | --- | --- |
| title | Titre personnalisé | — |
| item-\<index\> | Surcharge le contenu d'une entrée (index est le numéro de cellule dans sa ligne) | `{ item }` |

## Différences entre plateformes

- Composant purement d'affichage, sans aucun appel à une API de plateforme ; il se comporte de manière identique sur H5 et sur le Mini Program WeChat. Le comportement de `items` / `column` / `border` / `span` correspond à la version Vue 3.
- La version Vue 3 utilise les balises sémantiques `<dl>/<dt>/<dd>` ; ce dépôt les remplace par `<view>` (WXSS interdit les sélecteurs de balises, ce sont les classes qui portent les styles). La mise en page des lignes s'appuie sur du `flex` en ligne et des `flex-basis` en pourcentage, avec les mêmes formules de calcul des largeurs que la version Vue 3.
- Les lignes du tableau en mode borduré proviennent des sources de styles de `@lh-ui/share` et restent utilisables sur le Mini Program après la purification de `build-styles` (la sortie ne contient que des sélecteurs de classe et des propriétés, conformément à la liste blanche WXSS).
- L'agrégation des lignes (normalisation des spans, limitation, passage à la ligne, complément) est entièrement produite par la fonction pure `buildDescriptionRows` de `@lh-ui/share` ; ce dépôt n'écrit que la colle réactive et ne copie jamais l'implémentation du core.
