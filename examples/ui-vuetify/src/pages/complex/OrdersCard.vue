<script setup lang="ts">
const headers = [
  { title: "N°", key: "id", sortable: false },
  { title: "Client", key: "customer", sortable: false },
  { title: "Date", key: "date", sortable: false },
  { title: "Total", key: "total", sortable: false },
  { title: "Statut", key: "status", sortable: false },
]

const orders = [
  { id: "1001", customer: "Atelier Lumière", date: "12/10/2026", total: "1 240,00 €", status: "Payée" },
  { id: "1002", customer: "Maison Verdier", date: "12/10/2026", total: "389,90 €", status: "En cours" },
  { id: "1003", customer: "Studio Pivoine", date: "11/10/2026", total: "2 075,50 €", status: "Payée" },
  { id: "1004", customer: "Café du Port", date: "11/10/2026", total: "96,00 €", status: "Remboursée" },
  { id: "1005", customer: "Librairie Nord", date: "10/10/2026", total: "512,30 €", status: "Payée" },
  { id: "1006", customer: "Fleuriste Rose", date: "10/10/2026", total: "148,00 €", status: "En cours" },
  { id: "1007", customer: "Garage Moreau", date: "09/10/2026", total: "3 410,00 €", status: "Payée" },
  { id: "1008", customer: "Boulangerie Alba", date: "09/10/2026", total: "74,20 €", status: "Payée" },
]
</script>

<template>
  <v-card class="mt-6">
    <v-card-title>Commandes récentes</v-card-title>
    <v-data-table :headers="headers" :items="orders" :items-per-page="-1" hide-default-footer>
      <template #item.status="{ value }">
        <v-chip size="small">{{ value }}</v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>
