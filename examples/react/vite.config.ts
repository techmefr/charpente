import react from '@vitejs/plugin-react'
import { charpente } from 'charpente/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  server: { port: 5203, strictPort: true, fs: { allow: ['../..'] } },
  plugins: [react(), charpente()],
})
