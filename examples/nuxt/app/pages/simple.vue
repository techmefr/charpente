<script setup lang="ts">
import '../../../../fixtures/page.css'
import html from '../../../../fixtures/simple.html?raw'

const route = useRoute()
const loading = computed(() => route.query.state === 'loading')
const markup = computed(() =>
  loading.value
    ? html.replace('data-testid="root"', 'data-testid="root" data-charpente-loading aria-busy="true" inert')
    : html,
)
</script>

<template>
  <div v-html="markup" />
</template>
