import { tokenDeclarations } from '../css'
import { resolveTheme } from '../themes'
import { PAINT_TYPES, type CharpenteConfig, type ShapeDef, type ThemeDef } from '../types'
import { hoverCss } from './hover'
import { CAPTURED_SLOTS, LOADING, TYPE_SELECTORS } from './selectors'
import { hoverOverlays, shapePalette, typedRule } from './shaped'
import { darkThemeTokens } from './tokens'

export const themeCss = (
  name: string,
  isDefault: boolean,
  themes: Record<string, ThemeDef>,
  scheme: CharpenteConfig['colorScheme'],
  captured = false,
  shapes: Record<string, ShapeDef> = {},
): string => {
  const resolved = resolveTheme(name, themes)
  const scopes = [`${LOADING}[data-charpente-theme="${name}"]`]
  if (isDefault) scopes.push(`${LOADING}:not([data-charpente-theme])`)
  const palette = shapePalette(resolved, scheme)
  const rule = (type: (typeof PAINT_TYPES)[number], selector = TYPE_SELECTORS[type]): string =>
    typedRule(type, resolved.paint[type] ?? {}, scopes, selector, { shapes, palette, scheme })

  const blocks: string[] = []
  if (resolved.backdrop) blocks.push(`${scopes.join(',\n')} {\n  background: ${resolved.backdrop};\n}`)
  if (Object.keys(resolved.tokens).length > 0) {
    blocks.push(`${scopes.join(',\n')} {\n  ${tokenDeclarations(resolved.tokens)};\n}`)
  }
  if (Object.keys(resolved.dark).length > 0) {
    blocks.push(darkThemeTokens(scopes, resolved.dark, scheme))
  }
  for (const type of PAINT_TYPES) blocks.push(rule(type))
  if (captured) {
    const [text, media] = CAPTURED_SLOTS as [string, string]
    blocks.push(rule('text', text), rule('media', media))
  }
  const overlays = hoverOverlays(resolved.paint, shapes, palette)
  blocks.push(hoverCss(scopes, resolved.hover, resolved.hoverMotion, captured, overlays))
  return blocks.filter(Boolean).join('\n')
}
