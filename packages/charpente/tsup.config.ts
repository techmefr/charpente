import { defineConfig, type Options } from 'tsup'

const PURE_CALL = /(?<![\w$.])(?:flat|lines|motif|tint\d*|createGlassTheme|buildTheme|createCompiler|createNativeTheme)\(/g
const ANNOTATION = '/* @__PURE__ */ '

const plugins: Options['plugins'] = [
  {
    name: 'annotate-pure-calls',
    renderChunk: (code) => ({ code: code.replace(PURE_CALL, (call) => `${ANNOTATION}${call}`) }),
  },
]

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/dom.ts', 'src/loader.ts', 'src/vite.ts', 'src/cli.ts'],
    format: ['esm'],
    dts: true,
    clean: true,
    plugins,
  },
  {
    entry: { lite: 'src/lite.ts', themes: 'src/theme-exports.ts' },
    format: ['esm'],
    dts: true,
    splitting: false,
    plugins,
  },
])
