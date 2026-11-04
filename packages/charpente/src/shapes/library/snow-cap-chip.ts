import type { ShapeDef } from '../../types'
import { rrect } from '../geometry'

export const snowCapChip: ShapeDef = {
  viewBox: [200, 24],
  stretch: true,
  layers: [
    { name: 'Body', path: rrect(0, 5, 200, 19, 9), role: 'body' },
    { name: 'Body shade', path: 'M8 20H192V24H8Z', role: 'detail', opacity: 0.08 },
    { name: 'Left tuft underside', path: 'M3 11C3 5 11 3 21 4C30 4 36 8 38 11C30 13 12 13 3 11Z', role: 'detail', opacity: 0.2 },
    { name: 'Right tuft underside', path: 'M162 11C166 6 177 4 190 5C198 6 201 10 197 13C186 14 170 14 162 11Z', role: 'detail', opacity: 0.2 },
    { name: 'Left tuft', path: 'M3 9C3 3 11 1 21 2C30 2 36 6 38 9C30 11 12 11 3 9Z', role: 'accent2' },
    { name: 'Right tuft', path: 'M162 9C166 4 177 2 190 3C198 4 201 8 197 11C186 12 170 12 162 9Z', role: 'accent2' },
  ],
}
