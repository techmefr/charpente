import type { ThemeDef } from '../../types'
import { clipCut } from './shapes'

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
export const paper = texture('#ede1c9', '#b59a6e', `repeating-linear-gradient(0deg, transparent 0 7px, ${ink} 7px 8px)`, 'auto', '2px')
export const stripes = texture('#d9dfed', '#8f9fbd', `repeating-linear-gradient(135deg, transparent 0 8px, ${ink} 8px 11px)`, 'auto')
export const scanline = texture('#253344', '#668597', `repeating-linear-gradient(0deg, transparent 0 4px, ${ink} 4px 5px)`, 'auto', '2px')
export const vegas = {
  ...texture('#2d1336', '#ff6889', 'linear-gradient(120deg, #38154d, #af2f81 45%, #23b7bc 70%, #232649)', 'auto'),
  motion: 'border-beam',
} satisfies ThemeDef
export const editorial = texture('#e9e4da', '#9c8d7a', `linear-gradient(30deg, transparent 49.5%, ${ink} 50%, transparent 50.5%), linear-gradient(150deg, transparent 49.5%, ${ink} 50%, transparent 50.5%)`, '100% 100%, 100% 100%', '0')
export const commerce = texture('#f4e4cf', '#c89668', `repeating-linear-gradient(45deg, transparent 0 11px, ${ink} 11px 12px)`, 'auto', '2px 10px 10px 2px')
export const analytics = texture('#e0e4fb', '#7d8ed0', `repeating-linear-gradient(90deg, transparent 0 16px, ${ink} 16px 18px), repeating-linear-gradient(0deg, transparent 0 15px, ${ink} 15px 16px)`, 'auto, auto', '4px')
export const gaming = {
  ...texture('#212945', '#a79af6', `conic-gradient(${ink} 25%, transparent 0 50%, ${ink} 0 75%, transparent 0)`, '18px 18px', '0'),
  style: { clipPath: clipCut(6) },
} satisfies ThemeDef
export const music = texture('#332749', '#c18add', `radial-gradient(ellipse at 50% 50%, ${ink} 0 30%, transparent 34%)`, '12px 30px')
export const travel = texture('#d8ece7', '#6cafa6', `repeating-radial-gradient(ellipse at 12% 90%, transparent 0 11px, ${ink} 11px 12px)`, 'auto', '10px')
export const wellness = texture('#e5eadd', '#99ae94', `radial-gradient(ellipse at 15% 0%, ${ink}, transparent 68%)`, 'auto', '16px')
