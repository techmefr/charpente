import { defineConfig } from "tsup"

export default defineConfig([
  {
    entry: { cli: "src/cli.ts" },
    format: ["esm"],
    platform: "node",
    banner: { js: "#!/usr/bin/env node" },
    noExternal: ["charpente"],
  },
  {
    entry: { client: "src/client/main.ts" },
    format: ["iife"],
    platform: "browser",
    noExternal: ["charpente"],
    outExtension: () => ({ js: ".js" }),
  },
  {
    entry: { themes: "src/client/themes.ts" },
    format: ["iife"],
    platform: "browser",
    noExternal: ["charpente"],
    outExtension: () => ({ js: ".js" }),
  },
  {
    entry: { generator: "src/generator/index.ts" },
    format: ["esm"],
    platform: "browser",
    dts: true,
    noExternal: ["charpente"],
  },
])
