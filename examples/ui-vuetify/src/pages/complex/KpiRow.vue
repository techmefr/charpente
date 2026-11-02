<script setup lang="ts">
import { mdiCircle, mdiCircleOutline, mdiSquare, mdiTriangle } from "@mdi/js"

const kpis = [
  { label: "Chiffre d\x27affaires", value: "48 210 €", delta: "+12 %", icon: mdiCircle },
  { label: "Commandes", value: "1 204", delta: "+4 %", icon: mdiSquare },
  { label: "Panier moyen", value: "40,05 €", delta: "-1 %", icon: mdiTriangle },
  { label: "Retours", value: "2,3 %", delta: "stable", icon: mdiCircleOutline },
]
</script>

<template>
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
</template>
