export interface LoadingOptions {
  loading: boolean
  theme?: string
  motion?: string | string[]
  delay?: number
  stagger?: number
}

export interface LoadingAttributes {
  attributes: Record<string, string>
  style: Record<string, string>
}

export const motionAttribute = (motion: string | string[] | undefined): string | undefined => {
  if (motion === undefined) return undefined
  const names = (Array.isArray(motion) ? motion : [motion]).filter((name) => name !== '' && name !== 'none')
  const unique = [...new Set(names)].sort()
  return unique.length === 0 ? 'none' : unique.join(' ')
}

export const loadingAttributes = (options: LoadingOptions): LoadingAttributes => {
  const attributes: Record<string, string> = {}
  const style: Record<string, string> = {}
  if (options.loading) {
    attributes['data-charpente-loading'] = ''
    attributes['aria-busy'] = 'true'
    attributes['inert'] = ''
  }
  if (options.theme !== undefined) attributes['data-charpente-theme'] = options.theme
  const motion = motionAttribute(options.motion)
  if (motion !== undefined) attributes['data-charpente-motion'] = motion
  if (options.delay !== undefined) style['--charpente-delay'] = String(options.delay) + 'ms'
  if (options.stagger !== undefined) style['--charpente-stagger'] = String(options.stagger) + 'ms'
  return { attributes, style }
}
