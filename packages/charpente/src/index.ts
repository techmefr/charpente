import type { CharpenteConfig } from './types'

export { compile } from './compile'
export { builtinMotions } from './motions'
export { themeAt } from './schedule'
export { builtinThemes, flat } from './themes'
export type * from './types'

export const defineCharpente = (config: CharpenteConfig): CharpenteConfig => config
