---
layout: home

hero:
  name: lh-ui uniapp
  text: Bibliothèque de composants uni-app
  tagline: Une seule base de code, H5 + Mini Programme WeChat ; la logique des composants et les sources de styles sont communes avec les versions Vue3 / Vue2 / React
  actions:
    - theme: brand
      text: Démarrage
      link: /fr/guide/installation
    - theme: alt
      text: Prise en charge des plateformes
      link: /fr/guide/platform

features:
  - title: Un seul noyau, réutilisé sur toutes les plateformes
    details: La logique des composants (machines à états, validation, calculs popper, i18n) est constituée de fonctions pures de @lh-ui/share ; cette bibliothèque ne fournit que la colle réactive. Le comportement est identique aux versions Vue3 / Vue2 / React.
  - title: H5 + Mini Programme WeChat
    details: La première version couvre les deux plateformes. Les restrictions de style du Mini Programme (liste blanche WXSS, pas de svg, pas de document) sont traitées à la compilation par la couche de sanitisation, sans aucune dépendance sass pour l'utilisateur.
  - title: easycom à la demande
    details: "Installation via npm + une règle dans pages.json : écrivez simplement les balises dans le template ; l'enregistrement global via app.use est également possible."
  - title: Services impératifs disponibles
    details: Message / Loading adoptent le motif de point de montage, utilisables en appels impératifs même dans le Mini Programme ; en l'absence de point de montage, un avertissement explicite est émis en développement, pas de dégradation silencieuse.
---

::: tip Relation avec les autres bibliothèques de la famille
Cette bibliothèque est le pendant uni-app de la lignée web de la famille lh-ui ; elle partage les fonctions pures du noyau et les sources de styles de @lh-ui/share avec @lh-ui/vue3 (plus), @lh-ui/vue2 et @lh-ui/react. La nomination des props est globalement alignée sur la version Vue3 ; pour les différences liées à la plateforme, voir
[Différences d'API avec la version Vue3](/fr/guide/differences).
:::
