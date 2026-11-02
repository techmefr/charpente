<script setup lang="ts">
import { rootAttrs } from "../useLoadingState"
import ActivityCard from "./complex/ActivityCard.vue"
import FiltersCard from "./complex/FiltersCard.vue"
import KpiRow from "./complex/KpiRow.vue"
import OrdersCard from "./complex/OrdersCard.vue"
import PageHeader from "./complex/PageHeader.vue"
import ProductsCard from "./complex/ProductsCard.vue"
import SalesChartCard from "./complex/SalesChartCard.vue"
import SidebarNav from "./complex/SidebarNav.vue"
</script>

<template>
  <div data-testid="root" v-bind="rootAttrs">
    <v-layout>
      <SidebarNav />
      <v-main>
        <v-container fluid class="pa-6">
          <PageHeader />
          <KpiRow />
          <SalesChartCard />
          <OrdersCard />
          <v-row class="mt-6">
            <v-col cols="6">
              <FiltersCard />
            </v-col>
            <v-col cols="6">
              <ActivityCard />
            </v-col>
          </v-row>
          <ProductsCard />
        </v-container>
      </v-main>
    </v-layout>
  </div>
</template>
