import { defineConfig } from "astro/config"
import node from "@astrojs/node"
import { charpente } from "charpente/vite"

export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  server: { port: 5206, host: true },
  vite: { plugins: [charpente()] },
})
