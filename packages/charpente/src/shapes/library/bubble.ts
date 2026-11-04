import type { ShapeDef } from '../../types'
import { disc, rrect } from '../geometry'

export const bubble: ShapeDef = {
  viewBox: [200, 150],
  layers: [
    { name: 'Bubble', path: rrect(6, 6, 188, 106, 22), role: 'body' },
    { name: 'Tail', path: 'M44 104L38 144L86 108Z', role: 'body' },
    { name: 'Highlight', path: rrect(20, 14, 70, 8, 4), role: 'shine' },
    { name: 'First dot', path: disc(68, 59, 9), role: 'accent' },
    { name: 'Second dot', path: disc(100, 59, 9), role: 'accent' },
    { name: 'Third dot', path: disc(132, 59, 9), role: 'accent2' },
  ],
}
