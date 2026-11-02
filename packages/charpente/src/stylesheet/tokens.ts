import { tokenDeclarations } from '../css'
import type { CharpenteConfig, Tokens } from '../types'

const DEFAULT_TOKENS: { light: Required<Tokens>; dark: Required<Tokens> } = {
  light: {
    base: '#e5e7eb',
    strong: '#c4c8d0',
    shine: 'rgba(255, 255, 255, 0.7)',
    accent: '#0891b2',
    accent2: '#c026d3',
  },
  dark: {
    base: '#2a2d34',
    strong: '#454a55',
    shine: 'rgba(255, 255, 255, 0.08)',
    accent: '#22d3ee',
    accent2: '#e879f9',
  },
}

export const tokensCss = (config: CharpenteConfig): string => {
  const light = { ...DEFAULT_TOKENS.light, ...config.colorScheme?.tokens?.light }
  const dark = { ...DEFAULT_TOKENS.dark, ...config.colorScheme?.tokens?.dark }
  const root = `:root {\n  --charpente-radius: 0.35em;\n  --charpente-scope: ${config.scope ?? 'element'};\n  ${tokenDeclarations(light)};\n}`
  const darkSelector = config.colorScheme?.dark
  const lightSelector = config.colorScheme?.light
  const forcedLight = lightSelector ? `\n${lightSelector} {\n  ${tokenDeclarations(light)};\n}` : ''
  if (darkSelector) return `${root}\n${darkSelector} {\n  ${tokenDeclarations(dark)};\n}${forcedLight}`
  return `${root}\n@media (prefers-color-scheme: dark) {\n  :root {\n    ${tokenDeclarations(dark)};\n  }\n}${forcedLight}`
}

export const darkThemeTokens = (
  scopes: string[],
  tokens: Tokens,
  scheme: CharpenteConfig['colorScheme'],
): string => {
  const body = tokenDeclarations(tokens)
  if (scheme?.dark) {
    const dark = scheme.dark
    return `${scopes.map((scope) => `${dark} ${scope}`).join(',\n')} {\n  ${body};\n}`
  }
  const guarded = scheme?.light ? scopes.map((scope) => `${scope}:not(${scheme.light} *)`) : scopes
  return `@media (prefers-color-scheme: dark) {\n  ${guarded.join(',\n  ')} {\n    ${body};\n  }\n}`
}
