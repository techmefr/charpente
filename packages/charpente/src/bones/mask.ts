import type { ZoneBones } from '../types'

const round = (value: number): number => Math.round(value)

const rect = ({ x, y, width, height, radius }: ZoneBones['bones'][number]): string => {
  const corner = Math.min(round(radius), round(width / 2), round(height / 2))
  return `<rect x="${round(x)}" y="${round(y)}" width="${round(width)}" height="${round(height)}" rx="${corner}" fill="#000"/>`
}

export const maskSvg = (zone: ZoneBones): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${round(zone.width)} ${round(zone.height)}" preserveAspectRatio="none">${zone.bones.map(rect).join('')}</svg>`

const dataUrl = (svg: string): string => `url("data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27')}")`

export const maskUrl = (zone: ZoneBones): string => dataUrl(maskSvg(zone))

const RING = 3

const stroke = ({ x, y, width, height, radius }: ZoneBones['bones'][number]): string => {
  const inset = RING / 2
  const corner = Math.max(0, Math.min(round(radius), round(width / 2), round(height / 2)) - inset)
  const side = (value: number): number => Math.max(0, round(value) - RING)
  return `<rect x="${round(x) + inset}" y="${round(y) + inset}" width="${side(width)}" height="${side(height)}" rx="${corner}" fill="none" stroke="#000" stroke-width="${RING}"/>`
}

export const ringUrl = (zone: ZoneBones): string =>
  dataUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${round(zone.width)} ${round(zone.height)}" preserveAspectRatio="none">${zone.bones.map(stroke).join('')}</svg>`,
  )
