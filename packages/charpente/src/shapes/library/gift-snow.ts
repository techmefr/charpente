import type { ShapeDef } from '../../types'
import { disc, rrect } from '../geometry'

const LOOP_LEFT = 'M80 52C50 -4 6 14 26 44C40 62 68 58 80 52Z'
const LOOP_RIGHT = 'M80 52C110 -4 154 14 134 44C120 62 92 58 80 52Z'
const INNER_LEFT = 'M74 48C56 16 28 24 38 42C48 54 64 52 74 48Z'
const INNER_RIGHT = 'M86 48C104 16 132 24 122 42C112 54 96 52 86 48Z'
const CAP =
  'M12 64C10 52 24 48 34 52C42 44 58 44 64 52H96C102 44 118 44 126 52C136 48 150 52 148 64' +
  'C146 72 140 68 136 68C132 76 124 70 122 68C116 74 108 68 106 66H54C50 72 42 70 40 68C34 74 26 70 24 68C18 70 14 70 12 64Z'

export const giftSnow: ShapeDef = {
  viewBox: [160, 160],
  layers: [
    { name: 'Box', path: rrect(20, 76, 120, 76, 6), role: 'body' },
    { name: 'Lid', path: rrect(10, 56, 140, 28, 7), role: 'body' },
    { name: 'Lid shadow', path: 'M20 84H140V91H20Z', role: 'detail' },
    { name: 'Box shine', path: rrect(26, 98, 7, 46, 3.5), role: 'shine' },
    { name: 'Horizontal ribbon', path: 'M20 110H140V126H20Z', role: 'accent' },
    { name: 'Ribbon edges', path: 'M20 110H140V113H20ZM20 123H140V126H20Z', role: 'detail' },
    { name: 'Vertical ribbon', path: 'M68 56H92V152H68Z', role: 'accent' },
    { name: 'Ribbon sides', path: 'M68 56H72V152H68ZM88 56H92V152H88Z', role: 'detail' },
    { name: 'Snow cap', path: CAP, role: 'accent2' },
    { name: 'Left loop', path: LOOP_LEFT, role: 'accent' },
    { name: 'Right loop', path: LOOP_RIGHT, role: 'accent' },
    { name: 'Left loop shade', path: INNER_LEFT, role: 'detail' },
    { name: 'Right loop shade', path: INNER_RIGHT, role: 'detail' },
    { name: 'Tails', path: 'M72 60L54 90L65 92L78 68ZM88 60L106 90L95 92L82 68Z', role: 'accent' },
    { name: 'Knot', path: disc(80, 52, 12), role: 'accent' },
    { name: 'Knot shade', path: 'M80 40a12 12 0 0 1 0 24a8 12 0 0 0 0-24Z', role: 'detail' },
    { name: 'Knot shine', path: disc(76, 48, 3.5), role: 'shine' },
  ],
}
