import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: { conditions: ["browser", "development"] },
  test: { environment: "jsdom", server: { deps: { inline: [/solid-js/] } } },
})
