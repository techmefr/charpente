import { PAINT_TYPES, type Paint, type PaintType, type ThemeDef, type Tokens } from '../types'
import { expandTheme } from './short-format'

export interface ResolvedTheme {
  tokens: Tokens
  dark: Tokens
  paint: Partial<Record<PaintType, Paint>>
}

const mergePaint = (
  base: Partial<Record<PaintType, Paint>>,
  extra: Partial<Record<PaintType, Paint>> = {},
): Partial<Record<PaintType, Paint>> => {
  const merged: Partial<Record<PaintType, Paint>> = { ...base }
  for (const type of PAINT_TYPES) {
    const override = extra[type]
    if (!override) continue
    merged[type] = {
      ...base[type],
      ...override,
      style: { ...base[type]?.style, ...override.style },
    }
  }
  return merged
}

export const resolveTheme = (
  name: string,
  themes: Record<string, ThemeDef>,
  chain: string[] = [],
): ResolvedTheme => {
  const source = themes[name]
  if (!source) throw new Error(`charpente: unknown theme "${name}"`)
  const def = expandTheme(source)
  if (chain.includes(name)) throw new Error(`charpente: theme "${name}" extends itself`)
  const parent = def.extends
    ? resolveTheme(def.extends, themes, [...chain, name])
    : { tokens: {}, dark: {}, paint: {} }
  return {
    tokens: { ...parent.tokens, ...def.tokens },
    dark: { ...parent.dark, ...def.dark },
    paint: mergePaint(parent.paint, def.paint),
  }
}
