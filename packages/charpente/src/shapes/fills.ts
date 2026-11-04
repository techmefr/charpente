import type { ShapeGradient, ShapeLayer } from '../types'

export interface ShapeColors {
  accent: string
  accent2: string
}

export interface Fill {
  attr: string
  defs: string
}

const channels = (color: string): [number, number, number] | undefined => {
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim())?.[1]
  if (!hex) return undefined
  const full = hex.length === 3 ? [...hex].map((digit) => digit + digit).join('') : hex
  return [0, 2, 4].map((start) => parseInt(full.slice(start, start + 2), 16)) as [number, number, number]
}

export const tint = (color: string, amount: number): string => {
  const rgb = channels(color)
  if (!rgb) return color
  const target = amount < 0 ? 0 : 255
  const mixed = rgb.map((value) => Math.round(value + (target - value) * Math.abs(amount)))
  return `#${mixed.map((value) => value.toString(16).padStart(2, '0')).join('')}`
}

const DIRECTIONS: Record<ShapeGradient, string> = {
  x: 'x1="0" y1="0" x2="1" y2="0"',
  y: 'x1="0" y1="0" x2="0" y2="1"',
  d: 'x1="0" y1="0" x2="1" y2="1"',
}

const stops = (color: string, gradient: ShapeGradient): [number, string][] =>
  gradient === 'd'
    ? [[0, tint(color, 0.28)], [0.5, color], [1, tint(color, -0.32)]]
    : [[0, tint(color, -0.22)], [0.5, tint(color, 0.24)], [1, tint(color, -0.22)]]

const gradientOf = (id: string, color: string, gradient: ShapeGradient): string => {
  const list = stops(color, gradient).map(([offset, stop]) => `<stop offset="${offset}" stop-color="${stop}"/>`)
  return `<linearGradient id="${id}" ${DIRECTIONS[gradient]}>${list.join('')}</linearGradient>`
}

export const fillOf = (layer: ShapeLayer, colors: ShapeColors, id: string): Fill => {
  if (layer.role === 'detail') return { attr: `fill="#000" fill-opacity="${layer.opacity ?? 0.2}"`, defs: '' }
  if (layer.role === 'shine') return { attr: `fill="#fff" fill-opacity="${layer.opacity ?? 0.38}"`, defs: '' }
  const color = layer.role === 'accent' ? colors.accent : colors.accent2
  if (!layer.gradient || !channels(color)) return { attr: `fill="${color}"`, defs: '' }
  return { attr: `fill="url(#${id})"`, defs: gradientOf(id, color, layer.gradient) }
}
