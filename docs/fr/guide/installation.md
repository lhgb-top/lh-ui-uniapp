# Installation

## Dépendances

- `@lh-ui/share` est installé automatiquement (seule dépendance à l'exécution de cette bibliothèque).
- Un projet uni-app Vue3 (`@dcloudio/uni-app` 3.x).
- Le Mini Programme WeChat nécessite une **version de base >= 2.25.2** (root-portal) ; les versions inférieures se dégradent en repli fixed dans la page.

## Méthode 1 : import à la demande via easycom (recommandé)

Après l'installation, ajoutez une règle easycom dans `pages.json` :

```json
{
  "easycom": {
    "autoscan": false,
    "custom": {
      "^lh-(.*)": "@lh-ui/uniapp/src/components/lh-$1/lh-$1.vue"
    }
  }
}
```

Ensuite, écrivez simplement les balises dans le template, **sans import ni enregistrement** :

```vue
<template>
  <lh-button type="primary" @click="onTap">Bouton</lh-button>
</template>
```

::: warning La configuration easycom n'est pas prise en compte à chaud
Pour des raisons de performances de compilation, uni-app **ne recompile pas lorsque la règle easycom de `pages.json` change**. Après avoir modifié la règle, touchez le contenu d'une page (ou relancez le dev server) pour qu'elle s'applique. C'est un comportement connu d'uni-app, pas un problème de cette bibliothèque.
:::

## Méthode 2 : enregistrement global

Sans easycom (par exemple si un projet H5 souhaite tout importer), passez par `app.use` :

```ts
// main.ts
import { createSSRApp } from 'vue'
import lhUiUniapp from '@lh-ui/uniapp'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.use(lhUiUniapp)
  return { app }
}
```

## Import des styles

**Les deux méthodes nécessitent l'import des deux artefacts CSS** (zéro dépendance sass pour l'utilisateur ; les styles ont été sanitisés à la compilation en CSS autonome) :

```ts
// main.ts
import '@lh-ui/uniapp/src/theme/index.css' // Variables de thème (page { --lh-* } + page.dark pour le mode sombre)
import '@lh-ui/uniapp/src/icon/iconfont.css' // Police d'icônes (dépendance du composant lh-icon)
```

::: tip Pourquoi des artefacts de compilation plutôt que des sources scss
Le `loadPaths` de sass dans un projet uni-app n'inclut pas `node_modules` : un bare specifier comme `@use '@lh-ui/share/...'` ne se résout pas et la compilation échoue. C'est pourquoi cette bibliothèque produit à la compilation un CSS autonome, et que les SFC des composants importent via `<style src="./style.css">`. En conséquence, **l'utilisateur n'a pas besoin d'installer sass**.
:::

## Placer un point de montage pour les services impératifs

Message / Loading ne peuvent pas créer de DOM en JS dans le Mini Programme : ils adoptent le **motif de point de montage**. Placez un composant point de montage dans les pages (ou le composant racine) où vous en avez besoin :

```vue
<template>
  <lh-config-provider :theme="theme">
    <view class="content"><!-- Contenu de la page --></view>

    <!-- Point de montage des services impératifs -->
    <lh-message />
    <lh-loading />
  </lh-config-provider>
</template>

<script setup lang="ts">
import { useLhMessage } from '@lh-ui/uniapp'

const { success } = useLhMessage()
const onTap = () => success('Opération réussie')
</script>
```

::: danger Avertissement en l'absence de point de montage
Si vous appelez `useLhMessage()` alors que la page ne contient pas `<lh-message />`, un `console.error` explicite est émis en développement, **sans dégradation silencieuse**. C'est un choix délibéré : la dégradation silencieuse transformerait « l'appel semble réussir, mais rien ne se passe » en bug invisible.
:::

## TypeScript

Cette bibliothèque fournit ses propres types ; les Props et les événements des composants bénéficient d'une inférence complète. Avec easycom, le typage des balises du template est fourni par le système de types de composants d'uni-app (si le projet ne configure pas les types de composants globaux, annotez explicitement avec `LhXxxProps`).
