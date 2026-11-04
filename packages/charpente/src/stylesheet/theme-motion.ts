import { normalizeMotion } from '../motions'
import { resolveTheme } from '../themes'
import type { MotionDef, ThemeDef } from '../types'
import { LOADING } from './selectors'

export interface ThemeMotion {
  scopes: string[]
  names: string[]
}

export const themeMotions = (
  themeNames: string[],
  themes: Record<string, ThemeDef>,
  motions: Record<string, MotionDef>,
  defaultTheme: string,
): ThemeMotion[] =>
  themeNames.flatMap((name) => {
    const motion = resolveTheme(name, themes).motion
    if (!motion || motion.length === 0) return []
    const idle = ':not([data-charpente-motion])'
    const scopes = [`${LOADING}[data-charpente-theme="${name}"]${idle}`]
    if (name === defaultTheme) scopes.push(`${LOADING}:not([data-charpente-theme])${idle}`)
    return [{ scopes, names: normalizeMotion(motion, motions) }]
  })
