import { sveltekit } from "@sveltejs/kit/vite"
import { charpente } from "charpente/vite"
import { defineConfig } from "vite"

export default defineConfig({
  server: { port: 5205, strictPort: true },
  plugins: [charpente(), sveltekit()],
})
