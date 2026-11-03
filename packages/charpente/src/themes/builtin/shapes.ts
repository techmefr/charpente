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
