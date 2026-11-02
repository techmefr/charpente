import type { CharpenteConfig, ThemeDef } from './types'

export { compile } from './compile'
export { MAX_REVEAL_DEPTH, loadingAttributes, motionAttribute, revealWindow } from './attributes'
export type { LoadingAttributes, LoadingOptions, LoadingScope } from './attributes'
export { builtinMotions } from './motions'
export { themeAt } from './schedule'
export { builtinThemes, flat } from './themes'
export type * from './types'

export { expandTheme } from './expand'
export { builtinPatterns } from './patterns'

export const defineTheme = (theme: ThemeDef): ThemeDef => theme

export const defineCharpente = (config: CharpenteConfig): CharpenteConfig => config

export { createGlassTheme } from './glass'
export type { GlassOptions } from './glass'
