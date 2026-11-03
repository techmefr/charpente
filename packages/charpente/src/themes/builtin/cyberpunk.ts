import type { Paint, PaintType, ThemeDef } from '../../types'
import { buildTheme } from './build'
import { clipCut, edgeCut, perType } from './shapes'

const CYAN = 'var(--charpente-accent)'
const PINK = 'var(--charpente-accent2)'
const SCAN = 'repeating-linear-gradient(0deg, transparent 0 3px, rgba(34,211,238,.07) 3px 4px)'
const GROUND = 'linear-gradient(125deg, var(--charpente-base) 45%, #251332)'

const CUTS: Record<PaintType, number> = { text: 5, media: 18, control: 9, block: 24 }
const ACCENTS: Record<PaintType, string> = {
  text: `linear-gradient(90deg, ${PINK} 0 3px, transparent 3px)`,
  media: `linear-gradient(to top, ${PINK} 0 3px, transparent 3px)`,
  control: `linear-gradient(to top, ${PINK} 0 2px, transparent 2px)`,
  block: `linear-gradient(90deg, ${PINK} 0 4px, transparent 4px)`,
}

const paintOf = (type: PaintType): Paint => {
  const size = CUTS[type]
  return {
    fill: [ACCENTS[type], ...edgeCut(size, CYAN), SCAN, GROUND].join(', '),
    style: {
      borderRadius: type === 'text' ? '3px' : '0',
      clipPath: clipCut(size),
      boxShadow: `inset 0 0 0 1px rgba(34,211,238,.55), inset 0 0 ${size}px rgba(34,211,238,.18)`,
    },
  }
}

export const cyberpunk: ThemeDef = buildTheme(() => ({
  tokens: { base: '#0b1426', strong: '#16435a', accent: '#22d3ee', accent2: '#e879f9', shine: 'rgba(34,211,238,.18)' },
  paint: perType(paintOf),
}))
