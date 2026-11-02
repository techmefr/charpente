import type { LoadingScope } from '../types'

export const MAX_REVEAL_DEPTH = 6

export interface LoadingOptions {
  loading: boolean
  theme?: string
  motion?: string | string[]
  delay?: number
  stagger?: number
  reveal?: number
  scope?: LoadingScope
  ready?: boolean
  capture?: string
}

export const revealWindow = (revealMs: number, reveal = 0): number =>
  revealMs + reveal * (MAX_REVEAL_DEPTH - 1)

export interface LoadingAttributes {
  attributes: Record<string, string>
  style: Record<string, string>
}

export const motionAttribute = (motion: string | string[] | undefined): string | undefined => {
  if (motion === undefined) return undefined
  const names = Array.isArray(motion) ? [...motion].sort() : [motion]
  return names.length === 0 ? 'none' : names.join(' ')
}

export const loadingAttributes = (options: LoadingOptions): LoadingAttributes => {
  const attributes: Record<string, string> = {}
  const style: Record<string, string> = {}
  if (options.loading) {
    attributes['data-charpente-loading'] = ''
    attributes['aria-busy'] = 'true'
    attributes['inert'] = ''
  }
  if (options.capture !== undefined) {
    attributes['data-charpente-block'] = ''
    attributes['data-charpente-capture'] = options.capture
  }
  if (options.ready) attributes['data-charpente-ready'] = ''
  if (options.theme !== undefined) attributes['data-charpente-theme'] = options.theme
  const motion = motionAttribute(options.motion)
  if (motion !== undefined) attributes['data-charpente-motion'] = motion
  if (options.delay !== undefined) style['--charpente-delay'] = String(options.delay) + 'ms'
  if (options.stagger !== undefined) style['--charpente-stagger'] = String(options.stagger) + 'ms'
  if (options.reveal !== undefined) {
    attributes['data-charpente-reveal'] = ''
    style['--charpente-reveal'] = String(options.reveal) + 'ms'
  }
  return { attributes, style }
}
