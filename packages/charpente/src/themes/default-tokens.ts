import type { Tokens } from '../types'

export const DEFAULT_TOKENS: { light: Required<Tokens>; dark: Required<Tokens> } = {
  light: {
    base: '#e5e7eb',
    strong: '#c4c8d0',
    shine: 'rgba(255, 255, 255, 0.7)',
    accent: '#0891b2',
    accent2: '#c026d3',
  },
  dark: {
    base: '#2a2d34',
    strong: '#454a55',
    shine: 'rgba(255, 255, 255, 0.08)',
    accent: '#22d3ee',
    accent2: '#e879f9',
  },
}
