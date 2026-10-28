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
        fill: flat('transparent'),
        style: {
          outline: '1.5px dashed var(--charpente-strong)',
          outlineOffset: '-1.5px',
          borderRadius: 'var(--charpente-radius)',
        },
      },
      media: {
        fill: flat('transparent'),
        style: {
          outline: '1.5px dashed var(--charpente-strong)',
          outlineOffset: '-1.5px',
          borderRadius: 'var(--charpente-radius)',
        },
      },
      control: {
        fill: flat('transparent'),
        style: {
          outline: '1.5px dashed var(--charpente-strong)',
          outlineOffset: '-1.5px',
          borderRadius: 'var(--charpente-radius)',
        },
      },
      block: {
        fill: flat('transparent'),
        style: {
          outline: '1.5px dashed var(--charpente-strong)',
          outlineOffset: '-1.5px',
          borderRadius: 'var(--charpente-radius)',
        },
      },
    },
  },
  dots: {
    paint: {
      text: {
        fill: 'radial-gradient(circle, var(--charpente-strong) 1.2px, transparent 1.7px)',
        size: '6px 6px',
      },
      media: {
        fill: 'radial-gradient(circle, var(--charpente-strong) 1.4px, transparent 2px)',
        size: '8px 8px',
      },
      control: {
        fill: 'radial-gradient(circle, var(--charpente-strong) 1.2px, transparent 1.7px)',
        size: '6px 6px',
      },
      block: {
        fill: 'radial-gradient(circle, var(--charpente-strong) 1.4px, transparent 2px)',
        size: '8px 8px',
      },
    },
  },
  cyberpunk: {
    tokens: {
      accent: '#22d3ee',
      accent2: '#e879f9',
      shine: 'rgba(34, 211, 238, 0.35)',
    },
    paint: {
      text: {
        fill: `repeating-linear-gradient(0deg, transparent 0 2px, rgba(0, 0, 0, 0.25) 2px 3px), linear-gradient(135deg, color-mix(in srgb, var(--charpente-accent) 35%, transparent), color-mix(in srgb, var(--charpente-accent2) 35%, transparent))`,
        size: 'auto, auto',
        style: {
          clipPath:
            'polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)',
        },
      },
      media: {
        fill: `repeating-linear-gradient(0deg, transparent 0 2px, rgba(0, 0, 0, 0.25) 2px 3px), linear-gradient(135deg, color-mix(in srgb, var(--charpente-accent) 30%, transparent), color-mix(in srgb, var(--charpente-accent2) 30%, transparent))`,
        size: 'auto, auto',
        style: {
          clipPath:
            'polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
        },
      },
      control: {
        fill: `linear-gradient(135deg, color-mix(in srgb, var(--charpente-accent) 35%, transparent), color-mix(in srgb, var(--charpente-accent2) 35%, transparent))`,
        style: {
          clipPath:
            'polygon(0 6px, 6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)',
        },
      },
      block: {
        fill: `repeating-linear-gradient(0deg, transparent 0 2px, rgba(0, 0, 0, 0.25) 2px 3px), linear-gradient(135deg, color-mix(in srgb, var(--charpente-accent) 25%, transparent), color-mix(in srgb, var(--charpente-accent2) 25%, transparent))`,
        size: 'auto, auto',
        style: {
          clipPath:
            'polygon(0 16px, 16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)',
        },
      },
    },
  },
  web: {
    paint: {
      text: {
        fill: `repeating-radial-gradient(circle at 50% 50%, transparent 0 5px, var(--charpente-strong) 5px 6px), repeating-conic-gradient(from 0deg at 50% 50%, transparent 0 20deg, var(--charpente-strong) 20deg 21deg)`,
        size: 'auto, auto',
        style: { borderRadius: '3px' },
      },
      media: {
        fill: `repeating-radial-gradient(circle at 50% 50%, transparent 0 9px, var(--charpente-strong) 9px 10px), repeating-conic-gradient(from 0deg at 50% 50%, transparent 0 22.5deg, var(--charpente-strong) 22.5deg 23.5deg)`,
        size: 'auto, auto',
        style: { borderRadius: '4px' },
      },
      control: {
        fill: `repeating-radial-gradient(circle at 50% 50%, transparent 0 6px, var(--charpente-strong) 6px 7px), repeating-conic-gradient(from 0deg at 50% 50%, transparent 0 22.5deg, var(--charpente-strong) 22.5deg 23.5deg)`,
        size: 'auto, auto',
        style: { borderRadius: '4px' },
      },
      block: {
        fill: `repeating-radial-gradient(circle at 50% 50%, transparent 0 12px, var(--charpente-strong) 12px 13px), repeating-conic-gradient(from 0deg at 50% 50%, transparent 0 22.5deg, var(--charpente-strong) 22.5deg 23.5deg)`,
        size: 'auto, auto',
        style: { borderRadius: '6px' },
      },
    },
  },
}

export const builtinThemes: Record<string, ThemeDef> = { ...coreThemes, ...seasonalThemes }
