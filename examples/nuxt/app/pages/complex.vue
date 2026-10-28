<script setup lang="ts">
import { Charpente } from 'charpente-vue'
import '../../../../fixtures/page.css'
import html from '../../../../fixtures/complex.html?raw'

const route = useRoute()
const loading = computed(() => route.query.state === 'loading')
const inner = html.replace(/^<div[^>]*>/, '').replace(/<\/div>\s*$/, '')
</script>

<template>
  <div>
    <Charpente tag="div" class="dash" data-testid="root" :loading="loading" v-html="inner" />
  </div>
</template>
