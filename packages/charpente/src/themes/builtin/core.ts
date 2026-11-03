import { flat } from '../../css'
import type { ThemeDef } from '../../types'

const lines = (color: string): string =>
  `repeating-linear-gradient(to bottom, ${color} 0 0.8lh, transparent 0.8lh 1lh)`

export const solid: ThemeDef = {
  paint: {
    text: {
      fill: lines('var(--charpente-base)'),
      style: { borderRadius: 'var(--charpente-radius)' },
    },
    media: {
      fill: flat('var(--charpente-base)'),
      style: { borderRadius: 'var(--charpente-radius)' },
    },
    control: {
      fill: flat('var(--charpente-base)'),
      style: { borderRadius: 'var(--charpente-radius)' },
    },
    block: {
      fill: flat('var(--charpente-base)'),
      style: { borderRadius: 'var(--charpente-radius)' },
    },
  },
}
export const outline: ThemeDef = {
  paint: {
    text: {
      fill: flat('color-mix(in srgb, var(--charpente-base) 12%, transparent)'),
      style: {
        outline: '1px dashed var(--charpente-strong)',
        outlineOffset: '-1.5px',
        borderRadius: 'var(--charpente-radius)',
      },
    },
    media: {
      fill: flat('color-mix(in srgb, var(--charpente-base) 12%, transparent)'),
      style: {
        outline: '1px dashed var(--charpente-strong)',
        outlineOffset: '-1.5px',
        borderRadius: 'var(--charpente-radius)',
      },
    },
    control: {
      fill: flat('color-mix(in srgb, var(--charpente-base) 12%, transparent)'),
      style: {
        outline: '1px dashed var(--charpente-strong)',
        outlineOffset: '-1.5px',
        borderRadius: 'var(--charpente-radius)',
      },
    },
    block: {
      fill: flat('color-mix(in srgb, var(--charpente-base) 12%, transparent)'),
      style: {
        outline: '1px dashed var(--charpente-strong)',
        outlineOffset: '-1.5px',
        borderRadius: 'var(--charpente-radius)',
      },
    },
  },
}
export const dots: ThemeDef = { pattern: 'dots' }
