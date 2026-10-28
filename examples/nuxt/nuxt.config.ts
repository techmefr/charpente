import { charpente } from 'charpente/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devServer: { port: 5202 },
  css: ['virtual:charpente.css'],
  vite: {
    plugins: [charpente()],
  },
})
