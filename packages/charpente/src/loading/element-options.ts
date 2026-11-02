import type { LoadingScope } from '../types'
import type { LoadingOptions } from './attributes'

export const OBSERVED_ATTRIBUTES = ['loading', 'theme', 'motion', 'delay', 'stagger', 'reveal', 'reveal-ms', 'scope']
export const DEFAULT_REVEAL_MS = 260

export const numberAttribute = (value: string | null): number | undefined => {
  if (value === null || value === '') return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

const scopeAttribute = (value: string | null): LoadingScope | undefined =>
  value === 'page' || value === 'element' ? value : undefined

export const optionsOf = (element: HTMLElement, ready: boolean): LoadingOptions => {
  const motion = element.getAttribute('motion')
  return {
    loading: element.hasAttribute('loading'),
    theme: element.getAttribute('theme') ?? undefined,
    motion: motion === null ? undefined : motion.split(/\s+/).filter(Boolean),
    delay: numberAttribute(element.getAttribute('delay')),
    stagger: numberAttribute(element.getAttribute('stagger')),
    reveal: numberAttribute(element.getAttribute('reveal')),
    scope: scopeAttribute(element.getAttribute('scope')),
    ready,
  }
}
