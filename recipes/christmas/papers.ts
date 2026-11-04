import type { ThemeDef } from 'charpente'
import { berries, branch, flake, image, rand, tile, tree, type Motif } from './motifs'

type Paint = NonNullable<ThemeDef['paint']>
type PaintType = keyof Paint

const CREAM = '#f3e8c6'
const GREEN = '#3f6b3a'

interface Falling {
  seed: number
  width: number
  height: number
  count: number
  min: number
  max: number
  dx: number
}

const FALLING: Falling[] = [
  { seed: 3, width: 71, height: 93, count: 9, min: 1.1, max: 1.8, dx: 0 },
  { seed: 8, width: 109, height: 139, count: 8, min: 1.8, max: 2.6, dx: -1 },
  { seed: 14, width: 167, height: 211, count: 6, min: 2.8, max: 4, dx: 1 },
]

const crystals = ({ seed, width, height, count, min, max }: Falling): string => {
  const next = rand(seed)
  const body = Array.from({ length: count }, () => {
    const radius = min + next() * (max - min)
    const x = radius * 1.6 + next() * (width - radius * 3.2)
    const y = next() * height
    const dot = `<circle r="${radius.toFixed(1)}" fill="#fff" opacity="${(0.8 + next() * 0.2).toFixed(2)}"/>`
    const at = (shift: number): string => `<g transform="translate(${x.toFixed(1)} ${(y + shift).toFixed(1)})">${dot}</g>`
    return at(0) + (y < radius * 2 ? at(height) : '') + (y > height - radius * 2 ? at(-height) : '')
  })
  return image(body.join(''), width, height)
}

const TILE = { width: 240, height: 180 }

const MOTIFS: Record<string, Motif[]> = {
  fir: [branch(54), berries],
  flakes: [flake(15, CREAM), flake(9, CREAM)],
  trees: [tree(34, GREEN)],
}

const PATTERNS: Record<string, { motifs: string; speckle: boolean; columns: number; rows: number }> = {
  kraft: { motifs: 'fir', speckle: true, columns: 4, rows: 3 },
  green: { motifs: 'flakes', speckle: false, columns: 4, rows: 3 },
  cream: { motifs: 'trees', speckle: false, columns: 5, rows: 4 },
  red: { motifs: 'flakes', speckle: false, columns: 4, rows: 3 },
  'kraft-green': { motifs: 'flakes', speckle: true, columns: 4, rows: 3 },
}

const patternOf = (name: string, scale: number): { fill: string; size: string } => {
  const pattern = PATTERNS[name] as (typeof PATTERNS)[string]
  const list = MOTIFS[pattern.motifs] as Motif[]
  const scatters = list.map((motif, index) => ({ motif, columns: pattern.columns, rows: pattern.rows, radius: 40, seed: 11 + index * 7 }))
  const ground = pattern.speckle ? { speckle: '#8d6232', seed: 5 } : undefined
  return { fill: tile(TILE.width, TILE.height, ground, scatters), size: `${TILE.width * scale}px ${TILE.height * scale}px` }
}

const GROUND = 'linear-gradient(180deg, color-mix(in srgb, var(--charpente-base) 90%, #fff), var(--charpente-base))'
const FLOW: Record<PaintType, number> = { text: 0.45, media: 0.8, control: 0.55, block: 1 }
const SHAPES: Record<PaintType, string> = { text: 'gift-wrap-band', media: 'gift-wrap', control: 'gift-wrap-band', block: 'gift-wrap' }

const wrapped = (type: PaintType, name: string, snowing: boolean): Paint[PaintType] => {
  const scale = FLOW[type]
  const patterned = type === 'block' || type === 'media'
  const pattern = patterned ? patternOf(name, type === 'media' ? 0.7 : 1) : undefined
  const falling = snowing ? FALLING : []
  const shift = (tiles: number, extent: number): string => `calc(var(--charpente-flow) * ${(tiles * extent * scale).toFixed(1)}px)`
  const fills = [...falling.map(crystals), ...(pattern ? [pattern.fill] : []), GROUND]
  const sizes = [...falling.map(({ width, height }) => `${(width * scale).toFixed(1)}px ${(height * scale).toFixed(1)}px`), ...(pattern ? [pattern.size] : []), 'auto']
  const positions = [...falling.map(({ width, height, dx }) => `${shift(dx, width)} ${shift(1, height)}`), ...(pattern ? ['0 0'] : []), '0 0']
  return { fill: fills.join(', '), size: sizes.join(', '), position: positions.join(', '), shape: SHAPES[type] }
}

export const paperPaint = (name: string, snowing: boolean): Paint => ({
  text: wrapped('text', name, snowing),
  media: wrapped('media', name, snowing),
  control: wrapped('control', name, snowing),
  block: wrapped('block', name, snowing),
})
