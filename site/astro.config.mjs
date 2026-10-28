import { defineConfig } from 'astro/config'
import { charpente } from 'charpente/vite'

export default defineConfig({
  site: 'https://techmefr.github.io',
  base: '/charpente',
  trailingSlash: 'always',
  vite: { plugins: [charpente()] },
})
