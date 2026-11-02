import { existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { createJiti } from 'jiti'
import type { ThemeDef } from './types'

const THEME_FILES = ['theme.ts', 'theme.mts', 'theme.js', 'theme.mjs']

export const themeFiles = (root: string, dir = 'themes'): Record<string, string> => {
  const base = resolve(root, dir)
  if (!existsSync(base)) return {}
  const files: Record<string, string> = {}
  for (const entry of readdirSync(base, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const file = THEME_FILES.map((name) => resolve(base, entry.name, name)).find(existsSync)
    if (file) files[entry.name] = file
  }
  return files
}

export const discoverThemes = async (root: string, dir = 'themes'): Promise<Record<string, ThemeDef>> => {
  const jiti = createJiti(import.meta.url, { moduleCache: false })
  const themes: Record<string, ThemeDef> = {}
  for (const [name, file] of Object.entries(themeFiles(root, dir))) {
    const loaded = await jiti.import<{ default?: ThemeDef } | ThemeDef>(file)
    themes[name] = 'default' in loaded && loaded.default ? loaded.default : (loaded as ThemeDef)
  }
  return themes
}
