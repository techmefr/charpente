import type { ShapeDef } from '../../types'
import { disc } from '../geometry'

export const label: ShapeDef = {
  viewBox: [200, 100],
  layers: [
    { name: 'Tag', path: 'M44 8H186Q194 8 194 16V84Q194 92 186 92H44L6 50Z', role: 'body' },
    { name: 'Edge', path: 'M44 8L6 50L44 92H52L16 50L52 8Z', role: 'detail' },
    { name: 'Eyelet', path: disc(44, 50, 10), role: 'accent' },
    { name: 'Hole', path: disc(44, 50, 4.5), role: 'detail' },
    { name: 'Lines', path: 'M76 36H170V44H76ZM76 56H140V64H76Z', role: 'accent' },
  ],
}
