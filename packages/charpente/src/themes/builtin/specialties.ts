import type { ThemeDef } from '../../types'

const texture = (base: string, strong: string, fill: string, size: string, radius = '6px'): ThemeDef => ({
  tokens: { base, strong },
  pattern: { fill: `${fill}, linear-gradient(var(--charpente-base), var(--charpente-base))`, size: `${size}, auto` },
  radius,
  style: { boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--charpente-strong) 55%, transparent)' },
  paint: {
    text: { fill: 'linear-gradient(var(--charpente-strong), var(--charpente-strong))', style: { borderRadius: '3px' } },
    control: { fill: 'linear-gradient(135deg, var(--charpente-strong), var(--charpente-base))' },
  },
})

const ink = 'var(--charpente-strong)'






export const travel = texture('#d8ece7', '#6cafa6', `repeating-radial-gradient(ellipse at 12% 90%, transparent 0 11px, ${ink} 11px 12px)`, 'auto', '10px')
export const wellness = texture('#e5eadd', '#99ae94', `radial-gradient(ellipse at 15% 0%, ${ink}, transparent 68%)`, 'auto', '16px')
