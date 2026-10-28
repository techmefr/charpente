import type { Paint, PaintType, ThemeDef } from './types'

type PaintBuilder = (step: number) => Paint

export const tint = (token: string, percent: number): string =>
  `color-mix(in srgb, var(--charpente-${token}) ${percent}%, transparent)`

export const scaled = (build: PaintBuilder): Partial<Record<PaintType, Paint>> => ({
  text: build(1),
  control: build(1),
  media: build(1.15),
  block: build(1.15),
})

export const motif = (drawing: string, width = 48, height = 48): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${drawing}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27')}")`
}

const seasonal = (accent: string, accent2: string, drawing: string): ThemeDef => ({
  tokens: { accent, accent2 },
  dark: { shine: 'rgba(255,255,255,0.16)' },
  paint: {
    text: {
      fill: `linear-gradient(90deg, ${tint('accent', 28)}, ${tint('accent2', 16)})`,
      style: { borderRadius: '4px' },
    },
    control: {
      fill: `linear-gradient(135deg, ${tint('accent', 20)}, ${tint('accent2', 12)})`,
      style: { borderRadius: '6px', boxShadow: `inset 0 0 0 1px ${tint('accent', 45)}` },
    },
    media: {
      fill: `${motif(drawing)}, linear-gradient(135deg, ${tint('accent', 12)}, ${tint('accent2', 8)})`,
      size: '48px 48px, auto',
      style: { borderRadius: '8px', boxShadow: `inset 0 0 0 1px ${tint('accent', 24)}` },
    },
    block: {
      fill: `${motif(drawing)}, linear-gradient(135deg, ${tint('accent', 12)}, ${tint('accent2', 8)})`,
      size: '48px 48px, auto',
      style: { borderRadius: '8px' },
    },
  },
})

export const seasonalThemes: Record<string, ThemeDef> = {
  halloween: seasonal('#f97316', '#8b5cf6', `<g fill="none" stroke="#a78bfa" stroke-width=".7" opacity=".7"><path d="M0 0L48 48M0 0L48 16M0 0L16 48M0 12Q10 10 12 0M0 25Q21 21 25 0M0 40Q34 34 40 0"/></g><path d="M34 32q0-6 5-6t5 6v7l-2-2-3 2-3-2-2 2z" fill="#fb923c" opacity=".6"/><path d="M37 31v2m4-2v2" stroke="#432465"/>`),
  christmas: seasonal('#b91c1c', '#15803d', `<path d="M-4 6Q12 20 28 6T60 6" fill="none" stroke="#6b9276" stroke-width="1"/><g fill="#eab308"><circle cx="8" cy="12" r="2"/><circle cx="32" cy="4" r="2"/></g><circle cx="20" cy="10" r="2" fill="#ef4444"/><circle cx="43" cy="2" r="2" fill="#4ade80"/><path d="M21 25v12m-6-6h12m-10-4 8 8m0-8-8 8" stroke="#94a3b8" stroke-width=".8" opacity=".6"/>`),
  winter: seasonal('#38bdf8', '#818cf8', `<g fill="none" stroke="#7db7dd" stroke-width=".8" opacity=".7"><path d="M14 5v18M6 9l16 10M6 19 22 9M11 7l3 3 3-3M7 12l4 1-1 4M17 21l-3-3-3 3M21 16l-4-1 1-4"/><path d="M36 30v10m-4-8 8 6m-8 0 8-6"/></g><g fill="#9bc9e4"><circle cx="35" cy="12" r="1"/><circle cx="9" cy="37" r=".8"/></g>`),
  spring: seasonal('#65a779', '#e6a0b9', `<g fill="#8ab99a" opacity=".65"><path d="M8 31Q4 19 17 20Q18 30 8 31M31 9Q30 0 40 3Q40 11 31 9"/></g><g fill="#e8a2bb" opacity=".75"><circle cx="29" cy="30" r="3"/><circle cx="35" cy="30" r="3"/><circle cx="32" cy="25" r="3"/><circle cx="32" cy="35" r="3"/></g><circle cx="32" cy="30" r="2" fill="#d9b863"/>`),
  summer: seasonal('#d9a441', '#38aab7', `<g fill="none" stroke="#ddae56" stroke-width="1" opacity=".65"><circle cx="13" cy="13" r="4"/><path d="M13 4V1m0 24v-3M4 13H1m24 0h-3M7 7 5 5m14 14 2 2M7 19l-2 2M19 7l2-2"/></g><path d="M20 35q6-5 12 0t12 0" fill="none" stroke="#66b6be" stroke-width="1" opacity=".6"/>`),
  autumn: seasonal('#bd7f42', '#a85e53', `<g fill="#c5935b" opacity=".6"><path d="M7 24Q2 7 22 7Q25 23 7 24"/><path d="M29 40Q25 25 43 24Q46 39 29 40" fill="#b57260"/></g><path d="M5 28 18 12m-8 9 0-6m3 3 6-1M27 44l12-15" fill="none" stroke="#8c6545" stroke-width=".8" opacity=".65"/>`),
  'new-year': seasonal('#c6a04b', '#a78bfa', `<g fill="none" stroke="#c6a04b" stroke-width="1"><path d="M13 4v14m-7-7h14M8 6l10 10M8 16 18 6M35 29v10m-5-5h10"/></g><path d="m27 9 2 4m-21 22 3-2m29-14-2 3" stroke="#a78bfa" stroke-width="2"/><circle cx="23" cy="42" r="1" fill="#c6a04b"/>`),
}
