import type { Declarations, HoverDef, HoverPaint, Paint, PaintType, ThemeDef, Tokens } from 'charpente/lite'
import { BORDER_KEYS, borderDeclarations, colorValue } from './borders'
import { findFill } from './presets'
import { COLOR_KEYS, LEAVES, TOKENS, normalizeState, type GeneratorState, type LeafState } from './state'

const IMAGE = /^(linear|radial|conic|repeating|url|image|-webkit)/

export const flat = (color: string): string => `linear-gradient(${color}, ${color})`

export const hoverFill = (value: string): string => {
  if (TOKENS.some((token) => token === value)) return flat(`var(--charpente-${value})`)
  return IMAGE.test(value) ? value : flat(value)
}

const sameLeaf = (a: LeafState, b: LeafState): boolean => JSON.stringify(a) === JSON.stringify(b)

export const fillOf = (leaf: LeafState): { fill?: string; size?: string } => {
  if (leaf.fill === 'custom') return { fill: leaf.custom, ...(leaf.size && { size: leaf.size }) }
  const preset = findFill(leaf.fill)
  if (!preset) return {}
  return { fill: preset.fill, ...(preset.size && { size: preset.size }) }
}

export const styleOf = (leaf: LeafState): Declarations => ({
  ...(leaf.radius && { borderRadius: leaf.radius }),
  ...(leaf.clip && { clipPath: leaf.clip }),
  ...borderDeclarations(leaf.border),
})

const paintOf = (leaf: LeafState): Paint => {
  const style = styleOf(leaf)
  return { ...fillOf(leaf), ...(Object.keys(style).length > 0 && { style }) }
}

const isToken = (value: string): boolean => TOKENS.some((token) => token === value)
const isShortHover = (value: string): boolean => isToken(value) || (value !== '' && !IMAGE.test(value))

const hoverOf = (state: GeneratorState): HoverDef | undefined => {
  const values = LEAVES.map((type) => state.leaves[type].hover)
  const first = values[0] as string
  if (first && values.every((value) => value === first) && isShortHover(first)) return first
  const entries = LEAVES.filter((type) => state.leaves[type].hover).map((type) => [type, { fill: hoverFill(state.leaves[type].hover) } as HoverPaint])
  return entries.length > 0 ? (Object.fromEntries(entries) as HoverDef) : undefined
}

const colorsOf = (state: GeneratorState): Pick<ThemeDef, 'tokens' | 'dark'> => {
  if (state.siteColors) return {}
  const pick = (mode: 'light' | 'dark'): Tokens => Object.fromEntries(COLOR_KEYS.map((key) => [key, state.colors[mode][key]]))
  return { tokens: pick('light'), dark: pick('dark') }
}

const shortTheme = (leaf: LeafState): ThemeDef => {
  const style: Declarations = { ...(leaf.clip && { clipPath: leaf.clip }) }
  const border = borderDeclarations(leaf.border)
  const text = typeof border.border === 'string' && Object.keys(border).length === 1
  for (const key of BORDER_KEYS) if (border[key] && !text) style[key] = border[key]
  const preset = findFill(leaf.fill)
  const { fill, size } = fillOf(leaf)
  return {
    ...(leaf.fill && (preset?.short ? { pattern: preset.id } : fill && { pattern: { fill, ...(size && { size }) } })),
    ...(leaf.radius && { radius: leaf.radius }),
    ...(text && { border: border.border }),
    ...(Object.keys(style).length > 0 && { style }),
  }
}

export const stateToTheme = (input: GeneratorState): ThemeDef => {
  const state = normalizeState(input)
  const first = state.leaves.text
  const uniform = !state.extends && LEAVES.every((type) => sameLeaf(state.leaves[type], first))
  const paint = Object.fromEntries(LEAVES.map((type) => [type, paintOf(state.leaves[type])]).filter(([, value]) => Object.keys(value as Paint).length > 0))
  const hover = hoverOf(state)
  return {
    ...(state.extends && { extends: state.extends }),
    ...colorsOf(state),
    ...(uniform ? shortTheme(first) : Object.keys(paint).length > 0 && { paint: paint as Partial<Record<PaintType, Paint>> }),
    ...(hover !== undefined && { hover }),
    ...(state.hoverMotion !== 'inherit' && !(state.hoverMotion === 'none' && !state.extends) && { hoverMotion: state.hoverMotion }),
  }
}

export { colorValue }
