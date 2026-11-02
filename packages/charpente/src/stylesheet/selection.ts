import type { CharpenteConfig, ThemeDef } from '../types'

export const selectThemes = (config: CharpenteConfig, themes: Record<string, ThemeDef>): string[] => {
  const all = Object.keys(themes)
  if (!config.include) return all
  for (const name of config.include) {
    if (!themes[name]) throw new Error(`charpente: include uses unknown theme "${name}"`)
  }
  const kept = new Set([
    ...config.include,
    config.defaultTheme ?? 'solid',
    ...(config.schedule ?? []).map((entry) => entry.theme),
    ...Object.keys(config.themes ?? {}),
  ])
  return all.filter((name) => kept.has(name))
}
