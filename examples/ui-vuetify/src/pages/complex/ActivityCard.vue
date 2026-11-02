<script setup lang="ts">
import { GIF } from "./gif"

const feed = [
  { who: "Camille", before: "a validé la commande ", link: "#1042", after: " hier à 16 h." },
  { who: "Mehdi", before: "a ajouté une note sur ", link: "Atelier Lumière", after: "." },
  { who: "Inès", before: "a publié la fiche ", link: "Lampe de bureau", after: "." },
]
</script>

<template>
  <v-card>
    <v-card-title>Activité</v-card-title>
    <v-list>
      <v-list-item v-for="entry in feed" :key="entry.who">
        <template #prepend>
          <v-avatar :image="GIF" size="32" />
        </template>
        <p><strong>{{ entry.who }}</strong> {{ entry.before }}<a href="#">{{ entry.link }}</a>{{ entry.after }}</p>
      </v-list-item>
    </v-list>
  </v-card>
</template>
