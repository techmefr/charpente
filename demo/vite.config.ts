import vue from '@vitejs/plugin-vue'
import { charpente } from 'charpente/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  plugins: [vue(), charpente()],
})
