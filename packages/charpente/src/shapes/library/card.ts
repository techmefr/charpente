import type { ShapeDef } from '../../types'
import { organicCard } from '../organic'

const base = /* @__PURE__ */ organicCard(11)

export const card: ShapeDef = {
  ...base,
  layers: [...base.layers, { name: 'Highlight', path: 'M30 14H110Q116 14 116 20Q116 26 110 26H30Q24 26 24 20Q24 14 30 14Z', role: 'shine' }],
}
