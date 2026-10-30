# FAQ

## 1. La configuration easycom modifiée ne prend pas effet

**Symptôme** : vous avez ajouté une règle easycom dans `pages.json` (ou modifié la règle), mais les balises `<lh-xxx>` du template déclenchent toujours l'erreur « composant non enregistré ».

**Cause** : pour des raisons de performances de compilation, uni-app **ne recompile pas lorsque la règle easycom de `pages.json` change**.

**Solution** : après avoir modifié la règle, touchez le contenu d'une page (un espace + enregistrement suffit) pour forcer la recompilation ; ou relancez le dev server.

## 2. ref injoignable / la mesure renvoie un résultat vide

**Symptôme** : vous appelez une méthode du composant via ref dans `onLoad`, ou utilisez `getLhRect` / `useLhPopper`, et obtenez undefined ou un rectangle vide.

**Cause** : à l'étape `onLoad`, les composants ne sont pas encore créés : les instances enfants et les nœuds ne sont pas prêts.

**Solution** : placez tous les appels de ref et les mesures de nœuds **après `onReady`** (`onReady` correspond au premier rendu complet de la page) :

```ts
import { onReady } from '@dcloudio/uni-app'

onReady(() => {
  // C'est ici que l'accès aux ref des composants enfants / la mesure des nœuds est sans risque
})
```

## 3. Les services impératifs (message / loading) ne réagissent pas à l'appel

**Symptôme** : `useLhMessage().success(...)` a été appelé, la console affiche un avertissement `console.error`, mais aucun message n'apparaît sur la page.

**Cause** : le Mini Programme ne peut pas créer de DOM en JS, les services impératifs adoptent le **motif de point de montage** — la page doit d'abord contenir `<lh-message />` / `<lh-loading />` ; l'appel se contente de pousser un enregistrement dans un store singleton, et c'est le composant point de montage qui le rend.

**Solution** : placez le point de montage dans les pages concernées (ou dans un composant racine enveloppant permanent) :

```vue
<lh-config-provider>
  <view><!-- Contenu --></view>
  <lh-message />
  <lh-loading />
</lh-config-provider>
```

L'avertissement est un choix délibéré — pas de dégradation silencieuse, pour éviter le bug invisible d'un appel qui semble réussir mais reste sans effet.

## 4. Les styles ne s'appliquent pas / les classes sont là mais les styles manquent

**Ordre de vérification** :

1. Vérifiez que les deux artefacts CSS sont importés : `@lh-ui/uniapp/src/theme/index.css` et `@lh-ui/uniapp/src/icon/iconfont.css`. Si les variables de thème manquent, tous les `var(--lh-*)` retombent sur leurs valeurs par défaut (couleurs et arrondis incorrects).
2. Vérifiez que vous n'écrasez pas le `styleIsolation` de niveau composant. Les SFC des composants déclarent `styleIsolation: 'shared'` + `addGlobalClass: true` ; si la configuration du projet force une isolation plus stricte, les styles du composant et de la page deviennent mutuellement invisibles.
3. Transmettez les styles personnalisés via les props `custom-class` / `custom-style`, n'écrivez pas directement les classes BEM internes du composant dans la page (les classes internes comme `.lh-button__text` ne font pas partie de l'API publique).

## 5. Pourquoi le paquet du Mini Programme contient-il du base64 iconfont

C'est la police d'icônes (quelques dizaines de Ko), intégrée au CSS et livrée avec le paquet. Le Mini Programme ne supporte pas la balise `<svg>`, les icônes doivent passer par une police ; le base64 intégré est dû au fait que `@font-face` dans le Mini Programme ne permet pas de référencer un fichier de police local (`url(...)` en wxss n'accepte qu'une adresse réseau ou du base64). C'est l'approche dominante pour les icônes en uni-app.

## 6. Le calque est bien positionné en H5, mais décalé dans le Mini Programme

Le positionnement des calques suit la séquence « mesure sur deux images → positionnement → affichage » (rendu transparent pour mesurer, puis positionnement, enfin affichage pour éviter le clignotement). En cas de décalage, il s'agit généralement d'un **problème de séquence d'appel** : vérifiez que le positionnement est déclenché après `onReady` et que le nœud déclencheur a terminé sa mise en page. Par ailleurs, `getLhRect` est asynchrone dans le Mini Programme : ne supposez pas que le résultat est disponible de manière synchrone.

## 7. Le mode sombre ne s'applique pas

Les variables du mode sombre sont rattachées à `page.dark, .dark` et basculées via la classe `dark` ajoutée au nœud enveloppant par ConfigProvider. Vérifiez que `<lh-config-provider :theme="dark">` enveloppe bien la portion de contenu concernée (contrairement au web, où elles sont rattachées à document.documentElement et donc globales, ici la portée suit le nœud enveloppé).
