import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: { alias: { "react-native": fileURLToPath(new URL("./test/native-mock.tsx", import.meta.url)) } },
  test: { environment: "jsdom" },
})
