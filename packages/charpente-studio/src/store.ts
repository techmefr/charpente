import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { relative, resolve, isAbsolute } from 'node:path'
import { themeSource, type ThemeForm } from './theme-file'

export class ThemeExistsError extends Error {}

export const themeBase = (root: string, dir: string): string => {
  const base = resolve(root, dir)
  const path = relative(resolve(root), base)
  if (path.startsWith('..') || isAbsolute(path)) throw new Error(`charpente-studio: the folder "${dir}" must stay inside ${resolve(root)}`)
  return base
}

export const listThemes = (root: string, dir: string): string[] => {
  const base = themeBase(root, dir)
  if (!existsSync(base)) return []
  return readdirSync(base, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(resolve(base, entry.name, 'theme.ts')))
    .map((entry) => entry.name)
    .sort()
}

export const saveTheme = (root: string, dir: string, form: ThemeForm, overwrite = false): string => {
  const folder = resolve(themeBase(root, dir), form.name)
  const file = resolve(folder, 'theme.ts')
  if (existsSync(file) && !overwrite) throw new ThemeExistsError(`charpente-studio: the theme "${form.name}" already exists`)
  mkdirSync(folder, { recursive: true })
  writeFileSync(file, themeSource(form))
  return file
}
