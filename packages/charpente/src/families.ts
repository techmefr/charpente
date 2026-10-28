import { scaled, tint } from './seasons'
import type { ThemeDef } from './types'

const flat = (color: string): string => `linear-gradient(${color}, ${color})`

const heart = (color: string): string =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath fill='${color}' d='M5 9C-2 4 1-1 5 2c4-3 7 2 0 7z'/%3E%3C/svg%3E")`

export const eventThemes: Record<string, ThemeDef> = {
  valentine: {
    tokens: { accent: '#f43f5e', accent2: '#fb7185', shine: 'rgba(255, 255, 255, 0.6)' },
    paint: scaled((step) => ({
      fill: `${heart('%23fb7185')}, ${flat(tint('accent2', 22))}`,
      size: `${12 * step}px ${12 * step}px, auto`,
      style: { borderRadius: `${3 * step}px` },
    })),
  },
  birthday: {
    tokens: { accent: '#ec4899', accent2: '#facc15', shine: 'rgba(255, 255, 255, 0.7)' },
    paint: scaled((step) => ({
      fill: `radial-gradient(circle at 15% 30%, #ec4899 0 ${1.6 * step}px, transparent ${1.6 * step + 0.5}px), radial-gradient(circle at 45% 70%, #facc15 0 ${1.6 * step}px, transparent ${1.6 * step + 0.5}px), radial-gradient(circle at 70% 25%, #22d3ee 0 ${1.6 * step}px, transparent ${1.6 * step + 0.5}px), radial-gradient(circle at 90% 65%, #a78bfa 0 ${1.6 * step}px, transparent ${1.6 * step + 0.5}px), ${flat('rgba(254, 243, 199, 0.55)')}`,
      size: `${18 * step}px ${14 * step}px, ${18 * step}px ${14 * step}px, ${18 * step}px ${14 * step}px, ${18 * step}px ${14 * step}px, auto`,
      style: {
        borderRadius: `${3 * step}px`,
        outline: `1.5px dashed ${tint('accent', 70)}`,
        outlineOffset: '-1.5px',
      },
    })),
  },
  pride: {
    paint: scaled((step) => ({
      fill: 'linear-gradient(180deg, rgba(228, 3, 3, 0.55) 0 16.6%, rgba(255, 140, 0, 0.55) 16.6% 33.3%, rgba(255, 237, 0, 0.6) 33.3% 50%, rgba(0, 128, 38, 0.5) 50% 66.6%, rgba(0, 77, 255, 0.5) 66.6% 83.3%, rgba(117, 7, 135, 0.5) 83.3% 100%)',
      style: { borderRadius: `${2 * step}px` },
    })),
  },
}

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
    paint: scaled((step) => ({
      fill: `repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.28) 0 2px, transparent 2px ${6 * step}px), ${flat(tint('accent', 28))}`,
      size: 'auto, auto',
      style: {
        borderRadius: `${3 * step}px`,
        outline: `1.5px dashed ${tint('accent', 65)}`,
        outlineOffset: `-${2 * step}px`,
      },
    })),
  },
  analytics: {
    tokens: { accent: '#6366f1', shine: 'rgba(255, 255, 255, 0.5)' },
    paint: scaled((step) => ({
      fill: `repeating-linear-gradient(90deg, ${tint('accent', 38)} 0 ${10 * step}px, transparent ${10 * step}px ${12 * step}px), linear-gradient(var(--charpente-strong) 1px, transparent 1px), linear-gradient(90deg, var(--charpente-strong) 1px, transparent 1px), ${flat(tint('base', 60))}`,
      size: `auto, ${6 * step}px ${6 * step}px, ${6 * step}px ${6 * step}px, auto`,
      style: { borderRadius: `${step}px` },
    })),
  },
  gaming: {
    tokens: { accent: '#22c55e', shine: 'rgba(134, 239, 172, 0.35)' },
    paint: scaled((step) => ({
      fill: `conic-gradient(${tint('accent', 42)} 25%, ${tint('accent', 20)} 0 50%, ${tint('accent', 42)} 0 75%, ${tint('accent', 20)} 0)`,
      size: `${5 * step}px ${5 * step}px`,
      style: {
        borderRadius: '0',
        boxShadow: `inset 0 0 0 ${2}px ${tint('accent', 80)}`,
      },
    })),
  },
  music: {
    tokens: { accent: '#a855f7', accent2: '#22d3ee', shine: 'rgba(255, 255, 255, 0.5)' },
    paint: scaled((step) => ({
      fill: `repeating-linear-gradient(90deg, ${tint('accent', 55)} 0 ${3 * step}px, transparent ${3 * step}px ${6 * step}px), linear-gradient(0deg, ${tint('accent2', 40)}, ${tint('accent', 12)})`,
      size: 'auto, auto',
      style: { borderRadius: `${2 * step}px` },
    })),
  },
  developer: {
    tokens: { accent: '#10b981', accent2: '#38bdf8', shine: 'rgba(16, 185, 129, 0.3)' },
    paint: scaled((step) => ({
      fill: `repeating-linear-gradient(90deg, ${tint('accent', 40)} 0 ${14 * step}px, transparent ${14 * step}px ${16 * step}px), ${flat(tint('base', 70))}`,
      size: 'auto, auto',
      style: {
        borderRadius: `${2 * step}px`,
        boxShadow: `inset ${3}px 0 0 ${tint('accent2', 70)}`,
      },
    })),
  },
  travel: {
    tokens: { accent: '#0d9488', accent2: '#f59e0b', shine: 'rgba(255, 255, 255, 0.55)' },
    paint: scaled((step) => ({
      fill: `radial-gradient(circle, ${tint('accent2', 80)} 1px, transparent 1.6px), repeating-radial-gradient(circle at -25% 140%, transparent 0 ${9 * step}px, ${tint('accent', 40)} ${9 * step}px ${10 * step}px), ${flat(tint('base', 60))}`,
      size: `${18 * step}px ${18 * step}px, auto, auto`,
      style: { borderRadius: `${3 * step}px` },
    })),
  },
  wellness: {
    tokens: { accent: '#84a98c', accent2: '#e9c46a', shine: 'rgba(255, 255, 255, 0.6)' },
    paint: scaled((step) => ({
      fill: `radial-gradient(circle, rgba(0, 0, 0, 0.05) 0.6px, transparent 1px), linear-gradient(120deg, ${tint('accent', 38)}, ${tint('accent2', 28)})`,
      size: '3px 3px, auto',
      style: { borderRadius: step === 1 ? '999px' : `${8 * step}px` },
    })),
  },
}
