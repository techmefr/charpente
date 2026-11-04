import type { ShapeDef } from '../../types'
import { disc } from '../geometry'
import { blob } from '../organic'

const base = /* @__PURE__ */ blob(7)

export const avatar: ShapeDef = {
  viewBox: base.viewBox,
  layers: [
    ...base.layers,
    { name: 'Highlight', path: disc(34, 30, 9), role: 'shine' },
    { name: 'Status ring', path: disc(80, 82, 13), role: 'accent2' },
    { name: 'Status dot', path: disc(80, 82, 8), role: 'accent' },
  ],
}
