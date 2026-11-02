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
  'paper',
  'glass',
  'blueprint',
  'halftone',
  'stripes',
  'scanline',
  'neon',
  'vegas',
  'aurora',
  'brutalist',
  'sketch',
  'topo',
  'waves',
  'editorial',
  'commerce',
  'analytics',
  'gaming',
  'music',
  'developer',
  'travel',
  'wellness',
]
export const PAGES = ['simple', 'complex'] as const
export const ROOT = '[data-testid="root"]'
export const SETTLE_MS = 1500
export const GEOMETRY_TOLERANCE = 1
export const MAX_REPORTED = 4
