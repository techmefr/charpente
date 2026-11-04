import type { ShapeDef } from '../../types'
import { rrect } from '../geometry'
import { snowCap } from './frost-parts'

export const frostChip: ShapeDef = {
  viewBox: [200, 24],
  stretch: true,
  layers: [
    { name: 'Glass', path: rrect(0, 4, 200, 20, 5), role: 'body' },
    { name: 'Glass shade', path: 'M0 20H200V24H0Z', role: 'detail', opacity: 0.1 },
    { name: 'Frost bottom', path: 'M5 22.4H195V24H5Z', role: 'shine', opacity: 0.55 },
    { name: 'Snow underside', path: snowCap(200, 5, 0.34, 0.9), role: 'detail', opacity: 0.18 },
    { name: 'Snow', path: snowCap(200, 5, 0.34), role: 'accent2' },
  ],
}
