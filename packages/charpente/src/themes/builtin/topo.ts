import type { Paint, PaintType, ThemeDef } from '../../types'
import { buildTheme } from './build'
import { perType, random, round, svgImage } from './shapes'

const WIDTH = 320
const HEIGHT = 240
const COLUMNS = 32
const ROWS = 24
const LEVELS = Array.from({ length: 15 }, (_, index) => -1.4 + index * 0.2)

const field = (seed: number): ((x: number, y: number) => number) => {
  const rand = random(seed)
  const waves = [[1, 0, 1], [0, 1, 0.9], [1, 1, 0.7], [2, 1, 0.5], [1, -2, 0.4], [3, 0, 0.25]].map(([fx, fy, amplitude]) => ({
    fx: fx as number,
    fy: fy as number,
    amplitude: amplitude as number,
    phase: rand() * Math.PI * 2,
  }))
  return (x, y) =>
    waves.reduce((sum, wave) => sum + wave.amplitude * Math.cos(2 * Math.PI * ((wave.fx * x) / COLUMNS + (wave.fy * y) / ROWS) + wave.phase), 0)
}

type Segment = [string, string]

const cellSegments = (level: number, i: number, j: number, height: (x: number, y: number) => number): Segment[] => {
  const top = `h${i},${j}`
  const right = `v${i + 1},${j}`
  const bottom = `h${i},${j + 1}`
  const left = `v${i},${j}`
  const above = [height(i, j), height(i + 1, j), height(i + 1, j + 1), height(i, j + 1)].map((value) => value >= level)
  const code = above.reduce((sum, on, bit) => sum + (on ? 1 << bit : 0), 0)
  const centre = (height(i, j) + height(i + 1, j) + height(i + 1, j + 1) + height(i, j + 1)) / 4 >= level
  const table: Record<number, Segment[]> = {
    1: [[left, top]], 2: [[top, right]], 3: [[left, right]], 4: [[right, bottom]],
    5: centre ? [[top, right], [left, bottom]] : [[left, top], [right, bottom]],
    6: [[top, bottom]], 7: [[left, bottom]], 8: [[left, bottom]], 9: [[top, bottom]],
    10: centre ? [[left, top], [right, bottom]] : [[top, right], [left, bottom]],
    11: [[right, bottom]], 12: [[left, right]], 13: [[top, right]], 14: [[left, top]],
  }
  return table[code] ?? []
}

const chains = (segments: Segment[]): string[][] => {
  const links = new Map<string, string[]>()
  for (const [a, b] of segments) {
    links.set(a, [...(links.get(a) ?? []), b])
    links.set(b, [...(links.get(b) ?? []), a])
  }
  const used = new Set<string>()
  const walk = (start: string): string[] => {
    const path = [start]
    used.add(start)
    let current = start
    for (;;) {
      const next = (links.get(current) ?? []).find((key) => !used.has(key))
      if (next === undefined) return path
      used.add(next)
      path.push(next)
      current = next
    }
  }
  const ends = [...links.keys()].filter((key) => (links.get(key) as string[]).length === 1)
  return [...ends, ...links.keys()].filter((key) => !used.has(key)).map(walk).filter((path) => path.length > 1)
}

const smooth = (points: number[][]): string => {
  const mid = (a: number[], b: number[]): string => `${round(((a[0] as number) + (b[0] as number)) / 2)} ${round(((a[1] as number) + (b[1] as number)) / 2)}`
  const first = points[0] as number[]
  const last = points[points.length - 1] as number[]
  const body = points.slice(1, -1).map((point, at) => `Q${round(point[0] as number)} ${round(point[1] as number)} ${mid(point, points[at + 2] as number[])}`)
  return `M${first[0]} ${first[1]}L${mid(first, points[1] as number[])}${body.join('')}L${last[0]} ${last[1]}`
}

const contours = (seed: number): string => {
  const height = field(seed)
  const sx = WIDTH / COLUMNS
  const sy = HEIGHT / ROWS
  const place = (key: string, level: number): number[] => {
    const [kind, rest] = [key[0], key.slice(1)]
    const [i, j] = (rest as string).split(',').map(Number) as [number, number]
    const [x2, y2] = kind === 'h' ? [i + 1, j] : [i, j + 1]
    const a = height(i, j)
    const t = (level - a) / (height(x2, y2) - a)
    return [(i + (x2 - i) * t) * sx, (j + (y2 - j) * t) * sy]
  }
  const paths = LEVELS.map((level, index) => {
    const segments = Array.from({ length: COLUMNS * ROWS }, (_, cell) => cellSegments(level, cell % COLUMNS, Math.floor(cell / COLUMNS), height)).flat()
    const d = chains(segments).map((chain) => smooth(chain.map((key) => place(key, level)))).join('')
    const major = index % 5 === 0
    return `<path d="${d}" fill="none" stroke="#a88a52" stroke-width="${major ? 1.5 : 0.7}" stroke-opacity="${major ? 0.95 : 0.7}" stroke-linejoin="round"/>`
  })
  return svgImage(paths.join(''), WIDTH, HEIGHT)
}

const SCALE: Record<PaintType, number> = { text: 0.9, media: 1.3, control: 0.9, block: 1.5 }

const paintOf = (type: PaintType): Paint => ({
  fill: `${contours(5)}, linear-gradient(135deg, color-mix(in srgb, var(--charpente-base) 88%, #fff), var(--charpente-base))`,
  size: `${round(WIDTH * SCALE[type])}px ${round(HEIGHT * SCALE[type])}px, auto`,
  style: { borderRadius: type === 'control' ? '999px' : type === 'text' ? '3px' : '6px' },
})

export const topo: ThemeDef = buildTheme(() => ({
  tokens: { base: '#efe6cf', strong: '#a88a52' },
  dark: { base: '#262920', strong: '#a88a52' },
  paint: perType(paintOf),
}))
