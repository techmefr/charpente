import { existsSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { createJiti } from 'jiti'
import type { Plugin, ViteDevServer } from 'vite'
import { bonesPath, captureBones, createCapturer, isCaptureTrigger, readBones, withOptions, writeChangedBones } from './capturing'
import { transformInitial } from './loading'
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

const invalidate = (server: ViteDevServer): void => {
  for (const id of [VIRTUAL_ID, THEME_ID]) {
    const module = server.moduleGraph.getModuleById(id)
    if (module) server.moduleGraph.invalidateModule(module)
  }
  server.ws.send({ type: 'full-reload' })
}

const watchCapture =(server: ViteDevServer, root: string, config: CharpenteConfig): void => {
  const http = server.httpServer
  if (!config.capture || config.capture.dev === false || !http) return
  const capture = withOptions(config.capture, {})
  const bones = bonesPath(root, config)
  const capturer = createCapturer(
    async () => {
      const address = http.address()
      const origin = capture.url ?? (typeof address === 'object' && address ? `http://localhost:${address.port}` : undefined)
      if (origin) writeChangedBones(root, config, await captureBones(origin, capture))
    },
    (message) => server.config.logger.warn(message),
  )
  http.once('listening', () => void capturer.run())
  server.watcher.on('change', (file) => {
    if (isCaptureTrigger(file, bones)) capturer.schedule()
  })
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
    return { ...config, themes: { ...discovered, ...config.themes }, bones: config.bones ?? readBones(root, config) }
  }

  const themesRoot = async (): Promise<string> => resolve(root, (await loadConfig()).themesDir ?? 'themes')

  const isThemeFile = async (file: string): Promise<boolean> => {
    const path = relative(await themesRoot(), file)
    return path !== '' && !path.startsWith('..')
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
      this.addWatchFile(bonesPath(root, config))
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
    async transformIndexHtml(html) {
      return transformInitial(html, (await loadConfig()).initial)
    },
    async configureServer(server) {
      server.watcher.add(await themesRoot())
      const reload = async (file: string): Promise<void> => {
        if (await isThemeFile(file)) invalidate(server)
      }
      for (const event of ['add', 'unlink', 'addDir', 'unlinkDir'] as const) server.watcher.on(event, reload)
      watchCapture(server, root, await readConfig())
    },
    async handleHotUpdate({ file, server }) {
      if (file !== configPath && !(await isThemeFile(file)) && file !== bonesPath(root, await loadConfig())) return undefined
      invalidate(server)
      return []
    },
  }
}
