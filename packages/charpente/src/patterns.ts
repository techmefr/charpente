import type { PatternDef } from './types'

export const builtinPatterns: Record<string, PatternDef> = {
  solid: { fill: 'linear-gradient(var(--charpente-base), var(--charpente-base))' },
  dots: {
    fill: 'radial-gradient(circle, var(--charpente-strong) 0.9px, transparent 1.2px)',
    size: '5px 5px',
  },
  stripes: {
    fill: 'repeating-linear-gradient(135deg, var(--charpente-base) 0 6px, var(--charpente-strong) 6px 12px)',
  },
  grid: {
    fill: 'linear-gradient(var(--charpente-strong) 1px, transparent 1px), linear-gradient(90deg, var(--charpente-strong) 1px, transparent 1px), linear-gradient(var(--charpente-base), var(--charpente-base))',
    size: '8px 8px, 8px 8px, auto',
  },
}
