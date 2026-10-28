<script setup lang="ts">
import { Charpente } from 'charpente-vue'

interface Order {
  id: number
  customer: string
  total: string
  status: string
}

const placeholder: Order = { id: 0, customer: 'Nom du client', total: '000,00 €', status: 'En cours' }

const { data, status, refresh } = await useAsyncData(
  'orders',
  async () => {
    await new Promise((done) => setTimeout(done, 1800))
    return [
      { id: 1001, customer: 'Atelier Lumière', total: '1 240,00 €', status: 'Payée' },
      { id: 1002, customer: 'Maison Verdier', total: '389,90 €', status: 'En cours' },
      { id: 1003, customer: 'Studio Pivoine', total: '2 075,50 €', status: 'Payée' },
      { id: 1004, customer: 'Café du Port', total: '96,00 €', status: 'Remboursée' },
    ] satisfies Order[]
  },
  { server: false },
)

const loading = computed(() => status.value === 'pending' || status.value === 'idle')
const rows = computed<Order[]>(() =>
  loading.value || !data.value ? Array.from({ length: 4 }, () => placeholder) : data.value,
)

const dark = ref(false)
useHead({ htmlAttrs: { class: computed(() => (dark.value ? 'dark' : '')) } })
</script>

<template>
  <main class="page">
    <header class="head">
      <h1>Commandes</h1>
      <div class="head__actions">
        <label><input v-model="dark" type="checkbox" /> Sombre</label>
        <button type="button" :disabled="loading" @click="refresh()">Actualiser</button>
      </div>
    </header>

    <Charpente :loading="loading" label="Chargement des commandes" tag="table" class="table">
      <thead>
        <tr><th>N°</th><th>Client</th><th>Total</th><th>Statut</th></tr>
      </thead>
      <tbody>
        <tr v-for="(order, index) in rows" :key="index">
          <td>{{ order.id || '0000' }}</td>
          <td>{{ order.customer }}</td>
          <td>{{ order.total }}</td>
          <td>{{ order.status }}</td>
        </tr>
      </tbody>
    </Charpente>
  </main>
</template>

<style>
:root {
  --bg: #fff;
  --text: #15171c;
  --line: #e3e6ec;
  font-family: system-ui, sans-serif;
}

.dark {
  --bg: #0e1015;
  --text: #eef0f4;
  --line: #262a33;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
}

.page {
  max-width: 760px;
  margin: 0 auto;
  padding: 32px 16px;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.head__actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.table {
  width: 100%;
  margin-top: 16px;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid var(--line);
}
</style>
