export interface Target {
  name: string
  url: string
  simple: string
  complex: string
}

export const THEMES = [
  'solid',
  'outline',
  'dots',
  'cyberpunk',
  'web',
  'glass',
  'blueprint',
  'halftone',
  'stripes',
  'neon',
  'aurora',
  'brutalist',
  'sketch',
  'topo',
  'waves',
  'music',
  'developer',
  'wellness',
]
export const PAGES = ['simple', 'complex'] as const
export const ROOT = '[data-testid="root"]'
export const SETTLE_MS = 1500
export const GEOMETRY_TOLERANCE = 1
export const MAX_REPORTED = 4
