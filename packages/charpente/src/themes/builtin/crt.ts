import type { Paint, PaintType, ThemeDef } from '../../types'
import { buildTheme } from './build'
import { perType } from './shapes'

const GLARE = 'radial-gradient(ellipse 60% 40% at 28% 18%, rgba(255,255,255,.13), transparent 70%)'
const SCANLINES = 'repeating-linear-gradient(0deg, rgba(0,0,0,.35) 0 1px, transparent 1px 3px)'
const PHOSPHOR = 'radial-gradient(ellipse at center, var(--charpente-strong) 0%, var(--charpente-base) 100%)'
const RIM = 'color-mix(in srgb, var(--charpente-accent) 38%, transparent)'
const HALO = 'color-mix(in srgb, var(--charpente-accent) 40%, transparent)'

const RADII: Record<PaintType, string> = {
  text: '4px / 50%',
  media: '12% / 16%',
  control: '10px / 32%',
  block: '9% / 14%',
}

const paintOf = (type: PaintType): Paint => ({
  fill: [GLARE, SCANLINES, PHOSPHOR].join(', '),
  style: {
    borderRadius: RADII[type],
    boxShadow: `inset 0 0 0 1px ${RIM}, inset 0 0 14px 2px rgba(0,0,0,.7), 0 0 5px ${HALO}`,
  },
})

export const crt: ThemeDef = buildTheme(() => ({
  tokens: { base: '#031a0c', strong: '#0f4a25', accent: '#4ade80', accent2: '#bbf7d0', shine: 'rgba(74,222,128,.2)' },
  motion: 'crt',
  paint: perType(paintOf),
  variants: {
    amber: {
      tokens: { base: '#1c1002', strong: '#5c3a06', accent: '#fbbf24', accent2: '#fde68a', shine: 'rgba(251,191,36,.2)' },
    },
  },
}))
