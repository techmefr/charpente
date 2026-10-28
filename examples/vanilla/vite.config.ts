import tailwindcss from '@tailwindcss/vite'
import { charpente } from 'charpente/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  server: { port: 5201, strictPort: true, fs: { allow: ['../..'] } },
  plugins: [tailwindcss(), charpente()],
})
