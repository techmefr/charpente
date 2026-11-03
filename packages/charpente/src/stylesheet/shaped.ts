import { DEFAULT_TOKENS, type ResolvedTheme } from '../themes'
import { maskDeclarations, resolveShape, shapeOverlay, type ShapeColors } from '../shapes'
import type { CharpenteConfig, Paint, PaintType, ShapeDef, Tokens } from '../types'
import { fillDeclarations, paintRule, type Shaped } from './paint'
import { TYPE_SELECTORS } from './selectors'
import { darkRule } from './tokens'

export interface ShapePalette {
  light: ShapeColors
  dark: ShapeColors
}

const colorsOf = (tokens: Tokens, fallback: Required<Tokens>): ShapeColors => {
  const pick = (value: string | undefined, standard: string): string => (value && !value.includes('var(') ? value : standard)
  return { accent: pick(tokens.accent, fallback.accent), accent2: pick(tokens.accent2, fallback.accent2) }
}

export const shapePalette = (resolved: ResolvedTheme, scheme: CharpenteConfig['colorScheme']): ShapePalette => ({
  light: colorsOf({ ...DEFAULT_TOKENS.light, ...scheme?.tokens?.light, ...resolved.tokens }, DEFAULT_TOKENS.light),
  dark: colorsOf({ ...DEFAULT_TOKENS.dark, ...scheme?.tokens?.dark, ...resolved.tokens, ...resolved.dark }, DEFAULT_TOKENS.dark),
})

export const typedRule = (
  type: PaintType,
  paint: Paint,
  scopes: string[],
  selector: string,
  context: { shapes: Record<string, ShapeDef>; palette: ShapePalette; scheme: CharpenteConfig['colorScheme'] },
): string => {
  const shape = resolveShape(paint.shape, context.shapes)
  if (!shape) return paintRule(type, paint, scopes, selector)
  const light = shapeOverlay(shape, context.palette.light)
  const rule = paintRule(type, paint, scopes, selector, { shaped: { overlay: light }, mask: maskDeclarations(shape) })
  const dark = shapeOverlay(shape, context.palette.dark)
  if (!light || !dark || dark.image === light.image) return rule
  const image = fillDeclarations(type, paint, { overlay: dark }).find((line) => line.startsWith('background-image')) as string
  const selectors = scopes.map((scope) => `${scope} ${selector}`)
  return `${rule}\n${darkRule(selectors, image, context.scheme)}`
}

export const hoverOverlays = (
  paint: Partial<Record<PaintType, Paint>>,
  shapes: Record<string, ShapeDef>,
  palette: ShapePalette,
): Partial<Record<PaintType, Shaped>> => {
  const overlays: Partial<Record<PaintType, Shaped>> = {}
  for (const type of Object.keys(TYPE_SELECTORS) as PaintType[]) {
    const shape = resolveShape(paint[type]?.shape, shapes)
    if (shape) overlays[type] = { overlay: shapeOverlay(shape, palette.light) }
  }
  return overlays
}
