export interface ShapePreset {
  id: string
  label: string
  radius: string
  clip: string
}

const polygon = (points: string): string => `polygon(${points})`

export const SHAPES: ShapePreset[] = [
  { id: 'square', label: 'Square', radius: '0', clip: 'none' },
  { id: 'soft', label: 'Soft', radius: '6px', clip: 'none' },
  { id: 'round', label: 'Round', radius: '16px', clip: 'none' },
  { id: 'pill', label: 'Pill', radius: '999px', clip: 'none' },
  { id: 'circle', label: 'Circle', radius: '50%', clip: 'none' },
  { id: 'leaf', label: 'Leaf', radius: '0 28px 0 28px', clip: 'none' },
  { id: 'blob', label: 'Blob', radius: '30% 70% 70% 30% / 30% 30% 70% 70%', clip: 'none' },
  { id: 'egg', label: 'Egg', radius: '50% 50% 50% 50% / 60% 60% 40% 40%', clip: 'none' },
  { id: 'cut', label: 'Cut corners', radius: '0', clip: polygon('10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px') },
  { id: 'tag', label: 'Tag', radius: '0', clip: polygon('0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%') },
  { id: 'arrow', label: 'Arrow', radius: '0', clip: polygon('0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%') },
  { id: 'hexagon', label: 'Hexagon', radius: '0', clip: polygon('12px 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0 50%') },
  { id: 'slant', label: 'Slant', radius: '0', clip: polygon('14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%') },
  { id: 'notch', label: 'Notch', radius: '0', clip: polygon('0 0, 40% 0, 46% 10px, 54% 10px, 60% 0, 100% 0, 100% 100%, 0 100%') },
  { id: 'ellipse', label: 'Ellipse', radius: '0', clip: 'ellipse(50% 50% at 50% 50%)' },
]

export interface FillPreset {
  id: string
  label: string
  fill: string
  size: string
  short?: boolean
}

const BASE = 'linear-gradient(var(--charpente-base), var(--charpente-base))'
const STRONG = 'var(--charpente-strong)'

export const FILLS: FillPreset[] = [
  { id: 'solid', label: 'Solid', fill: BASE, size: '', short: true },
  { id: 'dots', label: 'Dots', fill: `radial-gradient(circle, ${STRONG} 0.9px, transparent 1.2px)`, size: '5px 5px', short: true },
  { id: 'stripes', label: 'Stripes', fill: `repeating-linear-gradient(135deg, var(--charpente-base) 0 6px, ${STRONG} 6px 12px)`, size: '', short: true },
  {
    id: 'grid',
    label: 'Grid',
    fill: `linear-gradient(${STRONG} 1px, transparent 1px), linear-gradient(90deg, ${STRONG} 1px, transparent 1px), ${BASE}`,
    size: '8px 8px, 8px 8px, auto',
    short: true,
  },
  {
    id: 'halftone',
    label: 'Halftone',
    fill: `radial-gradient(circle at 25% 25%, ${STRONG} 1.6px, transparent 2px), radial-gradient(circle at 75% 75%, ${STRONG} 1.6px, transparent 2px), ${BASE}`,
    size: '9px 9px, 9px 9px, auto',
  },
  { id: 'topo', label: 'Topo', fill: `repeating-radial-gradient(ellipse at 30% 40%, transparent 0 7px, ${STRONG} 7px 8px), ${BASE}`, size: '' },
  {
    id: 'matrix',
    label: 'Matrix',
    fill: `repeating-linear-gradient(0deg, transparent 0 4px, var(--charpente-accent) 4px 6px, transparent 6px 14px), repeating-linear-gradient(90deg, var(--charpente-base) 0 7px, ${STRONG} 7px 8px)`,
    size: '',
  },
  { id: 'checker', label: 'Checker', fill: `conic-gradient(${STRONG} 25%, var(--charpente-base) 0 50%, ${STRONG} 0 75%, var(--charpente-base) 0)`, size: '14px 14px' },
  { id: 'hatch', label: 'Hatch', fill: `repeating-linear-gradient(45deg, transparent 0 4px, ${STRONG} 4px 5px), ${BASE}`, size: '' },
  { id: 'waves', label: 'Waves', fill: `radial-gradient(circle at 50% 100%, transparent 0 7px, ${STRONG} 7px 8px, transparent 8px), ${BASE}`, size: '18px 10px, auto' },
  {
    id: 'aurora',
    label: 'Aurora',
    fill: 'linear-gradient(120deg, color-mix(in srgb, var(--charpente-accent) 38%, var(--charpente-base)), color-mix(in srgb, var(--charpente-accent2) 38%, var(--charpente-base)))',
    size: '',
  },
]

export const findFill = (id: string): FillPreset | undefined => FILLS.find((preset) => preset.id === id)

export const SAMPLE_FILLS = [
  'linear-gradient(135deg, #f97316, #ec4899)',
  'repeating-linear-gradient(90deg, #0ea5e9 0 4px, transparent 4px 12px)',
  'radial-gradient(circle at 30% 30%, #fde047, #f97316 70%)',
]
