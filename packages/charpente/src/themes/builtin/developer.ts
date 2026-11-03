import type { Paint, PaintType, ThemeDef } from '../../types'
import { buildTheme } from './build'
import { TYPE_SCALE, flowLayout, perType, random, svgImage, type FlowLayer } from './shapes'

const GLYPHS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓ0123456789=:+*'

const rain = (seed: number, columns: number, rows: number, pitch: number, green: string, gap: number): string => {
  const rand = random(seed)
  const glyph = (): string => GLYPHS[Math.floor(rand() * GLYPHS.length)] as string
  const body = Array.from({ length: columns }, (_, column) => {
    const length = 6 + Math.floor(rand() * (rows - 9))
    const start = Math.floor(rand() * rows)
    return Array.from({ length }, (_, row) => {
      const y = ((start + row) % rows) * pitch + pitch
      const head = row === length - 1
      const opacity = head ? 1 : (0.08 + (row / length) ** 1.6 * 0.85).toFixed(2)
      return `<text x="${column * (pitch + gap) + 1}" y="${y}" fill="${head ? '#e6ffee' : green}" fill-opacity="${opacity}">${glyph()}</text>`
    }).join('')
  }).join('')
  return svgImage(`<g font-family="monospace" font-size="${pitch - 2}">${body}</g>`, columns * (pitch + gap), rows * pitch)
}

const LAYERS: FlowLayer[] = [
  { size: [112, 300], dy: 2 },
  { size: [96, 230], dy: 1 },
  { size: [77, 310], dy: 1 },
  { size: [54, 152], dy: 1 },
]

const GROUND = 'linear-gradient(#010d06, #02170b)'
const SHADE = 'linear-gradient(to bottom, rgba(1,13,6,.5), transparent 30%, transparent 70%, rgba(1,13,6,.5))'

const paintOf = (type: PaintType): Paint => ({
  fill: [
    SHADE,
    rain(3, 8, 25, 12, '#22ff77', 2),
    rain(17, 8, 23, 10, '#0fbf55', 2),
    rain(29, 7, 31, 10, '#0a9a44', 1),
    rain(41, 6, 19, 8, '#087a38', 1),
    GROUND,
  ].join(', '),
  ...flowLayout(LAYERS, TYPE_SCALE[type] * 1.2, 1),
  style: {
    borderRadius: type === 'text' ? '1px' : '2px',
    boxShadow: 'inset 0 0 0 1px rgba(34,255,119,.45), inset 0 0 10px rgba(34,255,119,.18)',
  },
})

export const developer: ThemeDef = buildTheme(() => ({
  tokens: { base: '#010d06', strong: '#0fbf55', accent: '#22ff77', accent2: '#d8ffe4', shine: 'rgba(34,255,119,.22)' },
  motion: 'matrix',
  paint: perType(paintOf),
}))
