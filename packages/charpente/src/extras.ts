import { scaled, tint } from './seasons'
import type { ThemeDef } from './types'

export const extraThemes: Record<string, ThemeDef> = {
  paper: {
    tokens: { shine: 'rgba(255, 255, 255, 0.55)' },
    paint: scaled((step) => ({
      fill: `repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.05) 0 1px, transparent 1px ${3 * step}px), linear-gradient(color-mix(in srgb, #d6c7a1 50%, var(--charpente-base)), color-mix(in srgb, #d6c7a1 50%, var(--charpente-base)))`,
      size: 'auto, auto',
      style: {
        borderRadius: `${step}px`,
        boxShadow: 'inset 0 0 0 1px rgba(120, 90, 40, 0.18)',
      },
    })),
  },
  glass: {
    tokens: { shine: 'rgba(255, 255, 255, 0.6)' },
    paint: scaled((step) => ({
      fill: `linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.08)), linear-gradient(${tint('strong', 34)}, ${tint('strong', 34)})`,
      size: 'auto, auto',
      style: {
        borderRadius: `${3 * step}px`,
        backdropFilter: 'blur(6px)',
        boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.55)',
      },
    })),
  },
  blueprint: {
    tokens: { accent: '#93c5fd', shine: 'rgba(147, 197, 253, 0.35)' },
    paint: scaled((step) => ({
      fill: `linear-gradient(rgba(147, 197, 253, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(147, 197, 253, 0.4) 1px, transparent 1px), linear-gradient(#1e3a8a, #1d4ed8)`,
      size: `${8 * step}px ${8 * step}px, ${8 * step}px ${8 * step}px, auto`,
      style: {
        borderRadius: '2px',
        outline: '1px solid rgba(191, 219, 254, 0.8)',
        outlineOffset: '-1px',
      },
    })),
  },
}
