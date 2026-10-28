<script setup lang="ts">
import { mdiCircleOutline, mdiCircle, mdiSquare, mdiTriangle, mdiViewDashboard, mdiCart, mdiAccountGroup, mdiBookOpenVariant, mdiCog } from "@mdi/js"
import { ref } from "vue"
import { rootAttrs } from "../useLoadingState"

const GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"

const nav = [
  { title: "Tableau de bord", icon: mdiViewDashboard },
  { title: "Commandes", icon: mdiCart },
  { title: "Clients", icon: mdiAccountGroup },
  { title: "Catalogue", icon: mdiBookOpenVariant },
  { title: "Réglages", icon: mdiCog },
]

const kpis = [
  { label: "Chiffre d\x27affaires", value: "48 210 €", delta: "+12 %", icon: mdiCircle },
  { label: "Commandes", value: "1 204", delta: "+4 %", icon: mdiSquare },
  { label: "Panier moyen", value: "40,05 €", delta: "-1 %", icon: mdiTriangle },
  { label: "Retours", value: "2,3 %", delta: "stable", icon: mdiCircleOutline },
]

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

const statuses = ["Tous", "Payée", "En cours"]
const status = ref("Tous")
const customer = ref("")
const note = ref("")
const late = ref(false)
const tab = ref("popular")

const tabs = [
  { value: "popular", title: "Populaires" },
  { value: "new", title: "Nouveautés" },
  { value: "promo", title: "Promotions" },
]

const products = [
  { name: "Carnet à spirale", text: "Papier recyclé, 120 pages." },
  { name: "Stylo plume bleu", text: "Plume fine, encre incluse." },
  { name: "Lampe de bureau", text: "Bras articulé, LED chaude." },
]

const feed = [
  { who: "Camille", before: "a validé la commande ", link: "#1042", after: " hier à 16 h." },
  { who: "Mehdi", before: "a ajouté une note sur ", link: "Atelier Lumière", after: "." },
  { who: "Inès", before: "a publié la fiche ", link: "Lampe de bureau", after: "." },
]
</script>

<template>
  <div data-testid="root" v-bind="rootAttrs">
    <v-layout>
      <v-navigation-drawer permanent>
        <v-list-item title="Atelier" />
        <v-list nav aria-label="Principal">
          <v-list-item v-for="item in nav" :key="item.title" :prepend-icon="item.icon" :title="item.title" href="#" />
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <v-container fluid class="pa-6">
          <header class="d-flex align-center ga-4 mb-6">
            <h1>Tableau de bord</h1>
            <v-spacer />
            <v-text-field type="search" placeholder="Rechercher" aria-label="Rechercher" density="compact" hide-details style="max-width: 280px" />
            <v-btn>Exporter</v-btn>
          </header>

          <v-row aria-label="Indicateurs">
            <v-col v-for="kpi in kpis" :key="kpi.label" cols="3">
              <v-card>
                <v-card-text>
                  <v-icon :icon="kpi.icon" size="20" />
                  <p>{{ kpi.label }}</p>
                  <strong>{{ kpi.value }}</strong>
                  <v-chip size="small" class="ml-2">{{ kpi.delta }}</v-chip>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-card class="mt-6">
            <v-card-title>Ventes sur 12 mois</v-card-title>
            <v-card-text>
              <svg width="600" height="140" viewBox="0 0 600 140" role="img" aria-label="Courbe des ventes">
                <polyline points="0,110 50,90 100,100 150,60 200,70 250,40 300,55 350,30 400,45 450,20 500,35 550,15 600,25" fill="none" stroke="currentColor" stroke-width="3" />
              </svg>
            </v-card-text>
          </v-card>

          <v-card class="mt-6">
            <v-card-title>Commandes récentes</v-card-title>
            <v-data-table :headers="headers" :items="orders" :items-per-page="-1" hide-default-footer>
              <template #item.status="{ value }">
                <v-chip size="small">{{ value }}</v-chip>
              </template>
            </v-data-table>
          </v-card>

          <v-row class="mt-6">
            <v-col cols="6">
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
            </v-col>
            <v-col cols="6">
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
            </v-col>
          </v-row>

          <v-card class="mt-6">
            <v-tabs v-model="tab">
              <v-tab v-for="item in tabs" :key="item.value" :value="item.value">{{ item.title }}</v-tab>
            </v-tabs>
            <v-card-text>
              <v-row>
                <v-col v-for="product in products" :key="product.name" cols="4">
                  <v-card variant="outlined">
                    <v-img :src="GIF" width="320" height="120" cover />
                    <v-card-title>{{ product.name }}</v-card-title>
                    <v-card-text>{{ product.text }}</v-card-text>
                    <v-card-actions>
                      <v-btn>Ajouter</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-container>
      </v-main>
    </v-layout>
  </div>
</template>
