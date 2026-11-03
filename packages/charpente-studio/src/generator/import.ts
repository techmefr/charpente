import type { Declarations, HoverPaint, Paint, PaintType, ThemeDef } from 'charpente/lite'
import { BORDER_KEYS, parseBorder } from './borders'
import { FILLS, findFill } from './presets'
import { parseLiteral, type Literal } from './literal'
import { COLOR_KEYS, LEAVES, normalizeState, startState, tokenOf, type GeneratorState, type LeafState } from './state'
import { sanitizeState } from './validate'

export interface ImportResult {
  state: GeneratorState
  ignored: string[]
}

const FLAT = /^linear-gradient\((.+), \1\)$/

const unflat = (fill: string): string => {
  const match = FLAT.exec(fill)
  return match ? tokenOf(match[1] as string) : fill
}

const objectOf = (value: Literal | undefined): Record<string, Literal> =>
  typeof value === 'object' && value !== null && !Array.isArray(value) ? value : {}

const textOf = (value: Literal | undefined): string | undefined => (typeof value === 'string' ? value : undefined)

const extract = (source: string): Literal => {
  const start = /defineTheme\s*\(/.exec(source)
  const body = start ? source.slice(start.index + start[0].length) : source.slice(source.indexOf('{'))
  if (!body.includes('{')) throw new Error('charpente-studio: no theme object found in this file')
  return parseLiteral(body)
}

const asPaint = (def: ThemeDef): Record<PaintType, Paint> => {
  const style: Declarations = { ...(def.radius && typeof def.radius === 'string' && { borderRadius: def.radius }) }
  if (typeof def.border === 'string') style.border = def.border
  Object.assign(style, def.style)
  const pattern = def.pattern
  const base: Paint = {
    ...(typeof pattern === 'string' && findFill(pattern) && { fill: (findFill(pattern) as { fill: string }).fill, size: (findFill(pattern) as { size: string }).size }),
    ...(typeof pattern === 'object' && { fill: pattern.fill as string, ...(pattern.size && { size: pattern.size as string }) }),
    style,
  }
  return Object.fromEntries(LEAVES.map((type) => [type, { ...base, ...def.paint?.[type], style: { ...base.style, ...def.paint?.[type]?.style } }])) as Record<PaintType, Paint>
}

const applyPaint = (leaf: LeafState, paint: Paint, ignored: string[]): void => {
  const style = { ...paint.style }
  if (paint.fill) {
    const preset = FILLS.find((item) => item.fill === paint.fill && item.size === (paint.size ?? ''))
    Object.assign(leaf, preset ? { fill: preset.id } : { fill: 'custom', custom: paint.fill, size: paint.size ?? '' })
  }
  if (style.borderRadius) leaf.radius = style.borderRadius
  if (style.clipPath) leaf.clip = style.clipPath
  const border = parseBorder(style)
  if (border) leaf.border = border
  for (const key of ['borderRadius', 'clipPath', ...BORDER_KEYS]) delete style[key]
  ignored.push(...Object.keys(style))
}

const applyHover = (state: GeneratorState, def: ThemeDef, ignored: string[]): void => {
  const hover = def.hover
  if (typeof hover === 'string') for (const type of LEAVES) state.leaves[type].hover = tokenOf(hover)
  if (typeof hover === 'object') {
    for (const type of LEAVES) {
      const paint = hover[type] as HoverPaint | undefined
      if (paint?.fill) state.leaves[type].hover = unflat(paint.fill)
      if (paint) ignored.push(...Object.keys(paint).filter((key) => key !== 'fill'))
    }
  }
  if (def.hoverMotion) state.hoverMotion = def.hoverMotion
}

const unsupported = (def: ThemeDef): string[] => [
  ...(def.colors ? ['colors'] : []),
  ...(def.variants ? ['variants'] : []),
  ...(def.scale !== undefined ? ['scale'] : []),
  ...(typeof def.border === 'object' ? ['border'] : []),
  ...(typeof def.pattern === 'string' && !findFill(def.pattern) ? [`pattern ${def.pattern}`] : []),
]

export const defToState = (def: ThemeDef, name: string): ImportResult => {
  const ignored: string[] = []
  const state = startState(def.extends ?? '', name)
  const paint = asPaint(def)
  for (const type of LEAVES) applyPaint(state.leaves[type], paint[type], ignored)
  applyHover(state, def, ignored)
  if (def.tokens || def.dark) {
    state.siteColors = false
    for (const key of COLOR_KEYS) {
      if (def.tokens?.[key]) state.colors.light[key] = def.tokens[key] as string
      if (def.dark?.[key]) state.colors.dark[key] = def.dark[key] as string
    }
  }
  ignored.push(...unsupported(def))
  return { state: normalizeState(sanitizeState({ ...state })), ignored: [...new Set(ignored)] }
}

export const sourceToState = (source: string, name: string): ImportResult => {
  const literal = objectOf(extract(source))
  const def = literal as unknown as ThemeDef
  if (textOf(literal.extends) === undefined && literal.extends !== undefined) throw new Error('charpente-studio: extends must be a theme name')
  return defToState(def, name)
}
