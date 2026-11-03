import type { CharpenteConfig, ThemeDef } from './types'

export { flat } from './css'
export { MAX_REVEAL_DEPTH, loadingAttributes, motionAttribute, revealWindow } from './loading'
export type { LoadingAttributes, LoadingOptions } from './loading'
export { builtinMotions } from './motions'
export { themeAt } from './schedule'
export { compile } from './stylesheet'
export { builtinPatterns, builtinThemes, createGlassTheme, expandTheme, nativeTheme } from './themes'
export type { GlassOptions, NativeColors, NativeTheme } from './themes'
export type * from './types'

export const defineTheme = (theme: ThemeDef): ThemeDef => theme

export const defineCharpente = (config: CharpenteConfig): CharpenteConfig => config
