<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Charpente } from 'charpente-vue'

const themes = ['solid', 'outline', 'dots', 'cyberpunk', 'web', 'glass', 'frost', 'smoked', 'mint']
const motions = ['shimmer', 'pulse', 'wave', 'glitch']

const loading = ref(true)
const theme = ref('solid')
const motion = ref<string[]>(['shimmer'])
const delay = ref(120)
const stagger = ref(40)
const dark = ref(false)

const glassDefaults = {
  glass: { blur: 12, opacity: 0.12, reflection: 0.16, tint: '#b8c4ff' },
  frost: { blur: 24, opacity: 0.26, reflection: 0.3, tint: '#e2e8f0' },
  smoked: { blur: 16, opacity: 0.48, reflection: 0.08, tint: '#101827' },
}
const glass = ref({ ...glassDefaults.glass })
const isGlass = computed(() => theme.value in glassDefaults)
watch(theme, (name) => {
  if (name in glassDefaults) glass.value = { ...glassDefaults[name as keyof typeof glassDefaults] }
})
const glassStyle = computed(() => isGlass.value ? {
  '--charpente-glass-blur': `${glass.value.blur}px`,
  '--charpente-glass-opacity': glass.value.opacity,
  '--charpente-glass-tint': glass.value.tint,
  '--charpente-glass-reflection': glass.value.reflection,
} : {})

watch(
  dark,
  (value) => {
    document.documentElement.dataset.theme = value ? 'dark' : 'light'
  },
  { immediate: true },
)

const people = [
  { name: 'Camille Durand', role: 'Cheffe de projet', bio: 'Pilote la roadmap produit et coordonne les équipes front et back.' },
  { name: 'Mehdi Lambert', role: 'Développeur front', bio: 'Construit les composants partagés et veille à leur accessibilité.' },
  { name: 'Inès Morel', role: 'Designeuse', bio: 'Dessine les parcours et maintient le système de design de la marque.' },
]

const placeholder = { name: 'Nom du collaborateur', role: 'Fonction du poste', bio: 'Une courte présentation qui occupe la place du texte réel pendant le chargement de la fiche.' }

const items = computed(() => people.map((person) => (loading.value ? placeholder : person)))
</script>

<template>
  <main class="page">
    <header class="page__head">
      <h1><img :src="dark ? '/brand/logo-dark.svg' : '/brand/logo-light.svg'" alt="" width="40" height="40" />charpente</h1>
      <p>Skeleton loaders en CSS pur. Le thème, la motion et le timing sont indépendants.</p>
    </header>

    <section class="panel" aria-label="Réglages">
      <label>Thème
        <select v-model="theme">
          <option v-for="name in themes" :key="name" :value="name">{{ name }}</option>
        </select>
      </label>

      <fieldset>
        <legend>Motion</legend>
        <label v-for="name in motions" :key="name" class="check">
          <input v-model="motion" type="checkbox" :value="name" />
          {{ name }}
        </label>
      </fieldset>

      <label>Délai {{ delay }} ms
        <input v-model.number="delay" type="range" min="0" max="800" step="20" />
      </label>
      <label>Stagger {{ stagger }} ms
        <input v-model.number="stagger" type="range" min="0" max="200" step="10" />
      </label>

      <label class="check"><input v-model="loading" type="checkbox" /> Chargement</label>
      <label class="check"><input v-model="dark" type="checkbox" /> Sombre</label>
    </section>

    <section v-if="isGlass" class="panel" aria-label="Réglages du verre">
      <label>Flou {{ glass.blur }} px
        <input v-model.number="glass.blur" type="range" min="0" max="40" step="1" />
      </label>
      <label>Opacité {{ Math.round(glass.opacity * 100) }} %
        <input v-model.number="glass.opacity" type="range" min="0" max="1" step="0.01" />
      </label>
      <label>Reflet {{ Math.round(glass.reflection * 100) }} %
        <input v-model.number="glass.reflection" type="range" min="0" max="1" step="0.01" />
      </label>
      <label>Teinte <input v-model="glass.tint" type="color" /></label>
      <p class="glass-note">Les formes colorées derrière les fiches révèlent le flou et la transparence du verre.</p>
    </section>

    <Charpente
      :loading="loading"
      :theme="theme"
      :motion="motion"
      :delay="delay"
      :stagger="stagger"
      label="Chargement des fiches"
      class="grid"
      :class="{ 'grid--glass': isGlass && loading }"
      :style="glassStyle"
    >
      <article v-for="(person, index) in items" :key="index" class="card">
        <div class="card__banner" data-charpente-block></div>
        <div class="card__row">
          <img class="card__avatar" alt="" width="48" height="48" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
          <div>
            <h3>{{ person.name }}</h3>
            <span class="card__role">{{ person.role }}</span>
          </div>
        </div>
        <p>{{ person.bio }}</p>
        <div class="card__actions">
          <button type="button">Contacter</button>
          <input type="text" placeholder="Note" aria-label="Note" />
        </div>
      </article>
    </Charpente>
  </main>
</template>
