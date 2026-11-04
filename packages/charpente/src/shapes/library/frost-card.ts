import type { ShapeDef } from '../../types'
import { rrect } from '../geometry'
import { fern, snowCap } from './frost-parts'

const FERN = 60

export const frostCard: ShapeDef = {
  viewBox: [200, 120],
  stretch: true,
  layers: [
    { name: 'Glass', path: rrect(0, 10, 200, 110, 10), role: 'body' },
    { name: 'Glass shade', path: 'M0 110H200V120H0Z', role: 'detail', opacity: 0.07 },
    { name: 'Frost left', path: 'M0 14H2.5V116H0Z', role: 'shine', opacity: 0.6 },
    { name: 'Frost right', path: 'M197.5 14H200V116H197.5Z', role: 'shine', opacity: 0.6 },
    { name: 'Frost bottom', path: 'M6 117.5H194V120H6Z', role: 'shine', opacity: 0.6 },
    { name: 'Snow underside', path: snowCap(200, 12, 1, 1.6), role: 'detail', opacity: 0.078 },
    { name: 'Snow', path: snowCap(200, 12, 1), role: 'accent2' },
  ],
  fixed: [
    { viewBox: [FERN, FERN], size: 'auto 38%', position: 'left 2px top 15%', layers: [{ name: 'Top fern', path: fern(FERN, false), role: 'shine', opacity: 0.85 }] },
    { viewBox: [FERN, FERN], size: 'auto 38%', position: 'right 2px bottom 3%', layers: [{ name: 'Bottom fern', path: fern(FERN, true), role: 'shine', opacity: 0.85 }] },
  ],
}
