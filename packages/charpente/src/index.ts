import type { CharpenteConfig, ThemeDef } from './types'

export { compile } from './compile'
export { loadingAttributes, motionAttribute } from './attributes'
export type { LoadingAttributes, LoadingOptions } from './attributes'
export { builtinMotions } from './motions'
export { schedulePresets, themeAt } from './schedule'
export { builtinThemes, flat } from './themes'
export type * from './types'

export { expandTheme } from './expand'
export { builtinPatterns } from './patterns'
export { discoverThemes } from './discover'

export const defineTheme = (theme: ThemeDef): ThemeDef => theme

export const defineCharpente = (config: CharpenteConfig): CharpenteConfig => config

export { createGlassTheme } from './glass'
export type { GlassOptions } from './glass'
