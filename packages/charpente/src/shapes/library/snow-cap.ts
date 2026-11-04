import type { ShapeDef } from '../../types'
import { rrect } from '../geometry'

const CAP =
  'M0 30C0 14 10 8 24 10C34 4 50 6 58 12C70 4 88 8 98 14C110 6 128 4 140 10C152 6 170 6 178 12C192 10 200 18 200 30' +
  'C200 46 192 56 184 54C178 52 176 42 168 40C156 44 146 38 136 40C124 44 112 38 100 42C88 46 76 38 64 40' +
  'C52 44 40 38 28 40C22 42 22 52 16 54C8 56 0 46 0 30Z'

const lower = (path: string, shift: number): string => {
  let index = 0
  return path.replace(/-?\d+(?:\.\d+)?/g, (value) => String(Number(value) + (index++ % 2 === 1 ? shift : 0)))
}

export const snowCapCard: ShapeDef = {
  viewBox: [200, 120],
  stretch: true,
  layers: [
    { name: 'Body', path: rrect(6, 30, 188, 90, 10), role: 'body' },
    { name: 'Body shade', path: 'M6 110H194V120H6Z', role: 'detail', opacity: 0.08 },
    { name: 'Icicles', path: 'M141 40H148L144.5 66ZM64 40H69L66.5 58Z', role: 'shine', opacity: 0.9 },
    { name: 'Snow underside', path: lower(CAP, 4), role: 'detail', opacity: 0.2 },
    { name: 'Snow', path: CAP, role: 'accent2' },
  ],
}
