import type { ThemeDef } from '../../types'
import { glassThemes } from '../glass'
import { coreThemes } from './core'
import { extraThemes } from './extras'
import { usageThemes } from './usage'

export const builtinThemes: Record<string, ThemeDef> = {
  ...coreThemes,
  ...extraThemes,
  ...glassThemes,
  ...usageThemes,
}
