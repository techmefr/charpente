import { motif, tint } from './motifs'
import type { ThemeDef } from './types'

const flat = (color: string): string => `linear-gradient(${color}, ${color})`

export const usageThemes: Record<string, ThemeDef> = {
  editorial: {
    paint: {
      text: {
        fill: flat(tint('base', 70)),
        style: {
          borderRadius: '0',
          boxShadow: 'inset 0 2px 0 var(--charpente-strong), inset 0 -1px 0 var(--charpente-strong)',
        },
      },
      control: {
        fill: flat(tint('base', 70)),
        style: {
          borderRadius: '0',
          boxShadow: 'inset 0 0 0 1px var(--charpente-strong), inset 0 -3px 0 var(--charpente-strong)',
        },
      },
      media: {
        fill: `linear-gradient(to top right, transparent calc(50% - 0.5px), var(--charpente-strong) calc(50% - 0.5px) calc(50% + 0.5px), transparent calc(50% + 0.5px)), linear-gradient(to bottom right, transparent calc(50% - 0.5px), var(--charpente-strong) calc(50% - 0.5px) calc(50% + 0.5px), transparent calc(50% + 0.5px)), ${flat(tint('base', 40))}`,
        size: '100% 100%, 100% 100%, auto',
        style: { borderRadius: '0', boxShadow: 'inset 0 0 0 1px var(--charpente-strong)' },
      },
      block: {
        fill: `linear-gradient(to top right, transparent calc(50% - 0.5px), var(--charpente-strong) calc(50% - 0.5px) calc(50% + 0.5px), transparent calc(50% + 0.5px)), linear-gradient(to bottom right, transparent calc(50% - 0.5px), var(--charpente-strong) calc(50% - 0.5px) calc(50% + 0.5px), transparent calc(50% + 0.5px)), ${flat(tint('base', 40))}`,
        size: '100% 100%, 100% 100%, auto',
        style: { borderRadius: '0', boxShadow: 'inset 0 0 0 1px var(--charpente-strong)' },
      },
    },
  },
  commerce: {
    tokens: { accent: '#b45309', shine: 'rgba(255, 255, 255, 0.5)' },
    pattern: {
      fill: (step) => `repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.28) 0 2px, transparent 2px ${6 * step}px), ${flat(tint('accent', 28))}`,
      size: 'auto, auto',
    },
    radius: (step) => `${3 * step}px`,
    style: {
      outline: `1.5px dashed ${tint('accent', 65)}`,
      outlineOffset: (step) => `-${2 * step}px`,
    },
  },
  analytics: {
    tokens: { accent: '#6366f1', shine: 'rgba(255, 255, 255, 0.5)' },
    pattern: {
      fill: (step) =>
        `repeating-linear-gradient(90deg, ${tint('accent', 38)} 0 ${10 * step}px, transparent ${10 * step}px ${12 * step}px), linear-gradient(var(--charpente-strong) 1px, transparent 1px), linear-gradient(90deg, var(--charpente-strong) 1px, transparent 1px), ${flat(tint('base', 60))}`,
      size: (step) => `auto, ${6 * step}px ${6 * step}px, ${6 * step}px ${6 * step}px, auto`,
    },
    radius: (step) => `${step}px`,
  },
  gaming: {
    tokens: { accent: '#22c55e', shine: 'rgba(134, 239, 172, 0.35)' },
    pattern: {
      fill: `conic-gradient(${tint('accent', 42)} 25%, ${tint('accent', 20)} 0 50%, ${tint('accent', 42)} 0 75%, ${tint('accent', 20)} 0)`,
      size: (step) => `${5 * step}px ${5 * step}px`,
    },
    radius: '0',
    style: { boxShadow: `inset 0 0 0 2px ${tint('accent', 80)}` },
  },
  music: {
    tokens: { accent: '#a855f7', accent2: '#22d3ee' },
    pattern: {
      fill: `${motif('<g fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round"><path d="M4 21v6m5-12v18m5-23v28m5-19v10m5-24v38m5-29v20m5-14v8m5-18v28m5-20v12"/></g>')}, ${flat(tint('accent', 8))}`,
      size: '48px 48px, auto',
    },
    radius: '4px',
  },
  developer: {
    tokens: { accent: '#10b981', accent2: '#38bdf8', shine: 'rgba(16, 185, 129, 0.3)' },
    pattern: {
      fill: (step) => `repeating-linear-gradient(90deg, ${tint('accent', 40)} 0 ${14 * step}px, transparent ${14 * step}px ${16 * step}px), ${flat(tint('base', 70))}`,
      size: 'auto, auto',
    },
    radius: (step) => `${2 * step}px`,
    style: { boxShadow: `inset 3px 0 0 ${tint('accent2', 70)}` },
  },
  travel: {
    tokens: { accent: '#0d9488', accent2: '#f59e0b', shine: 'rgba(255, 255, 255, 0.55)' },
    pattern: {
      fill: (step) =>
        `radial-gradient(circle, ${tint('accent2', 80)} 1px, transparent 1.6px), repeating-radial-gradient(circle at -25% 140%, transparent 0 ${9 * step}px, ${tint('accent', 40)} ${9 * step}px ${10 * step}px), ${flat(tint('base', 60))}`,
      size: (step) => `${18 * step}px ${18 * step}px, auto, auto`,
    },
    radius: (step) => `${3 * step}px`,
  },
  wellness: {
    tokens: { accent: '#84a98c', accent2: '#e9c46a', shine: 'rgba(255, 255, 255, 0.6)' },
    pattern: {
      fill: `radial-gradient(circle, rgba(0, 0, 0, 0.05) 0.6px, transparent 1px), linear-gradient(120deg, ${tint('accent', 38)}, ${tint('accent2', 28)})`,
      size: '3px 3px, auto',
    },
    radius: (step) => (step === 1 ? '999px' : `${8 * step}px`),
  },
}
