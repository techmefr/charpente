import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
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

export const themeAssets = (root: string, dir = 'themes'): string[] =>
  Object.values(themeFiles(root, dir)).flatMap((file) =>
    readdirSync(dirname(file))
      .filter((name) => name.endsWith('.svg'))
      .map((name) => resolve(dirname(file), name)),
  )

const inlineBorder = (def: ThemeDef, directory: string): ThemeDef => {
  const variants = def.variants && Object.fromEntries(Object.entries(def.variants).map(([name, variant]) => [name, inlineBorder(variant, directory)]))
  const border = def.border
  const resolved =
    typeof border === 'object' && !/^\s*(<|url\()/.test(border.image)
      ? { ...border, image: readFileSync(resolve(directory, border.image), 'utf8') }
      : border
  return { ...def, ...(resolved !== undefined && { border: resolved }), ...(variants && { variants }) }
}

export const discoverThemes = async (root: string, dir = 'themes'): Promise<Record<string, ThemeDef>> => {
  const jiti = createJiti(import.meta.url, { moduleCache: false })
  const themes: Record<string, ThemeDef> = {}
  for (const [name, file] of Object.entries(themeFiles(root, dir))) {
    const loaded = await jiti.import<{ default?: ThemeDef } | ThemeDef>(file)
    const def = 'default' in loaded && loaded.default ? loaded.default : (loaded as ThemeDef)
    themes[name] = inlineBorder(def, dirname(file))
  }
  return themes
}
