import type { ThemeDef } from '../../types'
import { createGlassTheme } from '../glass'

export const glass: ThemeDef = createGlassTheme({ blur: '6px', opacity: 0.08, reflection: 0.38, rim: 0.85, filter: 'saturate(1.3) brightness(1.04)' })

export const frost: ThemeDef = createGlassTheme({ blur: '30px', opacity: 0.55, tint: '#ffffff', reflection: 0.12, rim: 0.3, filter: 'saturate(0.85) brightness(1.12)' })

export const smoked: ThemeDef = createGlassTheme({ blur: '14px', opacity: 0.6, tint: '#05080f', reflection: 0.04, rim: 0.1, filter: 'saturate(0.8) brightness(0.7)' })
