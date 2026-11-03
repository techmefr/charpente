import type { Paint, PaintType, ThemeDef } from '../../types'
import { buildTheme } from './build'
import { perType, random, svgImage } from './shapes'

const GLYPHS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓ0123456789=:+*'

const rain = (seed: number, columns: number, rows: number, pitch: number, green: string): string => {
  const rand = random(seed)
  const glyph = (): string => GLYPHS[Math.floor(rand() * GLYPHS.length)] as string
  const body = Array.from({ length: columns }, (_, column) => {
    const length = 5 + Math.floor(rand() * (rows - 6))
    const start = Math.floor(rand() * rows)
    return Array.from({ length }, (_, row) => {
      const y = ((start + row) % rows) * pitch + pitch
      const fade = (row + 1) / length
      const head = row === length - 1
      const fill = head ? '#d8ffe4' : green
      return `<text x="${column * pitch + 1}" y="${y}" fill="${fill}" fill-opacity="${head ? 1 : (0.15 + fade * 0.8).toFixed(2)}">${glyph()}</text>`
    }).join('')
  }).join('')
  const width = columns * pitch
  return svgImage(`<g font-family="monospace" font-size="${pitch - 2}">${body}</g>`, width, rows * pitch)
}

const NEAR = () => rain(3, 8, 20, 12, '#22ff77')
const MID = () => rain(17, 9, 23, 10, '#0fbf55')
const FAR = () => rain(29, 7, 29, 8, '#087a38')

const SIZES: Record<PaintType, string> = {
  text: '96px 240px, 90px 230px, 56px 232px',
  media: '120px 300px, 112px 287px, 70px 290px',
  control: '84px 210px, 78px 200px, 49px 203px',
  block: '144px 360px, 135px 345px, 84px 348px',
}

const GROUND = 'linear-gradient(#010d06, #02170b)'
const SHADE = 'linear-gradient(to bottom, rgba(1,13,6,.55), transparent 35%, transparent 65%, rgba(1,13,6,.55))'

const paintOf = (type: PaintType): Paint => ({
  fill: `${SHADE}, ${NEAR()}, ${MID()}, ${FAR()}, ${GROUND}`,
  size: `auto, ${SIZES[type]}, auto`,
  style: {
    borderRadius: type === 'text' ? '1px' : '2px',
    boxShadow: 'inset 0 0 0 1px rgba(34,255,119,.45), inset 0 0 10px rgba(34,255,119,.18)',
  },
})

export const developer: ThemeDef = buildTheme(() => ({
  tokens: { base: '#010d06', strong: '#0fbf55', accent: '#22ff77', accent2: '#d8ffe4', shine: 'rgba(34,255,119,.22)' },
  paint: perType(paintOf),
}))
