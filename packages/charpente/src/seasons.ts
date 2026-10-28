import type { Paint, PaintType, ThemeDef } from './types'

type PaintBuilder = (step: number) => Paint

export const tint = (token: string, percent: number): string =>
  `color-mix(in srgb, var(--charpente-${token}) ${percent}%, transparent)`

export const scaled = (build: PaintBuilder): Partial<Record<PaintType, Paint>> => ({
  text: build(1),
  control: build(1.5),
  media: build(2.5),
  block: build(3),
})

const ghostEdge = (depth: number): string => {
  const teeth = Array.from(
    { length: 10 },
    (_, index) => `${95 - index * 10}% ${index % 2 === 0 ? '100%' : `calc(100% - ${depth}px)`}`,
  )
  return `polygon(0 0, 100% 0, 100% calc(100% - ${depth}px), ${teeth.join(', ')}, 0 calc(100% - ${depth}px))`
}

export const seasonalThemes: Record<string, ThemeDef> = {
  halloween: {
    tokens: { accent: '#f97316', accent2: '#7c3aed', shine: 'rgba(249, 115, 22, 0.4)' },
    paint: scaled((step) => ({
      fill: `radial-gradient(circle at 18% 50%, ${tint('accent', 60)} 0 ${3 * step}px, transparent ${3 * step + 0.5}px), linear-gradient(90deg, ${tint('accent2', 26)}, ${tint('accent', 32)})`,
      size: 'auto, auto',
      style: { clipPath: ghostEdge(4 * step) },
    })),
  },
  christmas: {
    tokens: { accent: '#dc2626', accent2: '#16a34a', shine: 'rgba(255, 255, 255, 0.7)' },
    paint: scaled((step) => ({
      fill: `radial-gradient(circle, rgba(255, 255, 255, 0.95) ${1.2 * step}px, transparent ${1.2 * step + 0.5}px), repeating-linear-gradient(45deg, ${tint('accent', 30)} 0 ${8 * step}px, ${tint('accent2', 30)} ${8 * step}px ${16 * step}px)`,
      size: `${12 * step}px ${12 * step}px, auto`,
      style: { borderRadius: `${3 * step}px` },
    })),
  },
  winter: {
    tokens: { accent: '#38bdf8', accent2: '#818cf8', shine: 'rgba(255, 255, 255, 0.85)' },
    dark: { shine: 'rgba(186, 230, 253, 0.25)' },
    paint: scaled((step) => ({
      fill: `repeating-conic-gradient(from 0deg at 50% 50%, ${tint('shine', 65)} 0 15deg, transparent 15deg 30deg), linear-gradient(135deg, ${tint('accent', 32)}, ${tint('accent2', 20)})`,
      size: `${12 * step}px ${12 * step}px, auto`,
      style: {
        borderRadius: `${2 * step}px`,
        boxShadow: `inset 0 0 0 1px ${tint('accent', 70)}`,
      },
    })),
  },
  summer: {
    tokens: { accent: '#f59e0b', accent2: '#06b6d4', shine: 'rgba(255, 255, 255, 0.75)' },
    paint: scaled((step) => ({
      fill: `repeating-radial-gradient(circle at 50% 120%, transparent 0 ${5 * step}px, rgba(255, 255, 255, 0.5) ${5 * step}px ${7 * step}px), linear-gradient(90deg, ${tint('accent', 45)}, ${tint('accent2', 28)})`,
      size: 'auto, auto',
      style: { borderRadius: step === 1 ? '999px' : `${4 * step}px` },
    })),
  },
  spring: {
    tokens: { accent: '#22c55e', accent2: '#f472b6', shine: 'rgba(255, 255, 255, 0.8)' },
    paint: scaled((step) => ({
      fill: `radial-gradient(circle at 25% 30%, rgba(244, 114, 182, 0.75) 0 ${2.5 * step}px, transparent ${2.5 * step + 0.5}px), radial-gradient(circle at 75% 70%, rgba(250, 204, 21, 0.8) 0 ${2 * step}px, transparent ${2 * step + 0.5}px), linear-gradient(90deg, ${tint('accent', 24)}, ${tint('accent2', 24)})`,
      size: `${16 * step}px ${16 * step}px, ${16 * step}px ${16 * step}px, auto`,
      style: { borderRadius: `${3 * step}px` },
    })),
  },
  'new-year': {
    tokens: { accent: '#eab308', accent2: '#a855f7', shine: 'rgba(255, 244, 200, 0.85)' },
    paint: scaled((step) => ({
      fill: `radial-gradient(circle at 20% 35%, ${tint('accent2', 80)} 0 ${1.5 * step}px, transparent ${1.5 * step + 0.5}px), radial-gradient(circle at 70% 65%, rgba(255, 255, 255, 0.9) 0 ${1.2 * step}px, transparent ${1.2 * step + 0.5}px), linear-gradient(90deg, ${tint('accent', 55)}, rgba(250, 204, 21, 0.3), ${tint('accent', 55)})`,
      size: `${14 * step}px ${14 * step}px, ${10 * step}px ${10 * step}px, auto`,
      style: { borderRadius: `${3 * step}px` },
    })),
  },
  autumn: {
    tokens: { accent: '#b45309', accent2: '#dc2626', shine: 'rgba(255, 237, 213, 0.75)' },
    paint: scaled((step) => ({
      fill: `repeating-linear-gradient(-30deg, ${tint('accent', 38)} 0 ${6 * step}px, ${tint('accent2', 30)} ${6 * step}px ${12 * step}px, rgba(202, 138, 4, 0.34) ${12 * step}px ${18 * step}px)`,
      style: { borderRadius: `${step}px ${5 * step}px` },
    })),
  },
}
