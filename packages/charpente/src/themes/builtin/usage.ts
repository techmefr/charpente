import { tint } from '../../css'
import type { ThemeDef } from '../../types'
import { buildTheme } from './build'

export const wellness: ThemeDef = buildTheme(() => ({
  tokens: { accent: '#84a98c', accent2: '#e9c46a', shine: 'rgba(255, 255, 255, 0.6)' },
  pattern: {
    fill: `radial-gradient(circle, rgba(0, 0, 0, 0.05) 0.6px, transparent 1px), linear-gradient(120deg, ${tint('accent', 38)}, ${tint('accent2', 28)})`,
    size: '3px 3px, auto',
  },
  radius: (step) => (step === 1 ? '999px' : `${8 * step}px`),
}))
