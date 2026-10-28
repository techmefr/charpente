import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { charpente } from 'charpente/vite'
import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  server: { port: 5212, strictPort: true, fs: { allow: ['../..'] } },
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  plugins: [react(), tailwindcss(), charpente()],
})
