# Layout (conteneur de mise en page)

Squelette au niveau de la page : `lh-layout` associé aux sous-composants `lh-header` / `lh-aside` / `lh-main` / `lh-footer` (easycom permet d'utiliser les balises directement ; en import à la demande, les noms des composants sont `LhLayout` / `LhHeader` / `LhAside` / `LhMain` / `LhFooter`).

## Utilisation de base (en-tête / contenu / pied)

Le conteneur a besoin d'une hauteur explicite : `lh-layout` est lui-même un conteneur flex en `flex: 1`, donc placé dans un parent en flux normal il faut lui donner une hauteur via `sx` ou un style externe pour que les enfants header / main / footer se répartissent proportionnellement.

```vue
<template>
  <lh-layout direction="vertical" :sx="{ h: '240px' }">
    <lh-header>En-tête</lh-header>
    <lh-main>Contenu</lh-main>
    <lh-footer>Pied de page</lh-footer>
  </lh-layout>
</template>
```

## Direction de disposition

`direction` contrôle explicitement la disposition des enfants : par défaut `horizontal` (côte à côte) ; la disposition passe automatiquement à `vertical` lorsqu'un `lh-aside` est présent, et peut également être forcée manuellement.

```vue
<template>
  <lh-layout direction="horizontal" :sx="{ h: '80px' }">
    <lh-main>Côte à côte</lh-main>
    <lh-main>Côte à côte</lh-main>
  </lh-layout>
  <lh-layout direction="vertical" :sx="{ h: '140px', mt: '12px' }">
    <lh-main>Empilés verticalement</lh-main>
    <lh-main>Empilés verticalement</lh-main>
  </lh-layout>
</template>
```

## Mise en page avec barre latérale

Lorsqu'un `lh-aside` est présent, le parent passe automatiquement en vertical (header en haut, aside et main côte à côte).

```vue
<template>
  <lh-layout direction="vertical" :sx="{ h: '240px' }">
    <lh-header>En-tête</lh-header>
    <lh-layout :sx="{ flex: '1', minHeight: '0px' }">
      <lh-aside :width="140" aria-label="Navigation latérale">Barre latérale</lh-aside>
      <lh-main>Contenu</lh-main>
    </lh-layout>
    <lh-footer>Pied de page</lh-footer>
  </lh-layout>
</template>
```

`width` accepte un `number` (interprété en px) ou une `string` avec unité (par exemple `'30%'`) ; en l'absence de valeur, `--lh-layout-aside-width` est utilisée (220 px par défaut).

## Layout Props

| Propriété | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| direction | Direction de disposition (vertical automatique en présence d'un Aside) | `'horizontal' \| 'vertical'` | `'horizontal'` |
| customClass | Nom de classe personnalisé (transmis au nœud racine) | `string` | — |
| sx | Propriétés rapides de mise en page sx | `LhSxProps` | — |

## Header / Main / Footer Props

| Propriété | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| customClass | Nom de classe personnalisé (transmis au nœud racine) | `string` | — |
| sx | Propriétés rapides de mise en page sx | `LhSxProps` | — |

## Aside Props

| Propriété | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| width | Largeur de la barre latérale | `number \| string` | — |
| ariaLabel | Nom accessible (dénomination du landmark) | `string` | — |
| customClass | Nom de classe personnalisé (transmis au nœud racine) | `string` | — |
| sx | Propriétés rapides de mise en page sx | `LhSxProps` | — |

## Slots

| Slot | Description |
| --- | --- |
| default | Contenu de la mise en page (les cinq composants exposent un slot par défaut) |

## Différences entre plateformes

- **Composant de mise en page purement CSS** : il n'existe pas de module layout dans share core ; la couche logique ne porte qu'un contexte provide/inject (le parent passe en vertical dès qu'un Aside s'enregistre), sans mesure, sans superposition et sans dépendance au document ; le comportement est identique sur H5 et le Mini Programme WeChat.
- **Substitution de balises** : les balises `<section>` / `<header>` / `<aside>` / `<main>` / `<footer>` de la version plus sont toutes remplacées par des éléments `view` (WXSS interdit les sélecteurs de balise, les styles s'appliquent via les classes `lh-layout*`).
- **Sémantique des landmarks** : les rôles de landmark nativement fournis par les balises sémantiques sont restaurés par des attributs `role` — `banner` pour header, `complementary` pour aside, `main` pour main, `contentinfo` pour footer ; en présence de plusieurs `aside`, il est recommandé de les distinguer avec `ariaLabel` (par exemple « Navigation latérale », « Liens connexes »).
- **Conteneurs de défilement** : le `overflow: auto` de `lh-main` et `lh-aside` fait défiler l'élément lui-même sur H5 ; **la page d'un Mini Programme n'a pas de conteneur body défilable** (le défilement de la page est assuré par le nœud racine `page`), donc si vous placez tout le contenu d'une page directement dans `lh-main` sur un Mini Programme, le défilement de l'élément et celui de la page peuvent se superposer et produire une double barrière de défilement. Pour une mise en page pleine page avec barre latérale, donnez au conteneur externe `h: '100vh'` afin que `lh-main` défile par lui-même ; ou enrobez le contenu dans un `scroll-view` si nécessaire.
- **Conclusion du portage** : disponible sur toutes les plates-formes avec un comportement identique à la version plus ; la seule chose à garder en tête est la sémantique de conteneur « défilement au niveau de la page ou de l'élément » sur les Mini Programmes.

::: tip Différences avec la version Vue 3
- Les balises sémantiques sont remplacées par `view` et des attributs `role` (WXSS interdit les sélecteurs de balise) ; la sémantique d'accessibilité est conservée.
- Les balises des sous-composants suivent la convention easycom : `lh-header` / `lh-aside` / `lh-main` / `lh-footer` (en import à la demande, les noms correspondants sont `LhHeader`, etc.).
- Ajout de la prop `customClass` : sur uni-app une classe simple ne traverse pas `styleIsolation`, les classes personnalisées sont donc transmises via une prop (la version plus passe les classes directement).
- La direction de disposition et le mécanisme provide/inject qui bascule en vertical à la détection d'un Aside sont strictement identiques à la version plus.
:::
