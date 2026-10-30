# Formulaire

Collecte et validation de données. Toute la logique de validation est constituée de fonctions pures de `@lh-ui/share`, sans aucune dépendance à la plateforme : le comportement est identique sur les deux plateformes.

## Utilisation de base

```vue
<template>
  <lh-form :model="form" :rules="rules" ref="formRef" label-width="80">
    <lh-form-item label="Nom d'utilisateur" prop="name">
      <lh-input v-model="form.name" placeholder="Veuillez saisir le nom d'utilisateur" />
    </lh-form-item>
    <lh-form-item label="E-mail" prop="email">
      <lh-input v-model="form.email" placeholder="Veuillez saisir l'e-mail" />
    </lh-form-item>
    <lh-button type="primary" @click="onSubmit">Envoyer</lh-button>
  </lh-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({ name: '', email: '' })
const formRef = ref()

const rules = {
  name: [{ required: true, message: "Veuillez saisir le nom d'utilisateur", trigger: 'blur' }],
  email: [{ required: true, message: "Veuillez saisir l'e-mail", trigger: 'blur' }],
}

const onSubmit = async () => {
  const ok = await formRef.value.validate()
  if (ok) {
    // Validation réussie, envoi
  }
}
</script>
```

## Form Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| model | Objet de données du formulaire (requis) | `Record<string, unknown>` | — |
| rules | Règles de validation (les clés sont les noms de prop) | `Record<string, LhFormRule[]>` | — |
| labelPosition | Position du libellé | `'left' \| 'right' \| 'top'` | `'right'` |
| labelWidth | Largeur du libellé | `string \| number` | — |
| inline | Mise en page en ligne | `boolean` | `false` |
| customClass | Nom de classe personnalisé | `string` | — |
| sx | Propriétés de mise en page rapide | `LhSxProps` | — |

## Form Methods (à appeler via ref)

::: warning Les appels via ref doivent attendre onReady
À l'étape `onLoad`, les composants enfants ne sont pas encore créés : `formRef.value` vaut undefined. L'événement de clic du bouton d'envoi se produit naturellement après `onReady`, il n'y a pas de problème ; mais pour un appel lors de l'initialisation de la page, placez-le dans `onReady`.
:::

| Méthode | Description | Renvoie |
| --- | --- | --- |
| validate | Valide tous les champs | `Promise<boolean>` (true si tout est valide) |
| validateField | Valide un seul champ | `Promise<boolean>` |

## FormItem Props

| Prop | Description | Type | Valeur par défaut |
| --- | --- | --- | --- |
| prop | Nom de la clé du champ (correspond aux clés de model et de rules) | `string` | — |
| label | Texte du libellé | `string` | — |
| required | Marque de requis (affiche un astérisque ; la validation effective est décidée par rules) | `boolean` | `false` |
| rules | Règles propres à ce champ (fusionnées avec les rules de Form) | `LhFormRule[]>` | — |
| customClass | Nom de classe personnalisé | `string` | — |

::: tip Différences avec la version Vue3
- Déclenchement de la validation : les contrôles du Mini Programme n'ont pas de sémantique change, chaque contrôle de formulaire mappe les événements blur / input sur les déclencheurs de validation.
- Envoi du formulaire : la sémantique de formulaire du Mini Programme est différente, `validate` renvoie une `Promise<boolean>` pour un envoi manuel ; il n'y a pas d'interception de l'événement `submit` comme sur le web.
:::
