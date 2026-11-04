import type { ThemeDef } from 'charpente'

type Paint = NonNullable<ThemeDef['paint']>
type PaintType = keyof Paint

const rand = (seed: number): (() => number) => {
  let state = seed >>> 0
  return () => (state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 4294967296
}

const image = (body: string, width: number, height: number): string =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">${body}</svg>`)}")`

interface Flakes {
  seed: number
  width: number
  height: number
  count: number
  min: number
  max: number
  dx: number
}

const FALLING: Flakes[] = [
  { seed: 3, width: 71, height: 93, count: 10, min: 0.9, max: 1.5, dx: 0 },
  { seed: 8, width: 109, height: 139, count: 8, min: 1.5, max: 2.3, dx: -1 },
  { seed: 14, width: 167, height: 211, count: 6, min: 2.4, max: 3.4, dx: 1 },
]

const flakes = ({ seed, width, height, count, min, max }: Flakes): string => {
  const next = rand(seed)
  const body = Array.from({ length: count }, () => {
    const radius = min + next() * (max - min)
    const x = radius * 1.6 + next() * (width - radius * 3.2)
    const y = next() * height
    const dot = `<circle r="${radius.toFixed(1)}" fill="#fff" opacity="${(0.75 + next() * 0.25).toFixed(2)}"/>`
    const at = (shift: number): string => `<g transform="translate(${x.toFixed(1)} ${(y + shift).toFixed(1)})">${dot}</g>`
    return at(0) + (y < radius * 2 ? at(height) : '') + (y > height - radius * 2 ? at(-height) : '')
  })
  return image(body.join(''), width, height)
}

const glitter = (): string => {
  const next = rand(21)
  const dots = Array.from({ length: 46 }, () => `<circle cx="${(next() * 160).toFixed(1)}" cy="${(next() * 120).toFixed(1)}" r="${(0.4 + next() * 0.7).toFixed(1)}" fill="#fff" opacity="${(0.4 + next() * 0.5).toFixed(2)}"/>`)
  return image(dots.join(''), 160, 120)
}

const GLASS = [
  'linear-gradient(112deg, transparent 34%, rgba(255,255,255,0.4) 50%, transparent 66%)',
  'linear-gradient(180deg, color-mix(in srgb, var(--charpente-base) 88%, #fff), var(--charpente-strong))',
]
const SCALE: Record<PaintType, number> = { text: 0.45, media: 0.8, control: 0.55, block: 1 }
const SHAPES: Record<PaintType, string> = { text: 'frost-chip', media: 'frost-card', control: 'frost-chip', block: 'frost-card' }

const frosted = (type: PaintType): Paint[PaintType] => {
  const scale = SCALE[type]
  const shift = (tiles: number, extent: number): string => `calc(var(--charpente-flow) * ${(tiles * extent * scale).toFixed(1)}px)`
  const sparkle = type === 'block' || type === 'media'
  const fills = [...FALLING.map(flakes), ...(sparkle ? [glitter()] : []), ...GLASS]
  const sizes = [...FALLING.map(({ width, height }) => `${(width * scale).toFixed(1)}px ${(height * scale).toFixed(1)}px`), ...(sparkle ? ['160px 120px'] : []), 'auto', 'auto']
  const positions = [...FALLING.map(({ width, height, dx }) => `${shift(dx, width)} ${shift(1, height)}`), ...(sparkle ? ['0 0'] : []), '0 0', '0 0']
  return { fill: fills.join(', '), size: sizes.join(', '), position: positions.join(', '), shape: SHAPES[type] }
}

export const frostPaint = (): Paint => ({
  text: frosted('text'),
  media: frosted('media'),
  control: frosted('control'),
  block: frosted('block'),
})
