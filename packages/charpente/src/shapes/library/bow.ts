import type { FixedShape, ShapeLayer } from '../../types'

const WIDTH = 200
const HEIGHT = 140

const mirror = (path: string): string => {
  let index = 0
  return path.replace(/-?\d+(?:\.\d+)?/g, (number) => (index++ % 2 === 0 ? String(WIDTH - Number(number)) : number))
}

const TAIL = 'M96 62C84 84 56 104 26 128L44 134L52 122L62 128C76 112 90 92 104 68Z'
const LOBE = 'M96 58C76 70 44 74 30 92C24 100 36 104 46 98C64 90 84 80 99 64Z'
const LOOP = 'M97 54C80 22 46 6 22 14C4 20 6 44 26 56C46 66 78 62 97 56Z'
const SHADE = 'M92 53C78 32 52 22 34 26C24 30 28 44 42 52C58 58 78 58 92 55Z'
const GLEAM = 'M30 18C44 14 62 20 76 32C60 24 44 20 30 24Z'
const KNOT = 'M88 50C88 44 112 44 112 50C116 58 112 68 100 68C88 68 84 58 88 50Z'
const KNOT_GLEAM = 'M93 50C98 47 104 47 108 50C102 49 98 50 93 53Z'

const pair = (name: string, path: string, role: ShapeLayer['role'], extra: Partial<ShapeLayer> = {}): ShapeLayer[] => [
  { name: `${name} left`, path, role, ...extra },
  { name: `${name} right`, path: mirror(path), role, ...extra },
]

export const bow = (size: string): FixedShape => ({
  viewBox: [WIDTH, HEIGHT],
  size,
  layers: [
    ...pair('Tail', TAIL, 'accent', { gradient: 'd' }),
    ...pair('Lobe', LOBE, 'accent', { gradient: 'd' }),
    ...pair('Loop', LOOP, 'accent', { gradient: 'd' }),
    ...pair('Loop shade', SHADE, 'detail', { opacity: 0.28 }),
    ...pair('Loop gleam', GLEAM, 'shine', { opacity: 0.4 }),
    { name: 'Knot', path: KNOT, role: 'accent', gradient: 'd' },
    { name: 'Knot gleam', path: KNOT_GLEAM, role: 'shine', opacity: 0.5 },
  ],
})
