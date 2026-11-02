import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { themeSource, type ThemeForm } from './theme-file'

export const listThemes = (root: string, dir: string): string[] => {
  const base = resolve(root, dir)
  if (!existsSync(base)) return []
  return readdirSync(base, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(resolve(base, entry.name, 'theme.ts')))
    .map((entry) => entry.name)
    .sort()
}

export const saveTheme = (root: string, dir: string, form: ThemeForm): string => {
  const folder = resolve(root, dir, form.name)
  mkdirSync(folder, { recursive: true })
  const file = resolve(folder, 'theme.ts')
  writeFileSync(file, themeSource(form))
  return file
}
