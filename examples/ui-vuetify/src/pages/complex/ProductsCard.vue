<script setup lang="ts">
import { ref } from "vue"
import { GIF } from "./gif"

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
</script>

<template>
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
</template>
