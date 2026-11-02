<script setup lang="ts">
import { mdiAccountGroup, mdiBookOpenVariant, mdiCart, mdiCog, mdiViewDashboard } from "@mdi/js"

const nav = [
  { title: "Tableau de bord", icon: mdiViewDashboard },
  { title: "Commandes", icon: mdiCart },
  { title: "Clients", icon: mdiAccountGroup },
  { title: "Catalogue", icon: mdiBookOpenVariant },
  { title: "Réglages", icon: mdiCog },
]
</script>

<template>
  <v-navigation-drawer permanent>
    <v-list-item title="Atelier" />
    <v-list nav aria-label="Principal">
      <v-list-item v-for="item in nav" :key="item.title" :prepend-icon="item.icon" :title="item.title" href="#" />
    </v-list>
  </v-navigation-drawer>
</template>
