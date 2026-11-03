import { tokenDeclarations } from '../css'
import { resolveTheme } from '../themes'
import { PAINT_TYPES, type CharpenteConfig, type ThemeDef } from '../types'
import { hoverCss } from './hover'
import { paintRule } from './paint'
import { CAPTURED_SLOTS, LOADING } from './selectors'
import { darkThemeTokens } from './tokens'

export const themeCss = (
  name: string,
  isDefault: boolean,
  themes: Record<string, ThemeDef>,
  scheme: CharpenteConfig['colorScheme'],
  captured = false,
): string => {
  const resolved = resolveTheme(name, themes)
  const scopes = [`${LOADING}[data-charpente-theme="${name}"]`]
  if (isDefault) scopes.push(`${LOADING}:not([data-charpente-theme])`)

  const blocks: string[] = []
  if (Object.keys(resolved.tokens).length > 0) {
    blocks.push(`${scopes.join(',\n')} {\n  ${tokenDeclarations(resolved.tokens)};\n}`)
  }
  if (Object.keys(resolved.dark).length > 0) {
    blocks.push(darkThemeTokens(scopes, resolved.dark, scheme))
  }
  for (const type of PAINT_TYPES) blocks.push(paintRule(type, resolved.paint[type] ?? {}, scopes))
  if (captured) {
    const [text, media] = CAPTURED_SLOTS as [string, string]
    blocks.push(paintRule('text', resolved.paint.text ?? {}, scopes, text))
    blocks.push(paintRule('media', resolved.paint.media ?? {}, scopes, media))
  }
  blocks.push(hoverCss(scopes, resolved.hover, resolved.hoverMotion, captured))
  return blocks.filter(Boolean).join('\n')
}
