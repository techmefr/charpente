<script setup lang="ts">
import { ref } from "vue"

const statuses = ["Tous", "Payée", "En cours"]
const status = ref("Tous")
const customer = ref("")
const note = ref("")
const late = ref(false)
</script>

<template>
  <v-card>
    <v-card-title>Filtres</v-card-title>
    <v-card-text>
      <v-form aria-label="Filtres">
        <v-text-field v-model="customer" label="Client" placeholder="Nom du client" />
        <v-select v-model="status" label="Statut" :items="statuses" />
        <v-textarea v-model="note" label="Note" placeholder="Remarque" rows="3" />
        <v-checkbox v-model="late" label="Retards seulement" />
        <v-btn type="submit">Appliquer</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>
