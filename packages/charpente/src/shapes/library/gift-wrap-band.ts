import type { ShapeDef } from '../../types'
import { rrect } from '../geometry'
import { bow } from './bow'

export const giftWrapBand: ShapeDef = {
  viewBox: [200, 20],
  stretch: true,
  layers: [
    { name: 'Paper', path: rrect(0, 0, 200, 20, 3), role: 'body' },
    { name: 'Paper shade', path: 'M0 16H200V20H0Z', role: 'detail', opacity: 0.08 },
    { name: 'Ribbon', path: 'M0 7H200V13H0Z', role: 'accent', gradient: 'y' },
    { name: 'Ribbon edges', path: 'M0 7H200V8H0ZM0 12H200V13H0Z', role: 'detail', opacity: 0.2 },
  ],
  fixed: bow('auto 118%'),
}
