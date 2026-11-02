import { builtinPatterns } from './patterns'
import type { Paint, PaintType, PatternDef, Stepped, ThemeDef } from './types'

const PAINT_TYPES: PaintType[] = ['text', 'media', 'control', 'block']
const SCALED_TYPES: PaintType[] = ['media', 'block']
const DEFAULT_SCALE = 1.15

const resolvePattern = (pattern: string | PatternDef): PatternDef => {
  if (typeof pattern !== 'string') return pattern
  const found = builtinPatterns[pattern]
  if (!found) throw new Error(`charpente: unknown pattern "${pattern}"`)
  return found
}

const at = <T>(value: Stepped<T>, step: number): T => (typeof value === 'function' ? (value as (step: number) => T)(step) : value)

export const expandTheme = (def: ThemeDef): ThemeDef => {
  if (!def.colors && !def.pattern && !def.border && !def.radius && !def.style) return def
  const tokens = def.colors ? { base: def.colors[0], strong: def.colors[1], ...def.tokens } : def.tokens
  const pattern = def.pattern ? resolvePattern(def.pattern) : undefined
  const scale = def.scale ?? DEFAULT_SCALE
  const paint: Partial<Record<PaintType, Paint>> = {}
  for (const type of PAINT_TYPES) {
    const step = SCALED_TYPES.includes(type) ? scale : 1
    const base: Paint = {
      ...(pattern && { fill: at(pattern.fill, step), ...(pattern.size && { size: at(pattern.size, step) }) }),
      style: {
        borderRadius: def.radius ? at(def.radius, step) : 'var(--charpente-radius)',
        ...(def.border && { border: def.border }),
        ...Object.fromEntries(Object.entries(def.style ?? {}).map(([property, value]) => [property, at(value, step)])),
      },
    }
    const override = def.paint?.[type]
    paint[type] = { ...base, ...override, style: { ...base.style, ...override?.style } }
  }
  return { ...def, tokens, paint }
}
