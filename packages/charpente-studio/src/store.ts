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

export const writeTheme = (root: string, dir: string, name: string, source: string, overwrite = false): string => {
  const folder = resolve(themeBase(root, dir), name)
  const file = resolve(folder, 'theme.ts')
  mkdirSync(folder, { recursive: true })
  try {
    writeFileSync(file, source, { flag: overwrite ? 'w' : 'wx' })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
      throw new ThemeExistsError(`charpente-studio: the theme "${name}" already exists`)
    }
    throw error
  }
  return file
}

export const saveTheme = (root: string, dir: string, form: ThemeForm, overwrite = false): string =>
  writeTheme(root, dir, form.name, themeSource(form), overwrite)
