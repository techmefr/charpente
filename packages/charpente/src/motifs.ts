import type { Paint, PaintType } from './types'

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
