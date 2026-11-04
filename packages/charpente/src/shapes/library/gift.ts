import type { ShapeDef } from '../../types'
import { disc, rrect } from '../geometry'

const LOOP_LEFT = 'M80 54C58 8 14 20 34 46C46 60 68 58 80 54Z'
const LOOP_RIGHT = 'M80 54C102 8 146 20 126 46C114 60 92 58 80 54Z'
const INNER_LEFT = 'M76 50C60 22 36 28 44 44C52 54 66 53 76 50Z'
const INNER_RIGHT = 'M84 50C100 22 124 28 116 44C108 54 94 53 84 50Z'

export const gift: ShapeDef = {
  viewBox: [160, 160],
  layers: [
    { name: 'Box', path: rrect(20, 74, 120, 78, 6), role: 'body' },
    { name: 'Lid', path: rrect(10, 54, 140, 28, 7), role: 'body' },
    { name: 'Lid shadow', path: 'M20 82H140V90H20Z', role: 'detail' },
    { name: 'Box shine', path: rrect(26, 96, 7, 48, 3.5), role: 'shine' },
    { name: 'Lid shine', path: rrect(16, 60, 5, 16, 2.5), role: 'shine' },
    { name: 'Horizontal ribbon', path: 'M20 108H140V124H20Z', role: 'accent' },
    { name: 'Ribbon edges', path: 'M20 108H140V111H20ZM20 121H140V124H20Z', role: 'detail' },
    { name: 'Vertical ribbon', path: 'M69 54H91V152H69Z', role: 'accent' },
    { name: 'Ribbon sides', path: 'M69 54H73V152H69ZM87 54H91V152H87Z', role: 'detail' },
    { name: 'Left loop', path: LOOP_LEFT, role: 'accent' },
    { name: 'Right loop', path: LOOP_RIGHT, role: 'accent' },
    { name: 'Left loop shade', path: INNER_LEFT, role: 'detail' },
    { name: 'Right loop shade', path: INNER_RIGHT, role: 'detail' },
    { name: 'Tails', path: 'M72 60L56 86L66 88L78 66ZM88 60L104 86L94 88L82 66Z', role: 'accent' },
    { name: 'Knot', path: disc(80, 54, 11), role: 'accent2' },
    { name: 'Knot shine', path: disc(76.5, 50.5, 3.5), role: 'shine' },
  ],
}
