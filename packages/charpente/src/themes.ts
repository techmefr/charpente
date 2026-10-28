import { extraThemes } from './extras'
import { eventThemes, usageThemes } from './families'
import { seasonalThemes } from './seasons'
import type { ThemeDef } from './types'

export const flat = (color: string): string => `linear-gradient(${color}, ${color})`

const lines = (color: string): string =>
  `repeating-linear-gradient(to bottom, ${color} 0 0.8lh, transparent 0.8lh 1lh)`

const coreThemes: Record<string, ThemeDef> = {
  solid: {
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
  },
  outline: {
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
  },
  dots: {
    paint: {
      text: {
        fill: 'radial-gradient(circle, var(--charpente-strong) 0.9px, transparent 1.2px)',
        size: '5px 5px',
      },
      media: {
        fill: 'radial-gradient(circle, var(--charpente-strong) 0.9px, transparent 1.2px)',
        size: '5px 5px',
      },
      control: {
        fill: 'radial-gradient(circle, var(--charpente-strong) 0.9px, transparent 1.2px)',
        size: '5px 5px',
      },
      block: {
        fill: 'radial-gradient(circle, var(--charpente-strong) 0.9px, transparent 1.2px)',
        size: '5px 5px',
      },
    },
  },
  cyberpunk: {
    tokens: { base: '#0b1426', strong: '#16435a', accent: '#22d3ee', accent2: '#e879f9', shine: 'rgba(34,211,238,.18)' },
    paint: Object.fromEntries(['text', 'media', 'control', 'block'].map((type) => [type, {
      fill: 'repeating-linear-gradient(0deg, transparent 0 3px, rgba(34,211,238,.07) 3px 4px), linear-gradient(125deg, var(--charpente-base) 45%, #251332)',
      size: 'auto, auto',
      style: {
        borderRadius: type === 'text' ? '3px' : '6px',
        boxShadow: 'inset 0 0 0 1px rgba(34,211,238,.55), inset -2px 0 0 var(--charpente-accent2), 0 0 8px rgba(34,211,238,.1)',
      },
    }])),
  },
  web: {
    paint: Object.fromEntries(['text', 'media', 'control', 'block'].map((type) => [type, {
      fill: 'repeating-radial-gradient(ellipse at 22% 65%, transparent 0 9px, color-mix(in srgb, var(--charpente-strong) 65%, transparent) 9px 9.7px, transparent 9.7px 10px), repeating-conic-gradient(from 12deg at 22% 65%, transparent 0 23.5deg, color-mix(in srgb, var(--charpente-strong) 80%, transparent) 23.5deg 24deg), linear-gradient(var(--charpente-base), var(--charpente-base))',
      size: '96px 72px, 96px 72px, auto',
      style: { borderRadius: type === 'text' ? '4px' : '8px' },
    }])),
  },
}

export const builtinThemes: Record<string, ThemeDef> = {
  ...coreThemes,
  ...extraThemes,
  ...usageThemes,
  ...eventThemes,
  ...seasonalThemes,
}
