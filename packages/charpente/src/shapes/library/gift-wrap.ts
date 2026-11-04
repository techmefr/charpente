import type { ShapeDef } from '../../types'
import { rrect } from '../geometry'
import { bow } from './bow'

export const giftWrap: ShapeDef = {
  viewBox: [200, 160],
  stretch: true,
  layers: [
    { name: 'Paper', path: rrect(0, 0, 200, 160, 9), role: 'body' },
    { name: 'Paper shade', path: 'M0 148H200V160H0Z', role: 'detail', opacity: 0.08 },
    { name: 'Vertical ribbon', path: 'M89 0H111V160H89Z', role: 'accent', gradient: 'x' },
    { name: 'Horizontal ribbon', path: 'M0 67H200V93H0Z', role: 'accent', gradient: 'y' },
    { name: 'Vertical edges', path: 'M89 0H91V160H89ZM109 0H111V160H109Z', role: 'detail', opacity: 0.2 },
    { name: 'Horizontal edges', path: 'M0 67H200V69H0ZM0 91H200V93H0Z', role: 'detail', opacity: 0.2 },
  ],
  fixed: bow('auto 64%'),
}
