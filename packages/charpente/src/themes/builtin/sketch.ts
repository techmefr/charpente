import type { Paint, PaintType, ThemeDef } from '../../types'
import { buildTheme } from './build'
import { perType, random, round, svgImage } from './shapes'

const INK = '#7b8494'

const outline = (seed: number, width: number): string => {
  const rand = random(seed)
  const jitter = (): number => round((rand() - 0.5) * 2.6)
  const edge = (x1: number, y1: number, x2: number, y2: number): string[] =>
    Array.from({ length: 8 }, (_, index) => {
      const t = (index + 1) / 8
      return `${round(x1 + (x2 - x1) * t + jitter() * (x1 === x2 ? 0.6 : 0.2))} ${round(y1 + (y2 - y1) * t + jitter() * (y1 === y2 ? 0.6 : 0.2))}`
    })
  const points = [...edge(2, 3, 98, 2), ...edge(98, 2, 97, 98), ...edge(97, 98, 3, 97), ...edge(3, 97, 2, 3)]
  const overshoot = `M${round(rand() * 3)} 4L${round(100 - rand() * 3)} ${round(1 + rand() * 2)}M${round(96 + rand() * 3)} ${round(rand() * 4)}L${round(96 + rand() * 3)} 100`
  const path = `<path d="M2 3L${points.join('L')}${overshoot}" fill="none" stroke="${INK}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`
  return path
}

const FRAME = () => svgImage(`${outline(5, 1.4)}${outline(23, 0.9)}`, 100, 100, true)

const hatch = (seed: number, width: number, height: number, angle: number, count: number): string => {
  const rand = random(seed)
  const strokes = Array.from({ length: count }, () => {
    const x = round(rand() * width)
    const y = round(rand() * height)
    const length = 10 + rand() * 22
    const tilt = ((angle + (rand() - 0.5) * 14) * Math.PI) / 180
    return `M${x} ${y}l${round(Math.cos(tilt) * length)} ${round(Math.sin(tilt) * length)}`
  })
  return svgImage(`<path d="${strokes.join('')}" fill="none" stroke="${INK}" stroke-opacity=".6" stroke-width="1" stroke-linecap="round"/>`, width, height)
}

const FINE = () => hatch(2, 64, 48, -50, 26)
const CROSS = () => hatch(9, 97, 71, 38, 12)

const SIZES: Record<PaintType, string> = {
  text: '64px 48px, 97px 71px',
  media: '90px 68px, 130px 95px',
  control: '56px 42px, 83px 61px',
  block: '110px 82px, 160px 117px',
}

const paintOf = (type: PaintType): Paint => ({
  fill: `${FRAME()}, ${FINE()}, ${CROSS()}, linear-gradient(var(--charpente-base), var(--charpente-base))`,
  size: `100% 100%, ${SIZES[type]}, auto`,
  style: { borderRadius: type === 'control' ? '40% 60% 55% 45% / 60% 45% 55% 40%' : '2px 5px 3px 6px' },
})

export const sketch: ThemeDef = buildTheme(() => ({
  tokens: { base: '#f1ede4', strong: '#4b5563' },
  dark: { base: '#2b2c30', strong: '#9ca3af' },
  paint: perType(paintOf),
}))
