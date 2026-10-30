# Liste de régression manuelle du Mini Programme WeChat

> À destination des utilisateurs (ou des mainteneurs) pour vérification dans les outils de développement WeChat. La smoke de compilation garantit uniquement que le WXSS est valide et que la compilation passe ; **l'exactitude du comportement doit être vérifiée par régression manuelle** — vitest teste la sémantique H5, les différences d'événements et de rendu du côté MP ne sont pas couvertes.
>
> Compilation : `pnpm dev:mp-weixin` (or `pnpm build:mp-weixin`), l'artefact se trouve dans `dist/dev/mp-weixin` (or `dist/build/mp-weixin`) ; ouvrez ce répertoire dans les outils de développement WeChat.
>
> Prérequis : version de base de WeChat **>= 2.25.2** (dépendance root-portal ; les versions inférieures passent par la branche dégradée fixed dans la page — pour tester spécifiquement la voie dégradée, réglez la version de base en dessous de 2.25.2 et rejouez les trois cas « composants à calque »).

## Bases communes (à vérifier sur chaque page)

| # | Rubrique | Critère de réussite |
| --- | --- | --- |
| G1 | Ouverture | La page se rend sans écran blanc, sans erreur « composant non enregistré » |
| G2 | Mode sombre | Activer le mode sombre depuis l'entrée : toutes les couleurs des composants de la page suivent (pas uniquement le fond) |
| G3 | Langue | Changer de langue depuis l'entrée : les textes des composants (messages de validation de form, libellés de boutons, etc.) suivent le changement |
| G4 | Console | Aucun `console.error` (attention : l'avertissement « point de montage manquant » de message / loading ne doit pas apparaître) |

## Liste des composants

| Chemin de la page | Composant | Interactions clés (en plus des bases communes) |
| --- | --- | --- |
| `pages/button/button` | button | Le clic a un retour tactile ; loading / disabled / plain / round / circle / block sont tous rendus ; les boutons à icône affichent correctement l'iconfont |
| `pages/icon/icon` | icon | Les 37 icônes s'affichent toutes (pas de carrés vides) ; size / color fonctionnent ; l'icône loading tourne |
| `pages/tag/tag` | tag | Les couleurs de chaque type sont correctes ; bascule round / hit ; le clic sur closable déclenche la fermeture et le callback |
| `pages/input/input` | input | v-model bidirectionnel ; le style de l'espace réservé via `placeholder-style` s'applique (**on ne vérifie pas `::placeholder`**) ; le textarea adapte sa hauteur ; compteur de caractères ; clearable vide le champ ; l'état error rougit la bordure |
| `pages/switch/switch` | switch | Le clic bascule avec une animation du curseur ; loading / disabled ne répondent pas au clic ; activeText / inactiveText s'affichent |
| `pages/checkbox/checkbox` | checkbox / checkbox-group | Le clic coche ; la multi-sélection dans le groupe est indépendante ; les éléments disabled ne répondent pas ; état indéterminé |
| `pages/radio/radio` | radio / radio-group | Sélection exclusive (cliquer sur un autre élément annule le précédent) ; les éléments disabled ne répondent pas |
| `pages/form/form` | form / form-item | blur / input déclenchent la validation ; le message d'erreur s'affiche correctement dans un `<text>` ; la Promise renvoyée par `validate()` se résout correctement dans le bouton « Envoyer » ; l'astérisque requis s'affiche |
| `pages/select/select` | select | Le clic ouvre le listbox (**root-portal, au-dessus du masque**) ; le clic sur une option sélectionne et ferme ; clearable vide la valeur ; filterable : le champ de saisie dans le calque est utilisable ; **l'absence de navigation clavier est normale** (supprimée en MP) |
| `pages/tooltip/tooltip` | tooltip | Le clic sur le déclencheur ouvre la bulle ; la position correspond au placement (positionnement après mesure sur deux images, **aucun clignotement ni décalé sur la première image**) ; le clic à l'extérieur ferme ; trigger="hover" sans effet en MP est à considérer comme normal |
| `pages/dialog/dialog` | dialog | L'ouverture affiche le masque et la transition ; le clic sur le masque ferme selon `closeOnClick-modal` ; le placement bottom applique `safe-area-inset-bottom` sur les écrans plein écran ; **Esc et lockScroll sans effet en MP est normal** ; le mode plein écran couvre tout l'écran |
| `pages/services/services` | message / loading | Voir la section ci-dessous |

## Spécifique message / loading

| # | Rubrique | Critère de réussite |
| --- | --- | --- |
| S1 | Les différents types | Les cinq types success / info / warning / danger / loading s'affichent, avec les icônes et couleurs correctes |
| S2 | Fermeture automatique | Disparition après 3 secondes par défaut, avec une animation de transition (**pas une disparition instantanée**) |
| S3 | Fermeture manuelle | Le type loading ne se ferme pas automatiquement ; il disparaît après `handle.close()` |
| S4 | Empilement | Les appels successifs de plusieurs messages s'empilent verticalement sans se chevaucher ; au-delà de max, les plus anciens sont éjectés |
| S5 | Masque plein écran | loading.show affiche un masque plein écran ; pendant le masque, le niveau inférieur n'est pas cliquable |
| S6 | Callback de fermeture | Le callback onClose est déclenché à la disparition du message |
| S7 | Avertissement d'absence de montage | (À tester spécifiquement : retirez `<lh-message />` de la page, puis appelez) la console doit émettre un `console.error` explicite, **pas silencieux** |

## « Non-défauts » connus du côté MP (si vous les rencontrez, ne remontez pas de bug)

- select / dialog / tooltip : **pas de navigation clavier / Esc / focus-trap / lockScroll** — supprimés à la compilation, voir
  [Prise en charge des plateformes](/fr/guide/platform).
- `trigger="hover"` de tooltip ne se déclenche pas en MP — pas de sémantique de survol, utilisez click.
- message / loading nécessitent d'abord un point de montage : c'est la conception, pas un bug.
- icon est rendu en police : `fill` / `stroke` sont sans effet en CSS, seul `color` fonctionne.

## Enregistrement des résultats de régression

Ajoutez une colonne « Réussite / Échec (symptôme) » à droite des tableaux ; pour les échecs, collez d'abord les captures de la console et du panneau WXML des outils de développement, puis confrontez-les à la matrice des capacités de la plateforme dans `docs/uniapp/uniapp组件库计划.md` pour déterminer s'il s'agit d'une « dégradation prévue » ou d'un vrai défaut.
