import type { ThemeDef } from '../types'

export const withVariants = (themes: Record<string, ThemeDef>): Record<string, ThemeDef> => {
  const all: Record<string, ThemeDef> = {}
  for (const [name, def] of Object.entries(themes)) {
    const { variants, ...base } = def
    all[name] = base
    for (const [variant, override] of Object.entries(variants ?? {})) all[`${name}-${variant}`] = { ...base, ...override }
  }
  return all
}
