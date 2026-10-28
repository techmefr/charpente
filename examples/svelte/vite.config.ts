import adapter from "@sveltejs/adapter-auto"
import { sveltekit } from "@sveltejs/kit/vite"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import { charpente } from "charpente/vite"
import { defineConfig } from "vite"

export default defineConfig({
  server: { port: 5205, strictPort: true },
  plugins: [
    charpente(),
    sveltekit({ preprocess: vitePreprocess(), adapter: adapter() }),
  ],
})
