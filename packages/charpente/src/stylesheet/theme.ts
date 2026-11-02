import { declarations, flat, splitTopLevel, tokenDeclarations } from '../css'
import { resolveTheme } from '../themes'
import { PAINT_TYPES, type CharpenteConfig, type Paint, type PaintType, type ThemeDef } from '../types'
import { LOADING, TYPE_SELECTORS, within } from './selectors'
import { darkThemeTokens } from './tokens'

const paintRule = (type: PaintType, paint: Paint, scopes: string[]): string => {
  const layers = splitTopLevel(paint.fill ?? flat('var(--charpente-base)'))
  const sizes = paint.size ? splitTopLevel(paint.size) : []
  const sizeList = layers.map((_, index) => sizes[index] ?? 'auto')
  const body = [
    'background-color: transparent !important',
    `background-image: var(--charpente-shine-layer, none), ${layers.join(', ')} !important`,
    `background-size: 60% 100%, ${sizeList.join(', ')} !important`,
    `background-repeat: no-repeat, ${layers.map(() => 'repeat').join(', ')} !important`,
    `background-position: var(--charpente-shine-x, -80%) 0, ${layers.map(() => '0 0').join(', ')} !important`,
    `background-attachment: var(--charpente-shine-attachment, scroll), ${layers.map(() => 'scroll').join(', ')} !important`,
    ...(type === 'text'
      ? ['background-clip: content-box !important', 'background-origin: content-box !important']
      : []),
    declarations(paint.style),
  ]
    .filter(Boolean)
    .join(';\n  ')
  return `${within(scopes, TYPE_SELECTORS[type])} {\n  ${body};\n}`
}

export const themeCss = (
  name: string,
  isDefault: boolean,
  themes: Record<string, ThemeDef>,
  scheme: CharpenteConfig['colorScheme'],
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
  return blocks.join('\n')
}
