import vue from '@vitejs/plugin-vue'
import { charpente } from 'charpente/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), charpente()],
})
