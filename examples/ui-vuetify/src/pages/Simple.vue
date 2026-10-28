<script setup lang="ts">
import { rootAttrs } from "../useLoadingState"

const GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"

const people = [
  { name: "Camille Durand", role: "Cheffe de projet", mail: "camille@exemple.fr" },
  { name: "Mehdi Lambert", role: "Développeur front", mail: "mehdi@exemple.fr" },
  { name: "Inès Morel", role: "Designeuse", mail: "ines@exemple.fr" },
  { name: "Hugo Perrin", role: "Développeur back", mail: "hugo@exemple.fr" },
]
</script>

<template>
  <v-main>
    <div data-testid="root" v-bind="rootAttrs" class="pa-6">
      <header class="mb-4">
        <h1>Équipe</h1>
        <p>Quatre collaborateurs</p>
      </header>
      <v-card>
        <v-list>
          <v-list-item v-for="person in people" :key="person.mail">
            <template #prepend>
              <v-avatar :image="GIF" size="48" />
            </template>
            <v-list-item-title>{{ person.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ person.role }}</v-list-item-subtitle>
            <template #append>
              <a :href="`mailto:${person.mail}`">{{ person.mail }}</a>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </div>
  </v-main>
</template>
