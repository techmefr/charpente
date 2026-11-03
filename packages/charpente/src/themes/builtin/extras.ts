import { flat, motif, tint } from '../../css'
import type { ThemeDef } from '../../types'
import { buildTheme } from './build'

export const paper: ThemeDef = {
  tokens: { shine: 'rgba(255, 255, 255, 0.55)' },
  pattern: {
    fill: (step) =>
      `repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.05) 0 1px, transparent 1px ${3 * step}px), linear-gradient(color-mix(in srgb, #d6c7a1 50%, var(--charpente-base)), color-mix(in srgb, #d6c7a1 50%, var(--charpente-base)))`,
    size: 'auto, auto',
  },
  radius: (step) => `${step}px`,
  style: { boxShadow: 'inset 0 0 0 1px rgba(120, 90, 40, 0.18)' },
}
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
export const scanline: ThemeDef = {
  pattern: {
    fill: (step) => `repeating-linear-gradient(0deg, var(--charpente-strong) 0 1px, transparent 1px ${3 * step}px), ${flat('var(--charpente-base)')}`,
    size: 'auto, auto',
  },
  radius: '1px',
}
export const vegas: ThemeDef = {
  tokens: { accent: '#fc4445', accent2: '#3feee6', shine: 'rgba(255, 255, 255, 0.55)' },
  paint: {
    text: {
      fill: 'linear-gradient(#3feee6, #3feee6)',
      style: { borderRadius: '0', boxShadow: 'inset 0 -2px 0 #fc4445' },
    },
    control: {
      fill: 'linear-gradient(#fc4445, #fc4445)',
      style: { borderRadius: '0', boxShadow: 'inset 0 0 0 2px #3feee6' },
    },
    media: {
      fill: 'linear-gradient(135deg, #fc4445 0 50%, #3feee6 50% 100%)',
      style: { borderRadius: '0' },
    },
    block: {
      fill: 'linear-gradient(90deg, #fc4445 0 20%, #3feee6 20% 40%, #55bcc9 40% 60%, #97caef 60% 80%, #cafafe 80% 100%)',
      style: { borderRadius: '0' },
    },
  },
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
export const brutalist: ThemeDef = {
  tokens: { accent: '#111111', shine: 'rgba(255, 255, 255, 0.5)' },
  dark: { accent: '#f5f5f5' },
  pattern: { fill: flat('var(--charpente-accent)') },
  radius: '0',
  style: {
    outline: '2px solid var(--charpente-accent)',
    outlineOffset: '-2px',
    boxShadow: (step) => `${2 * step}px ${2 * step}px 0 var(--charpente-accent)`,
  },
}
export const sketch: ThemeDef = {
  pattern: { fill: (step) => `repeating-linear-gradient(-45deg, var(--charpente-strong) 0 1px, transparent 1px ${5 * step}px)` },
  radius: (step) => `${6 * step}px ${2 * step}px ${5 * step}px ${2 * step}px`,
  style: { outline: '1.5px solid var(--charpente-strong)', outlineOffset: '-1.5px' },
}
export const topo: ThemeDef = {
  pattern: {
    fill: (step) =>
      `repeating-radial-gradient(circle at 125% 140%, transparent 0 ${9 * step}px, var(--charpente-strong) ${9 * step}px ${10 * step}px), ${flat(tint('base', 60))}`,
    size: 'auto, auto',
  },
  radius: (step) => `${2 * step}px`,
}
export const waves: ThemeDef = buildTheme(() => ({
  tokens: { accent: '#38bdf8' },
  pattern: {
    fill: `${motif('<path d="M-12 6q12-10 24 0t24 0t24 0M-12 16q12-10 24 0t24 0t24 0M-12 26q12-10 24 0t24 0t24 0M-12 36q12-10 24 0t24 0t24 0M-12 46q12-10 24 0t24 0t24 0" fill="none" stroke="#67b5dc" stroke-width=".8"/>')}, ${flat(tint('accent', 8))}`,
    size: '48px 48px, auto',
  },
  radius: '6px',
}))
