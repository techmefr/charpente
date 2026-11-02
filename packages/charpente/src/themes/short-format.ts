import { builtinPatterns } from './patterns'
import { PAINT_TYPES, type BorderImage, type Declarations, type Paint, type PaintType, type PatternDef, type Stepped, type ThemeDef } from '../types'

const SCALED_TYPES: PaintType[] = ['media', 'block']
const DEFAULT_SCALE = 1.15

const resolvePattern = (pattern: string | PatternDef): PatternDef => {
  if (typeof pattern !== 'string') return pattern
  const found = builtinPatterns[pattern]
  if (!found) throw new Error(`charpente: unknown pattern "${pattern}"`)
  return found
}

const DEFAULT_BORDER_WIDTH = '12px'
const DEFAULT_BORDER_SLICE = 30

const imageUrl = (image: string): string => {
  const source = image.trim()
  if (source.startsWith('<')) return `url("data:image/svg+xml,${encodeURIComponent(source).replace(/'/g, '%27')}")`
  if (source.startsWith('url(')) return source
  throw new Error(`charpente: border image "${image}" is neither SVG markup nor url(...)`)
}

const borderDeclarations = (border: string | BorderImage): Declarations => {
  if (typeof border === 'string') return { border }
  const width = border.width ?? DEFAULT_BORDER_WIDTH
  return {
    boxSizing: 'border-box',
    borderStyle: 'solid !important',
    borderWidth: `${width} !important`,
    borderImage: `${imageUrl(border.image)} ${border.slice ?? DEFAULT_BORDER_SLICE} / ${width} ${border.repeat ?? 'round'} !important`,
  }
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
        ...(def.border && borderDeclarations(def.border)),
        ...Object.fromEntries(Object.entries(def.style ?? {}).map(([property, value]) => [property, at(value, step)])),
      },
    }
    const override = def.paint?.[type]
    paint[type] = { ...base, ...override, style: { ...base.style, ...override?.style } }
  }
  return { ...def, tokens, paint }
}
