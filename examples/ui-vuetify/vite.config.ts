import vue from "@vitejs/plugin-vue"
import { charpente } from "charpente/vite"
import { defineConfig } from "vite"
import vuetify from "vite-plugin-vuetify"

export default defineConfig({
  server: { port: 5211, strictPort: true, fs: { allow: ["../.."] } },
  plugins: [vue(), vuetify(), charpente()],
})
