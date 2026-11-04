import type { ThemeDef, Tokens } from '../types'
import { assertAvailable } from './available'
import { builtinThemes } from './builtin'
import { DEFAULT_TOKENS } from './default-tokens'
import { resolveTheme } from './resolve'
import { withVariants } from './variants'

const EM_IN_PIXELS = 16
const DEFAULT_RADIUS = 0.35 * EM_IN_PIXELS

export interface NativeColors {
  base: string
  strong: string
  shine: string
}

export interface NativeTheme {
  light: NativeColors
  dark: NativeColors
  radius: number
}

const colorsOf = (tokens: Tokens, fallback: Required<Tokens>): NativeColors => {
  const pick = (key: 'base' | 'strong' | 'shine'): string => {
    const value = tokens[key]
    return value && !value.includes('var(') ? value : fallback[key]
  }
  return { base: pick('base'), strong: pick('strong'), shine: pick('shine') }
}

const radiusOf = (value: string | undefined): number => {
  const match = /^(\d+(?:\.\d+)?)(px|em|rem)?$/.exec(value?.trim() ?? '')
  if (!match) return Math.round(DEFAULT_RADIUS)
  const amount = Number(match[1])
  return Math.round(match[2] === 'em' || match[2] === 'rem' ? amount * EM_IN_PIXELS : amount)
}

export const createNativeTheme =
  (registry: Record<string, ThemeDef>, onlyRegistry = false) =>
  (name: string, themes: Record<string, ThemeDef> = {}): NativeTheme => {
    const all = withVariants({ ...registry, ...themes })
    if (onlyRegistry) assertAvailable([name], all)
    const resolved = resolveTheme(name, all)
    return {
      light: colorsOf(resolved.tokens, DEFAULT_TOKENS.light),
      dark: colorsOf({ ...resolved.tokens, ...resolved.dark }, DEFAULT_TOKENS.dark),
      radius: radiusOf(resolved.paint.text?.style?.borderRadius),
    }
  }

export const nativeTheme = (name: string, themes: Record<string, ThemeDef> = {}): NativeTheme =>
  createNativeTheme(builtinThemes)(name, themes)
