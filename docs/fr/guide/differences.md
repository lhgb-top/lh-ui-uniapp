# Différences d'API avec la version Vue3

Cette bibliothèque partage les fonctions pures du core de `@lh-ui/share` avec `@lh-ui/vue3` (plus) ; **la nomination des props et des événements est globalement alignée**. Ce qui suit découle nécessairement des plateformes cibles d'uni-app ; pour toute API non listée, le comportement est identique à la version Vue3.

## icon : rendu en police plutôt qu'en SVG en ligne

| | Version Vue3 (plus) | Cette bibliothèque |
| --- | --- | --- |
| Mode de rendu | `<svg><path>` en ligne | `<text class="lh-iconfont lh-iconfont--<name>">` |
| Couleur | `currentColor` (hérite du color parent) | prop `color` explicite / color parent (couleur de police CSS, sémantiquement équivalente) |
| Taille | prop `size` | prop `size` (définit font-size) |

Le Mini Programme ne supporte pas la balise `<svg>` : à la compilation, les icônes sont converties depuis l'ensemble de paths SVG de share en une police iconfont (base64 intégrée dans `iconfont.css`, 37 icônes, 24x24, monochromes). Visuellement, ce sont les mêmes glyphes, mais il s'agit d'une police : en CSS, **on ne peut pas** utiliser `fill` / `stroke`, uniquement `color`.

## input : le style de l'espace réservé passe par des props

MP ne supporte pas le pseudo-élément `::placeholder`. Utilisez les props :

```vue
<lh-input placeholder="Saisir" placeholder-style="color: #999" />
```

| prop | Description |
| --- | --- |
| `placeholder-style` | Chaîne de style en ligne pour le texte de l'espace réservé |
| `placeholder-class` | Classe du texte de l'espace réservé (alternative à style) |

Les autres API (`v-model`, `maxlength`, le compteur de caractères `show-word-limit`, `type`) sont identiques à la version Vue3.

## select / dialog / tooltip : les capacités de type desktop uniquement sur H5

| Capacité | H5 | Mini Programme WeChat |
| --- | --- | --- |
| Navigation clavier (flèches / Entrée / Esc) | ✅ | ❌ Supprimée à la compilation |
| focus-trap (cycle de focus de la boîte de dialogue) | ✅ | ❌ Non appelé à la compilation |
| lockScroll (verrouillage du défilement de l'arrière-plan) | ✅ | ❌ (rabat sur l'interception par le masque) |
| Déclenchement au survol (tooltip) | ✅ | ❌, remplacé par click / touchstart |

**Le `trigger` de tooltip** : il accepte toujours `'click' | 'hover'`, mais `hover` n'a pas de sens dans le Mini Programme — utilisez `trigger="click"` (ou la valeur par défaut) côté Mini Programme, déclenchement par clic / toucher.

**Les événements de select** sont inchangés (`update:modelValue` / `change` / `visible-change`), mais « vider la valeur » et « sélectionner » ne se font dans le Mini Programme qu'en cliquant sur les éléments du listbox, sans parcours clavier.

## message / loading : motif de point de montage

C'est la **plus grande différence d'usage**. La version Vue3 fait `createApp + mount sur document.body`, l'appel provoque l'affichage ; le Mini Programme n'a pas de document, il faut **d'abord placer le composant point de montage** :

```vue
<!-- À placer une fois dans la page -->
<lh-message />
<lh-loading />
```

```ts
const { success, closeAll } = useLhMessage()
const loading = useLhLoading()

loading.show({ text: 'Chargement...' })
// ...
loading.close()
```

Voir [Installation - Placer un point de montage pour les services impératifs](/fr/guide/installation#placer-un-point-de-montage-pour-les-services-imperatifs).

::: tip Le composant Notification absent de la première version
La version Vue3 fournit `lh-notification`, mais cette bibliothèque ne l'implémente **pas** dans la première version (peu de valeur sur le Mini Programme, les notifications passent généralement par les capacités système). Pour un message de type notification, remplacez-le par `lh-message`.
:::

## config-provider : le mode sombre via une classe plutôt que via document

| | Version Vue3 | Cette bibliothèque |
| --- | --- | --- |
| Bascule du mode sombre | Ajoute une classe sur `document.documentElement` | Ajoute la classe `dark` sur le nœud enveloppant (le Mini Programme n'a pas de document) |
| prop `theme` | `'light' \| 'dark'` | Identique (implémentation interne différente) |

L'usage est inchangé : `<lh-config-provider :theme="dark">`. Dans le `theme/index.css` de cette bibliothèque, les variables du mode sombre sont rattachées à `page.dark, .dark`, donc la portée du mode sombre suit le nœud enveloppé par ConfigProvider.

## Unités : px tels quels

Cette bibliothèque **ne convertit pas les px en rpx** : les sources de styles sont en px, sorties telles quelles — comme wot-design-uni / uview-plus / uni-ui / TDesign, les principales bibliothèques de composants uni (la compilation officielle uni ne convertit pas non plus automatiquement les px en rpx). Si le projet configure un plugin comme `postcss-px-to-rpx`, les artefacts de cette bibliothèque seront convertis en même temps, sans action particulière.

## Options propres au Mini Programme dans les SFC des composants

Chaque SFC de composant déclare :

```ts
defineOptions({
  name: 'LhXxx',
  options: { virtualHost: true, addGlobalClass: true, styleIsolation: 'shared' },
})
```

- `virtualHost: true` — le composant ne génère pas de nœud enveloppant superflu ; custom-class / customStyle atteignent l'élément cible.
- `addGlobalClass: true` — les styles globaux (`app.wxss` / styles de page) peuvent être utilisés dans le composant.
- `styleIsolation: 'shared'` — l'isolation des styles est en mode partagé, les styles du composant et de la page sont mutuellement visibles.

**L'utilisateur n'a pas besoin de configurer ces trois options dans pages.json ou dans le projet** — elles sont déjà déclarées dans le json du composant lui-même. Si les styles d'un composant sont anormaux (les classes sont bien présentes mais les styles manquent), vérifiez d'abord qu'un paramètre `styleIsolation` du projet ne vient pas écraser la déclaration de niveau composant.
