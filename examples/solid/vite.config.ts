import { charpente } from 'charpente/vite'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  server: { port: 5221, strictPort: true, fs: { allow: ['../..'] } },
  plugins: [solid(), charpente()],
  build: { target: 'esnext' },
})
