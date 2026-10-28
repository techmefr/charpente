import { resolve } from 'node:path'
import { charpente } from 'charpente/vite'
import { defineConfig, type Plugin } from 'vite'

const cleanUrls = (): Plugin => ({
  name: 'clean-urls',
  configureServer(server) {
    server.middlewares.use((request, _response, next) => {
      const [path, query] = (request.url ?? '').split('?')
      if (path === '/simple' || path === '/complex') request.url = `${path}.html${query ? `?${query}` : ''}`
      next()
    })
  },
})

export default defineConfig({
  server: { port: 5214, strictPort: true, fs: { allow: ['../..'] } },
  plugins: [cleanUrls(), charpente()],
  build: {
    rollupOptions: {
      input: { simple: resolve(__dirname, 'simple.html'), complex: resolve(__dirname, 'complex.html') },
    },
  },
})
