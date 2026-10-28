import { motif, scaled, tint } from './seasons'
import type { ThemeDef } from './types'

const flat = (color: string): string => `linear-gradient(${color}, ${color})`

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
  halftone: {
    paint: scaled((step) => ({
      fill: `radial-gradient(circle, var(--charpente-strong) 0 ${1.6 * step}px, transparent ${1.6 * step + 0.5}px), ${flat(tint('base', 55))}`,
      size: `${5 * step}px ${5 * step}px, auto`,
      style: { borderRadius: `${step}px` },
    })),
  },
  stripes: {
    paint: scaled((step) => ({
      fill: `repeating-linear-gradient(45deg, var(--charpente-base) 0 ${3 * step}px, var(--charpente-strong) ${3 * step}px ${6 * step}px)`,
      style: { borderRadius: `${2 * step}px` },
    })),
  },
  scanline: {
    paint: scaled((step) => ({
      fill: `repeating-linear-gradient(0deg, var(--charpente-strong) 0 1px, transparent 1px ${3 * step}px), ${flat('var(--charpente-base)')}`,
      size: 'auto, auto',
      style: { borderRadius: '1px' },
    })),
  },
  vegas: {
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
  },
  neon: {
    tokens: { accent: '#22d3ee', accent2: '#f0abfc', shine: 'rgba(240, 171, 252, 0.3)' },
    paint: scaled((step) => ({
      fill: flat(tint('accent', 8)),
      style: {
        borderRadius: `${2 * step}px`,
        outline: `1.5px solid ${tint('accent', 90)}`,
        outlineOffset: '-1.5px',
        boxShadow: `0 0 ${5 * step}px ${tint('accent', 70)}, inset 0 0 ${4 * step}px ${tint('accent2', 45)}`,
      },
    })),
  },
  aurora: {
    tokens: { accent: '#2dd4bf', accent2: '#a78bfa', shine: 'rgba(255, 255, 255, 0.5)' },
    paint: scaled((step) => ({
      fill: `linear-gradient(100deg, ${tint('accent', 45)}, ${tint('accent2', 45)} 50%, rgba(52, 211, 153, 0.4))`,
      style: { borderRadius: `${3 * step}px` },
    })),
  },
  brutalist: {
    tokens: { accent: '#111111', shine: 'rgba(255, 255, 255, 0.5)' },
    dark: { accent: '#f5f5f5' },
    paint: scaled((step) => ({
      fill: flat('var(--charpente-accent)'),
      style: {
        borderRadius: '0',
        outline: '2px solid var(--charpente-accent)',
        outlineOffset: '-2px',
        boxShadow: `${2 * step}px ${2 * step}px 0 var(--charpente-accent)`,
      },
    })),
  },
  sketch: {
    paint: scaled((step) => ({
      fill: `repeating-linear-gradient(-45deg, var(--charpente-strong) 0 1px, transparent 1px ${5 * step}px)`,
      style: {
        borderRadius: `${6 * step}px ${2 * step}px ${5 * step}px ${2 * step}px`,
        outline: '1.5px solid var(--charpente-strong)',
        outlineOffset: '-1.5px',
      },
    })),
  },
  topo: {
    paint: scaled((step) => ({
      fill: `repeating-radial-gradient(circle at 125% 140%, transparent 0 ${9 * step}px, var(--charpente-strong) ${9 * step}px ${10 * step}px), ${flat(tint('base', 60))}`,
      size: 'auto, auto',
      style: { borderRadius: `${2 * step}px` },
    })),
  },
  waves: {
    tokens: { accent: '#38bdf8' },
    paint: scaled(() => ({
      fill: `${motif('<path d="M-12 6q12-10 24 0t24 0t24 0M-12 16q12-10 24 0t24 0t24 0M-12 26q12-10 24 0t24 0t24 0M-12 36q12-10 24 0t24 0t24 0M-12 46q12-10 24 0t24 0t24 0" fill="none" stroke="#67b5dc" stroke-width=".8"/>')}, ${flat(tint('accent', 8))}`,
      size: '48px 48px, auto',
      style: { borderRadius: '6px' },
    })),
  },
}
