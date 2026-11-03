import type { Paint, PaintType, ThemeDef } from '../../types'
import { buildTheme } from './build'
import { perType, random, round, svgImage } from './shapes'

const LINE = '#9a7f52'

const contour = (cx: number, cy: number, radius: number, phase: number[]): string => {
  const points = Array.from({ length: 40 }, (_, index) => {
    const angle = (index / 40) * Math.PI * 2
    const wobble = 1 + 0.16 * Math.sin(2 * angle + (phase[0] as number)) + 0.1 * Math.sin(3 * angle + (phase[1] as number)) + 0.05 * Math.sin(5 * angle + (phase[2] as number))
    return `${round(cx + Math.cos(angle) * radius * wobble * 1.25)} ${round(cy + Math.sin(angle) * radius * wobble)}`
  })
  return `M${points.join('L')}Z`
}

const hills = (seed: number, width: number, height: number, centers: number[][]): string => {
  const rand = random(seed)
  const body = centers.map(([cx, cy, max]) => {
    const phase = [rand() * 6, rand() * 6, rand() * 6]
    const levels = Math.floor((max as number) / 6)
    return Array.from({ length: levels }, (_, level) => {
      const width = level % 4 === 0 ? 1.6 : 0.8
      return `<path d="${contour(cx as number, cy as number, (max as number) - level * 6, phase)}" fill="none" stroke="${LINE}" stroke-width="${width}"/>`
    }).join('')
  })
  return svgImage(body.join(''), width, height)
}

const LARGE = () => hills(3, 360, 260, [[100, 85, 80], [265, 200, 58], [300, 45, 36], [45, 215, 32], [190, 40, 26]])
const SMALL = () => hills(11, 250, 190, [[60, 120, 44], [180, 60, 40], [195, 150, 22], [40, 40, 24]])

const SIZES: Record<PaintType, string> = {
  text: '230px 166px, 160px 121px',
  media: '420px 303px, 290px 220px',
  control: '200px 144px, 140px 106px',
  block: '480px 346px, 330px 250px',
}

const paintOf = (type: PaintType): Paint => ({
  fill: `${LARGE()}, ${SMALL()}, linear-gradient(var(--charpente-base), var(--charpente-base))`,
  size: `${SIZES[type]}, auto`,
  style: { borderRadius: type === 'control' ? '999px' : type === 'text' ? '3px' : '6px' },
})

export const topo: ThemeDef = buildTheme(() => ({
  tokens: { base: '#ebe5cf', strong: '#9a7f52' },
  dark: { base: '#262920', strong: '#9a7f52' },
  paint: perType(paintOf),
}))
