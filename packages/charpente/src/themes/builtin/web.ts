import type { Declarations, Paint, PaintType, ThemeDef } from '../../types'
import { buildTheme } from './build'
import { perType, random, round, svgImage } from './shapes'

const THREAD = '#8a97ab'
const SPOKES = [4, 16, 29, 43, 57, 70, 84]

const polar = (angle: number, radius: number): string => {
  const rad = (angle * Math.PI) / 180
  return `${round(Math.cos(rad) * radius)} ${round(Math.sin(rad) * radius)}`
}

const orb = (size: number, seed: number, flip = false): string => {
  const rand = random(seed)
  const reach = SPOKES.map((_, at) => size * (0.9 + rand() * 0.1 - (at % 2) * 0.05))
  const spokes = SPOKES.map((angle, at) => `M0 0L${polar(angle, reach[at] as number)}`)
  const rings = Array.from({ length: 9 }, (_, ring) => 0.12 + ring * 0.1 + rand() * 0.015)
  const arcs = rings.flatMap((ring) =>
    SPOKES.slice(1).map((angle, at) => {
      const before = SPOKES[at] as number
      const radius = ring * size
      return `M${polar(before, radius)}Q${polar((before + angle) / 2, radius * 0.9)} ${polar(angle, radius)}`
    }),
  )
  const drops = rings
    .slice(2, 8)
    .map((ring, at) => {
      const [x, y] = polar(SPOKES[(at * 2) % 6] as number, ring * size).split(' ')
      return `<circle cx="${x}" cy="${y}" r="1.1" fill="#ffffff" fill-opacity=".85"/>`
    })
    .join('')
  const web = `<path d="${[...spokes, ...arcs].join('')}" fill="none" stroke="${THREAD}" stroke-width=".7" stroke-linecap="round" stroke-opacity=".9"/>`
  const turn = flip ? ` transform="rotate(180 ${size / 2} ${size / 2})"` : ''
  return svgImage(`<g${turn}>${web}${drops}</g>`, size, size)
}

const hanging = (): string => {
  const body = `<path d="M30 0V58" stroke="${THREAD}" stroke-width=".7" fill="none"/><ellipse cx="30" cy="63" rx="3.2" ry="4.2" fill="#3b4558"/><circle cx="30" cy="57" r="2" fill="#3b4558"/><path d="M27 61l-6-4M27 64l-7 1M33 61l6-4M33 64l7 1M27 66l-5 5M33 66l5 5" stroke="#3b4558" stroke-width=".8" fill="none"/>`
  return svgImage(body, 60, 80)
}

const AREA: Record<PaintType, { web: number; far: number }> = {
  text: { web: 18, far: 12 },
  media: { web: 120, far: 80 },
  control: { web: 30, far: 20 },
  block: { web: 170, far: 110 },
}

const paintOf = (type: PaintType): Paint => {
  const { web, far } = AREA[type]
  const style: Declarations = { borderRadius: type === 'control' ? '999px' : type === 'text' ? '2px' : '6px' }
  const layers = [orb(web, 11), orb(far, 23, true), ...(type === 'block' || type === 'media' ? [hanging()] : [])]
  const sizes = [`${web}px ${web}px`, `${far}px ${far}px`, `${round(web * 0.3)}px ${round(web * 0.4)}px`]
  const spots = ['top left', 'bottom right', 'top 0 left 62%']
  const soft = 'linear-gradient(135deg, color-mix(in srgb, var(--charpente-base) 72%, transparent), var(--charpente-base))'
  const count = layers.length
  return {
    fill: `${layers.join(', ')}, ${soft}`,
    size: `${sizes.slice(0, count).join(', ')}, auto`,
    position: spots.slice(0, count).join(', '),
    repeat: `${'no-repeat, '.repeat(count)}repeat`,
    style,
  }
}

export const web: ThemeDef = buildTheme(() => ({
  tokens: { base: '#e4e9f1', strong: '#8a97ab' },
  dark: { base: '#232936', strong: '#6d7c93' },
  paint: perType(paintOf),
}))
