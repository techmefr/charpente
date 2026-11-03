import type { ThemeDef } from 'charpente/lite'
import type { GeneratorState } from './state'
import { sanitizeState } from './validate'

const KEY = 'g='

export const BUILTIN_NAMES = [
  'solid', 'outline', 'dots', 'cyberpunk', 'web', 'blueprint', 'halftone', 'stripes', 'neon', 'aurora',
  'brutalist', 'sketch', 'topo', 'waves', 'glass', 'frost', 'smoked', 'music', 'developer', 'wellness', 'crt',
]

export const encodeState = (state: GeneratorState): string => {
  const bytes = new TextEncoder().encode(JSON.stringify(state))
  return `${KEY}${btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')}`
}

export const decodeState = (hash: string): GeneratorState | undefined => {
  const raw = hash.replace(/^#/, '')
  if (!raw.startsWith(KEY)) return undefined
  try {
    const binary = atob(raw.slice(KEY.length).replace(/-/g, '+').replace(/_/g, '/'))
    return sanitizeState(JSON.parse(new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)))))
  } catch {
    return undefined
  }
}

export const themesOf = (namespace: Record<string, unknown>): Record<string, ThemeDef> =>
  Object.fromEntries(BUILTIN_NAMES.map((name) => [name, namespace[name] as ThemeDef]).filter(([, theme]) => typeof theme === 'object' && theme !== null))
