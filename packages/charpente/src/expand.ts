import { builtinPatterns } from './patterns'
import type { Paint, PaintType, PatternDef, ThemeDef } from './types'

const PAINT_TYPES: PaintType[] = ['text', 'media', 'control', 'block']

const resolvePattern = (pattern: string | PatternDef): PatternDef => {
  if (typeof pattern !== 'string') return pattern
  const found = builtinPatterns[pattern]
  if (!found) throw new Error(`charpente: unknown pattern "${pattern}"`)
  return found
}

export const expandTheme = (def: ThemeDef): ThemeDef => {
  if (!def.colors && !def.pattern && !def.border) return def
  const tokens = def.colors ? { base: def.colors[0], strong: def.colors[1], ...def.tokens } : def.tokens
  const pattern = def.pattern ? resolvePattern(def.pattern) : undefined
  const paint: Partial<Record<PaintType, Paint>> = {}
  for (const type of PAINT_TYPES) {
    paint[type] = {
      ...(pattern && { fill: pattern.fill, ...(pattern.size && { size: pattern.size }) }),
      style: { borderRadius: 'var(--charpente-radius)', ...(def.border && { border: def.border }) },
      ...def.paint?.[type],
    }
  }
  return { ...def, tokens, paint }
}
