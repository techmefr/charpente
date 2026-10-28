<script setup lang="ts">
import { Charpente } from 'charpente-vue'
import '../../../../fixtures/page.css'
import html from '../../../../fixtures/simple.html?raw'

const route = useRoute()
const loading = computed(() => route.query.state === 'loading')
const inner = html.replace(/^<main[^>]*>/, '').replace(/<\/main>\s*$/, '')
</script>

<template>
  <div>
    <Charpente tag="main" class="page" data-testid="root" :loading="loading" v-html="inner" />
  </div>
</template>
