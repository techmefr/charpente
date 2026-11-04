import type { Paint, PaintType, ThemeDef } from '../../types'
import { buildTheme } from './build'
import { TYPE_SCALE, flowLayout, perType, round, svgImage, type FlowLayer } from './shapes'

const swell = (width: number, height: number, rows: number, amplitude: number, color: string, opacity: number, weight: number): string => {
  const half = width / 2
  const lines = Array.from({ length: rows }, (_, row) => {
    const y = round(height / rows / 2 + row * (height / rows))
    return `M${-width} ${y}q${round(half / 2)} ${-amplitude} ${half} 0${`t${half} 0`.repeat(3)}`
  })
  const body = `<path d="${lines.join('')}" fill="none" stroke="${color}" stroke-width="${weight}" stroke-opacity="${opacity}" stroke-linecap="round"/>`
  return svgImage(body, width, height)
}

const LAYERS: FlowLayer[] = [
  { size: [96, 52], dx: 1 },
  { size: [150, 84], dx: -1 },
  { size: [61, 34], dx: 1 },
]

const paintOf = (type: PaintType): Paint => {
  const scale = TYPE_SCALE[type]
  const fill = [
    swell(96, 52, 4, 5, '#2f8fc4', 0.55, 1),
    swell(150, 84, 3, 9, '#5cb8e6', 0.45, 1.4),
    swell(61, 34, 3, 3, '#ffffff', 0.5, 0.8),
    'linear-gradient(180deg, color-mix(in srgb, var(--charpente-accent) 6%, var(--charpente-base)), color-mix(in srgb, var(--charpente-accent) 22%, var(--charpente-base)))',
  ]
  return {
    fill: fill.join(', '),
    ...flowLayout(LAYERS, scale),
    style: { borderRadius: type === 'text' ? '3px' : type === 'control' ? '999px' : '8px' },
  }
}

export const waves: ThemeDef = buildTheme(() => ({
  tokens: { base: '#dff1fb', strong: '#5cb8e6', accent: '#38bdf8' },
  dark: { base: '#0c2a3e', strong: '#2f8fc4' },
  motion: 'waves',
  paint: perType(paintOf),
}))
