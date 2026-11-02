import { existsSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { createJiti } from 'jiti'
import type { Plugin, ViteDevServer } from 'vite'
import { compile } from './stylesheet'
import { discoverThemes, themeAssets, themeFiles } from './discovery'
import type { CharpenteConfig } from './types'

const VIRTUAL_ID = 'virtual:charpente.css'
const THEME_ID = 'virtual:charpente.theme'

export interface CharpenteViteOptions {
  config?: CharpenteConfig
  configFile?: string
}

const findConfig = (from: string, fileName: string): string | undefined => {
  let directory = resolve(from)
  while (true) {
    const candidate = resolve(directory, fileName)
    if (existsSync(candidate)) return candidate
    const parent = dirname(directory)
    if (parent === directory) return undefined
    directory = parent
  }
}

export function charpente(options: CharpenteViteOptions = {}): Plugin {
  let configPath: string | undefined
  let root = process.cwd()

  const loadConfig = async (): Promise<CharpenteConfig> => {
    if (options.config) return options.config
    if (!configPath) return {}
    const jiti = createJiti(import.meta.url, { moduleCache: false })
    const loaded = await jiti.import<{ default?: CharpenteConfig } | CharpenteConfig>(configPath)
    return 'default' in loaded && loaded.default ? loaded.default : (loaded as CharpenteConfig)
  }

  const readConfig = async (): Promise<CharpenteConfig> => {
    const config = await loadConfig()
    const discovered = await discoverThemes(root, config.themesDir)
    return { ...config, themes: { ...discovered, ...config.themes } }
  }

  const themesRoot = async (): Promise<string> => resolve(root, (await loadConfig()).themesDir ?? 'themes')

  const isThemeFile = async (file: string): Promise<boolean> => {
    const path = relative(await themesRoot(), file)
    return path !== '' && !path.startsWith('..')
  }

  const invalidate = (server: ViteDevServer): void => {
    for (const id of [VIRTUAL_ID, THEME_ID]) {
      const module = server.moduleGraph.getModuleById(id)
      if (module) server.moduleGraph.invalidateModule(module)
    }
    server.ws.send({ type: 'full-reload' })
  }

  return {
    name: 'charpente',
    configResolved(resolved) {
      root = resolved.root
      configPath = findConfig(resolved.root, options.configFile ?? 'charpente.config.ts')
    },
    resolveId(id) {
      return id === VIRTUAL_ID || id === THEME_ID ? id : undefined
    },
    async load(id) {
      if (id !== VIRTUAL_ID && id !== THEME_ID) return undefined
      if (configPath) this.addWatchFile(configPath)
      const config = await readConfig()
      for (const file of [...Object.values(themeFiles(root, config.themesDir)), ...themeAssets(root, config.themesDir)]) this.addWatchFile(file)
      if (id === THEME_ID) {
        const { defaultTheme, timeZone, schedule } = config
        return [
          `import { themeAt } from 'charpente'`,
          `const config = ${JSON.stringify({ defaultTheme, timeZone, schedule })}`,
          `export const activeTheme = (date) => themeAt(config, date)`,
        ].join('\n')
      }
      const { css, warnings } = compile(config)
      for (const warning of warnings) this.warn(warning)
      return css
    },
    async configureServer(server) {
      server.watcher.add(await themesRoot())
      const reload = async (file: string): Promise<void> => {
        if (await isThemeFile(file)) invalidate(server)
      }
      for (const event of ['add', 'unlink', 'addDir', 'unlinkDir'] as const) server.watcher.on(event, reload)
    },
    async handleHotUpdate({ file, server }) {
      if (file !== configPath && !(await isThemeFile(file))) return undefined
      invalidate(server)
      return []
    },
  }
}
