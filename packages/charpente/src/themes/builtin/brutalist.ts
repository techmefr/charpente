import type { Paint, PaintType, ThemeDef } from '../../types'
import { buildTheme } from './build'
import { perType } from './shapes'

const INK = 'var(--charpente-accent)'
const SIGNAL = 'var(--charpente-accent2)'
const cross = (width: number): string[] =>
  ['to top right', 'to bottom right'].map(
    (way) => `linear-gradient(${way}, transparent calc(50% - ${width}px), ${INK} calc(50% - ${width}px) calc(50% + ${width}px), transparent calc(50% + ${width}px))`,
  )

const FILLS: Record<PaintType, string> = {
  text: `linear-gradient(to bottom, transparent calc(100% - 3px), ${INK} 0), linear-gradient(${SIGNAL}, ${SIGNAL})`,
  media: [...cross(1.5), `linear-gradient(${SIGNAL}, ${SIGNAL})`].join(', '),
  control: `linear-gradient(${INK}, ${INK})`,
  block: `repeating-linear-gradient(-45deg, ${INK} 0 10px, ${SIGNAL} 10px 20px)`,
}

const paintOf = (type: PaintType): Paint => ({
  fill: FILLS[type],
  style: {
    borderRadius: '0',
    outline: `${type === 'text' ? 2 : 3}px solid ${INK}`,
    outlineOffset: type === 'text' ? '-2px' : '-3px',
    boxShadow: `${type === 'text' ? 3 : 6}px ${type === 'text' ? 3 : 6}px 0 ${INK}`,
  },
})

export const brutalist: ThemeDef = buildTheme(() => ({
  tokens: { accent: '#111111', accent2: '#ffe14d', shine: 'rgba(255, 255, 255, 0.5)' },
  dark: { accent: '#f5f5f5', accent2: '#c9a800' },
  paint: perType(paintOf),
}))
