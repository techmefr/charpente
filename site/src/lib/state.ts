export interface StateOptions {
  loading?: boolean
  theme?: string
  motion?: string | string[]
  delay?: number
  stagger?: number
  style?: string
}

export const motionAttribute = (motion: string | string[] | undefined): string | undefined => {
  if (motion === undefined) return undefined
  const names = Array.isArray(motion) ? [...motion].sort() : [motion]
  return names.length === 0 ? 'none' : names.join(' ')
}

export const stateAttributes = ({
  loading = true,
  theme,
  motion,
  delay,
  stagger,
  style,
}: StateOptions): Record<string, string | boolean | undefined> => {
  const vars: string[] = []
  if (delay !== undefined) vars.push(`--charpente-delay: ${delay}ms`)
  if (stagger !== undefined) vars.push(`--charpente-stagger: ${stagger}ms`)
  if (style) vars.push(style)
  return {
    'data-charpente-loading': loading ? '' : undefined,
    'aria-busy': loading ? 'true' : undefined,
    inert: loading ? true : undefined,
    'data-charpente-theme': theme,
    'data-charpente-motion': motionAttribute(motion),
    style: vars.length > 0 ? vars.join('; ') : undefined,
  }
}
