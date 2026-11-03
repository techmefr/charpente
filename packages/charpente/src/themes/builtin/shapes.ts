import type { Paint, PaintType } from '../../types'

export const perType = (make: (type: PaintType) => Paint): Record<PaintType, Paint> => ({
  text: make('text'),
  media: make('media'),
  control: make('control'),
  block: make('block'),
})

export const svgImage = (body: string, width: number, height: number, stretch = false): string => {
  const ratio = stretch ? ' preserveAspectRatio="none"' : ''
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"${ratio}>${body}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27')}")`
}

export const random = (seed: number): (() => number) => {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }
}

export const round = (value: number): number => Math.round(value * 10) / 10

export const clipCut = (size: number): string =>
  `polygon(${size}px 0, 100% 0, 100% calc(100% - ${size}px), calc(100% - ${size}px) 100%, 0 100%, 0 ${size}px)`

export const edgeCut = (size: number, color: string, width = 1.5): string[] => {
  const start = round(size * 0.7071)
  const stroke = `transparent ${start}px, ${color} ${start}px ${round(start + width)}px, transparent ${round(start + width)}px`
  return [`linear-gradient(135deg, ${stroke})`, `linear-gradient(315deg, ${stroke})`]
}

export interface FlowLayer {
  size: [number, number]
  dx?: number
  dy?: number
}

export const TYPE_SCALE: Record<PaintType, number> = { text: 0.4, media: 0.75, control: 0.5, block: 1 }

export const flowLayout = (layers: FlowLayer[], scale = 1, before = 0): { size: string; position: string } => {
  const lead = Array.from({ length: before }, () => 'auto')
  const sizes = layers.map(({ size: [width, height] }) => `${round(width * scale)}px ${round(height * scale)}px`)
  const moves = layers.map(({ size: [width, height], dx = 0, dy = 0 }) => {
    const shift = (tiles: number, extent: number): string => `calc(var(--charpente-flow) * ${round(tiles * extent * scale)}px)`
    return `${shift(dx, width)} ${shift(dy, height)}`
  })
  return { size: [...lead, ...sizes].join(', '), position: [...lead.map(() => '0 0'), ...moves].join(', ') }
}
