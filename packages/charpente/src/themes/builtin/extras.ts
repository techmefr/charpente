import { flat, motif, tint } from '../../css'
import type { ThemeDef } from '../../types'
import { buildTheme } from './build'

export const blueprint: ThemeDef = {
  tokens: { accent: '#93c5fd', shine: 'rgba(147, 197, 253, 0.35)' },
  pattern: {
    fill: 'linear-gradient(rgba(147, 197, 253, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(147, 197, 253, 0.4) 1px, transparent 1px), linear-gradient(#1e3a8a, #1d4ed8)',
    size: (step) => `${8 * step}px ${8 * step}px, ${8 * step}px ${8 * step}px, auto`,
  },
  radius: '2px',
  style: { outline: '1px solid rgba(191, 219, 254, 0.8)', outlineOffset: '-1px' },
}
export const halftone: ThemeDef = {
  pattern: {
    fill: (step) =>
      `radial-gradient(circle, var(--charpente-strong) 0 ${1.6 * step}px, transparent ${1.6 * step + 0.5}px), ${flat(tint('base', 55))}`,
    size: (step) => `${5 * step}px ${5 * step}px, auto`,
  },
  radius: (step) => `${step}px`,
}
export const stripes: ThemeDef = {
  pattern: {
    fill: (step) =>
      `repeating-linear-gradient(45deg, var(--charpente-base) 0 ${3 * step}px, var(--charpente-strong) ${3 * step}px ${6 * step}px)`,
  },
  radius: (step) => `${2 * step}px`,
}
export const neon: ThemeDef = buildTheme(() => ({
  tokens: { accent: '#22d3ee', accent2: '#f0abfc', shine: 'rgba(240, 171, 252, 0.3)' },
  pattern: { fill: flat(tint('accent', 8)) },
  radius: (step) => `${2 * step}px`,
  style: {
    outline: `1.5px solid ${tint('accent', 90)}`,
    outlineOffset: '-1.5px',
    boxShadow: (step) => `0 0 ${5 * step}px ${tint('accent', 70)}, inset 0 0 ${4 * step}px ${tint('accent2', 45)}`,
  },
}))
export const aurora: ThemeDef = buildTheme(() => ({
  tokens: { accent: '#2dd4bf', accent2: '#a78bfa', shine: 'rgba(255, 255, 255, 0.5)' },
  pattern: { fill: `linear-gradient(100deg, ${tint('accent', 45)}, ${tint('accent2', 45)} 50%, rgba(52, 211, 153, 0.4))` },
  radius: (step) => `${3 * step}px`,
}))
export const waves: ThemeDef = buildTheme(() => ({
  tokens: { accent: '#38bdf8' },
  pattern: {
    fill: `${motif('<path d="M-12 6q12-10 24 0t24 0t24 0M-12 16q12-10 24 0t24 0t24 0M-12 26q12-10 24 0t24 0t24 0M-12 36q12-10 24 0t24 0t24 0M-12 46q12-10 24 0t24 0t24 0" fill="none" stroke="#67b5dc" stroke-width=".8"/>')}, ${flat(tint('accent', 8))}`,
    size: '48px 48px, auto',
  },
  radius: '6px',
}))
