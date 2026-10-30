# Prise en charge des plateformes

## Plateformes couvertes par la première version

| Plateforme | État | Remarques |
| --- | --- | --- |
| **H5** | ✅ Complet | Tous les composants, toutes les fonctionnalités |
| **Mini Programme WeChat** | ✅ Complet (dégradations partielles) | Les capacités de type desktop des composants à calque sont dégradées, voir le tableau ci-dessous |
| Mini Programmes Alipay / Douyin | 🚫 Non supporté dans la première version | Ajoutés par plateforme après validation par compilation conditionnelle |
| App (nvue) | 🚫 Pas prévu | Le moteur de rendu nvue diffère de webview, hors feuille de route |

## Matrice des capacités par composant

« Dégradation » signifie que **les capacités non supportées par la plateforme sont supprimées par des gardes à la compilation** (aucun code mort dans le paquet du Mini Programme), et non d'échec à l'exécution.

| Composant | H5 | Mini Programme WeChat | Stratégie de dégradation / remarques |
| --- | --- | --- | --- |
| config-provider | Complet | Complet | provide/inject + variables CSS en ligne utilisables sur toutes les plateformes ; le mode sombre s'appuie sur la classe `page.dark` (pas de document) |
| button / tag | Complet | Complet | — |
| icon | Complet | Complet | Solution à base de police iconfont (le web utilise du SVG en ligne, voir « Différences de rendu des icônes » ci-dessous) |
| input | Complet | Complet | Le style de l'espace réservé passe par le prop `placeholder-style` (MP ne supporte pas `::placeholder`) |
| checkbox / radio / switch | Complet | Complet | **Dessiné en view** (pas de composant natif, pour unifier le langage visuel lh) |
| form / form-item | Complet | Complet | La logique de validation est dans le core en fonctions pures, zéro dépendance à la plateforme |
| select | Complet | Dégradé | root-portal + mesure sur deux images ; **navigation clavier uniquement sur H5**, MP via clic + scroll-view |
| dialog | Complet | Dégradé | root-portal ; **focus-trap / lockScroll uniquement sur H5**, MP se rabat sur l'interception par le masque |
| tooltip | Complet | Dégradé | Mesure sur deux images ; **pas de hover**, déclenchement sur MP par clic / toucher |
| message / loading | Complet | Complet | Motif de point de montage (le Mini Programme n'a pas de document, impossible de créer du DOM en JS) |

## Restrictions spécifiques au Mini Programme WeChat et alternatives

| Restriction | Solution de remplacement |
| --- | --- |
| Balise `<svg>` non supportée | À la compilation, les icônes sont converties en police iconfont (base64 intégrée), rendues via `<text class="lh-iconfont">` |
| `::placeholder` non supporté | Props `placeholder-style` / `placeholder-class` de input |
| Sélecteur universel `*`, sélecteurs d'attribut, `:not()`, `:nth-*` non supportés | Sanitisation à la compilation : `*` est transformé en flex + gap, les autres sont remplacés par des classes équivalentes |
| Pas de `document` / `document.body` | Calques via `root-portal` ; services impératifs via le motif de point de montage |
| Pas de sémantique de focus clavier | focus-trap / navigation clavier non appelés, gardés par `LH_IS_H5` ; les attributs aria restent publiés pour les lecteurs d'écran |
| `transitionend` peu fiable | Animations d'entrée / sortie via CSS transition + setTimeout pour aligner les durées |
| Composants pas encore créés à l'étape `onLoad` | Tous les appels de ref / mesures doivent attendre `onReady` |

## Version de base de WeChat

- **root-portal nécessite une version de base >= 2.25.2** (le montage des calques de select / dialog / tooltip en dépend).
- Les versions inférieures se dégradent automatiquement vers un **positionnement fixed dans la page** (détecté via `getLhLibVersion()`) ; le calque est toujours là, seule sa hiérarchie est contrainte par le flux de la page.

## root-portal et les plateformes type DingTalk

`lh-root-portal` utilise en interne une compilation conditionnelle en trois branches : H5 via `<teleport to="body">`, WeChat via `<root-portal>`, et les plateformes ne supportant pas root-portal (DingTalk, etc.) via un fixed dans la page. **C'est un composant interne, l'utilisateur n'a pas à s'en soucier** : il est décrit ici uniquement pour expliquer l'origine des différences de comportement des calques entre plateformes.
