import type { ZoneBones } from '../types'

const round = (value: number): number => Math.round(value)

const rect = ({ x, y, width, height, radius }: ZoneBones['bones'][number]): string => {
  const corner = Math.min(round(radius), round(width / 2), round(height / 2))
  return `<rect x="${round(x)}" y="${round(y)}" width="${round(width)}" height="${round(height)}" rx="${corner}" fill="#000"/>`
}

export const maskSvg = (zone: ZoneBones): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${round(zone.width)} ${round(zone.height)}" preserveAspectRatio="none">${zone.bones.map(rect).join('')}</svg>`

export const maskUrl = (zone: ZoneBones): string =>
  `url("data:image/svg+xml,${encodeURIComponent(maskSvg(zone)).replace(/'/g, '%27')}")`
