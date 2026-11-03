import type { ThemeDef } from '../../types'
import { createGlassTheme } from '../glass'

export const glass: ThemeDef = createGlassTheme()

export const frost: ThemeDef = createGlassTheme({ blur: '24px', opacity: 0.26, reflection: 0.3 })

export const smoked: ThemeDef = createGlassTheme({ blur: '16px', opacity: 0.48, tint: '#101827', reflection: 0.08 })
