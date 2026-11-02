import { tokenDeclarations } from '../css'
import { DEFAULT_TOKENS } from '../themes'
import type { CharpenteConfig, Tokens } from '../types'

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
