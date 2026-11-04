import type { Paint, PaintType, ThemeDef } from '../types'

export interface GlassOptions {
  blur?: string
  opacity?: number
  tint?: string
  reflection?: number
  rim?: number
  filter?: string
}

export const createGlassTheme = (options: GlassOptions = {}): ThemeDef => {
  const { blur = '12px', opacity = 0.12, tint = 'var(--charpente-base)', reflection = 0.16, filter = 'saturate(1.15)' } = options
  const { rim } = options
  const line = rim === undefined ? `calc(var(--charpente-glass-reflection, ${reflection}) + 0.12)` : `${rim}`
  const top = rim === undefined ? `calc(var(--charpente-glass-reflection, ${reflection}) + 0.22)` : `${Math.min(1, rim + 0.1)}`
  for (const [name, value] of Object.entries({ opacity, reflection, ...(rim !== undefined && { rim }) })) {
    if (!Number.isFinite(value) || value < 0 || value > 1) {
      throw new Error(`charpente: glass ${name} must be between 0 and 1`)
    }
  }
  const blurFilter = `blur(var(--charpente-glass-blur, ${blur})) ${filter}`
  const paint = (type: PaintType): Paint => ({
    fill: `linear-gradient(125deg, rgb(255 255 255 / var(--charpente-glass-reflection, ${reflection})), transparent 42%, rgb(255 255 255 / calc(var(--charpente-glass-reflection, ${reflection}) * 0.25))), linear-gradient(color-mix(in srgb, var(--charpente-glass-tint, ${tint}) calc(var(--charpente-glass-opacity, ${opacity}) * 100%), transparent), color-mix(in srgb, var(--charpente-glass-tint, ${tint}) calc(var(--charpente-glass-opacity, ${opacity}) * 100%), transparent))`,
    size: 'auto, auto',
    style: {
      borderRadius: type === 'text' ? '4px' : '8px',
      backdropFilter: blurFilter,
      WebkitBackdropFilter: blurFilter,
      boxShadow: `inset 0 0 0 1px rgb(255 255 255 / ${line}), inset 0 1px 0 rgb(255 255 255 / ${top}), 0 3px 12px rgb(0 0 0 / 0.06)`,
    },
  })
  return {
    tokens: { shine: 'rgb(255 255 255 / 0.12)' },
    paint: { text: paint('text'), media: paint('media'), control: paint('control'), block: paint('block') },
  }
}
